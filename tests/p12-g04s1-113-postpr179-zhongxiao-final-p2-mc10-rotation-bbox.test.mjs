import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const d=read("data/review/p12-g04s1-113-postpr179-zhongxiao-final-p2-mc10-original-rotation-bbox-v1.json");
const old=read("data/review/p12-g04s1-113-postpr178-native6-scan183-b09fixed8-gap42-appendonly-v1.json");
const freeze=read("site/data/authority/science-g03-g04-selector-v3.json");
test("Zhongxiao ten section-four MC source parentheses have exact original PDF pixel BBoxes with lossless rotation transform",()=>{
 assert.equal(d.source_records.length,10);
 assert.equal(d.original_rgb_144dpi_sha256.length,64);
 assert.deepEqual(d.source_records.map(x=>x.source_print_number),Array.from({length:10},(_,i)=>i+1));
 const ids=new Set();
 for(const q of d.source_records){
  let a=q.original_printed_parentheses_bbox_upright_CCW_144dpi_px;
  let v=q.original_printed_parentheses_bbox_original_unrotated_144dpi_px;
  assert.deepEqual(v,[2382-a[3],a[0],2382-a[1],a[2]]);
  assert.ok(v[0]<v[2]&&v[1]<v[3]&&v[0]>=0&&v[1]>=0&&v[2]<=2382&&v[3]<=1684);
  const id=q.original_pdf_page_1based+"/"+q.section+"/"+q.source_print_number;assert.ok(!ids.has(id));ids.add(id);
 }
 assert.equal(d.prior_scan_source_exact_pixel_BBoxes,188);
 assert.equal(d.cumulative_exact_source_pixel_BBoxes,198);
 assert.equal(d.difference_of_old_planning_positions_NOT_certified_questions,64);
});
test("FROZEN KP, B09, and release gates cannot be inflated by the source geometry",()=>{
 assert.equal(freeze.units.filter(x=>x.grade===4&&x.semester===1).reduce((s,x)=>s+x.knowledge_points.length,0),48);
 assert.equal(d.FORMAL_SCIENCE_KP_APPROVED_new,0);
 assert.equal(d.ADMISSION_READY_new,0);
 assert.equal(d.PUBLISHED_new,0);
 assert.equal(d.no_B01_to_B08_reopen,true);
});
