import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root='data/review/p12-g04s1-113-all29-';
const read=s=>JSON.parse(readFileSync(new URL('../'+root+s,import.meta.url),'utf8'));
const v1=read('known-atomic-disjoint-source-ledger-v1.json');
const v2=read('known-atomic-disjoint-source-ledger-v2.json');
const old=read('historical5-242-source-proof-id-index-v1.json');
const bridge=read('sourceid-crosswalk5-91-original-proof-identity-v1.json');
const extra=read('original7-397-proof-residual-position-index-v1.json');
const normalize=id=>id.split('|').map(x=>/^[SG]\d+$/.test(x)?x[0]+Number(x.slice(1)):/^\d+$/.test(x)?String(Number(x)):x).join('|');
test('v2 classifies exactly 262 additional original-PDF source IDs without changing the 333 published answers',()=>{
 assert.equal(v1.source_position_count_distinct_known,904);
 assert.equal(v2.source_position_count_distinct_known,1166);
 assert.equal(v2.new_source_proof_unreviewed_position_IDs,262);
 assert.deepEqual(v2.known_disjoint_dispositions,{PUBLISHED:333,HOLD:269,ALIAS:10,UNREVIEWED:554});
 assert.equal(v2.known_atomic_source_dispositions.length,1166);
 assert.equal(new Set(v2.known_atomic_source_dispositions.map(x=>normalize(x.source_slot_id))).size,1166);
 const previous=new Map(v1.known_atomic_source_dispositions.map(x=>[normalize(x.source_slot_id),x]));
 for(const r of v2.known_atomic_source_dispositions){
  const o=previous.get(normalize(r.source_slot_id));
  if(o)assert.deepEqual(o,r,'prior source statuses and public source identities must not mutate');
  else assert.equal(r.disposition,'UNREVIEWED');
 }
 assert.equal(v2.source_response_identity_roster_original_papers_with_complete_source_mode_proof,17);
 assert.equal(v2.source_response_identity_roster_other_original_papers_pending,12);
 assert.equal(v2.unresolved_coverage.whole_paper_disjoint_coverage_complete,false);
 assert.equal(v2.unresolved_coverage.remaining_unreviewed_exact_question_count,null);
 assert.deepEqual(v2.formal_status_current_run,{FORMAL_SCIENCE_KP_APPROVED_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0,full_original_papers_Admission_closed:0});
});
test('91 original proof bridge maps unique legacy IDs to unique original parent-group markers and covers the 7 public unmatched legacy spellings',()=>{
 assert.equal(bridge.rows.length,91);
 assert.equal(new Set(bridge.rows.map(x=>normalize(x.legacy_batch_source_slot_id))).size,91);
 assert.equal(new Set(bridge.rows.map(x=>normalize(x.original_pdf_proof_source_slot_id))).size,91);
 assert.equal(bridge.covered_previous_7_public_source_id_mismatches,7);
 const proof=new Set(old.five_source_papers.flatMap(p=>p.source_ids.map(x=>normalize(x.id))));
 for(const row of bridge.rows){
  assert.ok(proof.has(normalize(row.original_pdf_proof_source_slot_id)));
  assert.equal(row.admission_status_change,false);
  assert.equal(row.formal_source_exact_question_text_parent_options_accepted,false);
 }
});
test('17 source-mode rosters include the five zero-public and twelve full historic proof inventories without claiming full Admission',()=>{
 const paper=v2.original_papers;
 assert.equal(paper.length,29);
 assert.equal(paper.filter(x=>x.source_response_identity_roster_full_paper_proof_known).length,17);
 assert.equal(extra.total_original_source_proof_count,397);
 assert.equal(extra.new_source_only_positions,243);
 assert.equal(extra.known_baseline_positions,154);
 const unknown=v2.known_atomic_source_dispositions.filter(r=>r.disposition==='UNREVIEWED'&&r.evidence_tier==='PR124_ORIGINAL_PDF_FULL_SOURCE_PROOF_LEFTOVER');
 assert.equal(unknown.length,262);
 assert.equal(paper.reduce((acc,x)=>acc+x.disjoint_known_source_positions.PUBLISHED,0),333);
 assert.ok(paper.every(x=>x.certified_total_independent_answer_positions===null&&x.certified_total_unreviewed_questions===null&&!x.whole_paper_formal_Admission_closed));
});
