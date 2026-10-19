import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAndConvertP12113HN22} from "../site/assets/js/p12-g04s1-113-hn22-release.mjs";
const read=p=>JSON.parse(readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const bank=read("site/data/question-bank/p12-g04s1-113-hn22-public-v1.json");
const approval=read("data/review/p12-g04s1-113-hn22-operator-approved-formal-v3.json");
const authority=read("site/data/authority/science-g03-g04-selector-v3.json");
const sourceRows=new Map(approval.records.map(x=>[x.source_slot_id,x]));
test("22 explicitly operator-approved 113 source exact TFMC remain immutable, direct frozen48 science, bbox, Article9 TEXT only, no numeric scoring",()=>{
 const v=validateAndConvertP12113HN22(bank,authority);
 assert.deepEqual([v.answerSlots,v.standaloneTf,v.standaloneChoice,v.contextGroups],[22,11,11,0]);
 assert.equal(approval.operator_approval_input_verbatim,"核准 V2 精確 22 題清冊正式發布，續跑 PR／CI／Pages 驗收。");
 assert.equal(approval.summary.FORMAL_SCIENCE_KP_APPROVED_new,22);
 assert.equal(approval.summary.ADMISSION_READY_new,22);
 assert.equal(approval.summary.PUBLISHED_new_before_main_pages,0);
 assert.equal(approval.records.length,22);
 assert.equal(bank.expected_answer_slots,22);
 const unique=new Set(), source=new Set();
 for(const b of bank.blocks){
  assert.ok(!unique.has(b.source_slot_id));unique.add(b.source_slot_id);source.add(b.source_id);
  assert.equal(b.original_cropped_assets_included,false);
  assert.equal(b.original_teacher_answer_key_authenticated,false);
  assert.equal(b.copyright_path,"SCHOOL_EXAM_QUESTION_TEXT_ONLY_NO_THIRD_PARTY_IMAGES");
  assert.equal(b.operator_publication_approval,true);
  assert.equal(b.certification_status,"OPERATOR_APPROVED_PUBLIC");
  assert.match(b.source_pdf_sha256,/^[a-f0-9]{64}$/);
  const r=sourceRows.get(b.source_slot_id);assert.ok(r);
  assert.deepEqual(r.original_exact_bbox_pts,b.source_pdf_bbox_pts_top_left);
  assert.equal(r.original_exam_sha256,b.source_pdf_sha256);
  assert.equal(r.canonical_kp_id,b.canonical_kp_id);
  assert.equal(r.science_unique_answer_and_direct_KP_formal_accepted,true);
  assert.equal(r.original_113_114_dedup_complete,true);
  assert.equal(r.operator_exact_cohort_release_approved,true);
  assert.equal(r.admission_ready,true);
  assert.equal(r.published,false);
  assert.ok(!("score" in b)&&!("points" in b)&&!("weight" in b)&&!("scoring" in b));
  assert.ok(!b.stem.includes("每題 2 分"));
  if(b.type==="mcq"){
   assert.deepEqual(b.options.map(o=>o[0]),["①","②","③","④"]);
   assert.ok(["①","②","③","④"].includes(b.answer));
  }else{
   assert.ok(["O","X"].includes(b.answer));
   assert.equal("options" in b,false);
  }
 }
 assert.deepEqual(source,new Set(["SCI_G04_S1_113_FINAL_001","SCI_G04_S1_113_MID_006"]));
 assert.equal(unique.has("SCI_G04_S1_113_MID_006|S2|MC|002"),false);
});
test("new 22 original source IDs are unique against each previously released public question shard; no verbatim stem+options duplicate",()=>{
 const newSource=new Set(bank.blocks.map(x=>x.source_slot_id));
 const norm=s=>String(s||"").normalize("NFKC").replace(/[\s，。、：；？！「」『』()（）]/g,"");
 const key=x=>norm(x.stem)+"|"+(x.options||[]).map(norm).join("|");
 const newText=new Set(bank.blocks.map(key));
 assert.equal(newText.size,22);
 for(const name of readdirSync(new URL("../site/data/question-bank/",import.meta.url)).filter(x=>x.endsWith(".json")&&x!=="p12-g04s1-113-hn22-public-v1.json")){
  const data=read("site/data/question-bank/"+name);
  for(const b of (data.blocks||[]).flatMap(x=>x.items||[x])){
   if(b.source_slot_id)assert.ok(!newSource.has(b.source_slot_id),name+": repeated source slot "+b.source_slot_id);
   if(b.stem)assert.ok(!newText.has(key(b)),name+": exact prior student content "+b.id);
  }
 }
});
test("source STEM / options / science / rights / operator changes fail-closed in strict HN22 fingerprint gate",()=>{
 const edits=[
  x=>x.blocks[0].stem+="！",x=>x.blocks[0].answer="X",
  x=>x.blocks.find(y=>y.type==="mcq").options[0]="①覆寫",
  x=>x.blocks[0].source_pdf_bbox_pts_top_left[0]+=0.1,
  x=>x.blocks[0].source_pdf_sha256="0".repeat(64),
  x=>x.blocks[0].canonical_kp_id="sci_g04s1_01_01",
  x=>x.blocks[0].operator_publication_approval=false,
  x=>x.blocks[0].original_cropped_assets_included=true,
  x=>x.blocks[0].rights_license_status="UNKNOWN",
  x=>x.blocks[0].source_slot_id="SCI_G04_S1_113_MID_006|S2|MC|002",
  x=>x.expected_answer_slots=23,x=>x.public_site_integrated=false
 ];
 for(const edit of edits){const broken=structuredClone(bank);edit(broken);assert.throws(()=>validateAndConvertP12113HN22(broken,authority));}
});
