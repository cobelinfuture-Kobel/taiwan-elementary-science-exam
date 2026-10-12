import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {fileURLToPath} from "node:url";
import {resolve} from "node:path";
import {buildMaster} from "./p12-master-progress.mjs";

const root=resolve(fileURLToPath(new URL("..",import.meta.url)));
const read=p=>JSON.parse(readFileSync(resolve(root,p),"utf8"));
const raw=p=>readFileSync(resolve(root,p),"utf8");
const approvalPath="data/review/p12-g03s2final-fishbowl-operator-science-adjudication-v1.json";
const correctionPath="data/review/p12-g03s2final-composite-p03-q03-science-correction-v1.json";
const sourcePath="data/review/p12-g03s2final-46-final-source-acceptance-v1.json";
const stagePath="data/staging/p12-g03s2final-46-learner-blocks-v1.json";
const reportPath="data/review/p12-g03s2final-46-a4-visual-acceptance-v1.json";
const sha="078806660f9673fd3e677c25afb348e0e3e9cc97fe866d94c91f1a370a33b793";
const id="G03-S2-FINAL|COMPOSITE|P03|003";
function must(c,m){assert.ok(c,"P12_G03S2FINAL_PREPUBLIC_INVALID: "+m);}
const kpSet=(auth,u)=>new Set(auth.units.filter(x=>x.grade===3&&x.semester===2&&x.unit_id===u).flatMap(x=>x.knowledge_points.map(y=>y.canonical_kp_id)));
export function verifyG03S2FinalPrepublic(){
 const approval=read(approvalPath),correction=read(correctionPath),source=read(sourcePath);
 const stage=read(stagePath),a4=read(reportPath);
 const figures=read("data/review/p12-g03s2final-figure-reconstruction-v1.json");
 const readings=read("data/review/p12-g03s2final-reading-groups-v1.json");
 const authority=read("site/data/authority/science-g03-g04-selector-v2.json");
 const events=read("site/data/governance/p12-review-events.json");
 const bankLoader=raw("site/assets/js/historical-bank-ox-v6.mjs");
 const prepublicFiles=[approval,correction,source,stage,a4,figures,readings];
 must(prepublicFiles.every(x=>x.source_pdf_sha256===sha||x.original_source_pdf_sha256===sha),"source PDF SHA mismatch");
 must(approval.decision==="APPROVE_CURVED_FISHBOWL_SCIENCE_ANSWER_X"
  &&approval.approved_source_slot_id===id
  &&approval.old_independent_model_answer==="O"&&approval.approved_learner_answer==="X"
  &&approval.primary_canonical_kp_id==="sci_g03s2_04_06"
  &&approval.approval_scope==="ONLY_G03S2FINAL_COMPOSITE_P03_Q03_SCIENCE_ADJUDICATION","source science approval mismatch");
 must(approval.bulk_46_public_admission_approved===false
  &&approval.published_question_bank_change_approved===false
  &&approval.current_public_slots_must_remain===205
  &&approval.teacher_answer_key_authenticated===false,"science approval must never imply public admission");
 must(correction.old_independent_model_answer==="O"
  &&correction.new_proposed_learner_answer==="X"
  &&correction.new_approved_learner_answer==="X"
  &&correction.operator_science_adjudication_ref===approvalPath
  &&correction.operator_science_adjudication_received===true
  &&correction.public_release_approved===false
  &&correction.original_source_question_and_image_unchanged===true,"science correction record conflict");
 must(source.assessed_source_answer_slots===46&&source.teacher_key_authenticated_count===0
  &&source.items.length===46&&source.previously_published_source_tf_count===8,"source acceptance scope altered");
 const reviewed=new Map(source.items.map(x=>[x.source_slot_id,x]));
 must(reviewed.size===46&&reviewed.get(id)?.independent_science_answer==="O"
  &&reviewed.get(id)?.source_canonical_kp_id===approval.primary_canonical_kp_id,"preserve source original O");
 must(stage.expected_blocks===28&&stage.expected_answer_slots===46
  &&stage.expected_singles===20&&stage.expected_figure_groups===6&&stage.expected_reading_groups===2
  &&stage.blocks.length===28&&stage.public_site_integrated===false
  &&stage.operator_public_release_approved===false
  &&stage.original_school_answer_key_authenticated===false
  &&stage.operator_science_adjudication_ref===approvalPath
  &&stage.science_correction_pending_operator_adjudication_slots.length===0
  &&stage.science_correction_adjudicated_source_slots.length===1
  &&stage.science_correction_adjudicated_source_slots[0]===id,"candidate inventory/science status mismatch");
 const blockIds=new Set(),seen=new Set(),counts={TF:0,MC:0,COMPOSITE:0,READ:0};
 const kp3=kpSet(authority,"U03"),kp4=kpSet(authority,"U04");
 for(const block of stage.blocks){
  must(!blockIds.has(block.id),"repeated block "+block.id);blockIds.add(block.id);
  must(block.source_id==="G03-S2-FINAL"&&block.source_pdf_sha256===sha
    &&["3-S2-U03","3-S2-U04"].includes(block.unit)
    &&(block.unit==="3-S2-U03"?kp3:kp4).has(block.canonical_kp_id)
    &&block.public_release_authorized===false
    &&block.source_original_teacher_key_authenticated===false,"block identity or public scope "+block.id);
  const items=block.type==="group"?block.items:[block];
  must(Array.isArray(items)&&items.length>0,"group empty "+block.id);
  for(const item of items){
   const old=reviewed.get(item.source_slot_id);
   must(old&&!seen.has(item.source_slot_id),"source slot duplicated/not from original "+item.source_slot_id);seen.add(item.source_slot_id);
   const section=item.source_slot_id.split("|")[1];must(Object.hasOwn(counts,section),"unrecognized source section");
   counts[section]++;
   const kp=block.unit==="3-S2-U03"?kp3:kp4;
   must(item.canonical_kp_id===old.source_canonical_kp_id&&kp.has(item.canonical_kp_id)
     &&typeof item.stem==="string"&&item.stem.trim()
     &&typeof item.answer_explanation==="string"&&item.answer_explanation.trim(),"canonical KP/prompt mismatch "+item.source_slot_id);
   if(item.source_slot_id===id){
     must(item.answer==="X"&&old.independent_science_answer==="O"
      &&item.operator_science_adjudication_ref===approvalPath
      &&item.science_answer_status==="OPERATOR_SCIENCE_ADJUDICATED_X__NOT_PUBLIC"
      &&item.source_original_anchor.includes("曲面")
      &&item.pre_correction_source_anchor_summary==="直壁小魚缸","approved one-item exception not traced");
   }else must(item.answer===old.independent_science_answer,"unauthorized answer drift "+item.source_slot_id);
   if(item.type==="tf")must(["O","X"].includes(item.answer),"invalid O/X "+item.source_slot_id);
   if(item.type==="mcq"){
     must(Array.isArray(item.options)&&item.options.length===4
      &&["①","②","③","④"].includes(item.answer)
      &&item.options.every((x,i)=>x.startsWith(["①","②","③","④"][i])),"invalid single-choice "+item.source_slot_id);
   }
   if(item.type==="short"){
     must(block.type==="group"&&Array.isArray(block.shared.choiceBank)&&block.shared.choiceBank.some(x=>x.startsWith(item.answer+" ")),"group code not in choice bank "+item.source_slot_id);
   }
  }
 }
 must(seen.size===46&&Object.values(counts).reduce((a,b)=>a+b,0)===46,"46 source slots missing");
 must(JSON.stringify(counts)===JSON.stringify({TF:6,MC:14,COMPOSITE:22,READ:4}),"source section counts");
 for(let n=2;n<=9;n++)must(!seen.has("G03-S2-FINAL|TF|P01|"+String(n).padStart(3,"0")),"P11 published TF duplicated");
 const visual=stage.blocks.filter(x=>x.type==="group"&&x.figure_spec),readingBlocks=stage.blocks.filter(x=>x.type==="group"&&!x.figure_spec);
 must(visual.length===6&&visual.reduce((n,x)=>n+x.items.length,0)===22
  &&readingBlocks.length===2&&readingBlocks.reduce((n,x)=>n+x.items.length,0)===4,"atomic groups not retained");
 must(figures.figure_groups.length===6&&readings.reading_groups.length===2
  &&figures.figure_status.includes("SCIENCE_ADJUDICATED"),"figure/reading contracts");
 for(const b of visual){
  const g=figures.figure_groups.find(x=>x.block_id===b.id);
  must(g&&g.source_position_count===b.items.length
   &&b.figure_spec.labels.length===b.items.length
   &&b.figure_spec.viewBox==="0 0 460 236"
   &&b.figure_spec.preserveAspectRatio==="xMidYMid meet"
   &&g.source_answers.join("|")===b.items.map(x=>x.answer).join("|"),"figure label/answer drift "+b.id);
 }
 const fish=visual.find(x=>x.id==="P12_G03S2FINAL_COMPOSITE_P03");
 must(fish.figure_spec.labels[2]==="曲面小魚缸"&&fish.items.map(x=>x.answer).join(",")==="O,X,X,O"
  &&fish.operator_science_adjudication_approved===true
  &&fish.science_correction_pending_public_approval===true,"fishbowl figure/teacher-key boundary");
 must(readingBlocks.every(x=>x.shared?.passage&&x.items.every(y=>y.type==="mcq"&&y.options.length===4))
  &&readingBlocks[1].shared.passage.includes("不表示每一年都完全相同"),"source-context reading");
 const cloud=stage.blocks.find(x=>x.source_slot_id==="G03-S2-FINAL|MC|P01|006");
 must(cloud?.answer==="①"&&cloud.editorial_status==="SELF_CONTAINED_CLOUD_READING_RECONSTRUCTION","source-referenced reading must be independent");
 must(a4.decision==="A4_TECHNICAL_PASS_SCIENCE_ADJUDICATED_STAGED_ONLY"
  &&a4.operator_science_correction_approved===true
  &&a4.operator_science_adjudication_ref===approvalPath
  &&a4.pedagogical_holds.length===0
  &&a4.science_adjudications.length===1
  &&a4.science_adjudications[0].source_slot_id===id
  &&a4.operator_public_approval===false,"A4 acceptance not reconciled");
 const geometry=a4.actual_browser_acceptance,artifact=a4.artifact_readback;
 must(a4.actual_blocks_reviewed===28&&a4.answer_slots_reviewed===46
  &&geometry.actual_browser_question_count==="28/28 PASS"
  &&geometry.actual_answer_slots==="46/46 PASS"
  &&geometry.svg_proportion_check==="PASS"
  &&geometry.svg_within_column_check==="PASS"
  &&geometry.two_column_print_geometry==="PASS"
  &&geometry.correct_answer_mapping.includes("EXPLICIT_OVERRIDDEN_SOURCE_INFERENCE")
  &&artifact.observed_pdf_count===28&&artifact.observed_png_count===28
  &&artifact.all_pdf_two_pages==="PASS","prior actual A4 acceptance missing");
 must(!bankLoader.includes("p12-g03s2final-46-learner-blocks-v1.json")
  &&!bankLoader.includes("p12-g03s2final-46-public"),"staging accidentally added to live loader");
 must(events.events.length===274
  &&events.events.filter(x=>x.action==="PUBLIC_ADMIT").length===57
  &&events.events.filter(x=>x.source_slot_id.startsWith("G03-S2-FINAL")&&x.action==="PUBLIC_ADMIT").length===0,"publication events changed");
 const lastEvents=new Map(events.events.map(x=>[x.source_slot_id,x]));
 must([...seen].every(x=>lastEvents.get(x)?.action==="CERTIFY_STAGED"),"one of 46 source slots not staged");
 const master=buildMaster();
 const row=master.paper_rows.find(x=>x.source_id==="G03-S2-FINAL");
 must(master.public_question_bank_answer_slots_current===205
  &&master.p12_operator_published_slots===57
  &&master.position_status_counts.certified_staged===46
  &&master.position_status_counts.not_started===223
  &&master.position_status_counts.blocked===0
  &&row.certified_staged===46&&row.published===0&&row.pending_remaining===0,"current P12 master drift");
 return {prepublic:"PASS_READY_FOR_SEPARATE_OPERATOR_PUBLIC_ADMISSION",blocks:28,sourceAnswerSlots:46,correctedAnswer:"X",explicitSourceException:id,figureGroups:6,figureSlots:22,readingGroups:2,readingSlots:4,existingPublicSlots:205,targetIfSeparatelyApproved:251,publicAdmission:false,a4ProofRun:a4.evidence_workflow_run_id};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 console.log("P12_G03S2FINAL_46_PREPUBLIC_PREFLIGHT_PASS",JSON.stringify(verifyG03S2FinalPrepublic()));
}
