import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const {build, normalizeSlot} = require('../scripts/review/p12-g04s1-113-wholecorpus-legacy-snapshot.cjs');
const read = name => JSON.parse(fs.readFileSync(new URL('../data/review/' + name, import.meta.url), 'utf8'));
const lane = build().lanes.find(l => l.name === 'OTHER_OR_DEPENDENT');
const suffix = 'source-parent-preflight-v1.json';
const paths = Array.from({length:7}, (_,i) => 'p12-g04s1-113-other-dependent-b' + String(i+3).padStart(2,'0') + '-' + suffix);
const newDocs = paths.map(read);
const b01 = read('p12-g04s1-113-other-dependent-b01-50-source-only-preflight-v1.json');
const b02 = read('p12-g04s1-113-other-dependent-b02-50-source-only-preflight-v1.json');
const missing = read('p12-g04s1-113-missing15-paper-inventory-gap-checkpoint-v1.json');
const pub = read('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');

test('B03 to B09 are frozen exact subsequent 308 source positions', () => {
  assert.equal(lane.position_count,408);
  assert.deepEqual(lane.batches.map(b => b.count),[50,50,50,50,50,50,50,50,8]);
  assert.deepEqual(newDocs.map(d => d.summary.positions),[50,50,50,50,50,50,8]);
  assert.equal(newDocs.reduce((n,d) => n+d.records.length,0),308);
  for (let i=0;i<newDocs.length;i++) {
    const d=newDocs[i],batch=lane.batches[i+2];
    assert.equal(d.batch,batch.batch);
    assert.deepEqual(d.records.map(x=>x.source_slot_id),batch.source_slots.map(x=>x.normalized_source_slot_id));
    assert.deepEqual(d.records.map(x=>x.other_lane_ordinal),
      Array.from({length:d.records.length},(_,j)=>(i+2)*50+j+1));
  }
});

test('full B01 to B09 408 source positions are unique; none appear in published114', () => {
  const ids=[
    ...b01.records.map(x=>x.normalized_source_slot_id),
    ...b02.records.map(x=>x.normalized_source_slot_id),
    ...newDocs.flatMap(d=>d.records.map(x=>x.source_slot_id))
  ];
  assert.equal(ids.length,408);
  assert.equal(new Set(ids).size,408);
  const published = new Set(pub.all_unique_published_source_slot_ids.map(normalizeSlot));
  assert.equal(published.size,114);
  for(const id of ids)assert.ok(!published.has(normalizeSlot(id)),id);
});

test('all 308 dependent-source rows retain parent and all original Admission Gates', () => {
  for(const d of newDocs) {
    assert.equal(d.summary.FORMAL_SCIENCE_KP_APPROVED_NEW,0);
    assert.equal(d.summary.ADMISSION_READY_NEW,0);
    assert.equal(d.summary.PUBLISHED_NEW,0);
    assert.equal(d.summary.site_total_750_unchanged,true);
    assert.equal(d.summary.published_113_114_unchanged,true);
    for(const r of d.records) {
      assert.match(r.original_pdf_sha256,/^[0-9a-f]{64}$/);
      assert.ok(r.parent_source_id.length>0);
      assert.ok(r.potential_missing_gate_evidence.length>0);
      assert.equal(r.source_exact_and_bbox_formal,false);
      assert.equal(r.science_unique_answer_formal,false);
      assert.equal(r.canonical_kp48_direct_formal,false);
      assert.equal(r.current_public_and_114_semantic_dedup_formal,false);
      assert.equal(r.rights_formal,false);
      assert.equal(r.admission_ready,false);
      assert.equal(r.published,false);
    }
  }
});

test('15 missing exact whole-paper ledgers remain separate from 408 preflight', () => {
  const src=read('p12-g04s1-113-all29-kp48-source-firstpass-v1.json').original_source_records;
  assert.equal(src.length,29);
  assert.equal(missing.summary.papers_missing_full_ledger,15);
  assert.equal(missing.records.length,15);
  assert.equal(new Set(missing.records.map(x=>x.paper_id)).size,15);
  assert.equal(missing.records.filter(x=>x.scan_only_pdf).length,5);
  assert.equal(missing.records.filter(x=>!x.scan_only_pdf).length,10);
  assert.equal(missing.summary.pages,41);
  assert.equal(missing.summary.previously_published_114_ids_within_missing_papers,51);
  assert.equal(missing.summary.scan_section_positions_existing_previous_evidence,262);
  assert.equal(missing.summary.whole29_planning_estimate_not_certified,1755);
  assert.equal(missing.summary.new_exact_positions_certified,0);
  assert.ok(missing.records.every(x=>x.exact_all_positions_final_certified===false));
  const idset=new Set(src.map(x=>x.source_id));
  assert.ok(missing.records.every(x=>idset.has(x.paper_id)));
  assert.equal(pub.newly_published_113_slots,114);
  assert.equal(pub.public_total_answer_slots,750);
});
