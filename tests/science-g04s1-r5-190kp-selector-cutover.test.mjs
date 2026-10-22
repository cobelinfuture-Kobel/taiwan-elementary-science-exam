import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync} from "node:fs";
import {validateAuthority,unitsFor,resolveUnit} from "../site/assets/js/authority-adapter.mjs";
import {validateAndConvertP12113Native38} from "../site/assets/js/p12-g04s1-113-native38-release.mjs";
import {validateAndConvertP12113HN22} from "../site/assets/js/p12-g04s1-113-hn22-release.mjs";
import {validateAndConvertP12113B01Wende7} from "../site/assets/js/p12-g04s1-113-b01-wende7-standalone-release.mjs";
import {validateAndConvertP12113B02Native21} from "../site/assets/js/p12-g04s1-113-b02-native21-standalone-release.mjs";
import {validateAndConvertP12113B03Native27} from "../site/assets/js/p12-g04s1-113-b03-native27-standalone-release.mjs";
import {validateAndConvertP12113B04Native36} from "../site/assets/js/p12-g04s1-113-b04-native36-standalone-release.mjs";
import {validateAndConvertP12113B06Native16} from "../site/assets/js/p12-g04s1-113-b06-native16-standalone-release.mjs";
const read=p=>JSON.parse(readFileSync(p,"utf8"));
const legacy=read("site/data/authority/science-g03-g04-selector-v2.json");
const active=read("site/data/authority/science-g03-g04-selector-v3.json");
const shadow=read("data/governance/science-g04s1-kp-additive-r4-shadow-v1.json");
const remap=read("data/review/science-g04s1-kp-additive-r4-remap-queue-v1.json");
const newIds=["sci_g04s1_01_12","sci_g04s1_02_13","sci_g04s1_02_14"];
test("R5 187-KP frozen selector remains valid alongside additive 190-KP V3",()=>{
 assert.equal(validateAuthority(legacy),legacy);
 assert.equal(validateAuthority(active),active);
 assert.equal(legacy.counts.knowledge_points,187);
 assert.equal(active.counts.knowledge_points,190);
 assert.equal(legacy.schema_version,"SCIENCE_G03_G04_PUBLIC_SELECTOR_V2");
 assert.equal(active.schema_version,"SCIENCE_G03_G04_PUBLIC_SELECTOR_V3");
 assert.deepEqual(unitsFor(active,4,1).map(u=>u.knowledge_points.length),[12,14,10,12]);
 assert.equal(unitsFor(active,4,2).reduce((a,u)=>a+u.knowledge_points.length,0),46);
});
test("R5 exactly preserves original 187 KP titles/IDs and their order",()=>{
 assert.deepEqual(active.assessment_scope,legacy.assessment_scope);
 assert.equal(active.units.length,legacy.units.length);
 const added=[];
 for(const [i,original] of legacy.units.entries()){
   const current=active.units[i];
   assert.equal(current.grade,original.grade);
   assert.equal(current.semester,original.semester);
   assert.equal(current.unit_id,original.unit_id);
   assert.equal(current.unit_title,original.unit_title);
   assert.deepEqual(current.knowledge_points.slice(0,original.knowledge_points.length),original.knowledge_points);
   added.push(...current.knowledge_points.slice(original.knowledge_points.length));
 }
 assert.deepEqual(added.map(x=>x.canonical_kp_id),newIds);
 assert.deepEqual(added.map(x=>x.title),shadow.added_kps.map(x=>x.title));
 assert.deepEqual(added.map(x=>x.kp_id),shadow.added_kps.map(x=>x.kp_id));
 assert.equal(active.sources.find(x=>x.grade===4&&x.semester===1).sha256,shadow.private_v2.sha256);
 assert.equal(active.sources.find(x=>x.grade===3&&x.semester===1).sha256,legacy.sources.find(x=>x.grade===3&&x.semester===1).sha256);
 assert.equal(active.counts.knowledge_points-legacy.counts.knowledge_points,3);
});
test("R5 fail-closed when new KP missing or duplicated",()=>{
 const missing=structuredClone(active);
 missing.units.find(x=>x.grade===4&&x.semester===1&&x.unit_id==="U02").knowledge_points.pop();
 assert.throws(()=>validateAuthority(missing));
 const duplicate=structuredClone(active);
 const newItem=duplicate.units.find(x=>x.grade===4&&x.semester===1&&x.unit_id==="U01").knowledge_points.at(-1);
 newItem.canonical_kp_id="sci_g04s1_01_05";
 assert.throws(()=>validateAuthority(duplicate));
 const wrongSource=structuredClone(active);
 wrongSource.sources.find(x=>x.grade===4&&x.semester===1).sha256="b".repeat(64);
 assert.throws(()=>validateAuthority(wrongSource));
});
test("original R5 selector auto-admission forbidden; only exact independent source certifications can be newly admitted",()=>{
 const sourceFiles=readdirSync("site/data/question-bank").filter(name=>name.endsWith(".json"));
 const approved="p12-e01-post46-anhe-wind1-public-v1.json";
 const certified113="p12-g04s1-113-dongguang-dahua-native5-after105-public-v1.json";
 const certifiedNative38="p12-g04s1-113-native38-public-v1.json";
 const certifiedHN22="p12-g04s1-113-hn22-public-v1.json";
 const certifiedWendeB01Seven="p12-g04s1-113-b01-wende7-standalone-public-v1.json";
 const certifiedB02Native21="p12-g04s1-113-b02-native21-standalone-public-v1.json";
 const certifiedB03Native27="p12-g04s1-113-b03-native27-standalone-public-v1.json";
 const certifiedB04Native36="p12-g04s1-113-b04-native36-standalone-public-v1.json";
 const certifiedB06Native16="p12-g04s1-113-b06-native16-standalone-public-v1.json";
 assert.ok(sourceFiles.includes(approved),"explicit operator release record required");
 assert.ok(sourceFiles.includes(certified113),"new 113 original source certification required");
 for(const name of sourceFiles){
   const bytes=readFileSync("site/data/question-bank/"+name,"utf8");
   if(name===approved){
     const wind=read("site/data/question-bank/"+name);
     assert.equal(wind.blocks.length,1);
     assert.equal(wind.blocks[0].source_slot_id,"SCI_G04_S1_114_MID_006|S01|TF|004");
     assert.equal(wind.blocks[0].canonical_kp_id,"sci_g04s1_01_12");
     assert.equal(wind.blocks[0].operator_publication_approval,true);
     assert.equal(wind.blocks[0].original_teacher_answer_key_authenticated,false);
     assert.equal(bytes.includes("sci_g04s1_02_13"),false);
     assert.equal(bytes.includes("sci_g04s1_02_14"),false);
   } else if(name===certified113){
     const bank=read("site/data/question-bank/"+name);
     const evidence=read("data/review/p12-g04s1-113-dongguang-dahua-native5-after105-formal-evidence-v1.json");
     const exceptions=bank.blocks.filter(b=>b.canonical_kp_id==="sci_g04s1_02_13");
     assert.deepEqual(exceptions.map(b=>b.source_slot_id),[
       "SCI_G04_S1_113_MID_004|S02|TF|002",
       "SCI_G04_S1_113_MID_004|S02|TF|015"
     ]);
     assert.equal(evidence.formal_science_kp_approved_new,5);
     assert.equal(evidence.admission_ready_new,5);
     assert.equal(evidence.published_new_before_main_and_pages,0);
     assert.ok(exceptions.every(b=>b.operator_publication_approval===true&&b.original_teacher_answer_key_authenticated===false
       &&b.source_pdf_sha256==="2c46b169a7a41501aa9b1ec90d84d94c1100db801ebc671af949879ecbe5b8f5"
       &&b.source_page_pdf_1_based===1&&b.source_pdf_bbox_pts_top_left?.length===4));
     assert.equal(bytes.includes("sci_g04s1_01_12"),false);
     assert.equal(bytes.includes("sci_g04s1_02_14"),false);
   } else if(name===certifiedNative38){
     // Exact independent source and operator-signed approval, never selector-based KP auto-admission.
     const bank=read("site/data/question-bank/"+name);
     const manifest=read("data/review/p12-g04s1-113-native38-consolidated-admission-formal-v2.json");
     const checked=validateAndConvertP12113Native38(bank,active);
     assert.equal(checked.answerSlots,38);
     assert.equal(manifest.summary.explicit_final_operator_cohort_manifest_release_signoff,true);
     assert.equal(manifest.summary.admission_ready_new,38);
     assert.equal(manifest.summary.published_new,0);
     assert.equal(manifest.records.length,38);
     assert.ok(manifest.records.every(row=>row.operator_cohort_final_explicit_release_confirmation===true
       &&row.original_school_exam_header_visual_verified===true
       &&row.rights_verified===true));
   } else if(name===certifiedHN22){
     // Explicit original 113 source/answer/direct-KP/Article9/operator approval, not R5 selector-only auto-promotion.
     const bank=read("site/data/question-bank/"+name);
     const decision=read("data/review/p12-g04s1-113-hn22-operator-approved-formal-v3.json");
     assert.equal(validateAndConvertP12113HN22(bank,active).answerSlots,22);
     assert.equal(decision.summary.FORMAL_SCIENCE_KP_APPROVED_new,22);
     assert.equal(decision.summary.ADMISSION_READY_new,22);
     assert.equal(decision.summary.PUBLISHED_new_before_main_pages,0);
     assert.equal(decision.records.length,22);
     const supplemental=bank.blocks.filter(x=>x.canonical_kp_id==="sci_g04s1_01_12");
     assert.deepEqual(supplemental.map(x=>x.source_slot_id),["SCI_G04_S1_113_MID_006|S2|MC|007"]);
     assert.ok(supplemental.every(x=>x.operator_publication_approval===true
        &&x.original_teacher_answer_key_authenticated===false
        &&x.source_pdf_sha256?.length===64&&x.source_pdf_bbox_pts_top_left?.length===4));
     assert.equal(bytes.includes("sci_g04s1_02_13"),false);
     assert.deepEqual(bank.blocks.filter(x=>x.canonical_kp_id==="sci_g04s1_02_14").map(x=>x.source_slot_id),["SCI_G04_S1_113_MID_006|S1|TF|005","SCI_G04_S1_113_MID_006|S1|TF|009"]); // only operator-approved source, not R5 selector-based auto admission
   } else if(name===certifiedWendeB01Seven){
     // Only the seven exactly named, individually authorized original questions; no R5 selector auto-admission.
     const bank=read("site/data/question-bank/"+name);
     const proof=read("data/review/p12-g04s1-113-b01-7standalone-operator-approved-formal-v1.json");
     const checked=validateAndConvertP12113B01Wende7(bank,active);
     assert.equal(checked.answerSlots,7);
     assert.equal(proof.records.length,7);
     assert.equal(proof.formal_before_merge.FORMAL_SCIENCE_KP_APPROVED_new,7);
     assert.equal(proof.formal_before_merge.ADMISSION_READY_new,7);
     assert.equal(proof.formal_before_merge.PUBLISHED_new,0);
     assert.deepEqual(bank.blocks.map(b=>b.source_slot_id),proof.records.map(r=>r.original_source_id));
     assert.ok(bank.blocks.every(b=>b.operator_publication_approval===true&&b.original_teacher_answer_key_authenticated===false&&b.source_pdf_sha256==="7bb7a6439ef21566d45739656180d800c925d9d46598eededbd3b32396c86a56"&&b.source_pdf_bbox_pts_top_left?.length===4));
     assert.deepEqual(bank.blocks.filter(b=>b.canonical_kp_id==="sci_g04s1_02_13").map(b=>b.source_slot_id),["SCI_G04_S1_113_MID_001|S01|TF|014"]);
     assert.deepEqual(bank.blocks.filter(b=>b.canonical_kp_id==="sci_g04s1_02_14").map(b=>b.source_slot_id),["SCI_G04_S1_113_MID_001|S01|TF|015","SCI_G04_S1_113_MID_001|S02|MC|011"]);
     assert.equal(bytes.includes("sci_g04s1_01_12"),false);
   } else if(name===certifiedB02Native21){
     // Only the 21 named original B02 source IDs expressly accepted by operator, not selector driven R5 automatic admission.
     const bank=read("site/data/question-bank/"+name);
     const approval=read("data/review/p12-g04s1-113-b02-exact21-operator-approved-formal-v1.json");
     const checked=validateAndConvertP12113B02Native21(bank,active);
     assert.equal(checked.answerSlots,21);
     assert.equal(checked.standaloneTf,15);
     assert.equal(checked.standaloneChoice,6);
     assert.equal(approval.formal_before_merge.FORMAL_SCIENCE_KP_APPROVED_new,21);
     assert.equal(approval.formal_before_merge.ADMISSION_READY_new,21);
     assert.equal(approval.formal_before_merge.PUBLISHED_new,0);
     assert.deepEqual(bank.blocks.map(b=>b.source_slot_id),approval.records.map(r=>r.source_id));
     assert.ok(bank.blocks.every(b=>b.operator_publication_approval===true
       &&b.original_teacher_answer_key_authenticated===false
       &&b.public_material_scope==="EXAM_QUESTION_TEXT_ONLY"
       &&b.source_pdf_sha256?.length===64&&b.source_pdf_bbox_pts_top_left?.length===4));
     assert.equal(bank.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_004|S2|TF|11"),false,"B01 Dongguang duplicate must be suppressed");
   } else if(name===certifiedB03Native27){
     const bank=read("site/data/question-bank/"+name);
     const gate=read("data/review/p12-g04s1-113-b03-exact27-operator-approved-formal-v1.json");
     const checked=validateAndConvertP12113B03Native27(bank,active);
     assert.deepEqual([checked.answerSlots,checked.standaloneTf,checked.standaloneChoice],[27,10,17]);
     assert.deepEqual([gate.formal_before_live.FORMAL_SCIENCE_KP_APPROVED_new,gate.formal_before_live.ADMISSION_READY_new,gate.formal_before_live.PUBLISHED_new],[27,27,0]);
     assert.deepEqual(bank.blocks.map(x=>x.source_slot_id),gate.records.map(x=>x.source_id));
     assert.ok(bank.blocks.every(x=>x.operator_publication_approval===true
       &&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
       &&x.original_teacher_answer_key_authenticated===false
       &&x.original_cropped_assets_included===false));
     assert.ok(!bank.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_009|S2|MC|15"));
     assert.ok(!bank.blocks.some(x=>x.source_slot_id?.startsWith("SCI_G04_S1_113_MID_010|S1|TF|")));
   } else if(name===certifiedB04Native36){
     const bank=read("site/data/question-bank/"+name);
     const proof=read("data/review/p12-g04s1-113-b04-exact36-operator-approved-formal-v1.json");
     const checked=validateAndConvertP12113B04Native36(bank,active);
     assert.deepEqual([checked.answerSlots,checked.standaloneTf,checked.standaloneChoice],[36,22,14]);
     assert.deepEqual([proof.formal_before_live.FORMAL_SCIENCE_KP_APPROVED_new,proof.formal_before_live.ADMISSION_READY_new,proof.formal_before_live.PUBLISHED_new],[36,36,0]);
     assert.deepEqual(bank.blocks.map(x=>x.source_slot_id),proof.records.map(x=>x.source_id));
     assert.ok(bank.blocks.every(x=>x.operator_publication_approval===true
        &&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
        &&x.original_teacher_answer_key_authenticated===false
        &&x.original_cropped_assets_included===false));
     assert.ok(!bank.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_014|S1|TF|2"));
     assert.ok(!bank.blocks.some(x=>x.source_slot_id==="SCI_G04_S1_113_MID_015|S1|TF|5"));
   } else if(name===certifiedB06Native16){
     // Independent B06 precise 16-source operator admission. Not an automatic R5 KP selector remap.
     const bank=read("site/data/question-bank/"+name);
     const approval=read("data/review/p12-g04s1-113-b06-exact16-operator-approved-formal-v1.json");
     const admitted=validateAndConvertP12113B06Native16(bank,active);
     assert.deepEqual([admitted.answerSlots,admitted.standaloneTf,admitted.standaloneChoice],[16,5,11]);
     assert.deepEqual(approval.formal_before_live,{FORMAL_SCIENCE_KP_APPROVED_new:16,ADMISSION_READY_new:16,PUBLISHED_new:0});
     assert.equal(approval.operator_approved_exact16,true);
     assert.deepEqual(bank.blocks.map(x=>x.source_slot_id),approval.records.map(x=>x.original_source_slot_id));
     assert.deepEqual(bank.blocks.filter(x=>x.canonical_kp_id==="sci_g04s1_02_14").map(x=>x.source_slot_id),
       ["SCI_G04_S1_113_MID_018|S2|MC|11"]);
     assert.equal(bank.blocks.some(x=>x.canonical_kp_id==="sci_g04s1_01_12"||x.canonical_kp_id==="sci_g04s1_02_13"),false);
     assert.ok(bank.blocks.every(x=>x.operator_publication_approval===true
       &&x.original_teacher_answer_key_authenticated===false
       &&x.original_cropped_assets_included===false
       &&x.rights_license_status==="REGULATED_EXAM_QUESTION_ART9"
       &&x.source_pdf_sha256?.length===64&&x.source_pdf_bbox_pts_top_left?.length===4));
   } else for(const id of newIds)assert.equal(bytes.includes(id),false,name+" must not auto-admit "+id);
 }
 assert.equal(remap.public_admission_count,0);
 assert.equal(remap.published_question_changes,0);
 assert.equal(remap.known_exact_candidate_matches[0].source_visual_bbox_certified,false);
 assert.equal(remap.known_exact_candidate_matches[0].site_admitted,false);
 assert.equal(active.authority_revision.activation_level,"EXAM_SELECTOR_ONLY_NO_QUESTION_REMAP");
 assert.equal(active.authority_revision.new_question_admission_count,0);
 assert.equal(resolveUnit(active,"4-S1-U02").knowledge_points.at(-1).title,"水域調查安全與尊重水生生物");
});
test("V3 projection publishes no private statement or textbook quote",()=>{
 for(const unit of active.units)for(const kp of unit.knowledge_points)
   assert.deepEqual(Object.keys(kp).sort(),["canonical_kp_id","kp_id","title"]);
});
