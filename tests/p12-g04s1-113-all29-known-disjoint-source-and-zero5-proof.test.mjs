import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>JSON.parse(readFileSync(new URL('../'+p,import.meta.url),'utf8'));
const prefix='data/review/p12-g04s1-113-all29-';
const source=read(prefix+'known-atomic-disjoint-source-ledger-v1.json');
const zero=read(prefix+'zero5-321-atomic-source-disposition-v1.json');
const join=read(prefix+'b08-published17-original-parent-sourceid-crosswalk-v1.json');
const master=read(prefix+'paper-level-admission-master-v1.json');
const normalize=id=>id.split('|').map(s=>/^[SG]\\d+$/.test(s)?s[0]+Number(s.slice(1)):/^\\d+$/.test(s)?String(Number(s)):s).join('|');
test('all29 known positions are disjoint and never presented as certified full question denominator',()=>{
 assert.equal(source.original_papers.length,29);
 assert.equal(source.source_position_count_distinct_known,904);
 assert.equal(source.known_atomic_source_dispositions.length,904);
 assert.equal(new Set(source.known_atomic_source_dispositions.map(x=>normalize(x.source_slot_id))).size,904);
 assert.deepEqual(source.known_disjoint_dispositions,{PUBLISHED:333,HOLD:269,ALIAS:10,UNREVIEWED:292});
 const by={PUBLISHED:0,HOLD:0,ALIAS:0,UNREVIEWED:0};
 for(const row of source.known_atomic_source_dispositions){
  assert.ok(Object.hasOwn(by,row.disposition));
  by[row.disposition]++;
 }
 assert.deepEqual(by,source.known_disjoint_dispositions);
 assert.equal(source.unresolved_coverage.all29_certified_independent_answer_position_denominator,null);
 assert.equal(source.unresolved_coverage.remaining_unreviewed_exact_question_count,null);
 assert.equal(source.unresolved_coverage.whole_paper_disjoint_coverage_complete,false);
});
test('published main 333 are not rereviewed or changed by B08 identity reconciliation',()=>{
 assert.equal(source.published_333_frozen_unchanged,true);
 assert.equal(source.B_historical_totals.PUBLISHED,155);
 assert.equal(source.B_historical_totals.HOLD,240);
 assert.equal(source.B_historical_totals.ALIAS,13);
 assert.equal(source.B_historical_totals.already_published_alias_same_source_ids,3);
 assert.equal(join.rows.length,17);
 assert.equal(new Set(join.rows.map(z=>z.original_batch_source_slot_id)).size,17);
 assert.equal(new Set(join.rows.map(z=>z.actual_public_original_source_slot_id)).size,17);
 const published=new Set(source.known_atomic_source_dispositions.filter(z=>z.disposition==='PUBLISHED').map(z=>normalize(z.source_slot_id)));
 for(const row of join.rows){
  assert.equal(row.alias_type,'SOURCE_ID_ENCODING_CROSSWALK_NOT_DUPLICATE_QUESTION');
  assert.ok(published.has(normalize(row.actual_public_original_source_slot_id)));
 }
 assert.deepEqual(source.formal_status_current_run,{FORMAL_SCIENCE_KP_APPROVED_new:0,ADMISSION_READY_new:0,PUBLISHED_new:0,full_original_papers_Admission_closed:0});
});
test('zero5 321 source anchors retain published zero, explicit hold and unknown formal status',()=>{
 assert.equal(zero.exact_original_source_anchor_count,321);
 assert.equal(zero.source_rows.length,321);
 assert.equal(new Set(zero.source_rows.map(z=>z.source_slot_id)).size,321);
 assert.deepEqual(zero.per_paper.map(z=>[z.anchors,z.hold,z.unreviewed]),[[50,4,46],[50,4,46],[100,14,86],[50,7,43],[71,0,71]]);
 assert.equal(zero.known_source_parent_HOLD_positions,29);
 assert.equal(zero.source_work_UNREVIEWED_formal_positions,292);
 assert.equal(zero.formally_certified_unique_answer_denominator,null);
 const zIds=new Set(zero.source_rows.map(z=>normalize(z.source_slot_id)));
 const sourceZero=source.known_atomic_source_dispositions.filter(x=>zIds.has(normalize(x.source_slot_id)));
 assert.equal(sourceZero.length,321);
 assert.ok(sourceZero.every(x=>x.evidence_tier==='ZERO_PUBLIC_SOURCE_ONLY'&&x.disposition!=='PUBLISHED'));
});
test('29 original paper rows preserve public counts and distinguish 13 B-touched from 16 others',()=>{
 assert.equal(source.original_papers.length,master.per_original_paper.length);
 assert.equal(source.original_papers.filter(x=>x.batch_touched).length,13);
 assert.equal(source.original_papers.filter(x=>!x.batch_touched).length,16);
 const sums={PUBLISHED:0,HOLD:0,ALIAS:0,UNREVIEWED:0};
 for(const x of source.original_papers){
  const m=master.per_original_paper.find(z=>z.source_paper_id===x.source_paper_id);
  assert.ok(m);
  assert.equal(x.disjoint_known_source_positions.PUBLISHED,m.public_113_total);
  assert.equal(x.certified_total_independent_answer_positions,null);
  assert.equal(x.certified_total_unreviewed_questions,null);
  assert.equal(x.whole_paper_formal_Admission_closed,false);
  for(const key of Object.keys(sums))sums[key]+=x.disjoint_known_source_positions[key];
 }
 assert.deepEqual(sums,source.known_disjoint_dispositions);
});
