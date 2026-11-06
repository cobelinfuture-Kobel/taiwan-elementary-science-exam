import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const root='data/review/p12-g04s1-113-all29-';
const v7=read(root+'known-atomic-disjoint-source-ledger-v7.json');
const v8=read(root+'known-atomic-disjoint-source-ledger-v8.json');
const review=read(root+'final003-18-onegate-science-kp-source-scope-v1.json');
const original=read('data/review/p12-g04s1-113-missing15-native88-original-text-sci-g04-s1-113-final-003-v1.json');
const older=read('data/review/p12-g04s1-113-native59-18-candidate-113114-public717-dedup-rights-gates-v1.json');
const kpAuthority=read('site/data/authority/science-g03-g04-selector-v3.json');
const pub=read('site/data/question-bank/p12-b04-b01-47-public-v1.json');
const norm=id=>id.split('|').map(x=>/^[SG]\d+$/.test(x)?x[0]+Number(x.slice(1)):/^\d+$/.test(x)?''+Number(x):x).join('|');
const p7=new Map(v7.known_atomic_source_dispositions.map(x=>[norm(x.source_slot_id),x]));
const p8=new Map(v8.known_atomic_source_dispositions.map(x=>[norm(x.source_slot_id),x]));

test('source-work corpus remains 1762, 29 papers, frozen333 unaffected, 14 more fully explained HOLD',()=>{
 assert.equal(v8.source_position_count_distinct_known,1762);
 assert.equal(v8.known_atomic_source_dispositions.length,1762);
 assert.equal(p8.size,1762);
 assert.equal(v8.original_papers.length,29);
 assert.deepEqual(v8.known_disjoint_dispositions,{PUBLISHED:333,HOLD:283,ALIAS:15,UNREVIEWED:1131});
 assert.equal(v8.original_unreviewed_source_positions_routed_to_existing_admission_hold_this_version,14);
 assert.equal(v8.original_source_positions_new_directKP_candidates_but_not_operator_eligible_this_version,4);
 assert.deepEqual(v8.formal_status_current_run,{FORMAL_SCIENCE_KP_APPROVED_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0,full_original_papers_Admission_closed:0});
 assert.equal(v8.unresolved_coverage.all29_certified_independent_answer_position_denominator,null);
 assert.equal(v8.unresolved_coverage.remaining_unreviewed_exact_question_count,null);
});
test('only fourteen FINAL003 UNREVIEWED sources become HOLD; no other source status or lineage changes',()=>{
 let moved=0;
 const hold=new Set(review.rows.filter(x=>x.source_only_disposition.startsWith('HOLD')).map(x=>norm(x.source_slot_id)));
 assert.equal(hold.size,14);
 for(const [id,before] of p7){
  const after=p8.get(id);assert.ok(after,id);
  if(hold.has(id)){
   moved++;
   assert.equal(before.disposition,'UNREVIEWED');
   assert.equal(after.disposition,'HOLD');
   assert.ok(after.source_admission_hold_reason.startsWith('HOLD'));
   assert.equal(after.full_Admission_gate_approved,false);
  }else assert.deepEqual(after,before,'untouched previous row was modified '+id);
 }
 assert.equal(moved,14);
 assert.equal([...p8.values()].filter(x=>x.disposition==='PUBLISHED').length,333);
 assert.equal([...p8.values()].filter(x=>x.disposition==='ALIAS').length,15);
});
test('18 original exam questions have exact original source page & printed BBox, 4 text choices for MC, with no new approvals',()=>{
 assert.equal(review.rows.length,18);
 assert.equal(review.direct_kp_model_candidates_not_formal,4);
 assert.equal(review.hold_by_source_kp_or_science,14);
 const originalMap=new Map(original.source_questions.map(x=>[norm(x.source_slot_id),x]));
 const sourceProofIds=new Set();
 for(const x of review.rows){
  assert.ok(!sourceProofIds.has(norm(x.source_slot_id)));sourceProofIds.add(norm(x.source_slot_id));
  const p=originalMap.get(norm(x.source_slot_id));assert.ok(p);
  assert.equal(x.source_original_pdf_sha256,original.original_pdf_sha256);
  assert.equal(x.original_pdf_page_1_based,p.source_page_pdf_1based);
  assert.deepEqual(x.exact_source_answer_bbox_pdf_points,p.answer_glyph_native_bbox_pdf_pts_top_left);
  assert.equal(x.original_text_readback_raw,p.source_text_native_pdf_readback_raw);
  assert.deepEqual(x.original_all_options_ordered,p.ordered_options_native_text_readback);
  if(x.original_type==='MC')assert.equal(x.original_all_options_ordered.length,4);
  assert.equal(x.science_unique_formally_approved,false);
  assert.equal(x.kp_direct_formally_approved,false);
  assert.equal(x.student_bank_admission_ready,false);
  assert.equal(x.operator_eligible,false);
 }
 assert.equal(review.rows.filter(x=>x.source_only_disposition==='DIRECT_KP_CANDIDATE_PENDING_FULL_GATE').length,4);
});
test('four source-only KP suggestions reference immutable 113 G04S1 authority and do not become eligible',()=>{
 const known=new Set(kpAuthority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
 assert.equal(known.size,48);
 for(const x of review.rows.filter(x=>x.source_only_disposition==='DIRECT_KP_CANDIDATE_PENDING_FULL_GATE')){
  assert.ok(known.has(x.direct_frozen48_kp_proposed_NOT_FORMAL));
  assert.equal(p8.get(norm(x.source_slot_id)).disposition,'UNREVIEWED');
  assert.equal(x.student_bank_admission_ready,false);
 }
});
test('similar battery/mains choice stem in 114 public bank uses different options: do not promote to ALIAS',()=>{
 const current=review.rows.find(x=>x.source_slot_id.endsWith('FINAL_003|S1|MC|004'));assert.ok(current);
 const target=pub.blocks.find(x=>x.id==='P12_B04_G04S1_B01_MC_034');assert.ok(target);
 const optionNorm=v=>String(v).normalize('NFKC').replace(/^[1-4]/,'').replace(/[\s，。.,．]+/g,'');
 const a=current.original_all_options_ordered.map(o=>optionNorm(o.source_option_text)).sort();
 const b=target.options.map(optionNorm).sort();
 assert.notDeepEqual(a,b);
 assert.equal(p8.get(norm(current.source_slot_id)).disposition,'UNREVIEWED');
 assert.equal(current.source_only_disposition,'DIRECT_KP_CANDIDATE_PENDING_FULL_GATE');
});
test('carbon-reduction original appears in 114 source archives but is not automatically duplicate of published student question',()=>{
 const row=review.rows.find(x=>x.source_slot_id.endsWith('FINAL_003|S1|MC|009'));assert.ok(row);
 assert.equal(row.source_only_disposition,'HOLD_NO_DIRECT_FROZEN48KP');
 assert.equal(row.verified_114_717_original_source_similar.length,2);
 assert.equal(row.duplicate_public_exact_or_option_reorder_verified,false);
 const s=read('data/content-only/p12-art9-114-yongan-g04s1-final22-original-questions-v1-content-v1.json');
 const same=s.original_question_records.find(x=>x.source_id==='SCI_G04_S1_114_FINAL_001|MC|S02|006');
 assert.ok(same);assert.equal(same.student_site_admitted,false);
});
test('prior 18 native review is inherited but not treated as teacher key or extra formal science/KP approval',()=>{
 const map=new Map(older.records.map(x=>[norm(x.source_original_id),x]));
 for(const x of review.rows){
  const old=map.get(norm(x.source_slot_id));
  if(!old)continue;
  assert.equal(old.formal_science_kp_approved,false);
  assert.equal(old.admission_ready,false);
  assert.equal(x.science_unique_formally_approved,false);
 }
 assert.equal(review.original_full_113_29_semantic_dedup_formal_not_closed,true);
});
