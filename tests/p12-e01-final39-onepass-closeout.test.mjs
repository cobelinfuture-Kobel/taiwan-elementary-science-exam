import test from "node:test";import assert from "node:assert/strict";import {readFileSync,readdirSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const final=read("data/review/p12-e01-remaining39-onepass-final-exceptions-closeout-v1.json");
const prior=read("data/review/p12-e01-postcloseout-remaining46-priority-review-v1.json");
const norm=s=>String(s||"").normalize("NFKC").replace(/[\s，。！？:：（）()]/gu,"");
test("P12 E01 all 39 source position exceptions screened exactly once; no invented admissions",()=>{
 assert.equal(final.records.length,39);assert.equal(final.initial_unique_exception_slots_after_PR120,39);
 assert.equal(final.onepass_original_archive_records_screened,39);
 assert.equal(new Set(final.records.map(x=>x.source_slot_id)).size,39);
 assert.deepEqual(final.current_scope_exception_disposition_counts,{
  EXCLUDE_ALREADY_PUBLISHED_EXACT_STEM:5,
  DEFER_SCIENCE_UNIQUE_ANSWER_OR_DIRECT_KP_GATE:32,
  EXCLUDE_SOURCE_PRINT_CHOICE_LABEL_CONFLICT:1,
  EXCLUDE_ORIGINAL_PRINT_TEXT_UNRELIABLE:1
 });
 assert.equal(final.eligible_learner_question_admission_count,0);
 assert.equal(final.new_public_bank_asset_count,0);assert.equal(final.open_untriaged_exception_positions,0);
 assert.equal(final.deferred_or_excluded_source_positions_total,39);
 assert.deepEqual([final.public_answer_slots_before_and_after,final.public_true_false_before_and_after,final.public_standalone_mc_before_and_after,final.public_context_groups_before_and_after],[636,313,188,36]);
});
test("final 39 original source ID/stems/options and PDF SHA agree with archived exact school original questions",()=>{
 assert.equal(new Set(final.records.map(x=>x.source_archive_ref)).size,14);
 for(const x of final.records){
  const archive=read(x.source_archive_ref);
  const row=archive.original_question_records.find(x2=>x2.source_id===x.source_slot_id);
  assert.ok(row,"exact source ID not present in "+x.source_archive_ref);
  assert.equal(row.full_original_stem,x.exact_original_scoreless_stem_from_frozen_source);
  assert.equal(archive.original_pdf_sha256,x.original_source_pdf_sha256);
  assert.equal(x.current_learner_release_eligible,false);
  assert.equal(x.school_original_question_rewording_permitted,false);
  assert.ok(x.why_not_eligible.length>15);
  const priorEntry=prior.records.find(p=>p.source_slot_id===x.source_slot_id);
  assert.equal(priorEntry.previous_held_status,x.legacy_hold_category);
  assert.equal(priorEntry.source_archive_ref,x.source_archive_ref);
 }
});
test("no accidental double publication or original source mutation after current 636-position baseline",()=>{
 const ids=new Set(final.records.map(x=>x.source_slot_id));
 for(const file of readdirSync("site/data/question-bank").filter(x=>x.endsWith(".json"))){
  const data=read("site/data/question-bank/"+file);
  for(const block of [...(data.blocks||[]),...(data.groups||[])])for(const q of [block,...(block.items||[])])
   assert.equal(ids.has(q.source_slot_id),false,"held original was published: "+file+" / "+q.source_slot_id);
 }
 assert.equal(final.no_previously_published_636_question_rewrites,true);
 assert.equal(final.no_original_source_archives_modified,true);
});
test("duplicate source lineage remains in source ledger without being copied into learner site",()=>{
 const dup=final.records.filter(x=>x.current_authority_disposition==="EXCLUDE_ALREADY_PUBLISHED_EXACT_STEM");
 assert.equal(dup.length,5);
 const known=new Set(dup.map(x=>x.source_slot_id));
 assert.ok(known.has("SCI_G04_S1_114_FINAL_004|S02|MC|006"));
 assert.ok(known.has("SCI_G04_S1_114_FINAL_008|S01|TF|012"));
 assert.ok(known.has("SCI_G04_S1_114_FINAL_008|S02|MC|007"));
 assert.ok(known.has("SCI_G04_S1_114_FINAL_002|S2|MC|015"));
 assert.ok(known.has("SCI_G04_S1_114_MID_009|S1|MC|004"));
 assert.equal(dup.every(x=>x.why_not_eligible&&x.reopen_trigger),true);
});
