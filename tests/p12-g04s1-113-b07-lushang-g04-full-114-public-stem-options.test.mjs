import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {build}=require('../scripts/review/p12-g04s1-113-b07-lushang-g04-fourmc-exact-fulloption-duplicate.cjs');
test('B07 G04 exact 4 full choice sets compared to 114/717 and public modules; no duplicate pass or admission forged',()=>{
 const a=build();
 assert.equal(a.compared_original114_questions,717);
 assert.equal(a.candidate_count,4);
 assert.ok(a.compared_public_g04s1_rows>300);
 assert.equal(a.formal_duplicate_gate_complete,false);
 assert.equal(a.admission_ready_new,0);
 assert.equal(a.published_new,0);
 assert.ok(a.candidate_rows.every(x=>x.source_only_no_operator_signoff));
 assert.deepEqual(a.candidate_rows.map(x=>x.original_ordinal),[324,325,326,327]);
 console.log('B07_G04_DUPLICATE_SUMMARY='+JSON.stringify({
  original114:a.compared_original114_questions,
  publicModules:a.compared_public_modules,
  publicG04:a.compared_public_g04s1_rows,
  exactFullDuplicates:a.exact_confirmed_question_duplicates,
  rows:a.candidate_rows.map(x=>({id:x.original_source_id,fullDup:x.confirmedExactOrOptionReorder,
    exactStem:x.exactStemCandidates,near:x.nearStemReview}))
 }));
});
