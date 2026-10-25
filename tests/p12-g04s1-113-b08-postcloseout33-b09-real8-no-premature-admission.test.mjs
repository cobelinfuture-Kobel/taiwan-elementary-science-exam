import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const b08=read("data/review/p12-g04s1-113-b08-postcloseout-33hold-exact-parent-gates-no-fake-admission-v1.json");
const b09=read("data/review/p12-g04s1-113-b09-real8-native-parent-bbox-frozen48-scope-hold-v1.json");
const base=read("data/review/p12-g04s1-113-b08-source50-17published-33hold-complete-closeout-v1.json");
const auth=read("site/data/authority/science-g03-g04-selector-v3.json");

test("B08 all 33 HOLD have unchanged original source ID/page/BBox and are not silently published",()=>{
  assert.equal(b08.records.length,33);
  assert.deepEqual(b08.records.map(x=>x.ordinal),base.all_hold33_ordinals);
  assert.ok(b08.records.every(x=>x.original_pdf_sha256.length===64 && x.inherited_answer_bbox_pdf_pts.length===4 && x.pdf_page_1_based>=1));
  assert.ok(b08.records.every(x=>x.science_formally_approved===false && x.admission_ready===false && x.published===false));
  assert.equal(new Set([...b08.records.map(x=>x.ordinal),...base.all_published_B08_ordinals]).size,50);
  assert.deepEqual([b08.counts.NEW_FORMAL_SCIENCE_KP_APPROVED,b08.counts.NEW_ADMISSION_READY,b08.counts.NEW_PUBLISHED],[0,0,0]);
  assert.equal(b08.counts.current_B08_PUBLISHED,17);
});
test("B08 grounded exception statuses do not force unique science answers or unrelated KP",()=>{
  const by=new Map(b08.records.map(x=>[x.ordinal,x]));
  assert.equal(by.get(351).science_answer_if_read,"震度");
  assert.equal(by.get(352).science_answer_if_read,"花蓮縣");
  assert.equal(by.get(351).decision,"HOLD_NO_DIRECT_FROZEN48_KP");
  assert.equal(by.get(352).decision,"HOLD_NO_DIRECT_FROZEN48_KP");
  assert.deepEqual(by.get(368).possible_codes,["B","C"]);
  assert.deepEqual(by.get(369).possible_codes,["A","D"]);
  assert.ok([353,354,355].every(i=>by.get(i).science_unique===false));
  assert.equal(b08.records.filter(x=>x.decision==="HOLD_MOON_OUTSIDE_FROZEN48_MIDTERM").length,13);
  assert.equal(b08.records.filter(x=>x.decision==="HOLD_SOURCE_FIGURE_RECONSTRUCTION").length,6);
  assert.equal(b08.records.filter(x=>x.decision==="HOLD_ORDERED_CIRCUIT_FIGURE").length,4);
});
test("B09 frozen original source queue is only eight, no invented extra forty-two",()=>{
  assert.equal(b09.frozen_ledger_actual_position_count,8);
  assert.deepEqual(b09.verified_ordinals,[401,402,403,404,405,406,407,408]);
  assert.equal(b09.shortfall_to_requested_50,42);
  assert.equal(b09.do_not_invent_new_source_ids,true);
  assert.equal(b09.records.length,8);
  assert.equal(new Set(b09.records.map(x=>x.source_id)).size,8);
  assert.deepEqual([b09.source_B09_scores.FORMAL_SCIENCE_KP_APPROVED_NEW,
     b09.source_B09_scores.ADMISSION_READY_NEW,b09.source_B09_scores.PUBLISHED_NEW],[0,0,0]);
});
test("B09 exact native geometry does not turn text anchors into seven forged answer BBoxes",()=>{
  const [moon,...acid]=b09.records;
  assert.deepEqual(moon.native_pdf_geometry.answer_bbox_pdf_pts,[410.83,923.29,452.95,937.33]);
  assert.equal(moon.native_pdf_geometry.answer_bbox_certified,true);
  assert.ok(moon.hold_reason.includes("MOON_KP"));
  assert.equal(acid.length,7);
  assert.ok(acid.every(x=>x.native_pdf_geometry.answer_bbox_certified===false && x.native_pdf_geometry.child_line_bbox_pdf_pts===null));
  assert.ok(acid.every(x=>x.hold_reason.includes("ACID_BASE_KP")));
  assert.equal(b09.source_B09_scores.NATIVE_ORIGINAL_ANSWER_BBOX_CONFIRMED,1);
});
test("B08 and B09 exceptions cannot mutate 113 G04S1 frozen KP or existing student bank",()=>{
  assert.equal(b08.frozen48_unchanged,true);
  assert.equal(b09.no_student_bank_change,true);
  assert.equal(b09.published_B08_17_untouched,true);
  assert.equal(b09.hold_B08_33_untouched,true);
  assert.equal(b08.no_B01_B07_reopen,true);
  assert.deepEqual(auth.units.filter(x=>x.grade===4&&x.semester===1).map(x=>x.unit_id),["U01","U02","U03","U04"]);
  const titles=auth.units.filter(x=>x.grade===4&&x.semester===1).flatMap(x=>x.knowledge_points.map(q=>q.title)).join("|");
  assert.equal(/月相|月亮觀測|酸鹼/.test(titles),false);
});
