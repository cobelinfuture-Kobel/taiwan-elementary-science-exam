import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const review=read("data/review/p12-b04-auto-batch50-b07-first50-science-kp-review-v1.json");
const norm=s=>String(s??"").replace(/\s+/g,"");
const noScore=s=>norm(s).replace(/\(\d+分\)/g,"");
test("B07 fifty frozen source IDs preserve five source partitions; hold scan-only PDF BBox and lilies KP",()=>{
 const tmp=mkdtempSync(join(tmpdir(),"p12-b07-"));
 try{
  execFileSync(process.execPath,["scripts/review/p12-b04-auto-batch50.cjs","--batch=7","--out-dir="+tmp],{encoding:"utf8"});
  const b=read(join(tmp,"batch-07-v1.json"));
  assert.equal(b.source_count,50);
  assert.equal(review.source_positions,50);
  assert.deepEqual(b.records.map(x=>x.source_id),review.records.map(x=>x.source_id));
  assert.equal(new Set(review.records.map(x=>x.source_id)).size,50);
  assert.equal(review.ready_for_formal_gate,31);
  assert.equal(review.source_or_semantic_hold,19);
  assert.equal(review.scanned_visual_bbox_reconfirmation_required,19);
  assert.equal(review.source_scoreless_instruction_projection_count,15);
  assert.deepEqual(review.records.filter(x=>x.exception_flags.length).map(x=>x.batch_ordinal),Array.from({length:19},(_,i)=>32+i));
  const sourceFiles=new Map();
  for(const r of review.records){
   if(!sourceFiles.has(r.original_source_archive_ref))sourceFiles.set(r.original_source_archive_ref,read(r.original_source_archive_ref));
   const p=sourceFiles.get(r.original_source_archive_ref);
   const orig=p.original_question_records.find(q=>q.source_id===r.source_id);
   assert.ok(orig,"original source absent "+r.source_id);
   assert.equal(noScore(orig.full_original_stem),noScore(r.student_scoreless_stem_projection));
   assert.equal(orig.full_original_stem,r.full_original_stem_including_parent_instructions);
   assert.deepEqual(orig.full_original_options_in_order.map(o=>o.label+o.text),r.original_options_in_order);
   assert.deepEqual(orig.answer_marker_pdf_bbox_pts_top_left??null,r.source_bbox_pts_top_left);
   assert.equal(p.original_pdf_sha256,r.source_pdf_sha256);
   assert.equal(orig.standalone_without_shared_figure_or_stimulus,true);
   assert.equal(r.site_admitted,false);
   assert.equal(r.formal_science_approved,false);
   assert.equal(r.formal_kp_approved,false);
   if(r.batch_ordinal>=32){
    assert.ok(r.source_pdf_scan_only);
    assert.ok(r.exception_flags.includes("SCANNED_PDF_VISUAL_ESTIMATE_BBOX_REQUIRES_MANUAL_PIXEL_EXACT_ACCEPTANCE"));
   }else{
    assert.equal(r.source_pdf_scan_only,false);
    assert.equal(r.exception_flags.length,0);
    assert.ok(r.model_independently_reasoned_answer);
   }
  }
  assert.equal(sourceFiles.size,4);
 }finally{rmSync(tmp,{recursive:true,force:true});}
});
