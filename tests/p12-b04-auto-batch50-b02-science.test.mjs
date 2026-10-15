import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const report=read("data/review/p12-b04-auto-batch50-b02-first50-science-kp-review-v1.json");
const norm=x=>String(x??"").replace(/\s+/g,"");
test("B02 50 exact source IDs preserve frozen 409 partition and readback original stems/options/BBox",()=>{
 const out=mkdtempSync(join(tmpdir(),"science-b02-"));
 try{
  execFileSync(process.execPath,["scripts/review/p12-b04-auto-batch50.cjs","--batch=2","--out-dir="+out]);
  const b=read(join(out,"batch-02-v1.json"));
  assert.equal(b.records.length,50);
  assert.equal(report.count,50);
  assert.deepEqual(report.records.map(x=>x.source_id),b.records.map(x=>x.source_id));
  assert.equal(new Set(report.records.map(x=>x.source_id)).size,50);
  const anchors=new Map();
  for(const r of report.records){
   if(!anchors.has(r.source_archive_ref)){
    const j=read(r.source_archive_ref);
    anchors.set(r.source_archive_ref,{j,byId:new Map(j.original_question_records.map(q=>[q.source_id,q]))});
   }
   const {j,byId}=anchors.get(r.source_archive_ref),o=byId.get(r.source_id);
   assert.ok(o,"no original record "+r.source_id);
   assert.equal(norm(o.full_original_stem),norm(r.original_full_stem));
   assert.deepEqual(o.full_original_options_in_order.map(q=>q.label+q.text),r.original_options_in_order);
   assert.deepEqual(o.answer_marker_pdf_bbox_pts_top_left,r.source_pdf_bbox_pts_top_left);
   assert.equal(j.original_pdf_sha256,r.source_pdf_sha256);
   assert.ok(r.model_proposed_answer&&r.independent_science_reasoning);
   assert.equal(r.formal_science_approved,false);
   assert.equal(r.formal_kp_approved,false);
   assert.equal(r.public_admitted,false);
  }
  assert.equal(report.model_ready,43);
  assert.equal(report.exceptions,7);
  assert.deepEqual(report.records.filter(x=>x.exception_flags.length).map(x=>x.batch_item_ordinal),[18,26,29,30,32,33,41]);
  assert.equal(report.records.at(0).source_id,"SCI_G04_S1_114_MID_004|S02|MC|013");
  assert.equal(report.records.at(-1).source_id,"SCI_G04_S1_114_MID_006|S02|MC|012");
 }finally{rmSync(out,{recursive:true,force:true});}
});
