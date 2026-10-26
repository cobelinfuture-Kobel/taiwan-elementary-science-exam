import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const rd=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const x=rd("data/review/p12-g04s1-113-postpr180-zhongxiao-final-page2-mc4-check14-pixelbbox-v1.json");
const prev=rd("data/review/p12-g04s1-113-postpr179-zhongxiao-final-p2-mc10-original-rotation-bbox-v1.json");
test("Zhongxiao final p2 correct source visual counts and rotation inverse",()=>{
 assert.equal(x.source_records.length,18);
 assert.equal(x.source_records.filter(q=>q.source_section==="S4").length,4);
 assert.equal(x.source_records.filter(q=>q.source_section==="S5").length,14);
 assert.equal(prev.source_records.length,10);
 assert.deepEqual(x.source_records.filter(q=>q.source_section==="S4").map(q=>q.parent_number),[11,12,13,14]);
 assert.equal(new Set(x.source_records.map(q=>[q.source_section,q.parent_number,q.child_number].join("/"))).size,18);
 for(const q of x.source_records){
  const b=q.bbox_upright_px, a=q.bbox_original_unrotated_px;
  assert.deepEqual(a,[2382-b[3],b[0],2382-b[1],b[2]]);
  assert.ok(a[0]>=0&&a[1]>=0&&a[0]<a[2]&&a[1]<a[3]&&a[2]<=2382&&a[3]<=1684);
 }
 assert.equal(x.source_raster_rgb_144dpi_sha256,prev.original_rgb_144dpi_sha256);
 assert.equal(x.scan5_source_bbox_new_total,216);
 assert.equal(x.new_FORMAL_SCIENCE_KP_APPROVED,0);
 assert.equal(x.new_ADMISSION_READY,0);
 assert.equal(x.new_PUBLISHED,0);
});
