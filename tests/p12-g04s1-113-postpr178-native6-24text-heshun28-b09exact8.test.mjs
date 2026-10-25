import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
const load = path => JSON.parse(readFileSync(new URL("../"+path,import.meta.url),"utf8"));
const root="data/review/";
const native=load(root+"p12-g04s1-113-postpr178-native6-24native-text-5scan-full29-dedup-gap-operator-roster-v1.json");
const h=load(root+"p12-g04s1-113-postpr178-heshunmid-28-original-144dpi-printed-response-bbox-v1.json");
const rec=load(root+"p12-g04s1-113-postpr178-native6-scan183-b09fixed8-gap42-appendonly-v1.json");
const old=load(root+"p12-g04s1-113-missing15-scan5-original16page-raster-sha-262planning-only-v1.json");
const b09=load(root+"p12-g04s1-113-b09-real8-native-parent-bbox-frozen48-scope-hold-v1.json");
const authority=load("site/data/authority/science-g03-g04-selector-v3.json");
test("Native6 exact source roster is not an approved admission cohort",()=>{
 assert.equal(native.source_coverage.frozen_113_school_original_pdf_count,29);
 assert.equal(native.source_coverage.accessible_original_text_corpus_count,24);
 assert.equal(native.source_coverage.scan_only_PDFs_without_native_text_or_individual_semantic_coverage,5);
 assert.equal(native.proposed_six_source_id_rows.length,6);
 assert.equal(new Set(native.proposed_six_source_id_rows.map(x=>x.source_id)).size,6);
 assert.ok(native.proposed_six_source_id_rows.every(x=>!x.FORMAL_SCIENCE_KP_APPROVED&&!x.ADMISSION_READY&&!x.PUBLISHED));
 assert.equal(native.source_coverage.full29_semantic_duplicate_formal_gate_complete,false);
 assert.deepEqual(native.formal_metrics_new,{FORMAL_SCIENCE_KP_APPROVED:0,ADMISSION_READY:0,PUBLISHED:0});
});
test("Heshun MID original raster 28 source printed parenthesis boxes exact page pixels SHA",()=>{
 assert.equal(h.source_original_answer_printed_pixel_boxes.length,28);
 assert.deepEqual(h.original_page_raster_dimensions_px,[2380,1682]);
 assert.equal(h.original_pdf_sha256,old.papers.find(x=>x.original_paper_id==="SCI_G04_S1_113_MID_002").original_pdf_sha256);
 const p=old.papers.find(x=>x.original_paper_id==="SCI_G04_S1_113_MID_002");
 assert.deepEqual(h.original_page_rgb_sha256,p.pages.map(x=>x.original_raster_rgb_sha256));
 const q=h.source_original_answer_printed_pixel_boxes;
 assert.equal(new Set(q.map(x=>x.slice(0,4).join("/"))).size,28);
 for(const [page,section,parent,child,type,x0,y0,x1,y1] of q){
  assert.ok([1,2,3].includes(page));
  assert.ok(["S2","S3","S4","S5"].includes(section));
  assert.ok(Number.isInteger(parent)&&Number.isInteger(child));
  assert.ok(["MC","TF","READING_MC","SURVEY_TICK","MOON_CHART_SHORT"].includes(type));
  assert.ok(0<=x0&&x0<x1&&x1<=2380&&0<=y0&&y0<y1&&y1<=1682);
 }
 assert.equal(h.total_183_scan_source_pixel_bbox,183);
 assert.equal(h.remaining_79_section_planning_difference_NOT_CERTIFIED,79);
});
test("B09 remains eight exact source positions; 42 not invented",()=>{
 assert.equal(b09.records.length,8);
 assert.deepEqual(rec.B09.existing_exact_frozen_source_lane_ordinals,[401,402,403,404,405,406,407,408]);
 assert.equal(rec.B09.requested_non_frozen_gap_unauthorized,42);
 assert.equal(rec.B09.newly_verified_operator_admissible_B09_source_IDs,0);
 assert.equal(rec.student_bank_files_modified,0);
 assert.equal(rec.no_B01_to_B08_reopen,true);
 assert.equal(authority.units.filter(x=>x.grade===4&&x.semester===1).reduce((a,x)=>a+x.knowledge_points.length,0),48);
 assert.deepEqual(rec.official_new_metrics,{FORMAL_SCIENCE_KP_APPROVED:0,ADMISSION_READY:0,PUBLISHED:0});
});


test("Zhongxiao rotated original PDF BBox and ShiHu line-matching parent are fail-closed",()=>{
 const z=load(root+"p12-g04s1-113-postpr178-zhongxiao-final-page1-5MC-rotation-aware-exact-raster-bbox-v1.json");
 const sh=load(root+"p12-g04s1-113-postpr178-shihu-page1-original-line-matching-parent-hold-v1.json");
 assert.equal(z.original_MC_printed_answer_blank_boxes.length,5);
 assert.deepEqual(z.original_MC_printed_answer_blank_boxes.map(x=>x[0]),[1,2,4,5,7]);
 const orig=old.papers.find(x=>x.original_paper_id==="SCI_G04_S1_113_FINAL_002");
 assert.equal(z.original_pdf_sha256,orig.original_pdf_sha256);
 assert.equal(z.source_original_raster_rgb_sha256,orig.pages[0].original_raster_rgb_sha256);
 for(const [num,rot,src] of z.original_MC_printed_answer_blank_boxes){
  assert.equal(rot.length,4);
  assert.deepEqual(src,[rot[1],1684-rot[2],rot[3],1684-rot[0]]);
  assert.ok(src[0]>=0&&src[2]<=2382&&src[1]>=0&&src[3]<=1684);
 }
 assert.equal(sh.source_exact_child_raster_bbox_accepted,0);
 assert.equal(sh.source_answer_line_slots_no_distinct_parentheses,true);
 assert.equal(sh.ADMISSION_READY_new,0);
 assert.equal(rec.source_global_statistics.source_exact_bbox_cumulative,188);
 assert.equal(rec.source_global_statistics.planning_count_difference_not_accepted_as_exact_remaining,74);
 assert.equal(z.PUBLISHED_new,0);
});
