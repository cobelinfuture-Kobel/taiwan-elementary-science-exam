import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,readdirSync} from 'node:fs';
const read=path=>JSON.parse(readFileSync(new URL('../'+path,import.meta.url),'utf8'));
const proof=read('data/review/p12-g04s1-113-all29-exact2-source-science-kp-rights-operator-pending-v1.json');
const authority=read('site/data/authority/science-g03-g04-selector-v3.json');
const publicDir=new URL('../site/data/question-bank/',import.meta.url);
const publicFiles=readdirSync(publicDir).filter(x=>x.endsWith('.json'));
const publicBlocks=publicFiles.flatMap(f=>{
 let x=JSON.parse(readFileSync(new URL(f,publicDir),'utf8'));
 return Array.isArray(x.blocks)?x.blocks.map(b=>({...b,__file:f})):[];
});
const normalize=s=>String(s||'').normalize('NFKC').replace(/[\\s（）、，。！？：；「」『』()\\.,!?;:—-]/g,'');

test('one source-exact admission candidate and one already public exact alias, independent Science/direct Frozen48KP',()=>{
 assert.equal(proof.records.length,1);
 assert.equal(proof.public_exact_aliases.length,1);
 assert.equal(proof.source_positions_screened,2);
 assert.equal(proof.new_student_item_candidates,1);
 assert.equal(proof.exact_public_alias_count,1);
 assert.equal(proof.original_paper_identity_matches_29,29);
 assert.equal(proof.original_readable_pdf_text_scans,24);
 assert.equal(proof.original_raster_papers_visually_sampled_for_exacts,5);
 assert.equal(proof.freeze_113_kp_count,48);
 const kps=authority.units.filter(x=>x.grade===4&&x.semester===1).flatMap(u=>u.knowledge_points);
 assert.equal(kps.length,48);
 const kpm=new Map(kps.map(k=>[k.canonical_kp_id,k.title]));
 const exactIds=['SCI_G04_S1_113_MID_005|S01|TF|002'];
 assert.deepEqual(proof.records.map(x=>x.source_slot_id),exactIds);
 assert.equal(new Set(exactIds).size,1);
 for(const x of proof.records){
  assert.equal(x.original_type,'TF');
  assert.equal(x.original_pdf_page_1based,1);
  assert.match(x.original_pdf_sha256,/^[a-f0-9]{64}$/);
  assert.equal(x.original_native_answer_bbox_pdf_points_top_left.length,4);
  assert.ok(x.original_native_answer_bbox_pdf_points_top_left.every(Number.isFinite));
  assert.ok(x.original_stem_verbatim.endsWith('。'));
  assert.equal(x.independent_science_answer_NOT_TEACHER_KEY,'O');
  assert.equal(x.science_unique_answer_independently_verified,true);
  assert.equal(x.direct_kp_independently_verified,true);
  assert.equal(kpm.get(x.direct_113_frozen48kp_id),x.direct_113_frozen48kp_title);
  assert.equal(x.original_standalone_parent_dependency,'NO_SHARED_IMAGE_OR_PASSAGE');
  assert.equal(x.school_regulated_exam_identity_verified,true);
  assert.equal(x.rights_license_status,'REGULATED_EXAM_QUESTION_ART9');
  assert.equal(x.rights_component_scope,'EXAM_QUESTION_TEXT_ONLY');
  assert.equal(x.no_third_party_figure_or_cropped_pdf_in_student_content,true);
  assert.equal(x.original_teacher_answer_not_authenticated,true);
  assert.match(x.student_item_content_fingerprint_fnv1a64,/^[a-f0-9]{16}$/);
 }
 assert.equal(proof.science_unique_and_direct_kp_independent_pass,1);
});

test('main public bank contains exactly known 114 public alias; eligible 113 MID source is not already present',()=>{
 assert.ok(publicFiles.length>=30);
 for(const x of proof.records){
  assert.ok(!publicBlocks.some(b=>b.source_slot_id===x.source_slot_id),x.source_slot_id);
  const matches=publicBlocks.filter(b=>b.type==='tf'&&normalize(b.stem)===normalize(x.original_stem_verbatim));
  assert.ok(matches.length===0,`${x.source_slot_id}: duplicate ${JSON.stringify(matches.map(b=>({file:b.__file,id:b.id,slot:b.source_slot_id,stem:b.stem})))}`);
 }
 const ali=proof.public_exact_aliases[0];
 assert.equal(ali.source_slot_id,'SCI_G04_S1_113_FINAL_005|S01|TF|007');
 assert.equal(ali.source_lineage_action,'ADD_113_SOURCE_ALIAS_ONLY_TO_REVIEW_LEDGER');
 assert.equal(ali.eligible_for_new_student_publication,false);
 assert.equal(ali.existing_public_student_id,'P12_B04_G04S1_B04_TF_050');
 assert.equal(ali.existing_public_original_source_slot_id,'SCI_G04_S1_114_FINAL_007|S01|TF|013');
 assert.equal(ali.existing_public_bank_path,'site/data/question-bank/p12-b04-b04-47-public-v1.json');
 assert.equal(ali.existing_public_kp_id_frozen_unchanged,'sci_g04s1_04_05');
 const exact114=publicBlocks.filter(b=>b.type==='tf'&&normalize(b.stem)===normalize(ali.original_stem_verbatim));
 assert.equal(exact114.length,1);
 assert.equal(exact114[0].id,ali.existing_public_student_id);
 assert.equal(exact114[0].source_slot_id,ali.existing_public_original_source_slot_id);
 assert.equal(exact114[0].__file,'p12-b04-b04-47-public-v1.json');
 assert.equal(exact114[0].canonical_kp_id,'sci_g04s1_04_05');
 assert.equal(ali.exact_original_stem_match_verified_by_CI,true);
});

test('two examined items are not auto-promoted to published without formal 29/114 dedup and exact operator approval',()=>{
 assert.equal(proof.formal_semantic_gate_no_auto_release,undefined);
 assert.equal(proof.full_semantic_dedup_closed,false);
 assert.equal(proof.operator_exact_source_roster_approved,false);
 assert.equal(proof.student_site_integration_allowed,false);
 assert.equal(proof.ADMISSION_READY_new,0);
 assert.equal(proof.PUBLISHED_new,0);
 assert.equal(proof.historical_113_published_source_slots_not_reopened,333);
 assert.ok(proof.records.every(r=>r.exact_operator_cohort_approval===false
   &&r.operator_eligible===false&&r.ADMISSION_READY===false&&r.PUBLISHED===false));
});
