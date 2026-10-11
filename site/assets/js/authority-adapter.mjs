export const AUTHORITY_SCHEMA = "SCIENCE_G03_G04_PUBLIC_SELECTOR_V2";
const EXPECTED = new Map([["3-1","14,12,11,10"],["3-2","12,12,12,13"],["4-1","11,12,10,12"],["4-2","12,11,12,11"]]);
export function validateAuthority(value) {
  if (!value || value.schema_version !== AUTHORITY_SCHEMA || value.projection_purpose !== "selector_only") throw new Error("KP Authority 版本不相容");
  if (!Array.isArray(value.sources) || value.sources.length !== 4 || !Array.isArray(value.units) || value.units.length !== 16) throw new Error("KP Authority 四學期／16 單元不完整");
  const legacy = new Set(), canonical = new Set();
  for(const [scope, expected] of EXPECTED) {
    const [g,s] = scope.split("-").map(Number);
    const rows = value.units.filter(u => u.grade === g && u.semester === s).sort((a,b) => a.unit_id.localeCompare(b.unit_id));
    if(rows.map(u=>u.knowledge_points?.length).join(",") !== expected || rows.map(u=>u.unit_id).join(",") !== "U01,U02,U03,U04") throw new Error("KP 單元範圍或數量不符：" + scope);
    const origin = value.sources.filter(x=>x.grade===g && x.semester===s);
    if(origin.length!==1 || !/^[0-9a-f]{64}$/.test(origin[0].sha256)) throw new Error("KP 來源雜湊缺失：" + scope);
    for(const u of rows) {
      if(!u.unit_title || !Array.isArray(u.knowledge_points))throw new Error("單元名稱或知識點缺失");
      for(const [i,kp] of u.knowledge_points.entries()) {
        const n=String(i+1).padStart(2,"0"),unit=u.unit_id.slice(1),part=String(g).padStart(2,"0");
        if(kp.kp_id!==`kx_g${part}s${s}_u${unit}_kp${n}` || kp.canonical_kp_id!==`sci_g${part}s${s}_${unit}_${n}` || !kp.title.trim())throw new Error("KP ID 或標題驗證失敗");
        if(legacy.has(kp.kp_id)||canonical.has(kp.canonical_kp_id))throw new Error("KP ID 重複");
        legacy.add(kp.kp_id);canonical.add(kp.canonical_kp_id);
      }
    }
  }
  if(legacy.size!==187||canonical.size!==187||value.counts?.knowledge_points!==187||value.counts?.units!==16)throw new Error("KP 187 筆完整性失敗");
  if(value.assessment_scope?.MIDTERM?.join(",")!=="U01,U02"||value.assessment_scope?.FINAL?.join(",")!=="U03,U04")throw new Error("期中期末範圍不符");
  if(value.question_bank_status!=="DEMO_ONLY_NOT_CERTIFIED")throw new Error("題庫狀態不符");
  return value;
}
export function unitsFor(authority,grade,semester) {
  if(!authority)return [];
  return authority.units.filter(u=>u.grade===Number(grade)&&u.semester===Number(semester)).sort((a,b)=>a.unit_id.localeCompare(b.unit_id));
}
export function resolveUnit(authority,unitKey){
  if(!authority)return null;
  const found=/^([34])-S([12])-(U0[1-4])$/.exec(String(unitKey));
  return found?authority.units.find(u=>u.grade===Number(found[1])&&u.semester===Number(found[2])&&u.unit_id===found[3])??null:null;
}
export async function loadAuthority(url="../data/authority/science-g03-g04-selector-v2.json"){
  const response=await fetch(url,{cache:"no-cache"});
  if(!response.ok)throw new Error("讀取正式 KP 選單資料失敗");
  return validateAuthority(await response.json());
}
