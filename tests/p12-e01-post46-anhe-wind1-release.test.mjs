import test from "node:test";import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12E01Post46AnheWind1} from "../site/assets/js/p12-e01-post46-anhe-wind1-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const old=read("data/review/p12-e01-postcloseout-remaining47-complete-exception-reroute-v1.json");
const priority=read("data/review/p12-e01-postcloseout-remaining46-priority-review-v1.json");
const proof=read("data/review/p12-e01-post46-anhe-wind-original-pdf-science-r4-bbox-formal-acceptance-v1.json");
const bank=read("site/data/question-bank/p12-e01-post46-anhe-wind1-public-v1.json");
const archive=read("data/source-archive/p12-art9-114-anhe-g04s1-mid30-original-questions-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const normalize=s=>String(s||"").normalize("NFKC").replace(/\s+/gu,"");
test("Remaining 46 is exactly original 47 minus one already deployed Dongguang; no exceptions overwritten",()=>{
const removed="SCI_G04_S1_114_MID_008|S02|MC|004",remaining=old.records.filter(x=>x.source_slot_id!==removed);
assert.equal(priority.reviewed_source_positions,46);assert.equal(priority.records.length,46);
assert.deepEqual(priority.records.map(x=>x.source_slot_id),remaining.map(x=>x.source_slot_id));
assert.equal(new Set(priority.records.map(x=>x.source_slot_id)).size,46);
assert.equal(priority.provisional_operator_candidate_count,1);
assert.equal(priority.records.filter(x=>x.public_release_candidate).length,1);
assert.equal(priority.records.find(x=>x.public_release_candidate).source_slot_id,"SCI_G04_S1_114_MID_006|S01|TF|004");
assert.deepEqual([priority.public_source_answer_slots_before,priority.candidate_public_after_all_gates,priority.exceptions_after_candidate_all_gates],[629,630,45]);
assert.equal(priority.records.every(x=>x.previous_public_admitted===false),true);
});
test("Anhe original PDF exact stem, native answer marker bbox and R4 additive KP source gate",()=>{
const q=archive.original_question_records.find(x=>x.source_id===proof.source_slot_id);
assert.ok(q);assert.equal(q.full_original_stem,bank.blocks[0].stem);
assert.equal(proof.source_exact_stem,q.full_original_stem);
assert.equal(proof.original_pdf_sha256,archive.original_pdf_sha256);
assert.equal(proof.original_pdf_raw_size_bytes,archive.original_raw_pdf_size_bytes);
assert.deepEqual(q.answer_marker_pdf_bbox_pts_top_left,proof.original_pdf_native_answer_marker_bbox_pts_top_left);
assert.deepEqual(proof.pdf_native_glyphs_intersecting_bbox,["("," ",")"]);
assert.deepEqual(proof.original_page_raster_size_px,[1166,1651]);
assert.equal(proof.original_pdf_page_rotation_degrees,0);
assert.match(proof.original_page_rgb_samples_sha256,/^[a-f0-9]{64}$/);
assert.equal(proof.original_pdf_sha256_independently_recomputed_in_this_task,true);
assert.equal(proof.source_is_independent_without_shared_figure,true);
assert.equal(proof.school_teacher_original_key_authenticated,false);
assert.equal(proof.original_image_crop_or_pdf_published,false);
assert.equal(proof.answered_science,"O");
assert.equal(proof.primary_new_canonical_kp_id,"sci_g04s1_01_12");
assert.equal(bank.blocks[0].answer,"O");
assert.match(bank.blocks[0].answer_assumption,/不是原校教師|非.*教師/);
assert.match(bank.blocks[0].answer_explanation,/不能解讀成所有條件下/);
assert.equal(validateAndConvertP12E01Post46AnheWind1(bank,authority).answerSlots,1);
});
test("all previously published source bank stems do not contain an exact Anhe wind duplicate",()=>{
const dir="site/data/question-bank";
for(const name of readdirSync(dir).filter(x=>x.endsWith(".json")&&x!=="p12-e01-post46-anhe-wind1-public-v1.json")){
 const v=read(dir+"/"+name);
 for(const root of [...(v.blocks||[]),...(v.groups||[])]){
  for(const q of [root,...(root.items||[])])
   assert.notEqual(normalize(q.stem),normalize(bank.blocks[0].stem),"duplicate public stem in "+name);
 }
}
});
test("wind release fails closed on all mutated identities, original data, science answers, KP and rights",()=>{
const edits=[
 x=>x.blocks[0].answer="X",x=>x.blocks[0].stem="changed",x=>x.blocks[0].canonical_kp_id="sci_g04s1_01_06",
 x=>x.blocks[0].source_pdf_sha256="bad",x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]++,
 x=>x.blocks[0].source_slot_id="BAD",x=>x.blocks[0].dependency_review_verified=false,
 x=>x.blocks[0].answer_assumption="",x=>x.blocks[0].copyright_path="BAD",x=>x.expected_blocks=2,
 x=>x.blocks[0].original_teacher_answer_key_authenticated=true
];
for(const edit of edits){const copy=structuredClone(bank);edit(copy);
 assert.throws(()=>validateAndConvertP12E01Post46AnheWind1(copy,authority));}
const legacy=read("site/data/authority/science-g03-g04-selector-v2.json");
assert.throws(()=>validateAndConvertP12E01Post46AnheWind1(bank,legacy));
});

test("active V3 live aggregation is 630 while frozen V2 historical fixture still returns 629",async()=>{
 const {loadEmbeddedHistoricalBank}=await import("../site/assets/js/historical-bank-ox-v6.mjs");
 const original=globalThis.fetch;
 globalThis.fetch=async url=>{
  const p=String(url).replace(/^\.\.\/data\//,"site/data/");
  try{return {ok:true,json:async()=>read(p)}}catch{return {ok:false,json:async()=>{throw Error("not found "+p)}}}
 };
 try{
  const v3=await loadEmbeddedHistoricalBank(authority);
  assert.equal(v3.certifiedAnswerSlots,630);
  assert.equal(v3.certifiedTrueFalse,308);
  assert.equal(v3.certifiedStandaloneChoice,187);
  assert.equal(v3.certifiedGroupCount,36);
  assert.equal(v3.blocks.filter(x=>x.source_slot_id===proof.source_slot_id).length,1);
  const wind=v3.blocks.filter(x=>x.canonical_kp_id==="sci_g04s1_01_12"||x.secondary_canonical_kp_ids?.includes("sci_g04s1_01_12"));
  assert.equal(wind.length,2);
  const v2=await loadEmbeddedHistoricalBank(read("site/data/authority/science-g03-g04-selector-v2.json"));
  assert.equal(v2.certifiedAnswerSlots,629);
  assert.equal(v2.blocks.some(x=>x.source_slot_id===proof.source_slot_id),false);
 }finally{globalThis.fetch=original}
});
