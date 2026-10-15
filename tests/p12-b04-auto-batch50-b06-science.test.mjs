import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const ledger=read("data/review/p12-b04-auto-batch50-b06-first50-science-kp-review-v1.json");
const squish=s=>String(s??"").replace(/\s+/g,"");
const noScore=s=>squish(s).replace(/\(\d+分\)/g,"");
test("B06 fixed 50 source slots, 47 model science candidates, three independent exception holds",()=>{
 const out=mkdtempSync(join(tmpdir(),"p12-b06-"));
 try{
  execFileSync(process.execPath,["scripts/review/p12-b04-auto-batch50.cjs","--batch=6","--out-dir="+out]);
  const batch=read(join(out,"batch-06-v1.json"));
  assert.equal(batch.source_count,50);
  assert.deepEqual(batch.records.map(x=>x.source_id),ledger.records.map(x=>x.source_id));
  assert.equal(new Set(ledger.records.map(x=>x.source_id)).size,50);
  assert.deepEqual([ledger.model_ready_for_formal_QA,ledger.science_kp_hold,ledger.source_score_annotation_projection_count],[47,3,12]);
  assert.deepEqual(ledger.records.filter(x=>x.exception_flags.length).map(x=>x.batch_ordinal),[5,6,50]);
  const sources=new Map();
  for(const row of ledger.records){
   if(!sources.has(row.original_source_archive_ref))sources.set(row.original_source_archive_ref,read(row.original_source_archive_ref));
   const paper=sources.get(row.original_source_archive_ref);
   const orig=paper.original_question_records.find(x=>x.source_id===row.source_id);
   assert.ok(orig,"not found in immutable original "+row.source_id);
   assert.deepEqual(orig.full_original_options_in_order.map(o=>o.label+o.text),row.original_options_in_order);
   assert.deepEqual(orig.answer_marker_pdf_bbox_pts_top_left,row.source_answer_bbox_pts_top_left);
   assert.equal(paper.original_pdf_sha256,row.source_pdf_sha256);
   if(row.source_score_annotation_intentionally_excluded){
    assert.notEqual(squish(orig.full_original_stem),squish(row.original_full_stem));
    assert.equal(noScore(orig.full_original_stem),noScore(row.original_full_stem));
    assert.equal(row.original_complete_stem_including_scoring_instruction,orig.full_original_stem);
   }else{
    assert.equal(squish(orig.full_original_stem),squish(row.original_full_stem));
   }
   assert.equal(row.scoreless_original_stem_projection_verified,true);
   assert.equal(orig.standalone_without_shared_figure_or_stimulus,true);
   assert.equal(row.formal_science_approved,false);
   assert.equal(row.formal_kp_approved,false);
   assert.equal(row.public_bank_admitted,false);
   if(!row.exception_flags.length)assert.ok(row.model_proposed_unique_answer&&row.independent_science_reasoning);
  }
  assert.equal(sources.size,5);
  assert.equal(ledger.records.filter(x=>x.source_score_annotation_intentionally_excluded).length,12);
 }finally{rmSync(out,{force:true,recursive:true});}
});
