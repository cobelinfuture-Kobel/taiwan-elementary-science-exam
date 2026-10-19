import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const data=n=>JSON.parse(fs.readFileSync(new URL('../'+n,import.meta.url),'utf8'));
const p=data('site/data/question-bank/p12-g04s1-113-native38-consolidated-prepublic-v1.json');
const m=data('data/review/p12-g04s1-113-native38-consolidated-operator-admission-manifest-v1.json');
const auth=data('site/data/authority/science-g03-g04-selector-v3.json');
const allowed=new Set(auth.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
test('prepublication 38 complete original school paper questions retain exact primary question/option/answers without scoring',()=>{
 assert.equal(p.blocks.length,38);
 assert.equal(m.records.length,38);
 assert.equal(p.expected_answer_slots,38);
 assert.equal(p.expected_standalone_true_false,15);
 assert.equal(p.expected_standalone_choice,23);
 assert.equal(m.summary.student_live_site_preexisting_answer_slots,750);
 assert.equal(m.summary.student_live_site_preexisting_113_source_slots,114);
 assert.equal(new Set(p.blocks.map(x=>x.id)).size,38);
 assert.equal(new Set(p.blocks.map(x=>x.source_slot_id)).size,38);
 assert.equal(new Set(m.records.map(x=>x.source_slot_id)).size,38);
 const mm=new Map(m.records.map(x=>[x.source_slot_id,x]));
 for(const x of p.blocks){
  assert.match(x.source_pdf_sha256,/^[a-f0-9]{64}$/);
  assert.ok(allowed.has(x.canonical_kp_id));
  assert.equal(x.grade,4);
  assert.equal(x.semester,1);
  assert.equal(x.unit,'4-S1-U'+x.canonical_kp_id.match(/sci_g04s1_(\d{2})/)[1]);
  assert.ok(x.stem?.trim().length>=6);
  assert.equal(x.source_pdf_bbox_pts_top_left.length,4);
  assert.ok(x.source_pdf_bbox_pts_top_left[2]>x.source_pdf_bbox_pts_top_left[0]);
  assert.ok(x.source_pdf_bbox_pts_top_left[3]>x.source_pdf_bbox_pts_top_left[1]);
  assert.equal(x.original_teacher_answer_key_authenticated,false);
  assert.equal(x.original_cropped_assets_included,false);
  assert.equal(x.dependency_review_verified,true);
  assert.equal(x.copyright_path,'SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES');
  assert.ok(x.answer_explanation?.length>5);
  assert.ok(mm.has(x.source_slot_id));
  assert.deepEqual(mm.get(x.source_slot_id).exact_pdf_glyph_bbox_pts_top_left,x.source_pdf_bbox_pts_top_left);
  if(x.type==='mcq'){
   assert.equal(x.options.length,4);
   assert.deepEqual(x.options.map(y=>y[0]),['①','②','③','④']);
   assert.ok(['①','②','③','④'].includes(x.answer));
  } else {
   assert.equal(x.type,'tf');
   assert.ok(!('options' in x));
   assert.ok(['O','X'].includes(x.answer));
  }
 }
});
test('38 consolidated release proposal is not automatically student bank admission or publication',()=>{
 assert.equal(p.public_site_integrated,false);
 assert.equal(p.requires_operator_batch_manifest_approval,true);
 assert.equal(m.summary.explicit_final_operator_cohort_manifest_release_signoff,false);
 assert.equal(m.summary.admission_ready_new,0);
 assert.equal(m.summary.published_new,0);
 assert.equal(m.suppressed_previous_public_sources.length,13);
 assert.equal(new Set(m.suppressed_previous_public_sources.map(x=>x.source_slot_id)).size,13);
 const suppressed=new Set(m.suppressed_previous_public_sources.map(x=>x.source_slot_id));
 assert.ok(p.blocks.every(x=>!suppressed.has(x.source_slot_id)));
 assert.ok(p.blocks.every(x=>!x.operator_publication_approval));
 assert.ok(p.blocks.every(x=>x.certification_status==='FORMAL_SCIENCE_KP_VERIFIED_OPERATOR_RELEASE_PENDING'));
 assert.ok(m.records.every(x=>!x.operator_cohort_final_explicit_release_confirmation));
 assert.ok(m.records.every(x=>!x.admission_ready&&!x.published));
});
test('official original school exam question text rights only; no third-party image PDF or teacher answer copy',()=>{
 assert.equal(m.exam_papers.length,8);
 assert.equal(m.summary.article9_school_exam_question_text_rights_verified,38);
 assert.equal(m.summary.science_unique_direct_kp_formal_verified,38);
 assert.ok(m.records.every(x=>x.rights_license_status==='REGULATED_EXAM_QUESTION_ART9'));
 assert.ok(m.records.every(x=>x.rights_scope==='EXAM_QUESTION_TEXT_ONLY'));
 assert.ok(m.records.every(x=>x.no_required_parent_figure_or_third_party_content));
 assert.ok(m.records.every(x=>x.original_school_exam_header_visual_verified));
 assert.equal(m.original_pdf_images_public,false);
 assert.equal(m.original_teacher_key_present,false);
});
