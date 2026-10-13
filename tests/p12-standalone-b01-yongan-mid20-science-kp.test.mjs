import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const json=p=>JSON.parse(readFileSync(p,"utf8"));
const m=json("data/review/p12-standalone-yongan-mid20-safe-science-kp-v1.json");
const q=json("data/review/p12-standalone-all25-source-first-queue-v1.json");
const source=json("data/review/p12-g04s1-114-nanyi-yongan-mid-kp-first-80-text-map-v2.json");
const authority=json("site/data/authority/science-g03-g04-selector-v2.json");
const canon=new Set(authority.units.flatMap(x=>x.knowledge_points.map(k=>k.canonical_kp_id)));
test("Yong'an MID20 source identity and 10 TF + 10 MC exact source positions",()=>{
  assert.equal(m.source_paper_id,"SCI_G04_S1_114_MID_001");
  assert.equal(m.source_original_pdf_sha256,"4d924c412166812557793cc43b62b02f6ce4da2539e9ddcf165e2faf456251fe");
  assert.equal(m.original_pdf_sha256_recomputed_from_raw_binary,true);
  assert.equal(m.source_original_pdf_pages,2);
  assert.equal(m.source_records.length,20);
  assert.equal(m.true_false_count,10); assert.equal(m.four_choice_count,10);
  assert.equal(m.original_private_complete_count,20);
  assert.equal(new Set(m.source_records.map(x=>x.source_id)).size,20);
  const baseline=new Set(source.items.map(x=>x.source_position_id??x.source_slot_id));
  for(let i=0;i<20;i++){
    const r=m.source_records[i];
    const type=i<10?"TF":"MC";
    const n=i%10+1;
    assert.equal(r.source_id,`SCI_G04_S1_114_MID_001|${type}|${i<10?"S01":"S02"}|${String(n).padStart(3,"0")}`);
    assert.ok(baseline.has(r.source_id),r.source_id);
    assert.equal(r.original_pdf_page,1);
    assert.equal(r.original_question_scored_points,2);
    assert.equal(r.option_count,type==="TF"?0:4);
    assert.equal(r.complete_original_stem_options_private,true);
    assert.equal(r.source_is_independent_single_question,true);
    const [x1,y1,x2,y2]=r.original_answer_marker_pdf_bbox_pts_top_left;
    assert.ok(x1>40&&x1<45&&x2>70&&x2<76&&y1<y2&&y2<1140,r.source_id);
    assert.equal(r.public_admitted,false);
    assert.equal(r.teacher_key_authenticated,false);
    assert.equal(r.formal_science_answer_approved,false);
    assert.equal(r.formal_kp_approved,false);
    assert.equal(r.source_use_rights_cleared,false);
    assert.equal(r.user_public_admission_approved,false);
  }
});
test("science quality holds stay quarantined independently of source and KP",()=>{
  assert.equal(m.model_science_provisional_pass,18);
  assert.equal(m.science_quality_hold,2);
  const flagged=m.source_records.filter(r=>r.independent_model_science_verdict.startsWith("SCIENCE_HOLD"));
  assert.deepEqual(flagged.map(x=>x.source_id),[
    "SCI_G04_S1_114_MID_001|TF|S01|004",
    "SCI_G04_S1_114_MID_001|MC|S02|007"]);
  assert.equal(flagged[1].model_provisional_answer,null);
  assert.equal(m.formal_science_certification_count,0);
  assert.equal(m.teacher_key_authenticated_count,0);
  assert.equal(m.formal_kp_approved_count,0);
});
test("cross-semester semantic projection stays candidate-only and source paper identity stays MID",()=>{
  const count=k=>m.source_records.filter(x=>x.kp_secondpass_disposition===k).length;
  assert.deepEqual([count("KP_STRONG_CANDIDATE"),count("KP_NONMATCH_G04S1"),count("KP_REVIEW")],[11,6,3]);
  assert.equal(m.g04s1_primary_candidate_and_science_model_pass_count,9);
  for(const r of m.source_records){
    if(r.kp_primary_g04s1_candidate){assert.ok(canon.has(r.kp_primary_g04s1_candidate));assert.ok(r.kp_primary_g04s1_candidate.startsWith("sci_g04s1_"));}
    if(r.cross_semester_candidate){assert.ok(canon.has(r.cross_semester_candidate));assert.ok(r.cross_semester_candidate.startsWith("sci_g04s2_"));}
    if(r.kp_secondpass_disposition==="KP_NONMATCH_G04S1")assert.equal(r.kp_primary_g04s1_candidate,null);
  }
  assert.equal(m.new_public_admissions,0);
});
test("copyright safe public manifest and cumulative 25-paper queue are fail closed",()=>{
  assert.equal(m.original_full_question_stems_options_not_in_public_repo,true);
  const publicJSON=JSON.stringify(m);
  assert.equal(publicJSON.includes("full_original_stem"),false);
  assert.equal(publicJSON.includes("full_original_options_in_order"),false);
  assert.match(m.private_source_artifact_sha256,/^[a-f\d]{64}$/);
  assert.equal(q.source_papers_total,25);
  assert.equal(q.source_response_slots_unchanged,1623);
  assert.equal(q.source_paper_queue.length,25);
  assert.ok(q.source_paper_queue.reduce((a,b)=>a+b.full_complete_standalone_tf_mc_private_source_count,0)>=42);
  assert.equal(q.source_exact_standalone_private_completed,q.source_paper_queue.reduce((a,b)=>a+b.full_complete_standalone_tf_mc_private_source_count,0));
  assert.ok(q.model_science_no_obvious_problem>=38);
  assert.ok(q.model_science_hold>=4);
  assert.equal(q.science_model_reviewed_original_standalone_items,q.model_science_no_obvious_problem+q.model_science_hold);
  assert.equal(q.fully_screened_all_25_standalone_papers,0);
  assert.equal(q.public_items_new,0);
  assert.equal(q.all25_before_publication_gate_preserved,true);
  assert.equal(m.all25_114_before_publication_policy_preserved,true);
  assert.equal(m.existing_site_answer_positions_total,251);
  assert.equal(m.existing_site_g04s1_answer_positions,53);
});
