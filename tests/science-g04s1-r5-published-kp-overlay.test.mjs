import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {applyG04S1R5ApprovedKPLinks,R5_APPROVED_ADDITIVE_KP_LINKS} from "../site/assets/js/science-g04s1-r5-approved-kp-links.mjs";
import {validateAuthority} from "../site/assets/js/authority-adapter.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const old=read("site/data/authority/science-g03-g04-selector-v2.json");
const v3=read("site/data/authority/science-g03-g04-selector-v3.json");
const h=read("site/data/question-bank/p12-e01-heshun-mid15-public-v1.json").blocks;
const m=read("site/data/question-bank/p12-e01-post49-source2-public-v1.json").blocks;
const combined=[...h,...m];
const sourceKeys=["SCI_G04_S1_114_MID_002|S1|MC|010","SCI_G04_S1_114_MID_007|S01|TF|003"];
test("R5 only enriches the two already certified exact source slots, never re-admits",()=>{
 validateAuthority(v3);validateAuthority(old);
 const before=structuredClone(combined);
 const rows=applyG04S1R5ApprovedKPLinks(combined,v3);
 assert.equal(rows.length,17);
 assert.deepEqual(combined,before,"original public bank inputs must remain immutable");
 assert.deepEqual(rows.map(x=>x.id),combined.map(x=>x.id));
 assert.deepEqual(rows.map(x=>x.answer),combined.map(x=>x.answer));
 assert.deepEqual(rows.map(x=>x.canonical_kp_id),combined.map(x=>x.canonical_kp_id));
 assert.deepEqual(rows.map(x=>x.stem),combined.map(x=>x.stem));
 assert.deepEqual(R5_APPROVED_ADDITIVE_KP_LINKS.map(x=>x.source_slot_id),sourceKeys);
 const newRows=rows.filter(x=>x.kp_overlay_revision);
 assert.equal(newRows.length,2);
 assert.deepEqual(newRows.map(x=>x.secondary_canonical_kp_ids),[["sci_g04s1_02_13"],["sci_g04s1_01_12"]]);
 assert.equal(rows.some(x=>(x.secondary_canonical_kp_ids||[]).includes("sci_g04s1_02_14")),false);
});
test("R5 historical 187 selector retains old exact behavior",()=>{
 assert.equal(applyG04S1R5ApprovedKPLinks(combined,old),combined);
 assert.ok(combined.every(x=>!x.secondary_canonical_kp_ids));
});
test("R5 source SHA, BBox, answer, original KP, new authority & missing source are fail-closed",()=>{
 const idx=combined.findIndex(x=>x.source_slot_id===sourceKeys[0]);
 for(const mutate of [
  a=>{a[idx].answer="①";},
  a=>{a[idx].canonical_kp_id="sci_g04s1_02_13";},
  a=>{a[idx].source_pdf_sha256="0".repeat(64);},
  a=>{a[idx].source_pdf_bbox_pts_top_left=[1,2,3,4];},
  a=>{a[idx].stem="WRONG";},
  a=>{a.splice(idx,1);},
  a=>{a.push(structuredClone(a[idx]));},
 ]){
  const bad=structuredClone(combined);mutate(bad);
  assert.throws(()=>applyG04S1R5ApprovedKPLinks(bad,v3));
 }
 const wrongAuthority=structuredClone(v3);
 wrongAuthority.units.find(x=>x.grade===4&&x.semester===1&&x.unit_id==="U02").knowledge_points.pop();
 assert.throws(()=>applyG04S1R5ApprovedKPLinks(combined,wrongAuthority));
});
