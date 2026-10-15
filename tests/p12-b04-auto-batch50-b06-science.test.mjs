import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const review=read("data/review/p12-b04-auto-batch50-b06-first50-science-kp-review-v1.json");
const norm=s=>String(s??"").replace(/\s+/g,"");
test("B06 fifty exact frozen source positions; only 12 original group-score annotations differ",()=>{
 const tmp=mkdtempSync(join(tmpdir(),"b04-b06-"));
 try{
  execFileSync(process.execPath,["scripts/review/p12-b04-auto-batch50.cjs","--batch=6","--out-dir="+tmp],{encoding:"utf8"});
  const b=read(join(tmp,"batch-06-v1.json"));
  assert.equal(b.source_count,50);
  assert.deepEqual(review.records.map(x=>x.source_id),b.records.map(x=>x.source_id));
  assert.equal(new Set(review.records.map(x=>x.source_id)).size,50);
  assert.equal(review.model_ready_for_formal_review,45);
  assert.equal(review.hold_count,5);
  assert.equal(review.source_score_annotation_only_delta_verified,12);
  assert.deepEqual(review.records.filter(x=>x.hold_flags.length).map(x=>x.ordinal),[5,6,11,35,46]);
  const files=new Map();
  for(const row of review.records){
   if(!files.has(row.original_source_archive_ref))files.set(row.original_source_archive_ref,read(row.original_source_archive_ref));
   const src=files.get(row.original_source_archive_ref),original=src.original_question_records.find(x=>x.source_id===row.source_id);
   assert.ok(original,"missing archived original for "+row.source_id);
   const full=original.full_original_stem;
   if(row.score_only_transcription_delta){
    assert.equal(full,row.source_archive_full_stem_including_points);
    assert.equal(norm(full.replace(/\(\d+\s*分\)/g,"")),norm(row.original_full_stem));
   }else assert.equal(norm(full),norm(row.original_full_stem));
   assert.deepEqual(original.full_original_options_in_order.map(o=>o.label+o.text),row.original_options_in_order);
   assert.deepEqual(original.answer_marker_pdf_bbox_pts_top_left,row.source_answer_marker_bbox_pts_top_left);
   assert.equal(src.original_pdf_sha256,row.source_pdf_sha256);
   assert.equal(original.standalone_without_shared_figure_or_stimulus,true);
   assert.equal(row.science_formal_approval,false);
   assert.equal(row.kp_formal_approval,false);
   assert.equal(row.public_admitted,false);
  }
  assert.equal(files.size,5);
  assert.equal(review.records.filter(x=>x.score_only_transcription_delta).length,12);
 }finally{rmSync(tmp,{recursive:true,force:true});}
});
