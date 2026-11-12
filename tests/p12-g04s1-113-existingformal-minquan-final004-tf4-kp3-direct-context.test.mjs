import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const json=p=>JSON.parse(readFileSync(new URL('../data/review/'+p,import.meta.url),'utf8'));
const m=json('p12-g04s1-113-existingformal-minquan-final004-tf3to6-sciencekp-1candidate-3hold-v1.json');
const pub=json('p12-g04s1-113-main-published178-source-suppression-readback-v12.json');
const orig=json('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
const b07=JSON.parse(readFileSync(new URL('../site/data/question-bank/p12-b04-b07-31-public-v1.json',import.meta.url),'utf8'));
const authority=JSON.parse(readFileSync(new URL('../site/data/authority/science-g03-g04-selector-v3.json',import.meta.url),'utf8'));
test('Minquan first-page original 6 standalone TF exact original PDF proof and two prior main source IDs remain excluded',()=>{
 assert.equal(m.original_pdf_SHA256,orig.original_source_records.find(x=>x.source_id===m.source_id).original_pdf_sha256);
 assert.equal(m.original_page1_TF1to6_count,6);
 assert.equal(m.source_TF001_and_TF002_ALREADY_113_MAIN_PUBLISHED_suppressed,2);
 assert.equal(m.unpublished_original_TF003to006_reviewed,4);
 assert.ok(pub.all_unique_published_source_slot_ids.includes('SCI_G04_S1_113_FINAL_004|S01|TF|001'));
 assert.ok(pub.all_unique_published_source_slot_ids.includes('SCI_G04_S1_113_FINAL_004|S1|TF|002'));
 assert.equal(pub.all_unique_published_source_slot_ids.length,178);
 assert.deepEqual(m.records.map(x=>x.original_printed_number),[3,4,5,6]);
 assert.equal(new Set(m.records.map(x=>x.original_source_slot_id)).size,4);
 for(const x of m.records){
  assert.equal(x.original_pdf_page,1);
  assert.equal(x.admission_ready,false);
  assert.equal(x.published,false);
  assert.equal(x.original_school_teacher_answer_key_authenticated,false);
  assert.equal(x.science_answer_directKP_existing_operator_formal_acceptance,false);
  const b=x.original_native_PDF_actual_printed_answer_parens_bbox_pdf_points_top_left;
  assert.deepEqual([b[0],b[2]],[28.32,60.72]);
  assert.ok(b.length===4&&b[1]>=0&&b[3]>b[1]);
 }
 assert.equal(m.records[3].original_school_question_stem_EXACT_preserves_original_typo.includes('始用'),true);
 for(const k of ['new_FORMAL_SCIENCE_KP_APPROVED','new_ADMISSION_READY','new_PUBLISHED'])assert.equal(m[k],0);
});
test('2026-10-19 SAME KPI but actual distinct wording: Moon astronaut footsteps does not automatically duplicate published astronauts directly talking',()=>{
 const moon=m.records[1];
 assert.equal(moon.original_source_slot_id,'SCI_G04_S1_113_FINAL_004|S01|TF|004');
 assert.equal(moon.frozen_direct48KP_candidate,'sci_g04s1_03_03');
 assert.equal(moon.science_answer_independent_candidate_NOT_TEACHER_ANSWER,'O');
 assert.equal(moon.existing_formal_admission_status,'SCIENCE_AND_DIRECT48KP_CANDIDATE_DISTINCT_ACTUAL_FOOTSTEP_CONTEXT');
 const kp=authority.units.find(u=>u.grade===4&&u.semester===1&&u.unit_id==='U03').knowledge_points.find(k=>k.canonical_kp_id==='sci_g04s1_03_03');
 assert.equal(kp?.title,'聲音需要介質傳播');
 assert.equal(moon.original_school_question_stem_EXACT_preserves_original_typo.includes('踏步'),true);
 for(const s of m.published_114_related_same_fact_but_different_actual_words){
  const prev=b07.blocks.find(x=>x.id===s.public_block);
  assert.ok(prev&&prev.stem.includes('說話')&&!prev.stem.includes('踏步'));
  assert.notEqual(moon.original_school_question_stem_EXACT_preserves_original_typo,prev.stem);
 }
 assert.equal(m.clear_frozen48KP_model_science_candidates,1);
 assert.equal(m.no_direct_KP_HOLD,3);
 for(const i of [0,2,3]){
  assert.equal(m.records[i].frozen_direct48KP_candidate,null);
  assert.ok(m.records[i].existing_formal_admission_status.startsWith('HOLD_'));
 }
 assert.equal(m.new_ADMISSION_READY,0);
 assert.equal(m.new_PUBLISHED,0);
});
