import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const rd=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const prefix="data/review/";
const native=rd(prefix+"p12-g04s1-113-postpr177-native9-science-directkp-rights-exception-by-source-v1.json");
const sh1=rd(prefix+"p12-g04s1-113-shihu-final-page1-mc15-exact-original-raster-bbox-v1.json");
const sh23=rd(prefix+"p12-g04s1-113-shihu-final-p2-24-p3-4-original-raster-bbox-sourceonly-v1.json");
const ne1=rd(prefix+"p12-g04s1-113-neianmid-original-page1-tf9-mc14-raster-source23-v1.json");
const ne2=rd(prefix+"p12-g04s1-113-neianmid-original-page2-18-source-parent-raster-bbox-v1.json");
const ne34=rd(prefix+"p12-g04s1-113-neianmid-p3-9-p4-12-original-raster-answer-bbox-v1.json");
const h1=rd(prefix+"p12-g04s1-113-heshunfinal-page1-pixelbbox-checkpoint-v1.json");
const h2=rd(prefix+"p12-g04s1-113-heshunfinal-page2-14-printed-bbox-visualqa-v1.json");
const h3=rd(prefix+"p12-g04s1-113-heshunfinal-scan-page1-9-page2-circuit4-source-bbox-v1.json");
const scan=rd(prefix+"p12-g04s1-113-missing15-scan5-original16page-raster-sha-262planning-only-v1.json");
const b09=rd(prefix+"p12-g04s1-113-b09-real8-native-parent-bbox-frozen48-scope-hold-v1.json");
const checkpoint=rd(prefix+"p12-g04s1-113-postpr177-native9-scan155-b09fixed8-gap42-checkpoint-v1.json");
const authority=rd("site/data/authority/science-g03-g04-selector-v3.json");
test("Exactly 155 visually traced source raster answer rectangles, no 262 section-planning inflation",()=>{
 const counts=[h1.positions.length,h2.original_source_geometries.length,h3.positions.length,sh1.rectangles.length,
 sh23.pages[0].slots.length,sh23.pages[1].slots.length,ne1.exact_printed_parentheses_pixel_bbox_with_original_visual_overlay.length,
 ne2.rows.length,ne34.pages[0].source_response_positions.length,ne34.pages[1].source_response_positions.length];
 assert.deepEqual(counts,[23,14,13,15,24,4,23,18,9,12]);
 assert.equal(counts.reduce((x,y)=>x+y,0),155);
 assert.deepEqual(checkpoint.scan5.per_original_paper_answer_pixel_bbox_certified,{
 SCI_G04_S1_113_FINAL_001:50,SCI_G04_S1_113_FINAL_009:43,SCI_G04_S1_113_MID_006:62});
 assert.equal(checkpoint.scan5.remaining_section_plan_positions_NOT_exact_answer_bbox,107);
 assert.equal(checkpoint.scan5.original_section_plan_total_NOT_true_slot_denominator,262);
});
test("New Shihu and Neian source rectangles remain pixel-grounded, unique, and correctly linked to original scan page hashes",()=>{
 const nScan=scan.papers.find(x=>x.original_paper_id==="SCI_G04_S1_113_MID_006");
 const sScan=scan.papers.find(x=>x.original_paper_id==="SCI_G04_S1_113_FINAL_009");
 assert.ok(nScan&&sScan);
 assert.equal(ne1.original_raster_rgb_144dpi_sha256,nScan.pages[0].original_raster_rgb_sha256);
 assert.equal(ne2.raster_sha256,nScan.pages[1].original_raster_rgb_sha256);
 ne34.pages.forEach(p=>assert.equal(p.source_raster_rgb_sha256,nScan.pages[p.original_page_1based-1].original_raster_rgb_sha256));
 sh23.pages.forEach(p=>assert.equal(p.rgb_sha256,sScan.pages[p.page-1].original_raster_rgb_sha256));
 const ns=[...ne1.exact_printed_parentheses_pixel_bbox_with_original_visual_overlay.map(x=>["P1",...x]),
 ...ne2.rows.map(x=>["P2",...x.slice(0,3),...x.slice(4)]),
 ...ne34.pages.flatMap(p=>p.source_response_positions.map(x=>["P"+p.original_page_1based,...x.slice(0,3),...x.slice(4)]))];
 assert.equal(ns.length,62);
 assert.equal(new Set(ns.map(x=>x.slice(0,4).join("/"))).size,62);
 assert.ok(ns.every(x=>{let b=x.slice(4);return b.length===4&&b.every(Number.isFinite)&&b[0]<b[2]&&b[1]<b[3]&&b[0]>=0&&b[1]>=0&&b[2]<=1457&&b[3]<=2064}));
 assert.equal(sh23.pages.reduce((n,x)=>n+x.slots.length,0),28);
 assert.ok(sh23.pages.flatMap(x=>x.slots).every(x=>x.slice(3).length===4&&x.slice(3).every(Number.isFinite)));
});
test("Native9 independent supported-six are not certified or published; three material science/KP holds remain",()=>{
 assert.equal(native.records.length,9);
 const s=native.stats;
 assert.equal(s.independent_science_direct_frozenKP_supported,6);
 assert.equal(s.science_assumptions_hold,1);
 assert.equal(s.direct_kp_scope_hold,2);
 assert.equal(s.exact_operator_release_authorized,0);
 assert.ok(native.records.every(q=>q.original_native_answer_blank_bbox_pts.length===4&&q.source_sha256.length===64));
 assert.ok(native.records.every(q=>!q.FORMAL_SCIENCE_KP_APPROVED&&!q.ADMISSION_READY&&!q.PUBLISHED));
 assert.equal(s.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(s.ADMISSION_READY_new,0);
 assert.equal(s.PUBLISHED_new,0);
});
test("Frozen48 and B09 fixed original8 remain intact; no source/subject inflation",()=>{
 assert.equal(authority.units.filter(x=>x.grade===4&&x.semester===1).reduce((n,u)=>n+u.knowledge_points.length,0),48);
 assert.equal(b09.records.length,8);
 assert.deepEqual(checkpoint.b09_authority.original_ordinals,[401,402,403,404,405,406,407,408]);
 assert.equal(checkpoint.b09_authority.missing_extra_source_IDs_not_authorized,42);
 assert.equal(checkpoint.b09_authority.new_exact_source_authority_cleared,0);
 assert.equal(checkpoint.no_B01_to_B08_reopen,true);
 assert.deepEqual(checkpoint.formal_metrics_new,{FORMAL_SCIENCE_KP_APPROVED:0,ADMISSION_READY:0,PUBLISHED:0});
});
