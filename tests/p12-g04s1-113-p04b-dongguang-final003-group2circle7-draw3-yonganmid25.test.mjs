import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const j=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const d=j('p12-g04s1-113-p04b-dongguang-final003-circle2groups7targets-draw3-original-parent-v2.json');
const old=j('p12-g04s1-113-p04b-dongguang-final003-remaining26-native16-circle7-draw3-holds-v1.json');
const y=j('p12-g04s1-113-p04b-yongan-mid008-page1-native-tf11-mc14-exact-25-v1.json');
const pub=j('p12-g04s1-113-main-published178-source-suppression-readback-v12.json');
const reg=j('p12-g04s1-113-all29-kp48-source-firstpass-v1.json');
test('Dongguang original S05 has TWO multi-select parent prompts, 7 native selection option anchors, and no false standalone boxes',()=>{
 assert.equal(d.original_two_group_questions_NOT_seven_independent_questions,2);
 assert.equal(d.original_printed_circle_option_targets,7);
 assert.equal(d.original_source_drawing_parent_regions_without_physical_printed_answer_frame,3);
 assert.equal(d.original_independent_printed_answer_marker_BBoxes_elsewhere_in_this_paper,49);
 assert.equal(d.original_mixed_working_response_target_anchors_provisional_total,59);
 assert.equal(d.S05_multi_select_groups.length,2);
 assert.deepEqual(d.S05_multi_select_groups.map(x=>x.original_option_targets.length),[4,3]);
 assert.equal(new Set(d.S05_multi_select_groups.flatMap(x=>x.original_option_targets.map(y=>y.source_id_provisional))).size,7);
 const input=new Map(old.records.map(x=>[x.source_slot_id_provisional,x]));
 for(const g of d.S05_multi_select_groups){
  assert.equal(g.original_group_question_count,1);
  assert.equal(g.answer_mode,'MULTI_SELECT_CIRCLE_ORIGINAL_PRINTED_TEXT_OPTION_LABELS');
  for(const q of g.original_option_targets){
   assert.equal(q.physical_separate_printed_answer_bbox_exists,false);
   assert.deepEqual(q.native_PDF_original_option_glyph_bbox_pt,input.get(q.source_id_provisional).original_source_anchor_or_parent_bbox_pdf_pts_top_left);
  }
 }
 assert.equal(d.S04_S08_drawing_parents.length,3);
 assert.deepEqual(d.S04_S08_drawing_parents.map(x=>x.source_original_pdf_image_xrefs_with_original_page_placements.map(y=>y.xref)),[[42,41],[48],[]]);
 assert.ok(d.S04_S08_drawing_parents.every(x=>x.physical_independent_answer_marker_does_not_exist===true&&x.figure_original_copy_rights_pending===true));
 for(const k of ['new_FORMAL_SCIENCE_KP_APPROVED','new_ADMISSION_READY','new_PUBLISHED'])assert.equal(d[k],0);
});
test('Yongan original p1 exact 11 TF +14 MC, 2 known published and 23 new source-only markers',()=>{
 assert.equal(y.original_page1_TF11_native_printed_boxes,11);
 assert.equal(y.original_page1_MC14_native_printed_boxes,14);
 assert.equal(y.records.length,25);
 assert.equal(y.additional_recovered_existing_source_not_new_admission,23);
 assert.equal(y.records.filter(x=>x.already_main_published_suppress_duplicate).length,2);
 assert.equal(new Set(y.records.map(x=>x.source_original_id)).size,25);
 assert.equal(y.original_pdf_sha256,reg.original_source_records.find(x=>x.source_id===y.original_paper_id).original_pdf_sha256);
 for(const x of y.records){
  assert.equal(x.original_pdf_page_1based,1);
  const b=x.physical_PDF_native_printed_parenthesis_pair_bbox_pts_top_left;
  assert.ok(b.length===4&&b.every(Number.isFinite)&&b[0]<b[2]&&b[1]<b[3]);
  assert.equal(x.admission_ready,false);
  if(x.already_main_published_suppress_duplicate)assert.ok(pub.all_unique_published_source_slot_ids.includes(x.source_original_id));
 }
 assert.deepEqual(y.records.at(-1).physical_PDF_native_printed_parenthesis_pair_bbox_pts_top_left,[425.93,112.285,473.95,124.81]);
 for(const k of ['FORMAL_SCIENCE_KP_APPROVED_new','ADMISSION_READY_new','PUBLISHED_new'])assert.equal(y[k],0);
});
