import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const rd=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const sh=rd("data/review/p12-g04s1-113-shihu-final-page1-mc15-exact-original-raster-bbox-v1.json");
const he=rd("data/review/p12-g04s1-113-post-pr175-native18-heshun50-scan5-212hold-b09gap42-v1.json");
const original=rd("data/review/p12-g04s1-113-missing15-scan5-original16page-raster-sha-262planning-only-v1.json");
const kp=rd("site/data/authority/science-g03-g04-selector-v3.json");
test("ShiHu FINAL009 15 original MC source glyph positions are contiguous and within source raster",()=>{
 assert.equal(sh.rectangles.length,15);
 assert.deepEqual(sh.rectangles.map(x=>x[0]),Array.from({length:15},(_,i)=>i+1));
 assert.equal(sh.original_pdf_sha256.length,64);
 assert.equal(sh.original_page_rgb_sha256,original.papers.find(p=>p.original_paper_id==="SCI_G04_S1_113_FINAL_009").pages[0].original_raster_rgb_sha256);
 assert.ok(sh.rectangles.every(([n,x0,y0,x1,y1])=>x0>=0&&y0>=0&&x0<x1&&y0<y1&&x1<=1457&&y1<=2064));
 assert.deepEqual([sh.original_printed_parentheses_visualQA_pass,sh.previous_exact_original_Heshun50,sh.additional_exact_ShiHu15],[15,50,15]);
 assert.equal(sh.remaining_four_scans_planning_count_after_source65,197);
});
test("Raster 65 source-gate locations never become student questions without Science KP and rights",()=>{
 assert.equal(he.status.Heshun_FINAL001_original_source_positions_raster_bbox_verified,50);
 assert.equal(he.status.scan5_frozen_prior_section_planning_positions,262);
 assert.equal(262-50-15,197);
 assert.equal(sh.operator_admission_ready_count,0);
 assert.equal(sh.published_new,0);
 assert.equal(sh.full_113114_duplicate_gate_completed,false);
 assert.equal(sh.science_unique_and_direct_frozen48_gate_completed,false);
 assert.equal(kp.units.filter(x=>x.grade===4&&x.semester===1).reduce((n,u)=>n+u.knowledge_points.length,0),48);
});
