import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const review=read("data/review/p12-b04-auto-batch50-b05-first50-science-kp-review-v1.json");
test("B05 first50 are exact frozen fourth-to-fifth batch source slots; 43 science/KP model candidates and 7 nonblocking holds",()=>{
 const dir=mkdtempSync(join(tmpdir(),"p12-b05-"));
 try{
  execFileSync(process.execPath,["scripts/review/p12-b04-auto-batch50.cjs","--batch=5","--out-dir="+dir],{encoding:"utf8"});
  const shard=read(join(dir,"batch-05-v1.json"));
  assert.equal(shard.source_count,50);
  assert.deepEqual(review.records.map(x=>x.source_id),shard.records.map(x=>x.source_id));
  assert.equal(new Set(review.records.map(x=>x.source_id)).size,50);
  assert.equal(review.model_ready_for_formal_QA,43);
  assert.equal(review.exception_hold_count,7);
  assert.deepEqual(review.records.filter(x=>x.exception_flags.length).map(x=>x.batch_ordinal),[1,3,9,16,17,18,23]);
  const raw=new Map();
  for(const row of review.records){
   if(!raw.has(row.original_source_archive_ref))raw.set(row.original_source_archive_ref,read(row.original_source_archive_ref));
   const paper=raw.get(row.original_source_archive_ref);
   const q=paper.original_question_records.find(x=>x.source_id===row.source_id);
   assert.ok(q);
   assert.equal(row.original_full_stem,q.full_original_stem);
   assert.deepEqual(row.original_full_options_in_order,q.full_original_options_in_order.map(o=>o.label+o.text));
   assert.deepEqual(row.source_answer_marker_bbox_pts_top_left,q.answer_marker_pdf_bbox_pts_top_left);
   assert.equal(row.source_pdf_sha256,paper.original_pdf_sha256);
   assert.equal(q.standalone_without_shared_figure_or_stimulus,true);
   assert.equal(row.formal_science_approved,false);
   assert.equal(row.formal_kp_approved,false);
   assert.equal(row.public_bank_admitted,false);
   assert.ok(row.science_independent_explanation);
   if(!row.exception_flags.length)assert.ok(row.model_proposed_answer);
  }
  assert.equal(raw.size,4);
  assert.ok(review.known_cross_batch_exact_duplicate.some(x=>x.source_id==="SCI_G04_S1_114_FINAL_008|S01|TF|012"));
 } finally{rmSync(dir,{recursive:true,force:true});}
});
