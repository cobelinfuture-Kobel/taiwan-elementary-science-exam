import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const file = p => fs.readFileSync(new URL(p,root),'utf8');
const governance = file('docs/QUESTION_ADMISSION_GOVERNANCE.md');
const readme = file('README.md');
const authority = JSON.parse(file('data/governance/science-duplicate-phrasing-operator-approval-20261019-v1.json'));

test('2026-10-19 operator-approved duplicate gate allows same KP, different real original wording',()=>{
  assert.equal(authority.approved_on,'2026-10-19');
  assert.ok(authority.operator_approved_text.includes('同 KP、不同問法'));
  assert.ok(governance.includes('相同 canonical KP、相同科學結論，但原題有實質不同問法'));
  assert.ok(readme.includes('相同 KP、不同實際問法'));
  assert.ok(authority.rule.do_not_merge_for.includes('SAME_KP_ONLY'));
  assert.ok(authority.rule.do_not_merge_for.includes('SAME_CORRECT_ANSWER_ONLY'));
  assert.ok(authority.rule.do_not_merge_for.includes('SAME_KP_DIFFERENT_QUESTION_FORMAT'));
  assert.ok(authority.rule.do_not_merge_for.includes('SAME_KP_DIFFERENT_REAL_LIFE_CONTEXT'));
  assert.equal(authority.rule.eligibility_is_not_admission,true);
});

test('exact same question and option reorder only still merge, preserve all original lineage',()=>{
  assert.ok(governance.includes('選項排列而無實質問法差異者'));
  assert.ok(governance.includes('所有來源 lineage'));
  assert.ok(authority.rule.merge_with_source_lineage.includes('EXACT_SAME_QUESTION'));
  assert.ok(authority.rule.merge_with_source_lineage.includes('ONLY_ANSWER_OPTION_ORDER_CHANGED'));
  assert.ok(authority.rule.merge_with_source_lineage.includes('ONLY_QUESTION_NUMBER_CHANGED'));
  assert.equal(authority.rule.unresolved,'HOLD_DUPLICATE');
});

test('operator changed only DUPLICATE interpretation; original seven admission gates remain',()=>{
  const required = ['SOURCE_EXACT','PDF_PAGE_BBOX','SCIENCE_UNIQUE_ANSWER','CANONICAL_KP','DUPLICATE','RIGHTS','ADMISSION_GATE'];
  for(const name of required) assert.ok(governance.includes(name),name);
  assert.ok(governance.includes('不新增 Science/KP 任何審核輪次'));
  assert.ok(governance.includes('不回寫既有來源或已發布題'));
  assert.equal(authority.original_authority_and_published_questions_unchanged,true);
  assert.equal(authority.no_teacher_answer_key_invented,true);
  assert.ok(authority.rule.preserve_existing_gates.includes('PAGES_E2E'));
});
