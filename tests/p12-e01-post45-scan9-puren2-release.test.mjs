import test from "node:test";import assert from "node:assert/strict";import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12E01Post45Puren2} from "../site/assets/js/p12-e01-post45-puren2-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const e=read("data/review/p12-e01-post45-scan9-source-pixelbbox-science-kp-selective-v1.json"),bank=read("site/data/question-bank/p12-e01-post45-puren2-public-v1.json");
const archive=read("data/source-archive/p12-art9-114-puren-g04s1-mid27-original-questions-v1.json"),base=read("data/review/p12-e01-postcloseout-remaining46-priority-review-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=s=>String(s??"").normalize("NFKC").replace(/\s+/gu,"");
const strip=s=>String(s??"").replace(/[（(]每個答案\s*1\s*分[）)]/gu,"");
test("Scan9 frozen 45 triage is nine exact source positions / 3 verified original scans, 2 admission 7 quarantine",()=>{
 const previously=base.records.filter(x=>x.previous_held_status==="RASTER_BBOX_RECOVERED_SEMANTIC_OR_KP_HOLD");
 assert.equal(base.records.length,46);assert.equal(e.positions_reviewed,9);
 assert.deepEqual(e.records.map(x=>x.source_slot_id),previously.map(x=>x.source_slot_id));
 assert.equal(e.certified_selected_admissions,2);assert.equal(e.science_kp_or_source_held,7);
 assert.deepEqual(e.by_hold_reason,{SOURCE_TEXT_CORRUPTION:1,KP_NO_DIRECT_MATCH:6});
 assert.deepEqual([e.public_slots_before,e.conditional_total_after_all_gates,e.remaining_exception_positions_before,e.conditional_remaining_after_all_gates],[630,632,45,43]);
 assert.equal(e.original_pdf_sha_verified_against_frozen_archive_for_all_3,true);
 assert.equal(e.six_raster_page_sha256_verified_against_prior_evidence,true);
 assert.equal(e.student_bank_original_image_assets_included,false);
 assert.equal(new Set(e.records.map(x=>x.source_slot_id)).size,9);
 for(const x of e.records){assert.match(x.upright_page_rgb_sha256,/^[a-f0-9]{64}$/);assert.equal(x.image_verified_answer_marker_pixel_bbox_candidate.length,4);
 assert.deepEqual(x.answer_marker_bbox_pts_top_left,x.image_verified_answer_marker_pixel_bbox_candidate.map(n=>Number((n/1.6).toFixed(3))));}
});
test("Two formally admitted Puren original sources preserve exact stem/options, printed marker, scoreless parent and direct KP",()=>{
 const source=new Map(archive.original_question_records.map(x=>[x.source_id,x]));
 assert.equal(validateAndConvertP12E01Post45Puren2(bank,authority).answerSlots,2);
 assert.equal(bank.blocks.length,2);assert.deepEqual(bank.blocks.map(x=>x.answer),["④","X"]);
 assert.deepEqual(bank.blocks.map(x=>x.canonical_kp_id),["sci_g04s1_01_03","sci_g04s1_01_10"]);
 for(const b of bank.blocks){
  const r=e.records.find(x=>x.source_slot_id===b.source_slot_id),o=source.get(b.source_slot_id);
  assert.ok(r&&o);
  assert.equal(norm(strip(o.full_original_stem)),norm(b.stem));
  assert.deepEqual(o.full_original_options_in_order.map(x=>x.label+x.text),b.options||[]);
  assert.equal(o.answer_marker_pdf_page,b.source_page_pdf_1_based);
  assert.deepEqual(b.source_pdf_bbox_pts_top_left,r.answer_marker_bbox_pts_top_left);
  assert.equal(r.exact_pixel_bbox_independent_acceptance,true);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.equal(b.original_cropped_assets_included,false);
  assert.match(b.answer_assumption,/非原校教師答案/);
 }
 assert.ok(e.records.find(x=>x.source_slot_id.endsWith("|S2|TF|011")).source_science_kp_decision==="HOLD_ORIGINAL_PRINTED_TEXT_CORRUPTION");
 assert.equal(e.records.filter(x=>x.source_science_kp_decision.startsWith("HOLD")).length,7);
});
test("Selective admission rejects forged source bytes, bbox, original options, scientific answer, KP and rights",()=>{
 for(const f of [
 b=>b.blocks[0].answer="③",b=>b.blocks[0].stem="not original",b=>b.blocks[0].options[3]="④沙",
 b=>b.blocks[0].source_pdf_sha256="bad",b=>b.blocks[0].source_pdf_bbox_pts_top_left[1]++,
 b=>b.blocks[0].canonical_kp_id="sci_g04s1_01_06",b=>b.blocks[0].source_slot_id="FAKE",
 b=>b.blocks[1].answer="O",b=>b.blocks[1].stem="bad",b=>b.blocks[1].dependency_review_verified=false,
 b=>b.blocks[1].copyright_path="NOT_CLEARED",b=>b.blocks[0].operator_publication_approval=false,
 b=>b.expected_blocks=9,b=>b.original_cropped_images_included=true
 ]){const z=structuredClone(bank);f(z);assert.throws(()=>validateAndConvertP12E01Post45Puren2(z,authority));}
});
test("No exact duplicate original learner stems in already published question bank",()=>{
 const seen=new Set(bank.blocks.map(x=>norm(x.stem)));assert.equal(seen.size,2);
 for(const name of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-e01-post45-puren2-public-v1.json")){
  const v=read("site/data/question-bank/"+name);
  for(const b of (v.blocks||[]))for(const x of [b,...(b.items||[])])
   assert.equal(seen.has(norm(x.stem)),false,"previous duplicate: "+name);
 }
});
