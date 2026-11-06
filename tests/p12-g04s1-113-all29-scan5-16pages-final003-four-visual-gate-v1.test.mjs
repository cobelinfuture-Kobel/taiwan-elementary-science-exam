import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(new URL('../' + path, import.meta.url), 'utf8'));
const root='data/review/p12-g04s1-113-all29-';
const audit=read(root+'scan5-original16pages-final003-four-visual-gate-v1.json');
const ledger=read(root+'known-atomic-disjoint-source-ledger-v8.json');
const fourOld=read(root+'final003-18-onegate-science-kp-source-scope-v1.json');
const native=read('data/review/p12-g04s1-113-missing15-native88-original-text-sci-g04-s1-113-final-003-v1.json');
const norm=s=>s.split('|').map(v=>/^[SG]\d+$/.test(v)?v[0]+Number(v.slice(1)):/^\d+$/.test(v)?String(Number(v)):v).join('|');

test('five no-text scans prove sixteen actual PDF pages but are NOT the same as zero-public five',()=>{
 assert.equal(audit.source_scan_paper_count,5);
 assert.equal(audit.scan_papers.length,5);
 assert.equal(new Set(audit.scan_papers.map(p=>p.id)).size,5);
 assert.equal(audit.total_verified_scan_pdf_pages,16);
 assert.equal(audit.scan_papers.reduce((a,p)=>a+p.pages,0),16);
 assert.equal(audit.each_scanned_pdf_page_is_one_embedded_image,true);
 assert.equal(audit.text_layer_extraction_all_scan_pages_zero,true);
 assert.equal(audit.scan5_not_zero_published5,true);
 const origin=new Map(ledger.original_papers.map(p=>[p.source_paper_id,p]));
 for(const p of audit.scan_papers){
  assert.match(p.sha,/^[0-9a-f]{64}$/);
  assert.equal(p.pdf_text_layer_chars,0);
  assert.equal(p.pdf_page_embedded_image_count_all_one,true);
  const row=origin.get(p.id);assert.ok(row,p.id);
  assert.equal(p.pages,row.original_pdf_pages);
  assert.deepEqual(p.existing_disjoint,row.disjoint_known_source_positions);
  assert.equal(p.source_work_positions,row.known_classified_source_positions);
  assert.equal(p.original_full_position_semantics_accepted,false);
 }
 assert.equal(audit.scan_total_known_source_work_positions,262);
 assert.deepEqual(audit.scan_known_status,{PUBLISHED:24,HOLD:15,ALIAS:0,UNREVIEWED:223});
 for(const k of Object.keys(audit.scan_known_status)){
  assert.equal(audit.scan_papers.reduce((s,p)=>s+p.existing_disjoint[k],0),audit.scan_known_status[k]);
 }
 const originalScanSha=[
 ['SCI_G04_S1_113_MID_002','data/review/p12-g04s1-113-all29-zero5-mid002-50-source-only-id-ledger-v1.json'],
 ['SCI_G04_S1_113_FINAL_002','data/review/p12-g04s1-113-all29-zero5-final002-50-source-only-id-ledger-v1.json'],
 ['SCI_G04_S1_113_FINAL_009','data/review/p12-g04s1-113-all29-zero5-final009-source-only-id-ledger-v1.json'],
 ];
 for(const [id,path] of originalScanSha) assert.equal(audit.scan_papers.find(p=>p.id===id).sha,read(path).original_pdf_sha256);
});

test('four Dongguang raw original-PDF page-1 native brackets and full visual context verified without new public admission',()=>{
 const map=new Map(fourOld.rows.map(x=>[norm(x.source_slot_id),x]));
 const source=new Map(native.source_questions.map(x=>[norm(x.source_slot_id),x]));
 assert.equal(audit.dongguang_visual_verified_source_bbox_count,4);
 assert.equal(audit.dongguang_candidate_original_source_visual_rows.length,4);
 assert.equal(audit.dongguang_original_sha256,native.original_pdf_sha256);
 assert.equal(audit.dongguang_original_page_count,2);
 for(const row of audit.dongguang_candidate_original_source_visual_rows){
  const key=norm(row.source_slot_id),a=map.get(key),b=source.get(key);
  assert.ok(a&&b,key);
  assert.equal(a.source_only_disposition,'DIRECT_KP_CANDIDATE_PENDING_FULL_GATE');
  assert.equal(row.original_page_1based,1);
  assert.deepEqual(row.bbox,a.exact_source_answer_bbox_pdf_points);
  assert.deepEqual(row.bbox,b.answer_glyph_native_bbox_pdf_pts_top_left);
  assert.equal(row.source_visual_bbox_accepted,true);
  assert.equal(row.visual_full_question_and_ordered_options_present,true);
  assert.equal(row.requires_external_figure,false);
  assert.equal(b.figure_or_option_image_dependency_undecided,false);
  for(const flag of ['teacher_key_authenticated','formal_unique_science_and_direct_frozen_kp_accepted',
    'article9_rights_and_third_party_component_formally_accepted','whole11329_11425_full_semantic_duplicate_done',
    'exact_operator_eligible','student_admission_ready']) assert.equal(row[flag],false);
 }
 assert.equal(audit.inferred_identical_question_alias_from_visual_topic_similarity,0);
 assert.equal(audit.new_source_status_changes,0);
 assert.equal(audit.new_FORMAL_SCIENCE_KP_APPROVED,0);
 assert.equal(audit.new_ADMISSION_READY,0);
 assert.equal(audit.new_PUBLISHED,0);
 assert.deepEqual(ledger.known_disjoint_dispositions,{PUBLISHED:333,HOLD:283,ALIAS:15,UNREVIEWED:1131});
 assert.equal(audit.published_333_unchanged,true);
 assert.equal(audit.frozen48kp_unchanged,true);
});
