import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {buildMaster,writeMaster,csvForMaster} from "../tools/p12-master-progress.mjs";

const base=JSON.parse(readFileSync("site/data/governance/p12-review-events.json","utf8"));
const slot="G03-S2-MID|TF|P01|002";
function event(action,id="e1"){return {event_id:id,source_slot_id:slot,action,recorded_at_utc:"2026-10-12T02:00:00Z",reviewer:"CI_REVIEW_TEST"};}
test("overall ledger accounts for all eight unique PDF documents and all 477 original positions",()=>{
 const x=buildMaster();
 assert.equal(x.paper_rows.length,8);
 assert.equal(new Set(x.paper_rows.map(p=>p.source_pdf_sha256)).size,8);
 assert.equal(new Set(x.paper_rows.map(p=>p.paper_uid)).size,8);
 assert.equal(x.scanned_original_answer_positions,477);
 assert.equal(x.originally_linked_exact_TF,72);
 assert.equal(x.originally_linked_adapted_context_source_positions,79);
 assert.equal(x.candidate_position_baseline,326);
 assert.equal(x.paper_rows.reduce((a,p)=>a+p.pending_remaining,0),326);
 assert.equal(x.complete_papers,0);
 assert.equal(x.incomplete_papers,8);
 assert.equal(x.public_question_bank_answer_slots_unchanged,148);
 assert.equal(x.external_drive_global_discovery_complete,false);
 assert.equal(x.external_sources_not_yet_registered_count,null);
 assert.equal(x.publisher_filter_enabled,false);
});
test("master resumes from original paper and printed TF source order, not lexical section sorting",()=>{
 const x=buildMaster();
 assert.equal(x.resume_checkpoint.source_id,"G03-S2-MID");
 assert.equal(x.resume_checkpoint.source_slot_id,slot);
 assert.equal(x.resume_checkpoint.source_section_code,"TF");
 assert.equal(x.resume_checkpoint.original_pdf_page_range[0],1);
 assert.equal(x.review_events_count,0);
 assert.equal(x.position_status_counts.not_started,326);
 assert.equal(x.position_status_counts.certified_staged,0);
 assert.equal(x.position_status_counts.rejected,0);
 assert.ok(x.paper_rows.every(p=>p.textbook_publisher==="NOT_VERIFIED_METADATA_ONLY"));
});
test("append-only event checkpoint is respected, but does not automatically publish a staged answer",()=>{
 const x=buildMaster({events:{...base,events:[event("START")]}});
 assert.equal(x.resume_checkpoint.source_slot_id,slot);
 assert.equal(x.resume_checkpoint.state,"IN_PROGRESS");
 assert.equal(x.paper_rows.find(p=>p.source_id==="G03-S2-MID").in_progress,1);
 const decision={...event("CERTIFY_STAGED","e2"),recorded_at_utc:"2026-10-12T02:10:00Z",
  source_question_text_verified:true,science_answer_verified:true,kp_mapping_verified:true,
  visual_dependency_verified:true,review_evidence_ref:"source-audit-test"};
 const staged=buildMaster({events:{...base,events:[event("START"),decision]}});
 assert.equal(staged.position_status_counts.certified_staged,1);
 assert.equal(staged.public_question_bank_answer_slots_unchanged,148);
 assert.notEqual(staged.resume_checkpoint.source_slot_id,slot);
});
test("unknown source and evidence-free certification stop the build",()=>{
 assert.throws(()=>buildMaster({events:{...base,events:[{...event("START"),source_slot_id:"NOT_REGISTERED"}]}}),/unknown source slot/);
 assert.throws(()=>buildMaster({events:{...base,events:[event("START"),{...event("CERTIFY_STAGED","e2"),recorded_at_utc:"2026-10-12T02:10:00Z"}]}}),/requires all question-level gates/);
 assert.throws(()=>buildMaster({events:{...base,events:[event("START"),event("START")]}}),/duplicate/);
});
test("master JSON and CSV are deterministic and current",()=>{
 assert.deepEqual(writeMaster({check:true}),{papers:8,positions:477,tf:72,adaptedPositions:79,pending:326,liveItems:148,resume:slot});
 const csv=csvForMaster(buildMaster());
 assert.ok(csv.startsWith("\ufeff"));
 assert.equal(csv.trim().split("\r\n").length,9);
 assert.ok(csv.includes("source_pdf_sha256"));
});
