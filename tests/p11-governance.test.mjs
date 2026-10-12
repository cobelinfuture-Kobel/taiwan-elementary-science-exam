import test from "node:test";import assert from "node:assert/strict";
import {buildP11,writeP11} from "../tools/p11-governance.mjs";
test("P11 governed question identity has 148 unique immutable content and revision SHA fingerprints",()=>{
 const result=buildP11();const ids=result["p11-question-identities.json"].questions;
 assert.equal(ids.length,148);
 assert.equal(new Set(ids.map(x=>x.identity_id)).size,148);
 assert.ok(ids.every(x=>/^[a-f0-9]{64}$/.test(x.content_sha256)&&/^[a-f0-9]{64}$/.test(x.published_revision_sha256)));
 assert.equal(ids.filter(x=>x.source_locator_quality==="EXACT_SOURCE_TF_NUMBER").length,72);
 assert.equal(ids.filter(x=>x.source_locator_quality==="ADAPTED_CONTEXT_SOURCE_SECTION_ONLY").length,76);
 assert.ok(ids.filter(x=>x.diagram_kind).every(x=>/^[a-f0-9]{64}$/.test(x.diagram_asset_bundle_sha256)));
 assert.ok(ids.every(x=>x.revision_history_available===false));
});
test("P11 registers all eight original PDFs and 477 candidate source slots; exact TF mapping is 72 only",()=>{
 const data=buildP11()["p11-full-corpus-ledger.json"];
 assert.equal(data.source_papers,8);assert.equal(data.source_slots.length,477);
 assert.equal(new Set(data.source_slots.map(x=>x.source_slot_id)).size,477);
 assert.equal(data.exact_tf_source_slots_publicly_admitted,72);
 assert.equal(data.source_slots_without_exact_public_item_link,405);
 assert.equal(data.published_adapted_context_answer_slots,76);
 assert.ok(data.groups.every(x=>x.exact_source_subitem_map_completed===false));
 assert.ok(data.source_slots.every(x=>/^[a-f0-9]{64}$/.test(x.source_pdf_sha256)));
 assert.equal(data.excluded_or_rejected_questions_not_yet_individually_classified,true);
});
test("P11 KP coverage is computed from the current live bank, not presumed for every unit",()=>{
 const c=buildP11()["p11-kp-coverage.json"];
 assert.equal(c.total_units,16);assert.equal(c.source_authority_kp_total,187);
 assert.equal(c.units_with_published_answer_slots,16);
 assert.equal(c.primary_kp_covered,71);assert.equal(c.primary_kp_missing,116);
 assert.equal(c.public_answer_slots,148);
 assert.equal(c.units.reduce((n,x)=>n+x.kp_total,0),187);
 assert.equal(c.units.reduce((n,x)=>n+x.published_answer_slots,0),148);
 assert.equal(c.knowledge_points.filter(x=>x.primary_answer_slots===0).length,116);
 assert.equal(c.units.find(x=>x.unit_id==="4-S2-U03").primary_kp_covered,2);
});
test("P11 generated records read back byte-for-byte, preventing stale deployment",()=>{
 assert.deepEqual(writeP11({check:true}),{items:148,kpCovered:71,kpTotal:187,originalSlots:477,exactPublicTF:72,adaptedSlots:76,unresolvedOriginalSlots:405,sourceCount:8});
});
