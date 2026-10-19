import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=n=>JSON.parse(fs.readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const live=read('p12-g04s1-113-native46-post750-source-originaltext-options-gate-v1.json');
const src=read('p12-g04s1-113-native137-science-kp59-evidence-only-v1.json');
const duplicated=read('p12-g04s1-113-native59-all750-original-stem-collisions-and-legacylineage-v1.json');
const kp=read('p12-g04s1-113-native59-kp7-original-source-focused-decisions-v1.json');
const rights=read('p12-g04s1-113-native59-article9-rights-component-preflight-v1.json');
test('46 exact source identities = 59 independent Science drafts minus 13 verified already-public original duplicates',()=>{
 assert.equal(src.records.length,59);
 assert.equal(live.records.length,46);
 const old=new Set(duplicated.records.filter(x=>x.result==='SOURCE_LINEAGE_ONLY_DO_NOT_REPUBLISH'||['EXACT_SAME_ORIGINAL_TF','EXACT_SAME_MC_STEM_AND_OPTIONS','ONLY_OPTION_ORDER_CHANGED'].includes(x.duplicate_kind)).map(x=>x.unpublished113_source_slot_id));
 assert.equal(old.size,13);
 assert.equal(new Set(live.records.map(x=>x.source_slot_id)).size,46);
 assert.deepEqual(new Set(live.records.map(x=>x.source_slot_id)),new Set(src.records.map(x=>x.source_slot_id).filter(x=>!old.has(x))));
 for(const x of live.records) {
   assert.match(x.original_pdf_sha256,/^[0-9a-f]{64}$/);
   assert.ok(x.original_printed_item_marker_read_back);
   assert.ok(x.source_native_text_was_read_back_from_registered_original_pdf);
   assert.equal(x.source_identity_already_published,false);
   assert.equal(x.admission_ready,false);
   assert.equal(x.published,false);
 }
});
test('29/29 printed four-option native questions, 17 OX, 2 mixed-column original source exceptions isolated',()=>{
 assert.equal(live.summary.original_pdf_source_papers,8);
 assert.equal(live.summary.original_mc_four_option_labels_readback,29);
 assert.equal(live.summary.original_true_false_statements_readback,17);
 assert.equal(live.summary.native_pdf_text_interleaving_exception_positions,2);
 assert.equal(live.records.filter(x=>x.question_type==='MC'&&x.source_native_mc_four_printed_option_labels_observed).length,29);
 assert.equal(live.records.filter(x=>x.question_type==='TF').length,17);
 assert.equal(live.records.filter(x=>x.native_text_mixing_exception!==null).length,2);
 assert.equal(live.summary.source_question_items_without_school_name_in_native_text,8);
 assert.equal(live.records.filter(x=>!x.paper_school_name_text_layer_verified).length,8);
 assert.equal(live.summary.direct_kp_unresolved,1);
 assert.equal(live.records.filter(x=>x.direct_kp_uncertain).length,1);
});
test('other original Gates not silently accepted and 1 unresolved focused KP remains HOLD',()=>{
 assert.equal(kp.summary.unresolved_no_unambiguous_direct_kp_hold,1);
 assert.equal(rights.summary.rights_cleared_new,0);
 assert.equal(live.summary.new_formal_science_kp_approved,0);
 assert.equal(live.summary.new_admission_ready,0);
 assert.equal(live.summary.new_published,0);
 assert.ok(live.records.every(x=>!x.article9_component_release_rights_cleared));
 assert.ok(live.records.every(x=>!x.formal_science_kp_approved));
});
