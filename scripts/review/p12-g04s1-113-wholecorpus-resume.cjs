#!/usr/bin/env node
'use strict';
// P12 ALL29 deterministic source orchestration + completion lock.
// This schedules evidence work; it NEVER invents Science/KP/rights decisions or publishes.
const fs=require('node:fs');
const path=require('node:path');
const cp=require('node:child_process');
const ROOT=path.resolve(__dirname,'../..');
const R='data/review/';
const MANIFEST='p12-g04s1-113-all29-master-ledger-v1.json';
const REGISTRY='p12-g04s1-113-all29-kp48-source-firstpass-v1.json';
const PUBLISHED='p12-g04s1-113-main-published178-source-suppression-readback-v12.json';
const LEGACY=[
  ['p12-g04s1-113-wholecorpus-eightpapers-421-graded-source-task-ledger-v1.json','rows'],
  ['p12-g04s1-113-next-three-whole-papers-199-source-tasks-v1.json','source_scored_tasks'],
  ['p12-g04s1-113-three-additional-papers-155-source-graded-tasks-v1.json','source_tasks_155']
];
const GATES=['SOURCE_EXACT','PDF_PAGE_BBOX','SCIENCE_UNIQUE_ANSWER','CANONICAL_KP','DUPLICATE','RIGHTS','OPERATOR_GATE'];
const FINAL=new Set(['PUBLISHED','ADMISSION_READY','HOLD','REJECT','DUPLICATE_LINEAGE']);
function read(name,root=ROOT){return JSON.parse(fs.readFileSync(path.join(root,R,name),'utf8'))}
function fail(message){throw new Error('ALL29_FAIL_CLOSED: '+message)}
function insist(ok,message){if(!ok)fail(message)}
function normalizeSlot(id){
  insist(typeof id==='string' && id.startsWith('SCI_G04_S1_113_'),'invalid source slot '+id);
  const parts=id.split('|');insist(parts.length>=4,'invalid section or item '+id);
  return parts.map((p,i)=>{
    const s=p.toUpperCase();
    if(i===1&&/^S0*\d+$/.test(s))return 'S'+Number(s.slice(1));
    if(i>1&&/^G0*\d+$/.test(s))return 'G'+Number(s.slice(1));
    if(i>1&&/^(TRUE_FALSE|OX|TF)$/.test(s))return 'TF';
    if(i>1&&/^(SINGLE_CHOICE|MULTIPLE_CHOICE|MC)$/.test(s))return 'MC';
    if(i>1&&/^\d+$/.test(s))return String(Number(s));
    return p;
  }).join('|');
}
function validateMaster(m,registry,pub,opts={}){
  insist(registry.original_source_records.length===29,'original 29 source registry not intact');
  insist(m.original_pdf_count===29&&m.paper_records.length===29,'master must cover exactly 29 papers');
  insist(m.original_pdf_page_count===registry.actual_pdf_page_count,'source page count mismatch');
  insist(pub.public_Pages_live_E2E_success===true,'published snapshot lacks Pages evidence');
  insist(pub.current_113_source_slots_published===pub.all_unique_published_source_slot_ids.length,'stale published source count');
  insist(m.known_published_source_positions===pub.current_113_source_slots_published,'master published snapshot stale');
  insist(m.published_main_sha===pub.public_main_commit,'master and published main SHA inconsistent');
  if(opts.requiredMainSha)insist(opts.requiredMainSha===pub.public_main_commit,'main moved: refresh approved published readback before re-running ALL29');
  const orig=new Map(registry.original_source_records.map(x=>[x.source_id,x]));
  const ids=new Set();let pubTotal=0;
  for(const p of m.paper_records){
    insist(!ids.has(p.paper_id),'duplicate master paper '+p.paper_id);ids.add(p.paper_id);
    const o=orig.get(p.paper_id);insist(o,'extra or unknown paper '+p.paper_id);
    insist(o.original_pdf_sha256===p.original_pdf_sha256,'original PDF SHA mismatch '+p.paper_id);
    insist(o.original_pdf_page_count===p.original_pdf_pages,'original page count mismatch '+p.paper_id);
    insist(o.scan_only_pdf===p.scan_only_pdf,'scan identity changed '+p.paper_id);
    const expected=pub.all_unique_published_source_slot_ids.filter(x=>x.split('|')[0]===p.paper_id).length;
    insist(p.published_count===expected,'per-paper published source count mismatch '+p.paper_id);
    pubTotal+=p.published_count;
  }
  insist(ids.size===29&&[...orig.keys()].every(x=>ids.has(x)),'29-paper identity coverage incomplete');
  const seen=new Set();
  for(const id of pub.all_unique_published_source_slot_ids){
    const key=normalizeSlot(id);insist(!seen.has(key),'published source alias collision '+id);
    seen.add(key);insist(ids.has(id.split('|')[0]),'published slot without registered source '+id);
  }
  insist(pubTotal===seen.size,'source suppression source identities not conserved');
  return {publishedIds:seen,paperIds:ids,originals:orig};
}
function assessCompletion(master,published){
  const reasons=[];let finalCount=0,exactCount=0;
  const all=new Set();
  let publishedDispositions=0;
  for(const p of master.paper_records){
    if(!p.inventory_certified||!Number.isInteger(p.exact_total_slots)||p.exact_total_slots<1){
      reasons.push(p.paper_id+':EXACT_DENOMINATOR_UNCERTIFIED');continue;
    }
    exactCount+=p.exact_total_slots;
    if(!Array.isArray(p.slot_dispositions)||p.slot_dispositions.length!==p.exact_total_slots){
      reasons.push(p.paper_id+':MISSING_EXACT_SLOT_DISPOSITIONS');continue;
    }
    const local=new Set();let valid=true;
    for(const s of p.slot_dispositions){
      const id=s.source_slot_id;
      if(!id||id.split('|')[0]!==p.paper_id){reasons.push(p.paper_id+':INVALID_SLOT_ID');valid=false;continue}
      const key=normalizeSlot(id);
      if(all.has(key)||local.has(key)){reasons.push(id+':DUPLICATE_SLOT_ID');valid=false}
      all.add(key);local.add(key);
      if(!FINAL.has(s.disposition)){reasons.push(id+':PENDING_OR_UNKNOWN_DISPOSITION');valid=false;continue}
      if(!s.source_evidence_ref||!s.pdf_page_bbox_evidence_ref){reasons.push(id+':MISSING_SOURCE_OR_BBOX_EVIDENCE');valid=false}
      if(s.disposition==='PUBLISHED'){
        publishedDispositions++;
        if(!published.has(key)){reasons.push(id+':FALSE_PUBLISHED');valid=false}
      }
      if(s.disposition==='ADMISSION_READY'){
        for(const g of GATES){if(s.gate_evidence?.[g]!==true){reasons.push(id+':GATE_MISSING_'+g);valid=false}}
      }
      if(['HOLD','REJECT'].includes(s.disposition)&&(!s.reason||!s.decision_evidence_ref)){
        reasons.push(id+':UNSUPPORTED_'+s.disposition);valid=false;
      }
      if(s.disposition==='DUPLICATE_LINEAGE'&&(!s.canonical_source_slot_id||!s.decision_evidence_ref)){
        reasons.push(id+':MISSING_DUPLICATE_LINEAGE');valid=false;
      }
    }
    if(local.size!==p.exact_total_slots){reasons.push(p.paper_id+':COUNT_MISMATCH');valid=false}
    if(!valid||p.paper_closed!==true)reasons.push(p.paper_id+':NOT_FORMALLY_CLOSED');
    else finalCount++;
  }
  if(publishedDispositions!==published.size)reasons.push('PUBLISHED_SOURCE_DISPOSITIONS_NOT_RECONCILED');
  if(master.all29_complete===true && (reasons.length||finalCount!==29))reasons.push('FALSE_ALL29_COMPLETE');
  return {all29_complete:reasons.length===0&&finalCount===29,closed_papers:finalCount,total_papers:29,certified_total_slots:exactCount||null,reasons};
}
function build(root=ROOT,batchSize=50,opts={}){
  insist(Number.isInteger(batchSize)&&batchSize>0,'invalid batch size');
  const m=read(MANIFEST,root),o=read(REGISTRY,root),pub=read(PUBLISHED,root);
  const validation=validateMaster(m,o,pub,opts);
  const coverage=assessCompletion(m,validation.publishedIds);
  insist(m.all29_complete===coverage.all29_complete,'all29 completion claim conflicts with actual evidence');
  insist(m.formally_closed_papers===coverage.closed_papers,'closed count conflicts with evidence');
  // All 29 papers participate, even when some older partial ledgers omit all their original slots.
  const inventories=m.paper_records.filter(p=>!p.inventory_certified).map(p=>({
    kind:'PAPER_INVENTORY_GAP',paper_id:p.paper_id,source_pdf_sha256:p.original_pdf_sha256,
    status:'NEEDS_EXACT_PRINTED_RESPONSE_SLOT_DENOMINATOR_AND_PARENT_RECONCILIATION'
  }));
  const known=new Map();let raw=0;
  for(const [file,field] of LEGACY){
    for(const row of read(file,root)[field]){
      raw++;const id=row.source_slot_id,key=normalizeSlot(id),paper=id.split('|')[0];
      insist(validation.paperIds.has(paper),'source ledger references unknown paper');
      const source=validation.originals.get(paper);
      const sha=row.original_pdf_sha256||row.original_sha256;
      if(sha)insist(sha===source.original_pdf_sha256,'source ledger SHA mismatch '+id);
      if(!known.has(key))known.set(key,{kind:'SOURCE_GATE_EVIDENCE',source_slot_id:id,normalized_source_slot_id:key,
        paper_id:paper,source_pdf_sha256:source.original_pdf_sha256,source_ledgers:[file],
        queue_status:'NEEDS_EXISTING_GATE_EVIDENCE_NOT_ADMISSION_READY'});
      else known.get(key).source_ledgers.push(file);
    }
  }
  const unprocessed=[...known.values()].filter(x=>!validation.publishedIds.has(x.normalized_source_slot_id));
  const index=new Map(m.paper_records.map((x,i)=>[x.paper_id,i]));
  unprocessed.sort((a,b)=>index.get(a.paper_id)-index.get(b.paper_id)||
    a.normalized_source_slot_id.localeCompare(b.normalized_source_slot_id,'en',{numeric:true}));
  const tasks=[...inventories,...unprocessed];
  const batches=[];for(let i=0;i<tasks.length;i+=batchSize)batches.push({
    batch:'ALL29_B'+String(batches.length+1).padStart(2,'0'),count:Math.min(batchSize,tasks.length-i),tasks:tasks.slice(i,i+batchSize)
  });
  insist(new Set(tasks.map(x=>x.kind==='PAPER_INVENTORY_GAP'?x.paper_id:x.normalized_source_slot_id)).size===tasks.length,
    'task identity collision');
  return {schema_version:'P12_G04S1_113_ALL29_RESUME_V2',purpose:'ALL29_SOURCE_COVERAGE_ROUTING_NO_NEW_ADMISSION_GATE',
    snapshot_main_sha:pub.public_main_commit,original_papers:29,
    metrics:{registered_papers:29,published_113:validation.publishedIds.size,
      ledger_source_rows:raw,unique_legacy_source_positions:known.size,
      papers_requiring_exact_inventory:inventories.length,unpublished_legacy_positions:unprocessed.length,
      deterministic_work_tasks:tasks.length,batch_size:batchSize,batch_count:batches.length,
      ALL29_COMPLETE:coverage.all29_complete,FORMAL_SCIENCE_KP_APPROVED_NEW:0,ADMISSION_READY_NEW:0,PUBLISHED_NEW:0},
    completion:coverage,paper_summary:m.paper_records.map(p=>({paper_id:p.paper_id,
      exact_total_slots:p.exact_total_slots,inventory_certified:p.inventory_certified,published_count:p.published_count,
      paper_closed:p.paper_closed})),batches};
}
function main(){
  const args=process.argv.slice(2);
  const size=Number((args.find(x=>x.startsWith('--size='))||'--size=50').split('=')[1]);
  let requiredMainSha;
  if(args.includes('--check-main'))requiredMainSha=cp.execFileSync('git',['rev-parse','origin/main'],{cwd:ROOT,encoding:'utf8'}).trim();
  const result=build(ROOT,size,{requiredMainSha});
  if(args.includes('--check-completion'))insist(result.completion.all29_complete,'29-paper closeout incomplete');
  const requested=args.find(x=>x.startsWith('--batch='));
  if(requested){
    const batch=result.batches.find(x=>x.batch===requested.split('=')[1]);
    insist(batch,'requested batch missing');process.stdout.write(JSON.stringify(batch,null,2)+'\n');return;
  }
  const outdir=args.find(x=>x.startsWith('--out-dir='));
  if(outdir){
    const dir=path.resolve(ROOT,outdir.slice(10));fs.mkdirSync(dir,{recursive:true});
    for(const b of result.batches)fs.writeFileSync(path.join(dir,b.batch+'.json'),JSON.stringify(b,null,2)+'\n');
    fs.writeFileSync(path.join(dir,'SUMMARY.json'),JSON.stringify({metrics:result.metrics,completion:result.completion},null,2)+'\n');
  }
  process.stdout.write(JSON.stringify(args.includes('--summary')?{metrics:result.metrics,completion:result.completion}:result,null,2)+'\n');
}
if(require.main===module)main();
// Public build()/CLI both use ALL29. Historical regression tests import the explicit legacy-snapshot module.
module.exports={build,buildAll29:build,normalizeSlot,validateMaster,assessCompletion};
