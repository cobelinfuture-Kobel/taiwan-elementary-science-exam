import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';const read=p=>fs.readFileSync(p,'utf8');const fixture=JSON.parse(read('site/data/layout-demo.json'));test('fixture is demo only',()=>assert.equal(fixture.admission,'DEMO_ONLY'));test('no duplicate ids',()=>assert.equal(new Set(fixture.blocks.map(x=>x.id)).size,fixture.blocks.length));test('site entrypoints',()=>{assert.match(read('site/index.html'),/exam\//);assert.match(read('site/exam/index.html'),/DEMO_ONLY/)});test('reading group has passage and children',()=>{const g=fixture.blocks.find(x=>x.type==='group');assert.ok(g.passage);assert.ok(g.items.length>=2)});test('print and answer surface',()=>{const html=read('site/exam/index.html');assert.match(html,/@page/);assert.match(html,/answer-key/);assert.match(html,/window.print/)});
test('demo figures preserve intrinsic aspect ratio in preview and print',()=>{const html=read('site/exam/index.html');assert.doesNotMatch(html,/\.diagram\{width:100%/);assert.match(html,/\.group img,\.group svg\.diagram,\.question img,\.question svg\.diagram\{/);assert.match(html,/width:auto;height:auto;max-width:100%;max-height:38mm;object-fit:contain/);assert.match(html,/fig\.setAttribute\('width','420'\)/);assert.match(html,/fig\.setAttribute\('height','110'\)/);assert.match(html,/fig\.setAttribute\('preserveAspectRatio','xMidYMid meet'\)/);});

test('reading groups occupy a single A4 column and remain atomic',()=>{
  const html=read('site/exam/index.html');
  assert.match(html,/const newPage=\(\)=>\{const p=paper\(false\);layout\(p,'two'\)/);
  assert.match(html,/const el=b.type==='group'\?group\(b,start\):question\(b,num\+1\)/);
  assert.doesNotMatch(html,/const wide=b.type==='group'/);
  assert.match(html,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
  assert.match(html,/\.group\{[^}]*break-inside:avoid[^}]*max-width:100%/);
  assert.match(html,/scrollWidth>x.clientWidth\+2/);
  assert.match(html,/target\.removeChild\(el\);if\(col\+1<current\.targets\.length\)col\+\+/);
  assert.match(html,/if\(!mounted\)throw Error\('題目內容過高，拒絕裁切'\)/);
});

test('Exam uses the canonical Authority adapter and does not read KP labels from demo fixture as selector source',()=>{const html=read('site/exam/index.html');assert.match(html,/import \{ loadAuthority, unitsFor, resolveUnit \} from/);assert.doesNotMatch(html,/const titles=\{/);assert.doesNotMatch(html,/bank\.blocks\.filter\(b=>b\.unit===ui\.unit\.value\)/);assert.match(html,/secondary_canonical_kp_ids/);});
test('DEMO_ONLY fixture uses exact canonical KP lineage',()=>{const refs={q1:'sci_g04s1_02_03',q2:'sci_g04s1_02_08',q3:'sci_g04s1_02_03',q4:'sci_g04s1_01_08',q5:'sci_g03s1_02_05'};for(const row of fixture.blocks)assert.equal(row.canonical_kp_id,refs[row.id]);});

test('Exam exclusively uses embedded certified historical questions in public mode',()=>{
 const html=read('site/exam/index.html');
 assert.match(html,/loadEmbeddedHistoricalBank/);
 assert.match(html,/EMBEDDED_CERTIFIED_HISTORICAL/);
 assert.match(html,/內建考古題/);
 assert.doesNotMatch(html,/id="local-import"|id="source-select"|LOCAL_APPROVED/);
 assert.match(html,/const qaFixture=/);
 assert.match(html,/qaFixture\?'DEMO_ONLY/);
});

test("TF item has O/X parenthesis before number and no invented 正確/錯誤 choices",()=>{
 const html=read("site/exam/index.html");
 assert.match(html,/q.type==='tf'\|\|q.type==='short'\|\|q.type==='mcq'\|\|q.type==='multi'/);
 assert.doesNotMatch(html,/（　）正確　（　）錯誤/);
 assert.match(html,/題目前的（　）內填入 O 或 X/);
});

test("public Exam pins a versioned JS module and keeps selectors when bank fails",()=>{
 const html=read("site/exam/index.html");
 assert.match(html,/historical-bank-ox-v6\.mjs\?v=20261016-p12-e01-post46-anhe-wind1/);
 assert.match(html,/authority=await loadAuthority\(\);\s*\/\/ Render canonical curriculum selector/);
 assert.match(html,/syncUnits\(\);\s*if\(qaFixture\)/);
 assert.match(html,/題庫載入或版本檢查失敗/);
});

test("historical context group renderer preserves all subquestions in a single column",()=>{
 const html=read("site/exam/index.html");
 assert.match(html,/function sourceContextGroup\(b,start\)/);
 assert.match(html,/b\.items\.forEach\(\(item,i\)=>\{/);
 assert.match(html,/group-context/);
 assert.match(html,/answers\.push\(\{number:\+\+ix,answer:sub\.answer,explanation:sub\.answer_explanation/);
 assert.match(html,/break-inside:avoid/);
});

test("P09 new scalable vector diagrams replace screenshot crops with explicit scoring rubric",()=>{
 const html=read("site/exam/index.html");
 assert.match(html,/renderScienceDiagram\(b\.diagram_kind\)/);
 assert.match(html,/if\(entry\.draw==='DRAW_CIRCUIT'\)x\.append/);
 assert.match(html,/science-diagram/);
 assert.doesNotMatch(html,/private_contexts\/.*\.png/);
});
