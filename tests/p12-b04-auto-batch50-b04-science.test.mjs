import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const data=read("data/review/p12-b04-auto-batch50-b04-first50-science-kp-review-v1.json");
test("B04 50 source positions equal deterministic fourth frozen batch with exact original options and PDF BBox",()=>{
 const dir=mkdtempSync(join(tmpdir(),"science-b04-"));
 try{
  execFileSync(process.execPath,["scripts/review/p12-b04-auto-batch50.cjs","--batch=4","--out-dir="+dir],{encoding:"utf8"});
  const shard=read(join(dir,"batch-04-v1.json"));
  assert.equal(shard.records.length,50);
  assert.equal(data.original_source_positions,50);
  assert.deepEqual(data.records.map(x=>x.source_id),shard.records.map(x=>x.source_id));
  assert.equal(new Set(data.records.map(x=>x.source_id)).size,50);
  assert.equal(data.model_ready_for_formal_QA,47);
  assert.equal(data.science_kp_hold,3);
  assert.deepEqual(data.records.filter(x=>x.exception_flags.length).map(x=>x.batch_ordinal),[28,35,41]);
  assert.equal(data.renderer_style_review,11);
  const papers=new Map();
  for(const r of data.records){
   if(!papers.has(r.original_source_archive_ref))papers.set(r.original_source_archive_ref,read(r.original_source_archive_ref));
   const p=papers.get(r.original_source_archive_ref);
   const orig=p.original_question_records.find(x=>x.source_id===r.source_id);
   assert.ok(orig,"missing historical source "+r.source_id);
   assert.equal(orig.full_original_stem,r.original_full_stem);
   assert.deepEqual(orig.full_original_options_in_order.map(o=>o.label+o.text),r.original_options_in_order);
   assert.deepEqual(orig.answer_marker_pdf_bbox_pts_top_left,r.source_pdf_bbox_pts_top_left);
   assert.equal(p.original_pdf_sha256,r.source_pdf_sha256);
   assert.equal(orig.standalone_without_shared_figure_or_stimulus,true);
   assert.equal(r.science_formal_approved,false);
   assert.equal(r.kp_formal_approved,false);
   assert.equal(r.site_admitted,false);
   if(r.exception_flags.length===0)assert.ok(r.provisional_unique_answer&&r.independent_science_reasoning);
  }
  assert.equal(papers.size,3);
  assert.equal(data.records.filter(x=>x.original_option_labels.includes("(1)")).length,11);
  assert.ok(data.records.filter(x=>x.presentation_review_flags.length).every(x=>x.original_option_labels.includes("(1)")));
 }finally{rmSync(dir,{recursive:true,force:true});}
});
