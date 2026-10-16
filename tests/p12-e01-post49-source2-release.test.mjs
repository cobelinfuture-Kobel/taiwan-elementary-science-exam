import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAndConvertP12E01Post49Source2} from "../site/assets/js/p12-e01-post49-source2-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const proof=read("data/review/p12-e01-post49-mingyi-taozijiao-two-source-exact-science-kp-acceptance-v1.json");
const sweep=read("data/review/p12-e01-postcloseout-remaining49-science-kp-source-sweep-v1.json");
const before=read("data/review/p12-e01-postcloseout-remaining52-source-classification-v1.json");
const anhe=read("site/data/question-bank/p12-e01-post52-anhe-final3-public-v1.json");
const bank=read("site/data/question-bank/p12-e01-post49-source2-public-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const normalize=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
const sourceKeys=new Set([
"SCI_G04_S1_114_MID_007|S01|TF|003",
"SCI_G04_S1_114_FINAL_012|Q06|001"
]);
test("P12 E01 remaining49 exact lineage: 52 minus 3 previously admitted, only 2 science/KP candidates, 47 still HOLD",()=>{
 assert.deepEqual([before.records.length,anhe.blocks.length,sweep.records.length],[52,3,49]);
 const published=new Set(anhe.blocks.map(x=>x.source_slot_id));
 assert.deepEqual(
  [...before.records.map(x=>x.source_slot_id).filter(id=>!published.has(id))].sort(),
  sweep.records.map(x=>x.source_slot_id).sort()
 );
 assert.equal(new Set(sweep.records.map(x=>x.source_slot_id)).size,49);
 assert.equal(sweep.direct_science_kp_source_exact_candidates,2);
 assert.equal(sweep.expected_unreleased_exception_count_after_selective_admission,47);
 assert.equal(sweep.baseline_student_answer_slots,626);
 assert.equal(sweep.expected_student_answer_slots_after_release,628);
 assert.equal(sweep.records.filter(x=>x.new_direct_kp).length,2);
 assert.equal(sweep.records.filter(x=>x.selective_repair_status==="RETAIN_ORIGINAL_EXCEPTION_HOLD").length,47);
 assert.equal(sweep.all_other_47_not_released,true);
 assert.equal(sweep.original_frozen_source_and_115_exception_ledger_immutable,true);
 const matches=sweep.records.filter(x=>x.new_direct_kp);
 assert.deepEqual(new Set(matches.map(x=>x.source_slot_id)),sourceKeys);
 for(const r of sweep.records){
  const b=before.records.find(x=>x.source_slot_id===r.source_slot_id);
  assert.ok(b);
  assert.equal(b.source_archive_ref,r.source_archive_ref);
  assert.equal(b.original_pdf_sha256,r.original_pdf_sha256);
  assert.deepEqual(b.original_flags,r.original_flags);
 }
});
test("P12 E01 source2 exact two real native text PDF BBoxes, SHA, printed text, science and direct existing KP",()=>{
 const certified=validateAndConvertP12E01Post49Source2(bank,authority);
 assert.deepEqual([certified.answerSlots,certified.standaloneTf,certified.standaloneChoice,certified.contextGroups],[2,2,0,0]);
 assert.equal(proof.source_review_positions,49);
 assert.equal(proof.formal_admission_candidates,2);
 assert.equal(proof.source_remain_after_release,47);
 assert.equal(proof.baseline_public_slots,626);
 assert.equal(proof.target_public_slots_after_release,628);
 assert.equal(proof.school_original_answer_keys_authenticated,false);
 assert.equal(proof.all_original_pdf_SHA256_verified,true);
 assert.equal(proof.all_original_marker_native_text_glyph_and_visual_bbox_verified,true);
 assert.equal(proof.no_original_pdf_or_images_published,true);
 assert.equal(proof.records.length,2);
 assert.equal(bank.blocks.length,2);
 for(const b of bank.blocks){
  const e=proof.records.find(x=>x.source_slot_id===b.source_slot_id);
  const item=sweep.records.find(x=>x.source_slot_id===b.source_slot_id);
  const doc=read(item.source_archive_ref);
  const original=doc.original_question_records.find(x=>x.source_id===b.source_slot_id);
  assert.ok(e&&item&&original);
  assert.equal(doc.original_pdf_sha256,b.source_pdf_sha256);
  assert.equal(e.original_pdf_sha256,b.source_pdf_sha256);
  assert.equal(e.source_drive_file_id,doc.original_source_drive_file_id);
  assert.equal(e.original_pdf_byte_size,doc.original_raw_pdf_size_bytes);
  assert.equal(e.source_original_question_full_stem_including_scoring_annotation,original.full_original_stem);
  assert.equal(e.source_original_question_full_stem_including_scoring_annotation,item.original_full_source_text);
  assert.equal(e.student_scoreless_stem_projection,b.stem);
  assert.equal(e.reasoned_science_answer,b.answer);
  assert.equal(e.final_direct_canonical_kp_id,b.canonical_kp_id);
  assert.equal(e.independent_science_reason,b.answer_explanation);
  assert.deepEqual(e.source_original_options,original.full_original_options_in_order);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,e.source_bbox_native_pdf_glyph_source_coordinates);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,original.answer_marker_pdf_bbox_pts_top_left);
  assert.equal(e.source_bbox_geometry_verified_by_pdf_image_overlay,true);
  assert.equal(e.source_pdf_native_text_layer_available,true);
  assert.equal(e.pdf_page_render_scale,1.6);
  assert.equal(e.original_pdf_page_rotation_degrees,0);
  assert.equal(e.source_pdf_page_1_based,1);
  assert.equal(e.published_original_scan_images,false);
  assert.equal(e.source_original_school_answer_key_authenticated,false);
  assert.equal(e.no_picture_parent_dependency,true);
  assert.equal(e.article9_regulated_exam_question_text_only,true);
  const canonical=authority.units.flatMap(u=>u.knowledge_points).find(x=>x.canonical_kp_id===b.canonical_kp_id);
  assert.ok(canonical?.title);
 }
 const mingyi=proof.records.find(x=>x.source_slot_id.includes("MID_007"));
 const taozijiao=proof.records.find(x=>x.source_slot_id.includes("FINAL_012"));
 assert.deepEqual([mingyi.original_pdf_page_size_pts,mingyi.original_page_image_size_px],[ [841.92,1190.52],[1348,1905] ]);
 assert.equal(mingyi.original_page_rgb_sha256,"788ebae1f026028f3322494441a89947031a9c767c5429369ea88fe0e7cbef71");
 assert.deepEqual([taozijiao.original_pdf_page_size_pts,taozijiao.original_page_image_size_px],[ [728.52,1031.82],[1166,1651] ]);
 assert.equal(taozijiao.original_page_rgb_sha256,"b5d46ac4f0bd6c7713ac20f883b5c1f14f8885c3f50508ce192b860587c7e815");
 assert.ok(taozijiao.source_original_question_full_stem_including_scoring_annotation.includes("(9 分)"));
 assert.ok(!taozijiao.student_scoreless_stem_projection.includes("(9 分)"));
 assert.equal(mingyi.final_direct_canonical_kp_id,"sci_g04s1_01_05");
 assert.equal(taozijiao.final_direct_canonical_kp_id,"sci_g04s1_03_07");
});
test("P12 E01 source2 immutable runtime fails closed on science answer, stem, KP, bbox, SHA, provenance and rights",()=>{
 const changes=[
 x=>x.blocks[0].answer="O",
 x=>x.blocks[0].stem="wrong",
 x=>x.blocks[0].canonical_kp_id="sci_g04s1_01_06",
 x=>x.blocks[1].canonical_kp_id="sci_g04s1_03_08",
 x=>x.blocks[0].source_pdf_sha256="WRONG",
 x=>x.blocks[1].source_page_pdf_1_based=2,
 x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]+=1,
 x=>x.blocks[1].answer_explanation="tampered",
 x=>x.blocks[0].source_slot_id="MISSING",
 x=>x.blocks[0].operator_publication_approval=false,
 x=>x.blocks[0].copyright_path="missing",
 x=>x.blocks[0].original_cropped_assets_included=true,
 x=>x.expected_blocks=3
 ];
 for(const edit of changes){const x=structuredClone(bank);edit(x);assert.throws(()=>validateAndConvertP12E01Post49Source2(x,authority));}
});
test("P12 E01 source2 published exact stems not duplicates in existing public student bank",()=>{
 const prior=["approved-historical-ox-v4","p12-b04-b01-47-public-v1",
  "p12-b04-b02-41-public-v1","p12-b04-b03-41-public-v1","p12-b04-b04-47-public-v1",
  "p12-b04-b05-40-public-v1","p12-b04-b06-47-public-v1","p12-b04-b07-31-public-v1",
  "p12-b04-g04s1-chongde-mid6-public-v1","p12-b04-g04s1-yongan-mid9-public-v1",
  "p12-e01-puren-final16-public-v1","p12-e01-puren-mid13-public-v1",
  "p12-e01-heshun-mid15-public-v1","p12-e01-heshun-final21-public-v1",
  "p12-e01-post52-anhe-final3-public-v1"];
 const seen=new Set(prior.flatMap(n=>read("site/data/question-bank/"+n+".json").blocks.map(q=>normalize(q.stem))));
 for(const item of bank.blocks)assert.equal(seen.has(normalize(item.stem)),false,item.source_slot_id);
});
