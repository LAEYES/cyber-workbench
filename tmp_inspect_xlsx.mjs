import * as XLSX from 'xlsx';
const url='https://csrc.nist.gov/extensions/nudp/services/json/csf/download?olirids=all';
const res=await fetch(url);
if(!res.ok) throw new Error(res.status+" "+res.statusText);
const ab=await res.arrayBuffer();
const wb=XLSX.read(ab,{type:'array'});
console.log('Sheets:', wb.SheetNames);
for (const name of wb.SheetNames) {
  const ws=wb.Sheets[name];
  const rows=XLSX.utils.sheet_to_json(ws,{header:1,range:0,blankrows:false});
  const first5=rows.slice(0,10);
  console.log('\n==',name,'==');
  for (const r of first5) console.log(r.slice(0,12));
}
