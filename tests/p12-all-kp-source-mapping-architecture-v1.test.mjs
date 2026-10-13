import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildAllKpSourceIndex, lookupByKp, lookupBySource,
 planIncrementalProjection, OUTPUT_V1, PROJECTION_RULES } from "../tools/p12-all-kp-source-mapping.mjs";
const json=p=>JSON.parse(readFileSync(p,"utf8"));
const index=buildAllKpSourceIndex();
const byId=new Map(index.original_source_items.map(s=>[s.source_id,s]));
const kps=new Map(index.authority_kps.map(k=>[k.kp_id,k]));
const edges=index.mapping_edges;
const q=id=>lookupBySource(index,id);
const kp=id=>lookupByKp(index,id);
test("Index all 187 current KP in 16 units across grades 3/4 upper and lower semesters",()=>{
 assert.equal(index.schema_version,"P12_ALL_KP_SOURCE_QUESTION_INDEX_V1");
 assert.equal(index.scope.authoritative_kps,187);
 assert.equal(index.authority_kps.length,187);
 assert.equal(kps.size,187);
 const breakdown={};
 for(const k of index.authority_kps) {
  const key="G"+String(k.grade).padStart(2,"0")+"-S"+k.semester;
  breakdown[key]=(breakdown[key]??0)+1;
  assert.ok(k.kp_title);
  assert.match(k.authority_content_sha256,/^[0-9a-f]{64}$/);
 }
 assert.deepEqual(breakdown,{"G03-S1":47,"G03-S2":49,"G04-S1":45,"G04-S2":46});
 assert.equal(index.by_kp.length,187);
 assert.equal(new Set(index.by_kp.map(x=>x.kp_id)).size,187);
 assert.equal(index.scope.possible_source_to_kp_review_pairs,1623*187);
 assert.equal(index.scope.full_187_kp_exhaustive_semantic_review_completed,false);
 assert.equal(index.scope.all_authority_kps_indexed_for_reverse_lookup,true);
});
test("All 1623 original answer positions from exactly 25 original source maps, never fabricated score placeholders",()=>{
 assert.equal(index.scope.source_papers,25);
 assert.equal(index.scope.source_answer_positions,1623);
 assert.equal(index.original_source_items.length,1623);
 assert.equal(byId.size,1623);
 assert.deepEqual(index.firstpass_114_decision_counts,{
  KP_MATCH_CANDIDATE:845,
  KP_MATCH_SOURCE_EVIDENCE_HOLD:325,
  REVIEW_KP_UNCERTAIN:115,
  NONMATCH_G04S1_KP_ARCHIVE:338
 });
 for(const s of index.original_source_items){
  assert.ok(s.original_source_item_file_ref.startsWith("data/review/"));
  assert.ok(s.original_paper_source_map_ref.startsWith("data/review/"));
  assert.equal(s.original_academic_year,114);
  assert.match(s.source_version_sha256,/^[0-9a-f]{64}$/);
  assert.equal(s.public_release_approved,false);
  assert.equal(s.teacher_answer_key_authenticated,false);
  assert.ok(s.source_id.startsWith(s.original_paper_id+"|"));
 }
 for(const n of ["009","010","011","012"])
  assert.equal(byId.has("SCI_G04_S1_114_FINAL_001|GROUP|S06|"+n),false);
 const byPaper=index.original_source_items.reduce((m,s)=>(m[s.original_paper_id]=(m[s.original_paper_id]??0)+1,m),{});
 assert.equal(Object.keys(byPaper).length,25);
 assert.equal(byPaper["SCI_G04_S1_114_FINAL_001"],74);
 assert.equal(byPaper["SCI_G04_S1_114_MID_003"],64);
 assert.equal(byPaper["SCI_G04_S1_114_MID_005"],75);
 assert.equal(byPaper["SCI_G04_S1_114_MID_008"],60);
});
test("Firstpass G04S1 KP candidates stay unverified and archived positions remain searchable",()=>{
 for(const e of edges){
  assert.ok(byId.has(e.source_id));
  assert.ok(kps.has(e.kp_id));
  assert.equal(e.verification,"NOT_VERIFIED_FOR_ADMISSION");
  assert.equal(e.public_release_approved,false);
  assert.equal(e.kp_version_sha256,kps.get(e.kp_id).authority_content_sha256);
  assert.equal(e.source_version_sha256,byId.get(e.source_id).source_version_sha256);
  if(e.projection==="LEGACY_FIRSTPASS")assert.match(e.kp_id,/^sci_g04s1_/);
 }
 const original="SCI_G04_S1_114_MID_010|S02|MC|004";
 const moon=q(original);
 assert.equal(moon.source.current_g04s1_firstpass_status,"NONMATCH_G04S1_KP_ARCHIVE");
 assert.deepEqual(moon.source.current_g04s1_kp_ids,[]);
 assert.equal(moon.projections.length,1);
 assert.equal(moon.projections[0].kp_id,"sci_g04s2_01_11");
 assert.equal(moon.projections[0].verification,"NOT_VERIFIED_FOR_ADMISSION");
 assert.equal(kp("sci_g04s2_01_11").candidates.some(x=>x.source.source_id===original),true);
 assert.equal(kp("sci_g04s2_01_11").exhaustive_full_corpus_review_complete,false);
});
test("Cross-grade and semester lookups never silently infer that uncovered KP is MISSING",()=>{
 const overlay=edges.filter(e=>e.projection==="MANUAL_CROSS_SCOPE_PROPOSAL");
 assert.equal(overlay.length,4);
 assert.ok(overlay.every(e=>e.decision==="CANDIDATE_REQUIRES_SOURCE_AND_KP_REVIEW"));
 for(const target of ["sci_g04s2_01_12","sci_g04s2_01_11","sci_g04s2_01_08","sci_g04s2_01_02"])
  assert.equal(kp(target).candidates.some(x=>x.edge.projection==="MANUAL_CROSS_SCOPE_PROPOSAL"),true);
 for(const item of index.by_kp) {
  assert.equal(item.exhaustive_full_corpus_review_complete,false);
  assert.equal(item.verified_source_count,0);
  if(item.indexed_firstpass_or_projection_candidate_source_count===0){
   assert.equal(item.coverage_status,"NOT_YET_MAPPED_NOT_EVIDENCE_OF_MISSING");
   assert.equal(kp(item.kp_id).missing_status,"UNASSESSED_NOT_PROVEN_MISSING");
  }
 }
 assert.equal(json(PROJECTION_RULES).public_bank_mutation_allowed,false);
});
test("Independent B01–B04 science evidence is joined, without promoting KP or public status",()=>{
 assert.equal(index.scope.independently_model_science_reviewed_original_source_positions,145);
 const a={FULL_PASS:0,CORRECTABLE:0,HOLD:0,REJECT:0};
 for(const item of index.original_source_items){
  if(item.model_science_review_completed){
   a[item.model_independent_science_verdict]++;
   assert.match(item.independent_science_batch_evidence_ref,/data\/review\/p12-g04s1-114-b0[1-4]/);
  } else {
   assert.equal(item.model_independent_science_verdict,null);
  }
 }
 assert.deepEqual(a,{FULL_PASS:121,CORRECTABLE:13,HOLD:10,REJECT:1});
 const fish=q("SCI_G04_S1_114_MID_006|S03|G03|013");
 assert.match(fish.source.source_excerpt,/尾鰭/);
 assert.equal(fish.source.model_independent_science_verdict,"FULL_PASS");
 assert.equal(fish.source.public_release_approved,false);
 assert.equal(index.public_admission_lock.live_public_question_positions,251);
 assert.equal(index.public_admission_lock.live_g04s1_positions,53);
});
test("New or changed KP triggers full corpus re-projection, without source PDF re-extraction",()=>{
 const copy=structuredClone(index);
 copy.authority_kps.push({kp_id:"sci_g05s1_01_01",authority_content_sha256:"new-authority-definition"});
 copy.scope.authoritative_kps=188;
 const p=planIncrementalProjection(index,copy);
 assert.deepEqual(p.added_kp_ids,["sci_g05s1_01_01"]);
 assert.equal(p.review_pairs_requiring_projection,1623);
 assert.deepEqual(p.changed_source_ids,[]);
 assert.equal(p.no_auto_approval_or_public_release,true);
 const modified=structuredClone(index);
 const target=modified.authority_kps.find(k=>k.kp_id==="sci_g04s2_01_11");
 target.authority_content_sha256="changed-version-hash";
 assert.deepEqual(planIncrementalProjection(index,modified).modified_kp_ids,["sci_g04s2_01_11"]);
 assert.equal(planIncrementalProjection(index,modified).review_pairs_requiring_projection,1623);
 const changedSource=structuredClone(index);
 changedSource.original_source_items[0].source_version_sha256="updated-source-text-hash";
 const d=planIncrementalProjection(index,changedSource);
 assert.equal(d.changed_source_ids.length,1);
 assert.equal(d.review_pairs_requiring_projection,187);
 assert.equal(d.new_source_ids.length,0);
});
test("Lookup never mutates frozen source bank; index can be rebuilt deterministically",()=>{
 const second=buildAllKpSourceIndex();
 assert.equal(JSON.stringify(index),JSON.stringify(second));
 assert.equal(index.public_admission_lock.no_source_items_publicly_added,true);
 assert.equal(index.public_admission_lock.source_artwork_not_republished,true);
 assert.equal(index.public_admission_lock.teacher_keys_unverified,true);
 assert.equal(typeof OUTPUT_V1,"string");
});
