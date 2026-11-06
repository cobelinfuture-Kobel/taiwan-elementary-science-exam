import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const rd=path=>JSON.parse(readFileSync(new URL('../data/review/'+path,import.meta.url),'utf8'));
const base='p12-g04s1-113-all29-';
const now=rd(base+'known-atomic-disjoint-source-ledger-v6.json');
const old=rd(base+'known-atomic-disjoint-source-ledger-v5.json');
const last43=rd(base+'last43-original-pdf-native-raster-exactbbox-v1.json');
const main=rd(base+'paper-level-admission-master-v1.json');
const published=[...rd(base+'published-source-shardA-v1.json').source_rows,...rd(base+'published-source-shardB-v1.json').source_rows];
const norm=id=>id.split('|').map(x=>/^[SG]\d+$/.test(x)?x[0]+Number(x.slice(1)):/^\d+$/.test(x)?String(Number(x)):x).join('|');
test('all29 original source-work identities are exactly routed, but not certified questions',()=>{
 assert.equal(now.source_position_count_distinct_known,1762);
 assert.equal(now.known_atomic_source_dispositions.length,1762);
 assert.equal(new Set(now.known_atomic_source_dispositions.map(x=>norm(x.source_slot_id))).size,1762);
 assert.deepEqual(now.known_disjoint_dispositions,{PUBLISHED:333,HOLD:269,ALIAS:10,UNREVIEWED:1150});
 assert.equal(now.original_papers.length,29);
 assert.equal(now.source_response_identity_roster_original_papers_with_complete_source_mode_proof,29);
 assert.equal(now.source_response_identity_roster_other_original_papers_pending,0);
 assert.deepEqual(now.remaining_provisional_source_work_regions_without_individual_accepted_source_ID,{});
 assert.equal(now.unresolved_coverage.all29_certified_independent_answer_position_denominator,null);
 assert.equal(now.unresolved_coverage.remaining_unreviewed_exact_question_count,null);
 assert.equal(now.formal_status_current_run.full_original_papers_Admission_closed,0);
 assert.equal(now.formal_status_current_run.PUBLISHED_new,0);
 assert.equal(now.formal_status_current_run.ADMISSION_READY_new,0);
});
test('each existing source identity, source status, public lineage and 333 published remain unchanged',()=>{
 const prior=new Map(old.known_atomic_source_dispositions.map(x=>[norm(x.source_slot_id),x]));
 assert.equal(prior.size,1719);
 const seenPublished=new Map(published.map(x=>[norm(x.source_slot_id),x]));
 assert.equal(seenPublished.size,333);
 let added=0;
 for(const x of now.known_atomic_source_dispositions){
  const key=norm(x.source_slot_id),before=prior.get(key);
  if(before)assert.deepEqual(x,before,'status drift '+key);
  else {added++;assert.equal(x.disposition,'UNREVIEWED');assert.ok(x.source_geometry_proof.endsWith('last43-original-pdf-native-raster-exactbbox-v1.json'));}
  if(seenPublished.has(key))assert.equal(x.disposition,'PUBLISHED','published item reclassified');
 }
 assert.equal(added,43);
 assert.equal(now.known_atomic_source_dispositions.filter(x=>x.disposition==='PUBLISHED').length,333);
 assert.equal(now.published_333_frozen_unchanged,true);
});
test('last43 are original-PDF SHA verified, 37 MID005 and 6 FINAL005 with original exact source bbox',()=>{
 assert.equal(last43.source_positions.length,43);
 assert.equal(new Set(last43.source_positions.map(x=>norm(x.source_slot_id))).size,43);
 const d=last43.source_positions.filter(x=>x.source_paper_id.endsWith('MID_005'));
 const y=last43.source_positions.filter(x=>x.source_paper_id.endsWith('FINAL_005'));
 assert.equal(d.length,37);assert.equal(y.length,6);
 assert.equal(d.filter(x=>x.geometry_provenance.includes('VECTOR')).length,8);
 assert.equal(d.filter(x=>x.geometry_provenance.includes('EMBEDDED')).length,4);
 assert.equal(d.filter(x=>x.geometry_provenance.includes('NATIVE')).length,25);
 assert.equal(y.filter(x=>x.geometry_provenance.includes('NATIVE')).length,6);
 const sd='8473701842070f628f677e57c860cd9ddcbb1cde224c338b3e015a3ad5db7096';
 const sy='94108a241a9833fda111ba7648ea4e1c424e5a64d84a090c42e4c9777c5218ec';
 for(const item of last43.source_positions){
  assert.equal(item.pdf_sha256,item.source_paper_id.endsWith('MID_005')?sd:sy);
  assert.equal(item.source_page_pdf_1_based,item.source_paper_id.endsWith('MID_005')?2:1);
  const a=item.original_pdf_bbox_pts_top_left;
  assert.equal(a.length,4);assert.ok(a.every(Number.isFinite));
  assert.ok(a[0]>=0&&a[1]>=0&&a[2]>a[0]&&a[3]>a[1]);
  const maxX=item.source_paper_id.endsWith('MID_005')?728.64:841.92,maxY=item.source_paper_id.endsWith('MID_005')?1032:1190.64;
  assert.ok(a[2]<=maxX+0.01&&a[3]<=maxY+0.01);
  assert.equal(item.admission_ready,false);
  assert.equal(item.previously_published,false);
 }
 for(const item of d.filter(x=>x.geometry_provenance.includes('EMBEDDED'))){
  assert.deepEqual(item.original_image_dimensions_px,[265,341]);
  assert.equal(item.original_embedded_image_ink_bbox_px.length,4);
 }
});
test('corrected original MID005 section3 is eight real table cells, four quake brackets, four scenery brackets',()=>{
 const d=last43.source_positions.filter(x=>x.source_paper_id.endsWith('MID_005'));
 const n=prefix=>d.filter(x=>x.source_slot_id.includes(prefix)).length;
 assert.equal(n('|S03|G01|TABLE_CELL|'),8);
 assert.equal(n('|S03|G02|FILL|'),4);
 assert.equal(n('|S03|G03|SCENERY_IMAGE_CHOICE|'),4);
 assert.equal(n('|S04|G01|TF|'),6);
 assert.equal(n('|S04|G02|TF|'),6);
 assert.equal(n('|S04|G03|TF|'),5);
 assert.equal(n('|S05|G01|MC|'),4);
 assert.ok(last43.dadun_prior_source_work_group_error.historical_noncertified_section3_groups.includes('4 plant'));
});
test('original FINAL005 six new source positions are disjoint from the 14 frozen public TF/MC question IDs',()=>{
 const y=last43.source_positions.filter(x=>x.source_paper_id.endsWith('FINAL_005'));
 const expected=['S01|TF|007','S01|TF|008','S01|TF|010','S02|MC|007','S02|MC|009','S02|MC|010'];
 assert.deepEqual(y.map(x=>x.source_slot_id.split('FINAL_005|')[1]),expected);
 const frozen=new Set(published.filter(x=>x.paper_id.endsWith('FINAL_005')).map(x=>norm(x.source_slot_id)));
 assert.equal(frozen.size,14);
 assert.ok(y.every(x=>!frozen.has(norm(x.source_slot_id))));
});
test('29 original-paper counters match main public positions; only MID005 and FINAL005 grew 37 and 6 respectively',()=>{
 const oldMap=new Map(old.original_papers.map(x=>[x.source_paper_id,x]));
 assert.equal(now.original_papers.length,main.per_original_paper.length);
 for(const x of now.original_papers){
  const before=oldMap.get(x.source_paper_id),m=main.per_original_paper.find(z=>z.source_paper_id===x.source_paper_id);
  assert.ok(before&&m);
  const delta=x.source_paper_id.endsWith('MID_005')?37:x.source_paper_id.endsWith('FINAL_005')?6:0;
  assert.equal(x.known_classified_source_positions,before.known_classified_source_positions+delta);
  assert.equal(x.disjoint_known_source_positions.PUBLISHED,m.public_113_total);
  assert.equal(x.whole_paper_formal_Admission_closed,false);
  assert.equal(x.exact_certified_independent_question_count,null);
 }
 assert.equal(now.original_papers.find(x=>x.source_paper_id.endsWith('MID_005')).known_classified_source_positions,66);
 assert.equal(now.original_papers.find(x=>x.source_paper_id.endsWith('FINAL_005')).known_classified_source_positions,80);
});
