#!/usr/bin/env node
'use strict';

// Source-only review orchestration. This is not an Admission Gate or a student-bank release.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.resolve(__dirname, '..', '..');
const REVIEW = path.join(ROOT, 'data', 'review');
const FIRSTPASS = 'p12-g04s1-113-all29-kp48-source-firstpass-v1.json';
const PUBLISHED = 'p12-g04s1-113-main-published114-source-suppression-readback-v9.json';
const INPUTS = [
  {file: 'p12-g04s1-113-wholecorpus-eightpapers-421-graded-source-task-ledger-v1.json', field: 'rows'},
  {file: 'p12-g04s1-113-next-three-whole-papers-199-source-tasks-v1.json', field: 'source_scored_tasks'},
  {file: 'p12-g04s1-113-three-additional-papers-155-source-graded-tasks-v1.json', field: 'source_tasks_155'}
];
const read = (file, root = ROOT) => JSON.parse(fs.readFileSync(path.join(root, 'data', 'review', file), 'utf8'));
const assert = (ok, reason) => { if (!ok) throw new Error('FAIL_CLOSED: ' + reason); };

function normalizeSlot(id) {
  assert(typeof id === 'string' && id.startsWith('SCI_G04_S1_113_'), 'missing 113 source ID');
  const p = id.split('|');
  assert(p.length >= 4, 'source slot requires paper/section/kind/item: ' + id);
  return p.map((part, i) => {
    const v = part.toUpperCase();
    if (i === 1 && /^S0*\d+$/.test(v)) return 'S' + Number(v.slice(1));
    if (i > 1 && /^G0*\d+$/.test(v)) return 'G' + Number(v.slice(1));
    if (i > 1 && /^(TRUE_FALSE|OX|TF)$/.test(v)) return 'TF';
    if (i > 1 && /^(SINGLE_CHOICE|MULTIPLE_CHOICE|MC)$/.test(v)) return 'MC';
    if (i > 1 && /^\d+$/.test(v)) return String(Number(v));
    return part;
  }).join('|');
}

function build(root = ROOT, batchSize = 50) {
  assert(Number.isInteger(batchSize) && batchSize > 0, 'invalid batch size');
  const papers = read(FIRSTPASS, root).original_source_records;
  const suppression = read(PUBLISHED, root);
  assert(papers.length === 29, '29 original PDFs expected');
  assert(suppression.newly_published_113_slots === 114 &&
    suppression.public_total_answer_slots === 750 &&
    suppression.public_pages_live_e2e_success === true,
    'published114 main + Pages snapshot must be explicitly refreshed');
  assert(suppression.approved_batches.reduce((n, b) => n + b.count, 0) === 114,
    'published batch count mismatch');
  const published = new Set(suppression.all_unique_published_source_slot_ids.map(normalizeSlot));
  assert(published.size === 114, '114 published source IDs must be unique');
  const holds = new Map(suppression.latest_exception_priority.map(x => [normalizeSlot(x.source_slot_id), x]));
  const paperOrder = new Map(papers.map((p, index) => [p.source_id, index]));
  const paperLookup = new Map(papers.map(p => [p.source_id, p]));
  const identities = new Map();
  let inputPositions = 0;
  for (const {file, field} of INPUTS) {
    const rows = read(file, root)[field];
    assert(Array.isArray(rows), 'missing ' + field + ' in ' + file);
    for (const row of rows) {
      inputPositions++;
      const id = row.source_slot_id;
      const key = normalizeSlot(id);
      const paperId = id.split('|')[0];
      const paper = paperLookup.get(paperId);
      assert(paper, 'unknown paper ' + paperId);
      const sha = row.original_pdf_sha256 || row.original_sha256;
      if (sha) assert(sha === paper.original_pdf_sha256, 'original PDF SHA mismatch: ' + id);
      if (identities.has(key)) {
        const previous = identities.get(key);
        // Reconcile aliases only; never silently conflate independently numbered slots.
        assert(previous.paper_id === paperId, 'source identity collision ' + key);
        previous.evidence_ledgers.push(file);
        previous.original_source_slot_ids.push(id);
      } else {
        const components = key.split('|');
        const independent = !paper.scan_only_pdf && components.length === 4 &&
          (components[2] === 'TF' || components[2] === 'MC');
        identities.set(key, {
          normalized_source_slot_id: key,
          original_source_slot_ids: [id],
          paper_id: paperId,
          source_pdf_sha256: paper.original_pdf_sha256,
          lane: independent ? 'NATIVE_TFMC' : 'OTHER_OR_DEPENDENT',
          evidence_ledgers: [file]
        });
      }
    }
  }
  const priorityOrder = new Map(['NATIVE_TFMC', 'OTHER_OR_DEPENDENT'].map((x, i) => [x, i]));
  const collator = new Intl.Collator('en', {numeric: true});
  const all = [...identities.values()].sort((a, b) =>
    priorityOrder.get(a.lane) - priorityOrder.get(b.lane) ||
    paperOrder.get(a.paper_id) - paperOrder.get(b.paper_id) ||
    collator.compare(a.normalized_source_slot_id, b.normalized_source_slot_id));
  const status = {published_suppressed: 0, known_exception_hold: 0, pending: 0};
  const queued = [];
  for (const item of all) {
    if (published.has(item.normalized_source_slot_id)) {
      status.published_suppressed++;
      continue;
    }
    if (holds.has(item.normalized_source_slot_id)) {
      status.known_exception_hold++;
      continue;
    }
    status.pending++;
    queued.push({
      ...item,
      queue_status: 'NEEDS_EXISTING_GATE_EVIDENCE',
      existing_gate_evidence_to_inherit_or_complete: [
        'SOURCE_EXACT_AND_CONTEXT', 'PDF_PAGE_BBOX', 'SCIENCE_UNIQUE_ANSWER',
        'CANONICAL_KP', 'CROSSYEAR_SEMANTIC_DEDUP', 'RIGHTS', 'OPERATOR_GATE'
      ]
    });
  }
  const lanes = ['NATIVE_TFMC', 'OTHER_OR_DEPENDENT'].map(name => {
    const records = queued.filter(r => r.lane === name);
    const batches = [];
    for (let i = 0; i < records.length; i += batchSize) {
      batches.push({batch: name + '_B' + String(batches.length + 1).padStart(2, '0'),
        count: Math.min(batchSize, records.length - i), source_slots: records.slice(i, i + batchSize)});
    }
    return {name, position_count: records.length, batches};
  });
  const distinctPaperIds = new Set(all.map(x => x.paper_id));
  const paperSummary = papers.map(p => ({
    paper_id: p.source_id, school: p.school, publisher: p.publisher_from_filename,
    exam_type: p.exam_type, scan_only: p.scan_only_pdf,
    source_pdf_sha256: p.original_pdf_sha256,
    identified_positions_in_three_ledgers: all.filter(x => x.paper_id === p.source_id).length,
    needs_remaining_exact_inventory: !distinctPaperIds.has(p.source_id)
  }));
  assert(inputPositions === 775, 'source ledger snapshot changed; review source first');
  assert(all.length === 775, 'unexpected alias collision; review before updating baseline');
  assert(status.published_suppressed === 63 && status.known_exception_hold === 3,
    'source/published alias collision changed; reconcile manually');
  assert(lanes[0].position_count === 301 && lanes[1].position_count === 408,
    'native lane counts unexpectedly changed');
  return {
    schema_version: 'P12_G04S1_113_WHOLE_CORPUS_SOURCE_BATCH_RESUME_V1',
    purpose: 'SOURCE_ONLY_CONTINUATION_NOT_RELEASE_NOT_NEW_ADMISSION_GATE',
    authority: '113 Kanghsuan G04 S1 frozen 48 KP',
    source_branch: 'Draft PR #124; must remain draft, unmerged',
    published_main_commit: suppression.main_commit,
    published_pages_live_e2e_run: suppression.live_pages_verification_run,
    sources: {firstpass: FIRSTPASS, published_suppression: PUBLISHED, reviewed_task_ledgers: INPUTS.map(x => x.file)},
    metrics: {
      original_papers: papers.length, original_pdfs_sha_verified: papers.length,
      identified_task_rows_from_three_ledgers: inputPositions,
      unique_identified_task_positions: all.length,
      paper_count_in_these_three_ledgers: distinctPaperIds.size,
      papers_not_covered_by_these_three_ledgers: papers.length - distinctPaperIds.size,
      published_113_all_sources: published.size,
      published_alias_overlap_in_these_three_ledgers: status.published_suppressed,
      known_exception_holds_in_these_three_ledgers: status.known_exception_hold,
      pending_identified_positions: status.pending,
      native_independent_pending: lanes[0].position_count,
      other_or_dependent_pending: lanes[1].position_count,
      formal_new_science_kp_approved_not_yet_certified: 0,
      new_admission_ready_not_yet_certified: 0,
      new_published_this_orchestration: 0
    },
    limitations: [
      'Partial task ledger, not the entire original 29-paper answer-slot universe; 1755 remains an estimate.',
      'Source rows often refer to operator ZIPs, not complete question text/BBox/teacher keys in GitHub.',
      'Identifier alias suppression is syntactic only. A cross-year/semantic duplicate Gate remains mandatory.',
      'Never convert model-initial-pass or review queue presence into formal Science/KP or admission.',
      'No one-question publishing loop; accumulate qualified items for consolidated release under existing operator authority.'
    ],
    paper_summary: paperSummary,
    lanes
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const size = Number((args.find(x => x.startsWith('--size=')) || '--size=50').split('=')[1]);
  const result = build(ROOT, size);
  const target = args.find(x => x.startsWith('--batch='));
  if (target) {
    const name = target.split('=')[1];
    const item = result.lanes.flatMap(x => x.batches).find(x => x.batch === name);
    assert(item, 'unknown batch ' + name);
    process.stdout.write(JSON.stringify(item, null, 2) + '\n');
  } else if (args.includes('--summary')) {
    process.stdout.write(JSON.stringify({metrics: result.metrics,
      batches: result.lanes.map(x => ({lane: x.name, sizes: x.batches.map(b => b.count)}))}, null, 2) + '\n');
  } else {
    process.stdout.write(JSON.stringify(result, null, 2) + '\n');
  }
}
module.exports = {build, normalizeSlot};
