import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const reg=read("data/source-registry/p12-g04s1-108114-drive-discovery-v1.json");
const pilot=read("data/review/p12-g04s1-108114-source-text-screening-pilot-v1.json");
const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
const p11=read("site/data/governance/p11-source-sections.json");
const old=read("site/data/question-bank/approved-historical-ox-v4.json");
const contexts=read("site/data/question-bank/certified-context-groups-v2.json");
const scopeKP=authority.units.filter(u=>u.grade===4&&u.semester===1);
test("all seven academic years are enumerated, 429 Drive PDF IDs group into 273 filename identities without content-dedup claim",()=>{
 assert.deepEqual(reg.entries.map(x=>x.year).filter((v,i,a)=>a.indexOf(v)===i).sort((a,b)=>a-b),[108,109,110,111,112,113,114]);
 assert.equal(reg.total_drive_file_records,429);
 assert.equal(reg.total_distinct_filenames,273);
 assert.equal(reg.entries.length,273);
 assert.equal(reg.old_corpus_108_112.records,375);
 assert.equal(reg.old_corpus_108_112.distinct_filenames,219);
 assert.equal(reg.old_corpus_108_112.excess_same_name_ids,156);
 assert.equal(reg.new_corpus_113_114.records,54);
 assert.equal(reg.new_corpus_113_114.distinct_filenames,54);
 assert.equal(reg.entries.reduce((n,x)=>n+x.files.length,0),429);
 assert.equal(new Set(reg.entries.map(x=>x.source_title)).size,273);
 assert.equal(new Set(reg.entries.map(x=>x.candidate_source_id)).size,273);
 const ids=reg.entries.flatMap(x=>x.files.map(y=>y.drive_file_id));
 assert.equal(new Set(ids).size,429);
 assert.ok(reg.entries.every(x=>x.files.length>=1&&x.school&&[108,109,110,111,112,113,114].includes(x.year)));
 assert.ok(reg.entries.every(x=>x.exam_type==="MID"||x.exam_type==="FINAL"));
 assert.ok(reg.entries.every(x=>x.files.every(y=>y.url.includes(y.drive_file_id))));
 assert.ok(reg.entries.every(x=>x.school_source_pdf_hash===null&&x.original_answer_position_inventory===null));
 assert.ok(reg.entries.every(x=>x.scope_decision==="UNDETERMINED_REQUIRES_FULL_PDF_SOURCE_REVIEW"));
 assert.ok(reg.entries.every(x=>x.public_admission_status==="NOT_AUTHORIZED"));
 assert.ok(reg.entries.filter(x=>x.same_filename_multiple_ids).every(x=>x.identical_binary_not_yet_verified));
});
test("year-specific file and filename counts distinguish 113 vs 114 and MID vs FINAL",()=>{
 const expected={
  108:[37,26,114],109:[35,22,103],110:[25,16,75],111:[18,10,42],
  112:[21,9,41],113:[18,11,29],114:[12,13,25]
 };
 for(const [year,[mid,fin,recs]] of Object.entries(expected)){
  const row=reg.by_year[year];
  assert.equal(row.MID.filename_candidates,mid,`mid ${year}`);
  assert.equal(row.FINAL.filename_candidates,fin,`final ${year}`);
  assert.equal(row.drive_file_records,recs,`all record IDs ${year}`);
  assert.equal(row.total_filename_candidates,mid+fin,`canonical titles ${year}`);
 }
 assert.equal(Object.values(reg.by_year).reduce((n,y)=>n+y.MID.filename_candidates,0),166);
 assert.equal(Object.values(reg.by_year).reduce((n,y)=>n+y.FINAL.filename_candidates,0),107);
 assert.equal(reg.entries.filter(x=>x.year<=112).every(x=>x.publisher_from_filename===null),true);
 assert.equal(reg.entries.filter(x=>x.year>=113).every(x=>["康軒","南一","翰林"].includes(x.publisher_from_filename)),true);
});
test("canonical G04-S1 study targets exactly U01 U02 mid 23 KP and U03 U04 final 22 KP",()=>{
 assert.deepEqual(scopeKP.map(u=>[u.unit_id,u.knowledge_points.length]),[["U01",11],["U02",12],["U03",10],["U04",12]]);
 assert.deepEqual(reg.exam_scope,{MID:["G04-S1-U01","G04-S1-U02"],FINAL:["G04-S1-U03","G04-S1-U04"]});
 assert.equal(scopeKP.reduce((n,u)=>n+u.knowledge_points.length,0),45);
 assert.match(reg.publisher_policy,/CONTENT_BASED_CANONICAL_SCOPE/);
});
test("113 original source papers already partially processed must remain linked but not wrongly declared fully closed",()=>{
 const sourceMid=p11.source_papers.find(x=>x.source_id==="G04-S1-MID"),sourceFinal=p11.source_papers.find(x=>x.source_id==="G04-S1-FINAL");
 assert.equal(sourceMid.sections.reduce((n,s)=>n+s.slot_count,0),50);
 assert.equal(sourceFinal.sections.reduce((n,s)=>n+s.slot_count,0),54);
 assert.equal(reg.reference_p11_exact_papers,2);
 assert.equal(reg.reference_p11_source_scope.full_source_question_approval,false);
 assert.equal(reg.entries.filter(x=>x.prior_p11_source_id).length,2);
 const blocks=[...old.blocks,...contexts.groups].filter(b=>b.unit?.startsWith("4-S1-"));
 assert.equal(blocks.reduce((n,b)=>n+(b.type==="group"?b.items.length:1),0),53);
 assert.equal(reg.known_baseline_public_learner_slots_g04s1,53);
 const kpCount=new Set(blocks.flatMap(b=>[b.canonical_kp_id,...b.secondary_canonical_kp_ids??[]])).size;
 assert.equal(kpCount,22);
 assert.equal(reg.known_baseline_canonical_kps_covered,22);
});
test("read evidence is source-anchored, per-question KP-scoped, and never certified or published by filename",()=>{
 assert.equal(pilot.samples_total,11);
 assert.deepEqual(pilot.by_status,{OUT_OF_SCOPE:2,POTENTIAL_IN_SCOPE:8,HOLD_EDITORIAL_CORRECTION:1});
 assert.deepEqual(pilot.all_years_present,[108,109,110,111,112,113,114]);
 assert.equal(pilot.teacher_keys_authenticated,0);
 assert.equal(pilot.question_positions_publicly_admitted,0);
 const titleSet=new Map(reg.entries.map(x=>[x.source_title,x]));
 for(const x of pilot.pilot_question_samples){
  const source=titleSet.get(x.source_title);assert.ok(source,x.source_title);
  assert.equal(x.year,source.year);
  assert.equal(x.exam,source.exam_type);
  assert.ok(source.files.some(y=>y.drive_file_id===x.drive_id));
  if(x.current_scope==="OUT_OF_SCOPE")assert.equal(x.canonical_kp_id,null);
  else{
   const k=scopeKP.flatMap(u=>u.knowledge_points.map(p=>({u,k:p.canonical_kp_id}))).find(z=>z.k===x.canonical_kp_id);
   assert.ok(k,x.canonical_kp_id);
   assert.ok(x.exam==="MID"?["U01","U02"].includes(k.u.unit_id):["U03","U04"].includes(k.u.unit_id));
  }
  assert.equal(x.original_answer_authority,"NOT_PROVIDED");
 }
 const changed=pilot.pilot_question_samples.find(x=>x.current_scope==="HOLD_EDITORIAL_CORRECTION");
 assert.equal(changed.year,112);
 assert.equal(changed.original_printed_no,"17");
 assert.match(changed.reason,/③/);
 assert.ok(reg.source_corpus_exhaustive_claim===false);
});
