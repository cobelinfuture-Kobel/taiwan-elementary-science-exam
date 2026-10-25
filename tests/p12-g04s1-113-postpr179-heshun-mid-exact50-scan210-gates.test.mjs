import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const get=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const prefix="data/review/";
const prev=get(prefix+"p12-g04s1-113-postpr178-heshunmid-28-original-144dpi-printed-response-bbox-v1.json");
const added=get(prefix+"p12-g04s1-113-postpr179-heshun-mid28plus22-50-full-source-answer-geometry-v1.json");
const scan=get(prefix+"p12-g04s1-113-missing15-scan5-original16page-raster-sha-262planning-only-v1.json");
const auth=get("site/data/authority/science-g03-g04-selector-v3.json");
test("Original Heshun MID source real response locations are 28+22=50, no printed example slot",()=>{
 assert.equal(prev.source_original_answer_printed_pixel_boxes.length,28);
 assert.equal(added.source_original_response_locations.length,22);
 const a=prev.source_original_answer_printed_pixel_boxes.map(row=>row.slice(0,4).join("/"));
 const b=added.source_original_response_locations.map(row=>"1/"+row.slice(0,3).join("/"));
 assert.equal(new Set([...a,...b]).size,50);
 assert.ok(!b.includes("1/S1/1/5"),"first animal respiratory cell is a printed school example");
 assert.equal(added.section_counts.ANIMAL_BLANK_TABLE_CELLS,7);
 assert.equal(added.section_counts.AQUATIC_PLANT_BLANK_TABLE_CELLS,8);
 assert.equal(added.section_counts.LUNAR_QUESTION_ORIGINAL_PRINTED_RESPONSE_GLYPHS,7);
});
test("Original full-page hash and 144dpi bbox bounds validated and nonpublished",()=>{
 const h=scan.papers.find(x=>x.original_paper_id==="SCI_G04_S1_113_MID_002");
 assert.ok(h);
 assert.equal(added.original_pdf_sha256,h.original_pdf_sha256);
 assert.equal(added.original_page_rgb_sha256,h.pages[0].original_raster_rgb_sha256);
 for(const [section,parent,child,type,rect] of added.source_original_response_locations){
  assert.equal(section,"S1");assert.ok(parent>=1&&parent<=3);
  assert.ok(Number.isInteger(child)&&rect.length===4);
  const [x0,y0,x1,y1]=rect;
  assert.ok(0<=x0&&x0<x1&&x1<=2380&&0<=y0&&y0<y1&&y1<=1682);
 }
 assert.equal(added.new_scan5_cumulative_original_answer_bbox,210);
 assert.equal(added.old_scan5_262_section_planning_difference_remaining_NONCERTIFIED,52);
 assert.equal(added.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(added.ADMISSION_READY_new,0);
 assert.equal(added.PUBLISHED_new,0);
 assert.equal(auth.units.filter(u=>u.grade===4&&u.semester===1).reduce((n,u)=>n+u.knowledge_points.length,0),48);
});
