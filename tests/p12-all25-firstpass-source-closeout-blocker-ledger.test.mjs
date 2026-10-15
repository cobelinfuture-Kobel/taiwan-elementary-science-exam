import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, existsSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(p,'utf8'));
const audits=[1,2,3].map(i=>read('data/review/p12-standalone-all25-firstpass-paper-audit-shard0'+i+'-v1.json'));
const rows=audits.flatMap(x=>x.paper_rows);
const closeout=read('data/review/p12-standalone-all25-firstpass-closeout-blocker-ledger-v1.json');
const q=read('data/review/p12-standalone-all25-source-first-queue-v1.json');
const idx=read('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v24.json');
const v17=read('data/review/p12-g04s1-114-all25-kp-first-progress-v17.json');
const v3=read('data/review/p12-all-kp-v3r1-114-all25-source-slot-evidence-coverage-v1.json');
const sum=(k)=>rows.reduce((n,x)=>n+(x[k]||0),0);
test('P12 all25 source-only first pass EXACT 25 school papers, 1623 frozen response positions and 717 independent original occurrences',()=>{
 assert.equal(rows.length,25);
 assert.equal(new Set(rows.map(x=>x.paper_id)).size,25);
 assert.equal(new Set(rows.map(x=>x.source_archive_ref)).size,25);
 assert.equal(sum('original_slots_from_frozen_v17'),1623);
 assert.equal(sum('source_occurrences_archived'),717);
 assert.equal(sum('not_archived_as_independent_source_occurrences'),906);
 assert.equal(sum('tf'),426);assert.equal(sum('mc'),291);
 assert.equal(idx.cumulative_original_source_question_occurrences,717);
 assert.equal(idx.original_single_choice_options,1164);
 assert.equal(q.source_response_slots_unchanged,1623);
 assert.equal(q.source_exact_standalone_private_completed,717);
 assert.equal(closeout.source_original_frozen_scored_answer_positions,1623);
 assert.equal(closeout.source_original_positions_not_in_independent_fulltext_archive,906);
 assert.deepEqual(idx.current_public_source_archive_files,rows.map(x=>x.source_archive_ref));
 assert.equal(q.source_papers_total,25);
 assert.equal(q.first_pass_all25_completed,true);
 assert.equal(q.fully_screened_all_25_standalone_papers,0);
 assert.equal(q.first_pass_all25_operator_final_acceptance,false);
 assert.equal(closeout.firstpass_source_papers_completed,25);
 assert.equal(closeout.full_paper_strict_question_level_certification_completed,0);
 assert.equal(closeout.operator_all25_source_final_human_approval,false);
});
test('P12 each of the 25 source archive JSONs and source QA references actually exists with complete stems and MC choices',()=>{
 let n=0,mc=0,tf=0,options=0,legacy=0,sciencePass=0,scienceHold=0,siteYes=0;
 for(const x of rows){
  assert.ok(existsSync(x.source_archive_ref),x.source_archive_ref);
  assert.ok(existsSync(x.science_review_ref),x.science_review_ref);
  const src=read(x.source_archive_ref),records=src.original_question_records;
  assert.equal(src.source_paper_id,x.paper_id);
  assert.match(src.original_pdf_sha256,/^[a-f0-9]{64}$/);
  assert.equal(records.length,x.source_occurrences_archived);
  assert.ok(records.length<=x.original_slots_from_frozen_v17);
  assert.equal(x.source_occurrences_archived+x.not_archived_as_independent_source_occurrences,x.original_slots_from_frozen_v17);
  assert.equal(src.source_archived_count,records.length);
  const paperRecords=new Set();
  for(const row of records){
   assert.ok(row.source_id.startsWith(x.paper_id+'|'));
   assert.ok(!paperRecords.has(row.source_id));paperRecords.add(row.source_id);
   assert.ok(typeof row.full_original_stem==='string'&&row.full_original_stem.trim().length>0,row.source_id);
   const inferredMC=row.question_type==='SINGLE_CHOICE'||(row.question_type==null&&row.source_id.includes('|MC|'));
   const inferredTF=row.question_type==='TRUE_FALSE'||(row.question_type==null&&row.source_id.includes('|TF|'));
   assert.ok(inferredMC||inferredTF,row.source_id);
   if(inferredMC){mc++;const o=row.full_original_options_in_order||[];assert.equal(o.length,4,row.source_id);options+=o.length;}
   else {tf++;assert.deepEqual(row.full_original_options_in_order||[],[],row.source_id);}
   if(!row.question_type||!row.science_review_status||!row.kp_review_status)legacy++;
   if(row.site_question_bank_admitted===true)siteYes++;
   n++;
  }
  sciencePass+=x.source_model_science_preliminary_pass;
  scienceHold+=x.source_model_science_hold;
  assert.equal(x.source_model_science_preliminary_pass+x.source_model_science_hold,records.length);
 }
 assert.deepEqual([n,tf,mc,options],[717,426,291,1164]);
 assert.deepEqual([sciencePass,scienceHold],[644,73]);
 assert.equal(legacy,0); // B01 contract-normalized 26 rows; frozen predecessor audit still records original defect
 assert.equal(siteYes,0);
});
test('P12 source-only Science644/73 and provisional KP470/81/166 never equal formal admission',()=>{
 assert.deepEqual([closeout.science_model_preliminary_pass,closeout.science_model_hold],[644,73]);
 assert.deepEqual([closeout.kp_preliminary_secondpass.strong_candidate,closeout.kp_preliminary_secondpass.review_required,closeout.kp_preliminary_secondpass.not_in_current_g04s1_authority],[470,81,166]);
 assert.equal(470+81+166,717);
 assert.equal(closeout.formal_teacher_key_authenticated,0);
 assert.equal(closeout.formal_science_approved,0);
 assert.equal(closeout.formal_kp_approved,0);
 assert.equal(closeout.new_student_site_admissions,0);
 assert.equal(closeout.existing_student_site_all,251);
 assert.equal(closeout.existing_student_site_g04s1,53);
 assert.equal(idx.site_question_bank_new_admissions,0);
 assert.equal(q.public_items_new,0);
 assert.equal(q.all25_before_publication_gate_preserved,true);
 assert.equal(closeout.blocker_ledger.length,10);
});
test('P12 source score gap 21 original V17 points + newly detected B23 6 points = 27 across exactly six named original schools',()=>{
 assert.equal(v17.source_score_points_not_proven_as_distinct_questions,21);
 const known=Object.values(v17.unresolved_source_score_points_by_paper).reduce((a,b)=>a+b,0);
 assert.equal(known,21);
 assert.equal(closeout.source_score_ledger.additional_b23_visual_unreconciled_total,6);
 assert.equal(closeout.source_score_ledger.known_unreconciled_score_total,27);
 assert.equal(closeout.source_score_ledger.known_unreconciled_paper_count,6);
 assert.equal(closeout.source_score_ledger.paper_score_gaps.length,6);
 assert.equal(closeout.source_score_ledger.paper_score_gaps.reduce((n,x)=>n+x.source_score_gap_points,0),27);
 assert.equal(closeout.source_score_ledger.b23_scan_observed_printed_s3_g05_each,1);
 assert.equal(closeout.source_score_ledger.b23_frozen_map_s3_g05_each,2);
 assert.equal(closeout.source_score_ledger.source_score_authority_reconciliation_approved,false);
});
test('P12 25 original PDF modal historical snapshot has unresolved 6-position modality attribution difference',()=>{
 assert.deepEqual([v17.textually_identifiable_answer_positions_count,v17.original_source_visual_only_positions_identified],[1374,249]);
 assert.deepEqual([v3.source_positions_with_text_layer,v3.source_positions_image_only],[1380,243]);
 assert.equal(v17.textually_identifiable_answer_positions_count+v17.original_source_visual_only_positions_identified,1623);
 assert.equal(v3.source_positions_with_text_layer+v3.source_positions_image_only,1623);
 assert.equal(closeout.historical_modality_position_snapshot_differences.difference_positions,6);
 assert.equal(rows.filter(x=>x.source_modality==='IMAGE_ONLY').length,4);
 assert.equal(rows.filter(x=>x.source_modality==='TEXT_LAYER').length,21);
 assert.equal(closeout.scan_visual_bbox_gate.pixel_exact_acceptance_complete,false);
});
test('P12 historical 東光MID26 audit defect retained while B01 source-row QA contract now materialized',()=>{
 const z=rows.find(x=>x.paper_id==='SCI_G04_S1_114_MID_008');
 assert.equal(z.source_row_question_type_missing,26);
 assert.equal(z.source_row_science_review_missing,26);
 assert.equal(z.source_row_kp_review_missing,26);
 assert.equal(closeout.legacy_schema_defect.missing_row_question_type_count,26); // frozen historical evidence
 const now=read(z.source_archive_ref);
 assert.equal(now.original_question_records.filter(x=>!x.question_type||!x.science_review_status||!x.kp_review_status).length,0);
 assert.equal(now.legacy_contract_original_wording_unchanged,true);
 const qa=read(z.science_review_ref);
 assert.equal(qa.model_science_preliminary_pass,23);
 assert.equal(qa.model_science_hold,3);
 assert.equal(qa.kp_secondpass_count.KP_STRONG_CANDIDATE,24);
 assert.equal(qa.kp_secondpass_count.KP_REVIEW,2);
 assert.equal(closeout.scan_visual_bbox_gate.scan_standalone_original_occurrences,133);
});
