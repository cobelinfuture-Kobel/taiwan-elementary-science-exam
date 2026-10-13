import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const get=p=>JSON.parse(readFileSync(p,"utf8"));
const p="data/review/p12-g04s1-114-";
const science=get(p+"b01-dongguang-final-science-figure-verdict-v1.json");
const draft=get(p+"b01-correctable-five-draft-proposals-v1.json");
test("Five correction proposals link exactly to five science CORRECTABLE original positions without amending originals",()=>{
 assert.equal(draft.correction_proposal_count,5);
 assert.equal(draft.items.length,5);
 const expected=new Set(science.items.filter(x=>x.independent_model_science_verdict==="CORRECTABLE").map(x=>x.source_slot_id));
 assert.deepEqual(new Set(draft.items.map(x=>x.source_slot_id)),expected);
 const all=new Set(science.items.map(x=>x.source_slot_id));
 for(const x of draft.items){
  assert.ok(all.has(x.source_slot_id));
  assert.ok(x.risk&&x.risk.length>10);
  assert.ok(x.proposed_stem||x.proposed_option4);
  assert.ok(x.expected_answer_after_rewrite);
  assert.equal(x.operator_revision_status,"DRAFT_NOT_APPROVED");
  assert.equal(x.public_release_approved,false);
 }
 assert.equal(draft.all_drafts_pending_operator_approval,true);
 assert.equal(draft.teacher_key_authenticated,false);
 assert.equal(draft.science_proposal_is_separate_from_original_source,true);
 assert.equal(draft.public_admission_approved,false);
});
