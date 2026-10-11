import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {validateAuthority,unitsFor,resolveUnit} from "../site/assets/js/authority-adapter.mjs";
const db=JSON.parse(readFileSync("site/data/authority/science-g03-g04-selector-v2.json","utf8"));
test("187 canonical science KP from four semesters",()=>{validateAuthority(db);assert.equal(db.units.flatMap(x=>x.knowledge_points).length,187)});
test("unit counts and actual source titles for four terms",()=>{assert.deepEqual([3,4].flatMap(g=>[1,2].map(s=>unitsFor(db,g,s).map(u=>u.knowledge_points.length))),[[14,12,11,10],[12,12,12,13],[11,12,10,12],[12,11,12,11]])});
test("G03-S1 formal unit names are from verified source",()=>assert.deepEqual(unitsFor(db,3,1).map(x=>x.unit_title),["多采多姿的植物","生活中的力","奇妙的空氣","廚房裡的科學"]));
test("exact legacy and canonical KP ids maintain lineage",()=>{const u=resolveUnit(db,"4-S1-U02");assert.equal(u.knowledge_points[2].canonical_kp_id,"sci_g04s1_02_03");assert.equal(u.knowledge_points[2].title,"水生植物的四種生長型");assert.equal(resolveUnit(db,"3-S1-U02").knowledge_points[4].kp_id,"kx_g03s1_u02_kp05");assert.equal(resolveUnit(db,"3-S1-U99"),null)});
test("no public copyrighted statements or evidences in selector projection",()=>{for(const kp of db.units.flatMap(u=>u.knowledge_points)){assert.deepEqual(Object.keys(kp).sort(),["canonical_kp_id","kp_id","title"]);}});
test("fail closed for a missing unit, corrupted count, and duplicate ids",()=>{const x=structuredClone(db);x.units[0].knowledge_points.pop();assert.throws(()=>validateAuthority(x));const y=structuredClone(db);y.units[1].knowledge_points[0].canonical_kp_id=y.units[0].knowledge_points[0].canonical_kp_id;assert.throws(()=>validateAuthority(y));});
test("assessment scope remains U01/U02 and U03/U04",()=>{assert.deepEqual(db.assessment_scope,{MIDTERM:["U01","U02"],FINAL:["U03","U04"]})});

test("frozen exact source titles and ID lineage match all four uploaded authority JSONs",()=>{
  const checks=new Map([["3-1","2e67d173"],["3-2","29c25fc9"],["4-1","562c167c"],["4-2","7cf2bbf5"]]);
  for(const [scope,expected] of checks){
    const [grade,semester]=scope.split("-").map(Number);
    const text=db.units.filter(u=>u.grade===grade&&u.semester===semester).flatMap(u=>u.knowledge_points.map(k=>k.canonical_kp_id+"|"+k.kp_id+"|"+k.title+"\n")).join("");
    let h=2166136261;for(let i=0;i<text.length;i++){h^=text.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}
    assert.equal(h.toString(16).padStart(8,"0"),expected,scope+" original ZIP parity");
  }
});
