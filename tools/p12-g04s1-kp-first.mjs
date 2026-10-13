// P12 G04 S1: canonical KP-first item eligibility, independent of the original paper's exam label.
// Not a science-answer verifier or a public-admission bypass.
export function buildG04S1KPIndex(authority){
 const units=authority.units.filter(x=>x.grade===4&&x.semester===1&&["U01","U02","U03","U04"].includes(x.unit_id));
 if(units.length!==4||units.reduce((n,u)=>n+u.knowledge_points.length,0)!==45)
  throw Error("G04_S1_KP_FIRST_AUTHORITY_MISMATCH");
 const index=new Map();
 for(const u of units)for(const k of u.knowledge_points){
  if(index.has(k.canonical_kp_id))throw Error("DUPLICATE_G04S1_KP");
  index.set(k.canonical_kp_id,{unit_id:u.unit_id,exam_routing:["U01","U02"].includes(u.unit_id)?"CURRENT_MID":"CURRENT_FINAL"});
 }
 return index;
}
export function classifyG04S1SourcePosition(question,authority){
 const index=buildG04S1KPIndex(authority);
 const matched=question.matched_canonical_kp_ids??[];
 if(!Array.isArray(matched)||matched.some(x=>typeof x!=="string"))throw Error("INVALID_KP_MATCH_ARRAY");
 const unknown=matched.filter(x=>!index.has(x));
 if(unknown.length)return {decision:"REVIEW_KP_UNCERTAIN",retain_source:true,publication_allowed:false,reason:"UNRECOGNIZED_CANONICAL_KP",unknown_kps:unknown,units:[]};
 const units=[...new Set(matched.map(x=>index.get(x).unit_id))];
 const routed=[...new Set(matched.map(x=>index.get(x).exam_routing))];
 if(matched.length){
  const blocked=question.source_figure_missing===true||question.science_answer_ambiguous===true||question.source_text_missing===true||question.source_answer_verification_hold===true;
  return {decision:blocked?"KP_MATCH_SOURCE_EVIDENCE_HOLD":"KP_MATCH_CANDIDATE",
   retain_source:true,publication_allowed:false,canonical_kp_ids:[...new Set(matched)],units,
   new_curriculum_exam_routing:routed,
   original_paper_exam_type:question.original_paper_exam_type??null,
   original_publisher_label:question.original_publisher_label??null,
   original_paper_scope_rating:question.original_paper_scope_rating??null,
   cross_original_exam_period:!!question.original_paper_exam_type&&routed.some(x=>x!==question.original_paper_exam_type),
   source_evidence_gate:blocked?"HOLD_FOR_SCIENCE_SOURCE_OR_FIGURE":"FULL_SOURCE_KP_AND_SCIENCE_CERTIFICATION_PENDING"};
 }
 if(question.independently_reviewed_as_no_matching_kp===true&&question.exact_question_text_read===true){
  return {decision:"NONMATCH_G04S1_KP_ARCHIVE",retain_source:true,publication_allowed:false,canonical_kp_ids:[],units:[],reason:"NO_EXACT_G04S1_KP"};
 }
 return {decision:"REVIEW_KP_UNCERTAIN",retain_source:true,publication_allowed:false,canonical_kp_ids:[],units:[],reason:"KP_NOT_YET_RESOLVED"};
}
export function validateG04S1KPFirstQueue(queue,registry,authority){
 const index=buildG04S1KPIndex(authority);
 if(index.size!==45||queue.work_items.length!==273||registry.entries.length!==273)
  throw Error("KP_FIRST_REGISTRY_COUNT_MISMATCH");
 const fromSource=new Map(registry.entries.map(x=>[x.candidate_source_id,x]));
 const seen=new Set(),years=new Set(),ids=[];
 for(const q of queue.work_items){
  const s=fromSource.get(q.source_candidate_id);
  if(!s||seen.has(q.source_candidate_id)||q.source_title!==s.source_title||q.academic_year!==s.year||q.printed_exam_type!==s.exam_type)
   throw Error("KP_FIRST_SOURCE_REGISTRY_PARITY");
  seen.add(q.source_candidate_id);years.add(q.academic_year);
  if(q.cross_exam_unit_match_is_kept!==true||q.excluded_if_publisher_mismatch!==false||q.excluded_if_paper_mismatch!==false||q.operator_public_admission_approved!==false)
   throw Error("KP_FIRST_UNAUTHORIZED_PAPER_GATE");
  if(JSON.stringify(q.source_drive_file_ids)!==JSON.stringify(s.files.map(x=>x.drive_file_id)))throw Error("KP_FIRST_SOURCE_DRIVE_ID_DRIFT");
  ids.push(...q.source_drive_file_ids);
 }
 if(ids.length!==429||new Set(ids).size!==429||seen.size!==273||[...years].sort().join(",")!=="108,109,110,111,112,113,114")
  throw Error("KP_FIRST_SOURCE_IDENTITY_COUNT");
 return {source_papers:273,source_drive_file_ids:429,years:[...years].sort(),target_kp_count:index.size,public_admission:false};
}
