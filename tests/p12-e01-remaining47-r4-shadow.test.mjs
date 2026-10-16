import test from "node:test";import assert from "node:assert/strict";import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
test("P12 E01 47 R4 shadow comparison is exact, additive and does not admit held questions",()=>{
const a=read("data/review/p12-e01-postcloseout-remaining47-complete-exception-reroute-v1.json");
const b=read("data/review/p12-e01-postcloseout-remaining47-r4-shadow-comparison-v1.json");
assert.equal(b.reviewed,47);assert.equal(b.rows.length,47);
assert.deepEqual(b.rows.map(q=>q.source_slot_id),a.records.map(q=>q.source_slot_id));
assert.equal(b.new_kp_formally_reassigned,0);assert.equal(b.new_kp_admitted,0);
assert.equal(b.original_47_frozen,true);assert.equal(b.existing_kp_45_frozen,true);
assert.equal(b.rows.filter(q=>q.proposed_r4_kp).length,1);
assert.deepEqual(b.rows.filter(q=>q.proposed_r4_kp).map(q=>[q.source_slot_id,q.proposed_r4_kp]),[["SCI_G04_S1_114_MID_006|S01|TF|004","sci_g04s1_01_12"]]);
assert.equal(b.new_kp_02_13_direct_matches,0);assert.equal(b.new_kp_02_14_direct_matches,0);
assert.ok(b.rows.every(q=>q.publish_now===false));
for(let i=0;i<a.records.length;i++){assert.equal(a.records[i].student_public_admitted,false);assert.equal(b.rows[i].pdf_sha256,a.records[i].original_pdf_sha256);assert.equal(b.rows[i].archive_ref,a.records[i].source_archive_ref);}
});
