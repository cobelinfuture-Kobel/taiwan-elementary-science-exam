import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
import {validateAndConvertP12E01Post47Dongguang1} from "../site/assets/js/p12-e01-post47-dongguang1-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));const bank=read("site/data/question-bank/p12-e01-post47-dongguang1-public-v1.json");
test("Dongguang original native PDF evidence plus direct legacy KP and ③ relative likelihood answer",()=>{
const proof=read("data/review/p12-e01-post47-dongguang-stream-lily-source-exact-unique-science-kp-v1.json");
const e=read("data/review/p12-e01-post47-dongguang1-formal-source-science-kp-acceptance-v1.json");
const archive=read("data/source-archive/p12-art9-114-dongguang-g04s1-mid26-original-questions-v1.json");
const source=archive.original_question_records.find(q=>q.source_id===e.source_slot_id),b=bank.blocks[0];
assert.ok(source);assert.equal(e.source_pdf_sha256,proof.records[0].original_pdf_sha256);
assert.equal(b.stem,source.full_original_stem);assert.deepEqual(b.options,source.full_original_options_in_order.map(x=>x.label+x.text));
assert.deepEqual(b.source_pdf_bbox_pts_top_left,source.answer_marker_pdf_bbox_pts_top_left);
assert.equal(e.source_page_rgb_sha256,proof.records[0].original_page_rgb_sha256);
assert.equal(b.answer,"③");assert.equal(b.canonical_kp_id,"sci_g04s1_02_02");assert.equal(e.r4_new_kp_remap,false);
assert.equal(e.original_school_teacher_key_authenticated,false);
assert.deepEqual([e.main_pre_admission_public_slots,e.new_student_answer_slots_on_full_success,e.remaining_exception_slots_on_full_success],[628,629,46]);
assert.equal(validateAndConvertP12E01Post47Dongguang1(bank,read("site/data/authority/science-g03-g04-selector-v3.json")).answerSlots,1);
});
test("One-MC release is fail closed on answer, source stem, options, bbox, KP, source identifier and rights",()=>{
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
for(const change of [b=>b.blocks[0].answer="②",b=>b.blocks[0].stem="wrong",b=>b.blocks[0].options[2]="③荷花",b=>b.blocks[0].source_pdf_bbox_pts_top_left[1]++,b=>b.blocks[0].canonical_kp_id="sci_g04s1_02_13",b=>b.blocks[0].source_slot_id="FAKE",b=>b.blocks[0].copyright_path="NOT_CLEARED",b=>b.blocks[0].dependency_review_verified=false,b=>b.expected_blocks=2]){
const c=structuredClone(bank);change(c);assert.throws(()=>validateAndConvertP12E01Post47Dongguang1(c,authority));}
});
