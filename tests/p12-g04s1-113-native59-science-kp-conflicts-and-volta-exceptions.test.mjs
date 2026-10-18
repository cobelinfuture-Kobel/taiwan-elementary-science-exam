import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const evidence=read('p12-g04s1-113-native137-science-kp59-evidence-only-v1.json');
const exception=read('p12-g04s1-113-volta-double-false-and-taozijiao4-science-exceptions-v1.json');
const p=read('p12-g04s1-113-main-published114-source-suppression-readback-v9.json');
const auth=JSON.parse(fs.readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8'));
const hist=read('p12-g04s1-113-all29-411-unique-question-review-union-v4.json');
const normalize=x=>x.replace(/\\|S0+(\\d+)/,'|S$1').replace(/\\|(TF|MC)\\|0+(\\d+)$/,'|$1|$2');
test('59 independent science answer/kp proposals are source-geometry indexed and never published',()=>{
 assert.equal(evidence.records.length,59);
 assert.equal(new Set(evidence.records.map(x=>x.source_slot_id)).size,59);
 const kp=new Set(auth.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(y=>y.canonical_kp_id)));
 assert.equal(kp.size,48);
 const pub=new Set(p.all_unique_published_source_slot_ids.map(normalize));
 for(const x of evidence.records){
  assert.ok(kp.has(x.proposed_direct_canonical_kp_id));
  assert.match(x.original_paper_sha256,/^[a-f0-9]{64}$/);
  assert.ok(!pub.has(normalize(x.source_slot_id)));
  assert.ok(x.science_reason.length>=8);
  assert.equal(x.teacher_key_authenticated,false);
  assert.equal(x.admission_ready,false);
  assert.equal(x.published,false);
  assert.equal(x.source_original_full_stem_options_visual_QA_complete,false);
  if(x.legacy_model_review_id){
   const y=hist.rows.find(y=>y.review_id===x.legacy_model_review_id);
   assert.ok(y);
   assert.equal(String(y.model_answer).toUpperCase(),x.answer_deduced_independently);
  }
 }
});
test('41 previous science proposals agree, but seven prior KP mismatches remain an actual source conflict',()=>{
 const z=evidence.summary;
 assert.equal(z.legacy_model_matches,41);
 assert.equal(z.newly_without_legacy_record,18);
 assert.equal(z.legacy_model_science_answer_conflicts,0);
 assert.equal(z.prior_kp_disagreement_held,7);
 assert.equal(evidence.records.filter(x=>x.legacy_kp_disagreement).length,7);
 assert.ok(evidence.records.filter(x=>x.legacy_kp_disagreement).every(x=>x.science_kp_determination_status==='KP_DIRECT_MAPPING_CONFLICT_HOLD'));
 assert.equal(z.formal_science_kp_approved_new,0);
 assert.equal(z.admission_ready_new,0);
 assert.equal(z.published_new,0);
});
test('one Volta item has two scientifically false options and Taozi four old Science HOLDS persist',()=>{
 const x=exception.exceptions;
 assert.equal(x.length,5);
 assert.equal(x[0].source_slot_id,'SCI_G04_S1_113_FINAL_008|S1|MC|005');
 assert.equal(x[0].student_admission,'SCIENCE_NON_UNIQUE_HOLD');
 assert.match(x[0].independent_science_issue,/TWO_FALSE_OPTIONS/);
 assert.equal(x.slice(1).filter(y=>y.prior_model_science_status==='SCIENCE_HOLD').length,4);
 assert.equal(exception.summary.new_formal_science_kp_approved,0);
 assert.equal(exception.summary.new_admission_ready,0);
 assert.equal(exception.summary.new_published,0);
 assert.equal(p.newly_published_113_slots,114);
 assert.equal(p.public_total_answer_slots,750);
});
