import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {execFileSync} from "node:child_process";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const norm=s=>String(s??"").normalize("NFKC").replace(/\\s+/gu,"");
const scoreless=s=>String(s??"").replace(/[（(]每個答案\\s*\\d+\\s*分[）)]/gu,"").replace(/[（(]\\s*\\d+\\s*分\\s*[）)]/gu,"");
const files=[
 "data/review/p12-b04-auto-batch50-b08-first50-science-kp-review-v1.json",
 "data/review/p12-b04-auto-batch50-b09-last9-science-kp-review-v1.json"
];
test("B08 50+B09 9 frozen source IDs; no scanned PDF answer BBox may be admitted",()=>{
 const tmp=mkdtempSync(join(tmpdir(),"p12-b08-b09-"));
 try{
  execFileSync(process.execPath,["scripts/review/p12-b04-auto-batch50.cjs","--out-dir="+tmp],{encoding:"utf8"});
  const reviews=files.map(read),expected=[read(join(tmp,"batch-08-v1.json")),read(join(tmp,"batch-09-v1.json"))];
  assert.deepEqual(reviews.map(r=>r.source_positions),[50,9]);
  assert.deepEqual(reviews.map(r=>r.new_public_admissions),[0,0]);
  assert.deepEqual(reviews.map(r=>r.formal_gate_ready),[0,0]);
  assert.deepEqual(reviews.map(r=>r.scan_only_visual_bbox_unverified),[50,9]);
  assert.deepEqual(reviews.map(r=>r.exact_source_projection_parent_score_preserved),[6,0]);
  assert.deepEqual(reviews.map(r=>r.duplicate_hold),[2,0]);
  assert.deepEqual(reviews.map(r=>r.additional_science_or_kp_semantic_hold),[3,0]);
  assert.deepEqual(reviews.map(r=>r.teacher_answer_key_authenticated),[false,false]);
  const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
  const kpIds=new Set(authority.units.filter(u=>u.grade===4&&u.semester===1).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id)));
  const origFiles=new Map(),ids=new Set();
  for(let b=0;b<2;b++){
   const r=reviews[b],e=expected[b];
   assert.equal(r.records.length,e.records.length);
   assert.deepEqual(r.records.map(x=>x.source_id),e.records.map(x=>x.source_id));
   for(const [i,row] of r.records.entries()){
    const p=e.records[i];
    assert.ok(!ids.has(row.source_id));ids.add(row.source_id);
    assert.equal(row.batch_ordinal,i+1);
    assert.equal(row.original_source_archive_ref,p.original_source_ref);
    assert.equal(row.source_content_ref,p.source_content_ref);
    if(!origFiles.has(row.original_source_archive_ref))origFiles.set(row.original_source_archive_ref,read(row.original_source_archive_ref));
    const source=origFiles.get(row.original_source_archive_ref);
    const original=source.original_question_records.find(q=>q.source_id===row.source_id);
    assert.ok(original);
    assert.equal(source.original_pdf_sha256,row.source_pdf_sha256);
    assert.equal(source.source_pdf_text_layer_available,false);
    assert.equal(source.native_text_glyph_bboxes_available,false);
    assert.equal(source.license_status,"REGULATED_EXAM_QUESTION_ART9");
    assert.equal(source.regulated_exam_identity_verified,true);
    assert.equal(source.third_party_content_clearance,"NO_THIRD_PARTY_COPY");
    assert.equal(original.article9_exam_question_text_only,true);
    assert.equal(original.standalone_without_shared_figure_or_stimulus,true);
    assert.equal(original.full_original_stem,row.full_original_stem_including_parent_instructions);
    assert.equal(norm(scoreless(original.full_original_stem)),norm(row.student_scoreless_stem_projection));
    assert.equal(row.source_parent_score_annotation_removed_for_student_view,
      norm(original.full_original_stem)!==norm(row.student_scoreless_stem_projection));
    assert.deepEqual(original.full_original_options_in_order??[],row.original_options_in_order);
    assert.deepEqual(original.answer_marker_pdf_bbox_pts_upright_visual_estimate??null,row.original_visual_bbox_estimate_not_for_admission);
    assert.deepEqual(row.source_pdf_pages,p.source_pdf_pages);
    assert.equal(row.source_pdf_scan_only,true);
    assert.equal(row.native_pdf_answer_marker_bbox_certified,false);
    assert.equal(row.review_state,"SOURCE_VISUAL_BBOX_HOLD");
    assert.equal(row.site_admitted,false);
    assert.equal(row.formal_science_approved,false);
    assert.equal(row.formal_kp_approved,false);
    assert.equal(kpIds.has(row.proposed_canonical_kp_id),true);
    assert.equal(typeof row.science_explanation,"string");
    assert.ok(row.science_explanation.trim().length>=6);
    assert.ok(row.exception_flags.includes("SCAN_ONLY_PDF_NO_NATIVE_GLYPH_BBOX_PIXEL_EXACT_RECONFIRMATION_REQUIRED"));
    if(row.question_type==="TRUE_FALSE")assert.ok(["O","X"].includes(row.model_independently_reasoned_answer));
    else assert.ok(row.original_options_in_order.some(o=>o.label===row.model_independently_reasoned_answer));
   }
  }
  assert.equal(ids.size,59);
  assert.equal(origFiles.size,3);
  assert.deepEqual(reviews[0].records.filter(x=>x.cross_source_duplicate_of).map(x=>x.batch_ordinal),[15,27]);
  assert.deepEqual(reviews[0].records.filter(x=>x.kp_semantic_attention.length).map(x=>x.batch_ordinal),[2,5,34]);
  assert.deepEqual(reviews[0].records.filter(x=>x.source_parent_score_annotation_removed_for_student_view).map(x=>x.batch_ordinal),[38,39,40,41,42,43]);
 }finally{rmSync(tmp,{recursive:true,force:true});}
});
