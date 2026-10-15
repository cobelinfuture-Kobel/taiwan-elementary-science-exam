import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync, mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const b01=read("data/review/p12-b04-auto-batch50-b01-first50-science-review-v1.json");
test("B01 first50 independent science readback matches deterministic 409 frozen queue IDs",()=>{
 const dir=mkdtempSync(join(tmpdir(),"b04-b01-"));
 try{
  execFileSync(process.execPath,["scripts/review/p12-b04-auto-batch50.cjs","--batch=1","--out-dir="+dir]);
  const manifest=read(join(dir,"batch-01-v1.json"));
  assert.equal(manifest.source_count,50);
  assert.equal(b01.source_positions_reviewed,50);
  assert.deepEqual(b01.records.map(r=>r.source_id),manifest.records.map(r=>r.source_id));
  assert.equal(b01.model_reasoned_without_immediate_quality_hold,47);
  assert.equal(b01.source_exceptions,3);
  assert.deepEqual(b01.records.filter(x=>x.operator_exception_required).map(x=>x.batch_item_ordinal),[32,42,48]);
  assert.ok(b01.records.every(x=>x.site_admitted===false&&x.science_answer_formal_approval===false&&x.kp_formal_approval===false));
  assert.ok(b01.records.filter(x=>!x.operator_exception_required).every(x=>x.model_proposed_answer && x.independent_model_science_reasoning));
  for(const r of b01.records){
   const original=read(r.original_source_archive_ref);
   const row=original.original_question_records.find(x=>x.source_id===r.source_id);
   assert.ok(row,"missing historical source evidence");
   assert.equal(row.full_original_stem??row.original_item_stem,r.original_full_stem);
   assert.deepEqual(row.full_original_options_in_order.map(o=>o.label+o.text),r.original_options_in_order);
   assert.deepEqual(row.answer_marker_pdf_bbox_pts_top_left,r.original_answer_marker_bbox_pts_top_left);
  }
  const printed=b01.records.find(x=>x.batch_item_ordinal===48);
  assert.deepEqual(printed.original_options_in_order.map(s=>s[0]),["①","②","②","④"]);
 }finally{rmSync(dir,{recursive:true,force:true});}
});
