import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const rd=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const root='data/review/p12-g04s1-113-all29-';
const roster=rd(root+'exact7-item-gate-operator-approval-roster-PENDING-v1.json');
const dadun=rd(root+'exact2-source-science-kp-rights-operator-pending-v1.json');
const neian=rd(root+'neian-mid006-page1-three-scanned-exact-source-science-kp-gate-v1.json');
const yongan=rd(root+'yongan-final005-five-lighttf-original-source-kp-dedup-v1.json');
const mainKP=rd('site/data/authority/science-g03-g04-selector-v3.json');
const map=new Map([
 ...dadun.records.map(q=>[q.source_slot_id,q]),
 ...neian.rows.map(q=>[q.source_slot_id,q]),
 ...yongan.rows.map(q=>[q.source_slot_id,q])
]);
test('single exact7 source roster only contains auditable SOURCE_EXACT source IDs in three original papers',()=>{
 assert.equal(roster.candidates_count,7);
 assert.equal(roster.sources.length,7);
 assert.equal(new Set(roster.sources.map(x=>x.id)).size,7);
 assert.equal(roster.source_corpus_113_papers_visited,29);
 assert.equal(roster.original_113_papers_with_text,24);
 assert.equal(roster.original_113_scan_only_papers_raster_readback,5);
 assert.equal(roster.original_114_source_archive_papers_ci_checked,25);
 assert.equal(roster.original_114_source_works_ci_checked,717);
 const kps=new Map(mainKP.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(k=>[k.canonical_kp_id,k.title])));
 assert.equal(kps.size,48);
 const groups={DADUN_MID005:0,NEIAN_MID006:0,YONGAN_FINAL005:0};
 for(const r of roster.sources){
  groups[r.origin]++;
  const p=map.get(r.id);
  assert.ok(p,'no source evidence for '+r.id);
  assert.equal(r.kp,p.direct_113_frozen48kp_id||p.model_proposed_direct_frozen48kp);
  assert.ok(kps.has(r.kp));
  assert.equal(r.answer,p.independent_science_answer_NOT_TEACHER_KEY||p.science_independent_candidate_answer_NOT_TEACHER_KEY);
  assert.ok(r.known_near instanceof Array);
 }
 assert.deepEqual(groups,{DADUN_MID005:1,NEIAN_MID006:1,YONGAN_FINAL005:5});
 assert.deepEqual(roster.sources.map(x=>x.id).slice(0,2),['SCI_G04_S1_113_MID_005|S01|TF|002','SCI_G04_S1_113_MID_006|S2|MC|002']);
 assert.deepEqual(roster.sources.slice(2).map(x=>x.id),['001','002','003','004','005'].map(n=>'SCI_G04_S1_113_FINAL_005|S04|G01|LIGHT_TF|'+n));
 assert.deepEqual(roster.excluded_cases_science_or_kp_ambiguous,['SCI_G04_S1_113_MID_006|S1|TF|006','SCI_G04_S1_113_MID_006|S2|MC|009']);
 assert.equal(roster.exact_identical_or_mc_option_reordered_duplicates_in_public_or_114source_for_selected_cohort,0);
});
test('original disjoint 1762 unchanged, exact operator Source ID approval remains missing, zero auto-student-publication',()=>{
 assert.deepEqual(roster.effective_29_paper_work_disjoint_before,{PUBLISHED:333,HOLD:291,ALIAS:16,UNREVIEWED:1122});
 assert.equal(Object.values(roster.effective_29_paper_work_disjoint_before).reduce((a,b)=>a+b,0),1762);
 assert.equal(roster.operator_exact_7_source_ids_approved,false);
 assert.equal(roster.public_student_bank_release_authorized,false);
 assert.equal(roster.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(roster.ADMISSION_READY_new,0);
 assert.equal(roster.PUBLISHED_new,0);
 assert.equal(roster.original_published_333_not_reopened,true);
 assert.equal(roster.no_113_authority_48_KP_change,true);
 assert.equal(roster.source_work_disposition_unchanged_in_this_pr,true);
 assert.equal(dadun.operator_exact_source_roster_approved,false);
 assert.equal(neian.new_PUBLISHED,0);
 assert.equal(yongan.PUBLISHED_new,0);
});