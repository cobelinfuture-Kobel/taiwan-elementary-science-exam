import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {build}=require('../scripts/review/p12-g04s1-113-b07-original-stem-dedup-preflight.cjs');
test('B07 candidate excerpt lexical preflight covers 114/717 and published G04S1, never certifies semantic duplicate or admission',()=>{
 const r=build();
 assert.equal(r.comparison_114_original_positions,717);
 assert.equal(r.candidate_excerpt_rows,33);
 assert.equal(r.rows.length,33);
 assert.ok(r.comparison_public_g04s1_module_rows>=309);
 assert.deepEqual(r.rows.filter(x=>[320,321,322,323,328,329,330].includes(x.ordinal)).map(x=>x.ordinal),[320,321,322,323,328,329,330]);
 assert.equal(r.semantic_duplicate_certified,false);
 assert.equal(r.FORMAL_SCIENCE_KP_APPROVED_NEW,0);
 assert.equal(r.ADMISSION_READY_NEW,0);
 assert.equal(r.PUBLISHED_NEW,0);
 assert.ok(r.rows.every(x=>x.full_113_114_question_options_parent_semantic_duplicate_review_status==='INCOMPLETE_EXISTING_DUPLICATE_GATE'&&x.student_admission_allowed===false));
 assert.ok(r.rows.flatMap(x=>x.exact_or_high_near_stem_hits).every(x=>x.full_question_and_options_accepted_duplicate===false));
 console.log('B07_DUPLICATE_PREFLIGHT_REPORT='+JSON.stringify({
  count114:r.comparison_114_original_positions,
  liveG04moduleRows:r.comparison_public_g04s1_module_rows,
  screened:r.candidate_excerpt_rows,
  possibleNear:r.exact_or_near_rows,
  candidateHits:r.rows.filter(x=>x.exact_or_high_near_stem_hits.length).map(x=>({
   ordinal:x.ordinal,hits:x.exact_or_high_near_stem_hits.slice(0,3).map(y=>({source:y.source_id,score:y.stem_similarity,corpus:y.source_corpus,kind:y.match_type}))
  }))
 }));
});
