import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../data/review/'+p,import.meta.url),'utf8'));
const q=read('p12-g04s1-113-b07-lushang-g03g05-sourceexact-native-bbox-science-kp-rights-hold-v1.json');
const source=read('p12-g04s1-113-b07-dependent50-originalpdf-ninepages-nativebbox-science-kp-hold-v1.json');
const closeout=read('p12-g04s1-113-b07-dependent50-exact3-published-47hold-pages-live-closeout-v1.json');
test('B07 G03 G05 seven actual school printed children keep native coordinates, exact words and shared original choices',()=>{
 assert.equal(q.original_7_count,7);assert.equal(q.source_exact_full_text_7,7);
 assert.equal(q.source_original_pdf_SHA256,'21edbb5e78c1ef8caf2aa37329615ae87fa2a6c6a306dcc1227da0f73b777732');
 assert.deepEqual(q.records.map(x=>x.worklist_ordinal),[320,321,322,323,328,329,330]);
 assert.equal(new Set(q.records.map(x=>x.original_source_slot_id)).size,7);
 assert.deepEqual(q.G03_original_source_and_answer_contract.expected_code_answers_not_school_teacher_key,['B','C','D','A']);
 assert.deepEqual(q.G05_original_source_and_answer_contract.expected_matching_from_context_not_school_key,['B','C','A']);
 assert.deepEqual(q.G03_original_source_and_answer_contract.original_shared_code_bank_ordered.map(x=>x.text),['震度','震央','震源','地震規模']);
 assert.deepEqual(q.G05_original_source_and_answer_contract.original_right_choices.map(x=>x.text),['整治河川','在裸露的山坡地種植植物','避免砍伐森林，維持森林生態的完整性。']);
 assert.deepEqual(q.G05_original_source_and_answer_contract.original_illustrations_pdf_xref,[36,39,40]);
 assert.equal(q.G05_original_source_and_answer_contract.original_print_no_precompleted_link_paths,true);
 for(const x of q.records){
  const original=source.records.find(r=>r.worklist_ordinal===x.worklist_ordinal);
  assert.ok(original,'source ordinal must exist');assert.equal(x.original_source_slot_id,original.original_native_source_slot_id);
  assert.equal(x.legacy_worklist_source_slot_id,original.legacy_source_slot_id);
  assert.equal(x.source_pdf_page_1based,original.source_page_1_based);
  assert.deepEqual(x.original_native_answer_or_left_label_bbox_pdf_pts,original.original_physical_bbox_pdf_pts_top_left);
  assert.equal(x.science_answer_proposal_not_teacher_key,original.independent_science_answer_candidate_NOT_ORIGINAL_TEACHER_KEY);
  assert.equal(x.formal_science_kp_approved,false);assert.equal(x.admission_ready,false);assert.equal(x.published,false);assert.equal(x.exact_operator_approval,false);
  assert.equal(x.duplicate_gate_formal_complete,false);
  assert.equal(x.native_pdf_text_word_and_page_visual_inspected,true);
  assert.ok(closeout.exact_source_dispositions.some(z=>z.worklist_ordinal===x.worklist_ordinal&&z.public_status==='RETAIN_FROZEN_HOLD'));
 }
});
test('G03 four glossary definitions are not direct frozen48 KP; obsolete Richter wording not silently corrected',()=>{
 const a=q.records.filter(x=>x.worklist_ordinal<=323);
 assert.equal(a.length,4);
 assert.ok(a.every(x=>x.direct_frozen_113_48KP===null));
 assert.ok(a.every(x=>x.hold_existing_reason.includes('HOLD_DIRECT_FROZEN48')));
 assert.match(q.G03_original_source_and_answer_contract.science_caveat_child3,/芮氏規模/);
 assert.match(q.G03_original_source_and_answer_contract.original_full_child_texts[2],/目前世界通用的為芮氏規模/);
 assert.equal(q.G03_original_source_and_answer_contract.current_113_frozen_48KP_U01_direct_terms_missing,true);
 assert.equal(q.original_native_answer_bracket_4,4);
});
test('G05 original left AND right PDF-native matching anchors do not fabricate a user answer path or license third party picture',()=>{
 const a=q.records.filter(x=>x.worklist_ordinal>=328);
 assert.equal(a.length,3);
 assert.ok(a.every(x=>x.direct_frozen_113_48KP==='sci_g04s1_01_07'));
 assert.ok(a.every(x=>x.original_image_pdf_xref>0&&x.original_image_bbox_pdf_pts?.length===4&&x.native_pdf_left_source_dot_bbox_pt?.length===4&&x.target_right_native_dot_bbox_pt?.length===4));
 assert.equal(q.original_native_matching_left_right_dot_anchor_3,3);
 assert.equal(q.original_student_answer_paths_were_preprinted,0);
 assert.equal(q.G05_original_source_and_answer_contract.image_author_or_public_redistribution_rights_verified,false);
 assert.ok(a.every(x=>x.hold_existing_reason.includes('HOLD_MATCHING')));
 assert.equal(q.formal_gate_summary.crossyear_113114_full_semantic_dedup_complete,false);
 assert.deepEqual([q.formal_gate_summary.science_KP_formal_approved,q.formal_gate_summary.admission_ready,q.formal_gate_summary.published_new],[0,0,0]);
 assert.equal(closeout.this_release_published,3);assert.equal(closeout.remaining_HOLD,47);
});
