import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const read = path => JSON.parse(readFileSync(path, 'utf8'));
const ledgerPath='data/review/p12-b04-auto-batch50-final-closeout-115-exceptions-v1.json';

test('P12 B04 closeout preserves 409 reviewed, 294 released, 115 disjoint HELD positions',()=>{
 const l=read(ledgerPath),review=l.sources.review_files.map(read),accept=l.sources.formal_acceptance_files.map(read);
 assert.equal(l.schema_version,'P12_B04_AUTO_BATCH50_FINAL_CLOSEOUT_115_EXCEPTIONS_V1');
 assert.equal(review.length,9);assert.equal(accept.length,7);
 assert.deepEqual(review.map(x=>x.records.length),[50,50,50,50,50,50,50,50,9]);
 assert.deepEqual(accept.map(x=>x.approved_items.length),[47,41,41,47,40,47,31]);
 assert.deepEqual([l.totals.reviewed,l.totals.admitted,l.totals.held],[409,294,115]);
 assert.equal(l.records.length,115);
 const published=new Set(accept.flatMap(x=>x.approved_items.map(y=>y.source_slot_id)));
 const expected=[];
 for(let i=0;i<9;i++){
   const key='B'+String(i+1).padStart(2,'0');
   const source=review[i],reviewIDs=new Set(source.records.map(x=>x.source_id));
   const a=i<7?accept[i].approved_items:[],h=i<7?(accept[i].held_items??accept[i].exception_source_ids):source.records;
   const ids=h.map(x=>x.source_id??x.source_slot_id);
   assert.equal(a.length+ids.length,source.records.length,'source position partition '+key);
   assert.equal(new Set(ids).size,ids.length,'unique within '+key);
   assert.ok(ids.every(id=>reviewIDs.has(id)),'held source IDs trace back '+key);
   assert.ok(ids.every(id=>!published.has(id)),'held never published '+key);
   expected.push(...ids);
   const r=l.by_batch[key];
   assert.deepEqual([r.reviewed,r.public_admitted,r.held],[source.records.length,a.length,h.length]);
 }
 assert.equal(new Set(expected).size,115);
 assert.deepEqual(new Set(l.records.map(x=>x.source_id)),new Set(expected));
 assert.equal(l.records.every(x=>x.public_admitted===false),true);
 assert.equal(l.records.every(x=>x.original_school_teacher_key_authenticated===false),true);
 assert.equal(l.records.every(x=>x.requires_separate_original_pdf_review_before_any_admission===true),true);
 assert.equal(l.records.every(x=>x.source_pdf_sha256?.match(/^[a-f0-9]{64}$/)&&x.source_pdf_pages?.length&&x.original_source_archive_ref),true);
 assert.equal(l.admission_policy.scan_visual_estimate_is_not_certified_bbox,true);
 assert.equal(l.admission_policy.no_modification_of_existing_294,true);
});

test('P12 B04 115 exception routing is mutually exclusive and preserves overlapping scan blockers',()=>{
 const l=read(ledgerPath),rows=l.records,scan=rows.filter(x=>x.scan_bbox_blocker),nonScan=rows.filter(x=>!x.scan_bbox_blocker);
 assert.deepEqual([scan.length,nonScan.length],[78,37]);
 assert.equal(scan.filter(x=>x.secondary_blocker_flags.length===0).length,72);
 assert.equal(scan.filter(x=>x.secondary_blocker_flags.length>0).length,6);
 assert.equal(scan.filter(x=>x.cross_source_duplicate_blocker).length,2);
 assert.equal(nonScan.filter(x=>x.primary_route==='DEDUP_LINEAGE_ONLY').length,3);
 assert.equal(nonScan.filter(x=>x.primary_route==='ORIGINAL_PRINTED_OPTIONS_REVIEW').length,1);
 assert.equal(nonScan.filter(x=>x.primary_route==='SCIENCE_KP_SEMANTIC_REVIEW').length,33);
 assert.equal(scan.every(x=>x.primary_route==='SCAN_WITH_SECONDARY_HOLDS'||x.primary_route==='SCAN_PDF_BBOX_RECOVERY'),true);
 assert.equal(rows.every(x=>x.exception_flags.length>0),true);
 assert.deepEqual(Object.values(l.by_batch).map(x=>x.scan_bbox_hold),[0,0,0,0,0,0,19,50,9]);
 assert.equal(l.baseline.cumulative_student_bank_answer_slots,560);
 assert.equal(l.baseline.initial_priority_public_admitted,15);
 assert.equal(l.baseline.initial_priority_deduplicated,1);
});
