import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const review=read("data/review/p12-b04-auto-batch50-b03-first50-science-kp-review-v1.json");
test("B03 original-source first 50 match frozen AUTO_BATCH50 shard and preserve full printed text/choice/order/BBox",()=>{
 const tmp=mkdtempSync(join(tmpdir(),"b04-b03-"));
 try{
  execFileSync(process.execPath,["scripts/review/p12-b04-auto-batch50.cjs","--batch=3","--out-dir="+tmp],{encoding:"utf8"});
  const shard=read(join(tmp,"batch-03-v1.json"));
  assert.equal(shard.source_count,50);
  assert.equal(review.source_questions,50);
  assert.equal(review.records.length,50);
  assert.deepEqual(review.records.map(x=>x.source_id),shard.records.map(x=>x.source_id));
  assert.equal(new Set(review.records.map(x=>x.source_id)).size,50);
  assert.deepEqual(review.records.filter(x=>x.exception_flags.length).map(x=>x.batch_ordinal),[4,5,10,20,21,26,27,28,32]);
  assert.equal(review.model_reasoned_candidates,41);
  assert.equal(review.exceptions,9);
  const files=new Map();
  for(const row of review.records){
   if(!files.has(row.original_source_archive_ref))files.set(row.original_source_archive_ref,read(row.original_source_archive_ref));
   const paper=files.get(row.original_source_archive_ref);
   const original=paper.original_question_records.find(x=>x.source_id===row.source_id);
   assert.ok(original,"original source missing "+row.source_id);
   assert.equal(original.full_original_stem,row.original_full_stem);
   assert.deepEqual(original.full_original_options_in_order.map(o=>o.label+o.text),row.original_full_options_in_order);
   assert.deepEqual(original.answer_marker_pdf_bbox_pts_top_left,row.original_answer_marker_bbox_pts_top_left);
   assert.equal(paper.original_pdf_sha256,row.source_pdf_sha256);
   assert.equal(original.standalone_without_shared_figure_or_stimulus,true);
   assert.equal(row.science_formally_approved,false);
   assert.equal(row.kp_formally_approved,false);
   assert.equal(row.site_admitted,false);
   if(!row.exception_flags.length)assert.ok(row.provisional_unique_answer&&row.science_independent_rationale);
  }
  assert.equal(files.size,4);
 } finally{rmSync(tmp,{recursive:true,force:true});}
});
