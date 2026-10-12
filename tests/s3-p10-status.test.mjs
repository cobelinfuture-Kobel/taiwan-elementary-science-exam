import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const st=JSON.parse(readFileSync("site/data/question-bank/s3-p10-status.json","utf8"));
const db=JSON.parse(readFileSync("site/data/question-bank/approved-historical-ox-v4.json","utf8"));
const old=JSON.parse(readFileSync("site/data/question-bank/certified-context-groups-v2.json","utf8"));
test("new lower-semester 113 authority and period ledger stays consistent",()=>{
 assert.equal(st.source_count,4);assert.equal(st.newly_certified_text_tf,32);
 assert.equal(st.total_tf,72);assert.equal(st.new_public_answer_slots,148);
 assert.equal(st.p09_context_groups_preserved,old.groups.length);
 assert.equal(st.p09_context_slots_preserved,old.expected_answer_slots);
 assert.equal(st.new_public_answer_slots,db.blocks.length+old.expected_answer_slots);
 assert.ok(st.sources.every(x=>x.semester===2 && x.certified_tf_count===8 && /^[a-f0-9]{64}$/.test(x.source_pdf_sha256)));
 assert.deepEqual(Object.values(st.new_by_period),[8,8,8,8]);
});
