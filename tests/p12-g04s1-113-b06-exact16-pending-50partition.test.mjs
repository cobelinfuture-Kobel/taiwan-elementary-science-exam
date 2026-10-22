import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const exact=read('data/review/p12-g04s1-113-b06-exact16-source-science-kp-rights-dedup-operator-PENDING-v1.json');
const initial=read('data/review/p12-g04s1-113-native-tfmc-b06-50-source-checkpoint-v1.json');
const text=read('data/review/p12-g04s1-113-native-tfmc-b06-50-pdf-text-source-v2.json');
const geo=read('data/review/p12-g04s1-113-native-tfmc-b06-50-original-native-glyph-bbox-v1.json');
const routing=read('data/review/p12-g04s1-113-native-tfmc-b06-50-science-kp-context-routing-v1.json');
const authority=read('site/data/authority/science-g03-g04-selector-v3.json');
const approvedKP=new Set(authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(y=>y.canonical_kp_id)));
test('B06 frozen native source worklist 251–300 conserved 16 operator-pending +34 held',()=>{
 assert.equal(initial.records.length,50);
 assert.deepEqual(initial.source_queue_ordinal_range,[251,300]);
 assert.deepEqual(initial.records.map(x=>x.worklist_number),Array.from({length:50},(_,i)=>i+251));
 assert.equal(exact.operator_exact16_records.length,16);
 assert.equal(exact.held_34_original_source_records.length,34);
 const all=[...exact.operator_exact16_records.map(x=>x.original_source_slot_id),...exact.held_34_original_source_records.map(x=>x.source_id)];
 assert.equal(new Set(all).size,50);
 assert.deepEqual(new Set(all),new Set(initial.records.map(x=>x.source_slot_id)));
 assert.deepEqual([routing.direct_science_and_KP_text_candidates,routing.hold_and_outscope],[18,32]);
 assert.equal(exact.old_50_model_direct,18);
 assert.equal(exact.new_two_targeted_HOLD,2);
 assert.equal(exact.proposed_exact_operator_cohort_size,16);
 assert.equal(exact.new_final_HOLD_count,34);
});
test('All exact16 native page BBox, sha, 113 frozen 48KP, original text, four MC alternatives and independent answers trace to existing source',()=>{
 for(const item of exact.operator_exact16_records){
  const w=initial.records.find(x=>x.source_slot_id===item.original_source_slot_id);
  const s=text.source_records.find(x=>x.source_slot_id===item.original_source_slot_id);
  const g=geo.source_positions.find(x=>x.source_slot_id===item.original_source_slot_id);
  const route=routing.records.find(x=>x.source_slot_id===item.original_source_slot_id);
  assert.ok(w&&s&&g&&route);
  assert.equal(item.original_source_legacy_id,w.original_source_slot_id);
  assert.equal(item.original_pdf_sha256,w.original_pdf_sha256);
  assert.equal(item.original_pdf_sha256,s.source_pdf_sha256);
  assert.equal(item.original_pdf_sha256,g.source_pdf_sha256);
  assert.deepEqual(item.original_native_answer_bbox_pdf_pts_top_left,g.original_answer_parenthesis_bbox_pts_top_left);
  assert.equal(item.original_pdf_page,g.pdf_page_1_based);
  assert.equal(item.original_stem_verbatim,s.original_pdf_text_layer_stem);
  assert.equal(item.original_full_question_with_options_verbatim,s.original_pdf_text_layer_question);
  assert.deepEqual(item.original_ordered_options_verbatim,s.original_ordered_choices);
  assert.equal(item.proposed_independent_answer_not_school_teacher_key,route.scientific_answer_candidate);
  assert.equal(item.proposed_frozen_113_48kp,route.canonical_kp_candidate);
  assert.equal(approvedKP.has(item.proposed_frozen_113_48kp),true);
  const kpunit=item.proposed_frozen_113_48kp.split('_')[2];
  assert.ok(item.exam_scope.startsWith('MIDTERM')?['01','02'].includes(kpunit):['03','04'].includes(kpunit));
  if(item.original_source_slot_id.includes('|MC|')){
   assert.equal(item.original_ordered_options_verbatim.length,4);
   assert.ok(['①','②','③','④'].includes(item.proposed_independent_answer_not_school_teacher_key));
  }else{
   assert.equal(item.original_ordered_options_verbatim,null);
   assert.ok(['O','X'].includes(item.proposed_independent_answer_not_school_teacher_key));
  }
  assert.equal(item.exact_cohort_operator_approved,false);
  assert.equal(item.admission_ready,false);
  assert.equal(item.published,false);
  assert.equal(item.source_text_is_immutable,true);
  assert.match(item.rights_if_operator_approves,/TEXT_ONLY/);
 }
});
test('Crossyear name-only full-choice near duplicate & defective sound/light source item held without rewriting originals',()=>{
 const near=exact.held_34_original_source_records.find(x=>x.source_id==='SCI_G04_S1_113_FINAL_010|S1|MC|22');
 const defect=exact.held_34_original_source_records.find(x=>x.source_id==='SCI_G04_S1_113_FINAL_010|S1|MC|24');
 assert.equal(near.reason,'HOLD_CROSSYEAR_114_UNPUBLISHED_NEAR_SAME_STEM_CHOICES_NAME_ONLY');
 assert.equal(defect.reason,'HOLD_ORIGINAL_OPTION_SEMANTIC_UNCLEAR_SOUND_LIGHT');
 assert.equal(exact.source_114_near_114_current_student_site_admitted,false);
 assert.equal(exact.source_114_near_original_source_id,'SCI_G04_S1_114_FINAL_011|S2|MC|017');
 assert.equal(exact.source_114_near_options_same_as_113,true);
 const nonDirect=routing.records.filter(x=>x.route!=='DIRECT').map(x=>x.source_slot_id);
 assert.equal(nonDirect.length,32);
 assert.ok(nonDirect.every(id=>exact.held_34_original_source_records.some(x=>x.source_id===id)));
});
test('No previous public or operator gate changes; pending is not ADMISSION_READY or PUBLISHED',()=>{
 assert.equal(exact.prior_site_live_answer_positions,929);
 assert.equal(exact.prior_113_published_original_source_ids,293);
 assert.equal(exact.operator_input_exact16_approval_received,false);
 assert.equal(exact.do_not_publish_without_exact16_operator_scope_approval,true);
 assert.equal(exact.remain_draft_review_only,true);
 assert.deepEqual(exact.formal_metrics_this_turn,{FORMAL_SCIENCE_KP_APPROVED_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0});
 assert.equal(exact.five_113_original_scan_pages_visual_targeted_examined,16);
 assert.equal(exact.source_114_original_25_papers_717_question_records_checked,true);
 assert.equal(exact.published_113_293_original_stems_checked,true);
 assert.equal(exact.other_113_22_native_exam_original_PDF_text_read,true);
});
