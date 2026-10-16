import test from "node:test";import assert from "node:assert/strict";import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12E01Post43ScienceKP2} from "../site/assets/js/p12-e01-post43-sciencekp2-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const audit=read("data/review/p12-e01-post43-sciencekp26-two-source-exact-review-v1.json");
const bank=read("site/data/question-bank/p12-e01-post43-sciencekp2-public-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const norm=x=>String(x??"").normalize("NFKC").replace(/[\s，。！？；、（）():：①②③④]/gu,"");
test("corrected ScienceKP27 historical label to exact 26, preserving 43/632 baseline",()=>{
 assert.deepEqual([audit.priority_source_positions_reviewed,audit.science_question_unique_answer_candidates_selected,
 audit.original_exception_positions_retained,audit.other_remaining_non_priority_exception_positions,
 audit.before_public_answer_slots,audit.after_public_answer_slots_on_ci_pages_success,
 audit.before_remaining_exception_positions,audit.after_remaining_exception_positions_on_ci_pages_success],
 [26,2,24,17,632,634,43,41]);
 assert.equal(audit.records.length,26);
 assert.equal(new Set(audit.records.map(x=>x.source_slot_id)).size,26);
 assert.equal(audit.records.filter(x=>x.certified_new_learner_release).length,2);
 assert.equal(audit.records.filter(x=>x.source_science_kp_status==="HOLD_ORIGINAL_EXCEPTION_UNCHANGED").length,24);
 assert.ok(audit.records.every(x=>x.original_pdf_sha256_frozen&&x.priority_screening_done));
});
test("two untouched original school source PDFs have recomputed SHA, exact native box and model science answer",()=>{
 assert.equal(audit.certified_two_source_pdfs.length,2);
 assert.deepEqual(audit.certified_two_source_pdfs.map(x=>x.pdf_sha256),[
 "0422e4e69a317391021e1893760544a48cdeb07133440d68ce3019cf7041e2b7",
 "023ccfc808efbff873545efeae9b70ef4ce90ff3f5b55b1f94edcc81ca831fdd"]);
 assert.deepEqual(audit.certified_two_source_pdfs.map(x=>x.original_marker_bbox_pts),
 [[81.38,287.6,123.32,301.64],[53.88,321.23,98.18,336.77]]);
 for(const original of audit.certified_two_source_pdfs){assert.match(original.page_1_rgb_sha256,/^[a-f\d]{64}$/);
 assert.equal(original.original_text_and_marker_directly_verified,true)}
 assert.deepEqual(bank.blocks.map(x=>x.answer),["O","X"]);
 assert.deepEqual(bank.blocks.map(x=>x.canonical_kp_id),["sci_g04s1_02_05","sci_g04s1_03_10"]);
 assert.equal(validateAndConvertP12E01Post43ScienceKP2(bank,authority).answerSlots,2);
 for(const b of bank.blocks){
 const a=audit.records.find(x=>x.source_slot_id===b.source_slot_id);
 const paper=audit.certified_two_source_pdfs.find(x=>x.pdf_sha256===b.source_pdf_sha256);
 assert.equal(b.stem,a.original_scoreless_stem_frozen);
 assert.deepEqual(b.source_pdf_bbox_pts_top_left,paper.original_marker_bbox_pts);
 assert.equal(b.source_pdf_sha256,paper.pdf_sha256,"source original binary identity must be a required public block field");
 assert.equal(b.original_teacher_answer_key_authenticated,false);
 assert.ok(b.answer_assumption.includes("原校教師答案"));
 }
 const dongguang=read("data/source-archive/p12-art9-114-dongguang-g04s1-mid26-original-questions-v1.json");
 const mingyi=read("data/source-archive/p12-art9-114-mingyi-g04s1-final28-original-questions-v1.json");
 for(const b of bank.blocks)assert.equal(
 (b.source_id==="SCI_G04_S1_114_MID_008"?dongguang:mingyi).original_question_records.find(x=>x.source_id===b.source_slot_id)?.full_original_stem,b.stem);
 assert.equal(bank.blocks[1].canonical_kp_id!=="sci_g04s1_03_09",true,"don't force fit warning KP");
});
test("fail-closed on science answer, original text, source SHA, bbox, direct KP or rights",()=>{
 for(const fn of [v=>v.blocks[0].answer="X",v=>v.blocks[1].answer="O",v=>v.blocks[0].stem="tampered",
 v=>v.blocks[0].source_pdf_sha256="wrong",v=>v.blocks[1].source_pdf_bbox_pts_top_left[1]++,
 v=>v.blocks[0].canonical_kp_id="sci_g04s1_02_06",v=>v.blocks[1].canonical_kp_id="sci_g04s1_03_09",
 v=>v.blocks[0].source_slot_id="duplicate",v=>v.blocks[1].original_cropped_assets_included=true,
 v=>v.blocks[1].copyright_path="BAD",v=>v.blocks[1].operator_publication_approval=false,
 v=>v.expected_blocks=3]){
 const v=structuredClone(bank);fn(v);assert.throws(()=>validateAndConvertP12E01Post43ScienceKP2(v,authority));}
});
test("screen every previously published original text for exact normalized duplicates",()=>{
 const targets=new Set(bank.blocks.map(b=>norm(b.stem)));
 assert.equal(targets.size,2);
 for(const p of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json")&&x!=="p12-e01-post43-sciencekp2-public-v1.json")){
 const z=read("site/data/question-bank/"+p);
 for(const b of [...(z.blocks||[]),...(z.groups||[])])for(const q of [b,...(b.items||[])])
 assert.equal(targets.has(norm(q.stem)),false,"exact previously published duplicate in "+p);
 }
});
