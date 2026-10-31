import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const load=(p)=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const root='data/review/p12-g04s1-113-all29-';
const v6=load(root+'known-atomic-disjoint-source-ledger-v6.json');
const v7=load(root+'known-atomic-disjoint-source-ledger-v7.json');
const proof=load(root+'mid005-final005-18-existing-gate-dedup-source-review-v1.json');
const source=load('data/review/p12-g04s1-113-missing15-native88-original-text-sci-g04-s1-113-mid-005-v1.json');
const norm=id=>id.split('|').map(s=>/^[SG]\d+$/.test(s)?s[0]+Number(s.slice(1)):/^\d+$/.test(s)?''+Number(s):s).join('|');
const qnorm=s=>String(s||'').normalize('NFKC').replace(/^\s*[（(]\s*[）)]\s*\d+[.．、]?\s*/,'').replace(/\s/g,'').replace(/[.,。，？！?!：:;；（）()『』「」《》、\-—－]+/g,'').toLowerCase();
const mapOld=new Map(v6.known_atomic_source_dispositions.map(x=>[norm(x.source_slot_id),x]));
const mapNow=new Map(v7.known_atomic_source_dispositions.map(x=>[norm(x.source_slot_id),x]));
const reviewed=new Map(proof.rows.map(x=>[norm(x.source_slot_id),x]));
const allPublic=[
...load('site/data/question-bank/p12-g04s1-113-b02-native21-standalone-public-v1.json').blocks,
...load('site/data/question-bank/p12-g04s1-113-b03-native27-standalone-public-v1.json').blocks,
...load('site/data/question-bank/p12-b04-b01-47-public-v1.json').blocks,
...load('site/data/question-bank/p12-b04-b04-47-public-v1.json').blocks,
...load('site/data/question-bank/p12-b04-b05-40-public-v1.json').blocks
];
const pubById=new Map(allPublic.map(x=>[x.id,x]));
test('v7 retains all29 source-work IDs with 333 published unchanged and 5 extra verified aliases',()=>{
 assert.equal(mapNow.size,1762);
 assert.deepEqual(v7.known_disjoint_dispositions,{PUBLISHED:333,HOLD:269,ALIAS:15,UNREVIEWED:1145});
 assert.equal(v7.original_papers.length,29);
 assert.equal(v7.source_response_identity_roster_original_papers_with_complete_source_mode_proof,29);
 assert.equal(v7.unresolved_coverage.all29_certified_independent_answer_position_denominator,null);
 assert.equal(v7.unresolved_coverage.remaining_unreviewed_exact_question_count,null);
 assert.equal(v7.formal_status_current_run.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(v7.formal_status_current_run.ADMISSION_READY_new,0);
 assert.equal(v7.formal_status_current_run.PUBLISHED_new,0);
 assert.equal(v7.formal_status_current_run.full_original_papers_Admission_closed,0);
});
test('the only changed prior positions are exactly five UNREVIEWED to ALIAS with a pre-existing public id',()=>{
 let changed=0;
 for(const [id,prev] of mapOld){
  const curr=mapNow.get(id);
  assert.ok(curr);
  if(curr.disposition===prev.disposition){assert.deepEqual(curr,prev,'unchanged position mutated '+id);continue;}
  changed++;
  assert.equal(prev.disposition,'UNREVIEWED');
  assert.equal(curr.disposition,'ALIAS');
  assert.equal(curr.source_alias_class,'FULL_IDENTICAL_STUDENT_PUBLIC_OR_OPTION_ONLY_ORDER');
  assert.ok(pubById.has(curr.existing_public_student_item_id));
  assert.equal(curr.student_new_public_count,0);
  assert.equal(reviewed.get(id).duplicate_disposition,'ALIAS_EXISTING_PUBLIC');
 }
 assert.equal(changed,5);
 assert.equal(v7.known_atomic_source_dispositions.filter(x=>x.disposition==='PUBLISHED').length,333);
});
test('18 original source-only independent TFMC candidates: 5 public-alias, 1 material-answer-changing 113 contrast, pending items never admitted',()=>{
 assert.equal(proof.rows.length,18);
 assert.equal(proof.rows.filter(x=>x.duplicate_disposition==='ALIAS_EXISTING_PUBLIC').length,5);
 assert.equal(proof.rows.filter(x=>x.paper_id.endsWith('MID_005')).length,12);
 assert.equal(proof.rows.filter(x=>x.paper_id.endsWith('FINAL_005')).length,6);
 for(const x of proof.rows){
  assert.equal(x.science_kp_formal_approved,false);
  assert.equal(x.rights_full_gate_accepted,false);
  assert.equal(x.operator_eligible,false);
  assert.equal(x.new_public_item,false);
  if(x.duplicate_disposition==='ALIAS_EXISTING_PUBLIC'){
   const matched=pubById.get(x.matched_public_student_id);
   assert.ok(matched);
   assert.equal(norm(x.matched_public_original_source_id),norm(matched.source_slot_id));
  }
 }
});
test('MID005 MC010 has exactly the same original four options as existing 113 public school MC question',()=>{
 const p=proof.rows.find(x=>x.source_slot_id.endsWith('MID_005|S02|MC|010'));
 const original=source.source_questions.find(x=>norm(x.source_slot_id)===norm(p.source_slot_id));
 const publicQ=pubById.get(p.matched_public_student_id);
 assert.equal(qnorm(original.source_text_native_pdf_readback_raw.split(/[①②③④]|○\s*[1-4]/)[0]),qnorm(publicQ.stem));
 const orgOpts=original.ordered_options_native_text_readback.map(x=>qnorm(x.source_option_text));
 const pubOpts=publicQ.options.map(x=>qnorm(x).replace(/^[1-4]/,''));
 assert.deepEqual(orgOpts,pubOpts);
});
test('MID005 TF001 and already published 113 water environment question change one answer-bearing member and cannot be merged',()=>{
 const row=proof.rows.find(x=>x.source_slot_id.endsWith('MID_005|S01|TF|001'));
 const original=source.source_questions.find(x=>norm(x.source_slot_id)===norm(row.source_slot_id));
 const published=pubById.get('P12_113_G04S1_B02_NATIVE21_018');
 assert.equal(row.duplicate_disposition,'DISTINCT_ANSWER_CHANGING_WORDING_VS_113_PUBLIC');
 assert.ok(original.source_text_native_pdf_readback_raw.includes('潮間帶'));
 assert.ok(published.stem.includes('水田'));
 assert.equal(row.model_science_answer_NOT_FORMAL,'X');
 assert.equal(published.answer,'O');
 assert.notEqual(qnorm(original.source_text_native_pdf_readback_raw),qnorm(published.stem));
 assert.equal(mapNow.get(norm(row.source_slot_id)).disposition,'UNREVIEWED');
});
test('a verbatim question from 114 source archive alone is never treated as already published or formally eligible',()=>{
 const row=proof.rows.find(x=>x.source_slot_id.endsWith('MID_005|S01|TF|013'));
 const source114=load('data/content-only/p12-art9-114-dongguang-g04s1-mid26-original-questions-v1-content-v1.json');
 const archived=source114.original_question_records.find(x=>x.source_id==='SCI_G04_S1_114_MID_008|S01|TF|012');
 assert.equal(row.duplicate_disposition,'EXACT_114_ORIGINAL_ARCHIVE_NOT_CONFIRMED_STUDENT_PUBLIC');
 assert.equal(archived.student_site_admitted,false);
 assert.equal(row.matched_public_student_id,null);
 assert.equal(mapNow.get(norm(row.source_slot_id)).disposition,'UNREVIEWED');
});
