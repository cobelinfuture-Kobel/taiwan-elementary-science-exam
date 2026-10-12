import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const st=JSON.parse(readFileSync("site/data/question-bank/s3-p09-status.json","utf8"));
const db=JSON.parse(readFileSync("site/data/question-bank/certified-context-groups-v2.json","utf8"));
test("P09 admission ledger matches original 20 source groups exactly",()=>{
 assert.equal(st.groups.length,20);assert.equal(new Set(st.groups.map(x=>x.group_id)).size,20);
 assert.deepEqual(new Set(st.groups.map(x=>x.group_id)),new Set(db.groups.map(x=>x.id)));
 assert.equal(st.p09_recovered_groups,11);assert.equal(st.p09_recovered_answer_slots,30);
 assert.equal(st.public_context_answer_slots,76);assert.equal(st.total_public_answer_slots,116);
 assert.equal(st.groups.filter(x=>x.previous_p08_state==="REVIEW_HOLD").length,11);
 assert.equal(st.groups.filter(x=>x.manual_scoring).length,1);
 assert.equal(st.groups.filter(x=>x.diagram_kind).length,7);
 assert.equal(st.source_cropped_figures_copied,0);assert.equal(st.teacher_key_verified_count,0);
});
