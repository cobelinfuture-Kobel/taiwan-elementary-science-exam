import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {fileURLToPath} from "node:url";
import path from "node:path";
const root=path.resolve(fileURLToPath(new URL("../",import.meta.url)));
const read=f=>JSON.parse(readFileSync(path.join(root,f),"utf8"));
const native=read("data/review/p12-g04s1-113-missing15-native88-originalstem-options-47proposals41hold-v1.json");
const original=read("data/review/p12-g04s1-113-missing15-native5-107-original-glyph-bbox-19suppressed-88hold-v1.json");
const scans=read("data/review/p12-g04s1-113-missing15-scan5-original16page-raster-sha-262planning-only-v1.json");
const B09=read("data/review/p12-g04s1-113-b09-real8-native-parent-bbox-frozen48-scope-hold-v1.json");
const B08=read("data/review/p12-g04s1-113-b08-source50-17published-33hold-complete-closeout-v1.json");
const auth=read("site/data/authority/science-g03-g04-selector-v3.json");

test("Native88 original source positions recover 38 TF / 50 MC, 47 proposals remain nonformal",()=>{
  assert.deepEqual([native.summary.unpublished_native_original_positions,native.summary.unpublished_tf,native.summary.unpublished_mc],[88,38,50]);
  assert.equal(native.summary.unpublished_mc_four_text_options_recovered,48);
  assert.equal(native.summary.unpublished_mc_missing_complete_original_options_due_figures,2);
  assert.equal(native.summary.independent_science_unique_plus_KP_candidate_proposals_NOT_FORMAL,47);
  assert.equal(native.summary.remaining_without_safe_science_KP_proposal,41);
  assert.equal(native.summary.new_formal_science_KP_approved,0);
  assert.equal(native.summary.new_admission_ready,0);
  assert.equal(native.summary.new_published,0);
  assert.equal(original.source_records.filter(x=>!x.already_published_source_suppression).length,88);
  assert.equal(native.papers.reduce((n,x)=>n+x.unpublished_original_TFMC_positions,0),88);
});

test("Five original scans preserve 262 only as unverified section planning positions, 16 page raster digests",()=>{
  assert.equal(scans.summary.original_scan_papers,5);
  assert.equal(scans.summary.original_pages,16);
  assert.equal(scans.summary.existing_section_planning_positions_NOT_CHILD_CERTIFIED,262);
  assert.equal(scans.papers.reduce((n,x)=>n+x.prior_section_planning_slot_count_NOT_CERTIFIED,0),262);
  const pages=scans.papers.flatMap(x=>x.pages);
  assert.equal(pages.length,16);
  assert.ok(pages.every(x=>x.original_raster_rgb_sha256.length===64
    &&x.original_raster_width_px>1000&&x.original_raster_height_px>1500
    &&x.per_original_answer_slot_raster_bbox_px===null&&x.original_answer_bbox_fully_certified===false));
  assert.equal(scans.summary.exact_per_child_answer_bbox_accepted_new,0);
  assert.equal(scans.summary.annotation_red_components_for_navigation_ONLY,41);
  assert.equal(scans.summary.PUBLISHED_new,0);
});

test("Unpublished native88 original source IDs have no exact collision with any published source-slot ID",()=>{
  const target=original.source_records.filter(x=>!x.already_published_source_suppression);
  const bankDir=path.join(root,"site/data/question-bank");
  const names=readdirSync(bankDir).filter(n=>n.endsWith(".json"));
  const published=new Set();
  let inspected=0;
  function accept(q){if(!q||typeof q!=="object")return;
    for(const k of ["source_slot_id","source_original_slot_id"]){if(typeof q[k]==="string")published.add(q[k]);}
    if(Array.isArray(q.items))q.items.forEach(accept);
  }
  for(const name of names){const doc=read("site/data/question-bank/"+name);
    if(!doc.public_site_integrated&&doc.question_bank_status!=="PUBLIC"&&doc.question_bank_status!=="CERTIFIED")continue;
    inspected++; (doc.blocks??[]).forEach(accept);(doc.groups??[]).forEach(accept);
  }
  assert.ok(inspected>25,"published bank reads");
  const overlap=target.filter(q=>published.has(q.source_slot_id)||published.has(q.source_alias_id));
  console.log("MISSING15_NATIVE88_MAIN_EXACT_SOURCE_CROSSOVER",JSON.stringify(overlap.map(q=>({source_slot_id:q.source_slot_id,alias:q.source_alias_id}))));
  assert.equal(overlap.length,0,"Native88 current main published source-ID crossovers");
});

test("No B09 frozen8 scope inflation, no Frozen48 modification and no B01 to B08 publication change",()=>{
  assert.equal(B09.frozen_ledger_actual_position_count,8);
  assert.deepEqual(B09.verified_ordinals,[401,402,403,404,405,406,407,408]);
  assert.equal(B09.shortfall_to_requested_50,42);
  assert.equal(B08.formal_B08_cumulative.PUBLISHED,17);
  assert.equal(native.B01_to_B08_published_unmodified,true);
  assert.equal(scans.frozen48_unchanged,true);
  assert.equal(auth.units.filter(u=>u.grade===4&&u.semester===1).reduce((s,u)=>s+u.knowledge_points.length,0),48);
});
