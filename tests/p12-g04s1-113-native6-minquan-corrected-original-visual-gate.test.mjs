import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get=n=>JSON.parse(readFileSync(new URL('../data/review/'+n,import.meta.url),'utf8'));
const c=get('p12-g04s1-113-native6-original-pdf-visual-science-kp-correction-v2.json');
const b=get('p12-g04s1-113-othernative4-exact-pdf-glyph-bbox56-v1.json');
const pub=get('p12-g04s1-113-main-published152-source-suppression-readback-v10.json');
test('Minquan TF004 source correction is not Yongan string telephone and remains science condition HOLD',()=>{
 assert.equal(c.records.length,2);
 const [a,m]=c.records;
 assert.equal(a.source_school,'花蓮縣花蓮市明義國民小學');
 assert.equal(a.verified_SHA256,'356d91fba36cd8b8bfe2e5a5e32a354b02d48e17782ce146e6cd8b5cf4881f12');
 assert.equal(a.unique_science_answer_choice,4);
 assert.equal(a.canonical_KP,'sci_g04s1_04_12');
 assert.deepEqual(a.original_options,['冰箱','烤箱','洗衣機','檯燈']);
 assert.equal(a.formal_science_kp_approved,true);
 assert.equal(a.admission_ready,false);
 assert.equal(m.source_school,'臺北市民權國民小學');
 assert.equal(m.verified_SHA256,'ee3847a2790d0f92f64ff2361003e6383364dd83d49797bacd3631cfe808768d');
 assert.match(m.original_stem,/月球上/);
 assert.doesNotMatch(m.original_stem,/傳聲筒/);
 assert.match(m.science_hold_reason,/solid contact\/vibration/);
 assert.equal(m.formal_science_kp_approved,false);
 assert.equal(m.admission_ready,false);
 assert.equal(c.summary.additional_formal_science_and_direct_frozen_kp_accepted,1);
 assert.equal(c.summary.new_published,0);
 const published=new Set(pub.all_unique_published_source_slot_ids);
 for(const x of c.records){
   const [id,section,type,num]=x.source_slot_id.split('|');
   const g=b.groups.find(y=>y.source_id===id&&y.section===section&&y.type===type);
   assert.ok(g);
   const box=g.encoded_geometry.split(';')[Number(num)-1].split('.').map(y=>Number.parseInt(y,36)/100);
   assert.deepEqual(x.exact_original_printed_answer_bbox_pts_top_left,box);
   assert.ok(!published.has(x.source_slot_id));
 }
});
