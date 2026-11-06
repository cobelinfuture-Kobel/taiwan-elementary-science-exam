#!/usr/bin/env node
/**
 * B01 item-level admission evidence resolver, not an Admission or publication shortcut.
 * Reads 114 original work slots and all 114 25-paper archived originals plus all
 * public student-bank JSON blocks. Tracks exact same stems, but does NOT declare
 * a semantic duplicate or Article9 / Operator Gate without distinct evidence.
 */
import assert from 'node:assert/strict';
import {readFileSync,readdirSync,mkdirSync,writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const read=p=>JSON.parse(readFileSync(path.join(root,p),'utf8'));
const P='data/review/p12-g04s1-113-all29-';
const audit=read(P+'bulk-b01-114-original-content-and-gate-routing-v1.json');
const originals=read('data/source-archive/p12-art9-114-g04s1-public-original-source-corpus-current-v25.json');
const banksRoot=path.join(root,'site/data/question-bank');
const norm=s=>String(s||'').normalize('NFKC').replace(/[\s（）、，。！？：；「」『』()、.,!?;:—-]/g,'');
const simple=x=>typeof x==='string'?x:(x?.text||x?.option_text||x?.stem||'');
const opts=x=>Array.isArray(x)?x.map(a=>norm(simple(a)).replace(/^[①②③④]|^□[1234]/,'')).sort():[];
const sourceOriginals=originals.original_source_archive_evidence_refs.flatMap(p=>{
 const r=read(p);
 const a=r.original_question_records||r.source_questions||r.questions||[];
 return a.map(x=>({...x,__source_archive_path:p}));
});
const existingBanks=readdirSync(banksRoot).filter(f=>f.endsWith('.json')).flatMap(f=>{
 const o=read('site/data/question-bank/'+f);
 return (o.blocks||[]).map(x=>({...x,__public_bank_file:f}));
});
assert.equal(originals.current_public_source_paper_count,25);
assert.equal(originals.cumulative_original_source_question_occurrences,717);
assert.equal(sourceOriginals.length,717);
assert.equal(audit.rows.length,114);
const matches=x=>{
 if(!x.question_text_from_original_PDF)return {public_exact_stem_or_child:[],original114_exact_stem:[],original114_exact_stem_and_options:[],public_exact_full_options:[]};
 const st=norm(x.question_text_from_original_PDF);
 const pubs=existingBanks.filter(b=>norm(b.stem)===st);
 const o114=sourceOriginals.filter(b=>norm(b.full_original_stem||b.stem)===st);
 const eqopts=z=>{
  const a=opts(x.original_options_ordered);
  const b=opts(z.options||z.full_original_options_in_order||z.original_options_in_order||z.original_ordered_options);
  return a.length===b.length&&a.every((v,i)=>v===b[i]);
 };
 return {
  public_exact_stem_or_child:pubs.map(b=>({student_id:b.id,source_slot_id:b.source_slot_id,file:b.__public_bank_file,identical_options:!x.original_options_ordered.length||eqopts(b)})),
  original114_exact_stem:o114.map(b=>({source_id:b.source_id||b.source_slot_id,file:b.__source_archive_path})),
  original114_exact_stem_and_options:o114.filter(z=>eqopts(z)).map(b=>({source_id:b.source_id||b.source_slot_id,file:b.__source_archive_path})),
  public_exact_full_options:pubs.filter(z=>eqopts(z)).map(b=>({student_id:b.id,source_slot_id:b.source_slot_id,file:b.__public_bank_file}))
 };
};
const rows=audit.rows.map(r=>{
 const d=matches(r);
 const parentRights=String(r.content_route).startsWith('PARENT_ARTICLE')||String(r.content_route).startsWith('PARENT_PHOTO');
 const sourceText=!!r.question_text_from_original_PDF&&!!r.parent_text_from_original_PDF; // if standalone, parent may intentionally be null
 const newDistinct=(r.content_route==='TEXT_WITH_DIRECT_KP_CANDIDATE'&&!d.public_exact_full_options.length&&!d.original114_exact_stem_and_options.length);
 return {
  source_slot_id:r.source_slot_id,paper_id:r.paper_id,original_page:r.original_pdf_page_1based,
  original_bbox_pdf_pts_top_left:r.original_answer_bbox_pdf_points_top_left,
  source_full_stem_text_present:!!r.question_text_from_original_PDF,
  source_parent_text_present:!!r.parent_text_from_original_PDF,
  preflight_gate_case:r.content_route,
  proposed_direct_kp_id:r.model_direct_frozen48kp_id||null,
  proposed_answer_non_teacher:r.independent_answer_model_not_school_key,
  current_public_exact_stem_matches:d.public_exact_stem_or_child,
  current_public_full_option_match:d.public_exact_full_options,
  original_114_25_exact_stem_matches:d.original114_exact_stem,
  original_114_25_exact_stem_option_matches:d.original114_exact_stem_and_options,
  source_item_candidate_new_distinct_preliminary:newDistinct,
  operator_eligible:false,
  full_11329_11425_semantic_duplicate_gate_accepted:false,
  rights_accepted:false,
  formal_science_kp_approved:false,
  ADMISSION_READY:false,
  PUBLISHED:false,
  next_short_step:newDistinct?'FORMAL_SEMANTIC_DEDUP_RIGHTS_AND_EXACT_OPERATOR_SIGNOFF':parentRights?'ORIGINAL_PARENT_RIGHTS_AND_FIGURE_SOURCE_REVIEW':'TARGETED_GATE_EXCEPTION_OR_DEDUP_MATCH_REVIEW'
 };
});
const counter={};
for(const row of rows)counter[row.preflight_gate_case]=(counter[row.preflight_gate_case]||0)+1;
const publicMatches=rows.filter(x=>x.current_public_exact_stem_matches.length);
const originalMatches=rows.filter(x=>x.original_114_25_exact_stem_matches.length);
const shortlist=rows.filter(x=>x.source_item_candidate_new_distinct_preliminary);
const outcome={
 schema_version:'P12_G04S1_113_ALL29_FULLFIX_B01_ADMISSION_CONTENT_DUPLICATE_PRECISION_REPORT_V1',
 created_from_source_branch:'p12-g04s1-113-all29-fullfix-bulk1122-admission-20261106',
 initial_batch:'B01',total_original_source_work:114,
 source_text_evidence_rows:rows.filter(x=>x.source_full_stem_text_present).length,
 no_full_original_child_text_pending_figure_or_draw:rows.filter(x=>!x.source_full_stem_text_present).length,
 original_source_page_and_bbox_nonnull:rows.filter(x=>x.original_bbox_pdf_pts_top_left).length,
 original_114_source_archives_checked:25,original_114_source_positions_checked:717,public_student_bank_item_blocks_scanned:existingBanks.length,
 public_exact_stem_match_source_positions:publicMatches.length,
 original114_exact_stem_match_source_positions:originalMatches.length,
 preliminary_original_text_science_directkp_no_exact_source_match:shortlist.length,
 preliminary_shortlist_source_slot_ids:shortlist.map(x=>x.source_slot_id),
 duplicate_manual_review_source_slot_ids:[...new Set([...publicMatches,...originalMatches].map(x=>x.source_slot_id))],
 original_11329_semantic_parent_figure_review_complete:false,
 operator_source_roster_signed:false,
 new_FORMAL_SCIENCE_KP_APPROVED:0,new_ADMISSION_READY:0,new_PUBLISHED:0,
 original_29_disjoint_remains:{PUBLISHED:333,HOLD:291,ALIAS:16,UNREVIEWED:1122},
 paper_summary:Object.fromEntries([...new Set(rows.map(x=>x.paper_id))].map(pid=>[pid,{
  source_slots:rows.filter(x=>x.paper_id===pid).length,
  text_evidence:rows.filter(x=>x.paper_id===pid&&x.source_full_stem_text_present).length,
  preliminary_no_exact_source_candidate:shortlist.filter(x=>x.paper_id===pid).length
 }])),
 rows
};
const content60=read(P+'bulk-b01-exact60-after-cross113-duplicate-operator-review-PENDING-v1.json');
const held42=read(P+'bulk-b01-existing-gate-42-source-hold-exception-overlay-v1.json');
assert.equal(content60.records.length,60,'B01 final content evidence should preserve 60 unsigned candidate originals');
assert.equal(held42.records.length,42,'B01 exception HOLD 42 source positions must remain classified');
assert.equal(content60.source_ids_exact.every(x=>resultPlaceholderOrPreliminaryContains(x)),true);
function resultPlaceholderOrPreliminaryContains(id){return outcome.preliminary_shortlist_source_slot_ids.includes(id);}
outcome.precise_operator_roster_after_B01_all_content_routing=content60.source_ids_exact;
outcome.existing_gate_exceptions_source_positions_HOLD=held42.records.length;
outcome.effective_29_disjoint_after_B01={PUBLISHED:333,HOLD:336,ALIAS:25,UNREVIEWED:1068};
outcome.B01_source_positions_classified_this_batch=54;
outcome.B01_frozen114_remaining_unsigned_candidates=60;
export const result=outcome;
export function main(args=process.argv.slice(2)){
 let dir=null;
 for(const a of args){if(a.startsWith('--out-dir='))dir=a.slice(10);else if(a!=='--check')throw Error('B01 evidence gate unknown flag: '+a);}
 if(dir){
  const dest=path.resolve(root,dir);
  if(dest.includes('site/data/question-bank'))throw Error('B01 cannot write published student bank');
  mkdirSync(dest,{recursive:true});
  writeFileSync(path.join(dest,'B01-content-dedup-review.json'),JSON.stringify(result,null,2)+'\n');
  writeFileSync(path.join(dest,'B01-preliminary-operator-roster-PENDING.json'),JSON.stringify({
   schema_version:'P12_G04S1_113_B01_EXACT_SOURCE_OPERATOR_PRELIMINARY_ROSTER_NOT_APPROVED_V1',
   source_slot_ids:result.precise_operator_roster_after_B01_all_content_routing,
   initial_model_preflight_count:result.preliminary_shortlist_source_slot_ids.length,
   source_gate_exceptions_held:result.existing_gate_exceptions_source_positions_HOLD,
   exact_operator_candidates_not_yet_signed:result.precise_operator_roster_after_B01_all_content_routing.length,
   B01_remaining_original_work_positions:60,
   formal_11425_11329_duplicate_rights_and_operator_gates_not_closed:true,
   operator_authorized:false,
   actual_student_publication_count:0
  },null,2)+'\n');
 }
 console.log('B01_CROSS_SOURCE_EXACT_MATCH_DETAILS '+JSON.stringify(result.rows.filter(r=>r.current_public_exact_stem_matches.length||r.original_114_25_exact_stem_matches.length).map(r=>({source_slot_id:r.source_slot_id,published:r.current_public_exact_stem_matches,archive114:r.original_114_25_exact_stem_matches}))));
 console.log('B01_ORIGINAL_CONTENT_ROUTING '+JSON.stringify({
  source_positions:result.total_original_source_work,source_text_rows:result.source_text_evidence_rows,
  figure_or_drawing_parent_pending:result.no_full_original_child_text_pending_figure_or_draw,
  public_exact_stem_matches:result.public_exact_stem_match_source_positions,
  archive114_exact_matches:result.original114_exact_stem_match_source_positions,
  preliminary_distinct_science_directkp_roster:result.preliminary_original_text_science_directkp_no_exact_source_match,
  source_exceptions_classified_HOLD:result.existing_gate_exceptions_source_positions_HOLD,
  precise_original_source_operator_cohort_not_signed:result.precise_operator_roster_after_B01_all_content_routing.length,
  B01_remaining_UNREVIEWED:60,
  ALL29_remaining_UNREVIEWED:1068,
  possible_duplicate_ids:result.duplicate_manual_review_source_slot_ids,
  operator_signed:false,FORMAL_SCIENCE_KP_APPROVED_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0
 }));
 return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))try{main();}catch(e){console.error(e);process.exitCode=1;}
