import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const close=read("data/review/p12-g04s1-113-b08-chenggong-mc7-sevenpublished-10matching33hold-final-closeout-v1.json");
const bank=read("site/data/question-bank/p12-g04s1-113-b08-chenggong-mc7-two-parent-public-v1.json");
test("B08 final exact source 50 = live seven + ten separate matching + 33 held",()=>{
 assert.deepEqual(close.exact_operator_cohort,[387,388,389,390,391,392,393]);
 assert.equal(close.original_source_work_positions,50);
 assert.equal(close.unpublished_matching10.length,10);
 assert.equal(close.unpublished_other_hold33.length,33);
 assert.equal(new Set([...close.exact_operator_cohort,...close.unpublished_matching10,...close.unpublished_other_hold33]).size,50);
 assert.equal(close.B01_to_B07_not_reopened,true);
});
test("B08 latest validated live Pages seven group children, no teacher-key or source images",()=>{
 assert.deepEqual(bank.blocks.map(b=>b.items.length),[3,4]);
 assert.deepEqual(bank.blocks.flatMap(g=>g.items.map(x=>x.source_original_slot_id)),close.source_original_slots);
 assert.deepEqual(close.formal_metrics,{FORMAL_SCIENCE_KP_APPROVED_new:7,ADMISSION_READY_at_prepublication:7,ADMISSION_READY_remaining_after_release:0,PUBLISHED_new:7});
 assert.equal(close.student_site_after_live.answer_slots,959);
 assert.equal(close.student_site_after_live.context_groups,38);
 assert.equal(close.proof.pages_conclusion,"success");
 assert.equal(close.proof.pages_run_id,40156845567);
 assert.equal(close.proof.main_live_sha,"cb93f255d8499a6845ee8bff097ee7e71d53ca8a");
 assert.equal(close.source_pdf_images_not_published,true);
 assert.equal(close.school_teacher_answer_key_not_authenticated,true);
});
