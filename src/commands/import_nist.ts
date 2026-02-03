import path from "node:path";
import * as XLSX from "xlsx";
import { writeYamlFile } from "../catalog/write.js";

const DEFAULT_URL = "https://csrc.nist.gov/extensions/nudp/services/json/csf/download?olirids=all";

export async function importNistCsf(params: { outFile: string; url?: string }) {
  const url = params.url ?? DEFAULT_URL;
  const outFile = path.resolve(params.outFile);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} ${res.statusText} from ${url}`);
  const ab = await res.arrayBuffer();

  const wb = XLSX.read(ab, { type: "array" });
  if (wb.SheetNames.length === 0) throw new Error("No worksheet found in xlsx");

  // Prefer the sheet named like "CSF 2.0" (observed in the NIST export).
  let sheetName = wb.SheetNames.find((n) => /csf\s*2\.0/i.test(n)) ?? wb.SheetNames[0]!;
  const ws = wb.Sheets[sheetName];

  // Work with raw rows to handle hierarchical blanks.
  const table = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, blankrows: false }) as any[];

  // Find the header row containing Function/Category/Subcategory.
  let headerRowIdx = -1;
  for (let i = 0; i < Math.min(table.length, 50); i++) {
    const r = (table[i] ?? []).map((x: any) => String(x).trim());
    if (r.includes("Function") && r.includes("Category") && r.includes("Subcategory")) {
      headerRowIdx = i;
      break;
    }
  }
  if (headerRowIdx === -1) throw new Error(`Could not locate header row in sheet ${sheetName}`);

  const header = (table[headerRowIdx] ?? []).map((x: any) => String(x).trim());
  const functionIdx = header.indexOf("Function");
  const categoryIdx = header.indexOf("Category");
  const subcatIdx = header.indexOf("Subcategory");

  const items = new Map<string, { id: string; title: string; sources: string[] }>();

  // Rows below header.
  for (let i = headerRowIdx + 1; i < table.length; i++) {
    const row = table[i] ?? [];
    const subcatCell = String(row[subcatIdx] ?? "").trim();
    if (!subcatCell) continue;

    // Typical format: "GV.OC-01: ..."
    const m = subcatCell.match(/^([A-Z]{2}\.[A-Z]{2}-\d{2})\s*:\s*(.+)$/);
    if (!m) continue;

    const id = m[1];
    const title = m[2];

    if (!items.has(id)) {
      items.set(id, { id, title, sources: ["NIST CSF 2.0 (via NIST CSF Reference Tool export)"] });
    }

    // Optionally: we could also capture the parent category/function for tags later.
    void functionIdx;
    void categoryIdx;
  }

  const controls = [...items.values()]
    .sort((a, b) => a.id.localeCompare(b.id, "en"))
    .map((x) => ({
      id: x.id,
      framework: "nist-csf-2.0",
      title: x.title,
      tags: { domains: [], cia: [], type: [] },
      sources: x.sources
    }));

  const payload = {
    id: "nist-csf-2.0.outcomes",
    framework: "nist-csf-2.0",
    version: "2.0",
    controls
  };

  await writeYamlFile(outFile, payload);

  console.log(`Imported ${controls.length} NIST CSF items -> ${outFile}`);
  console.log(`Sheet: ${sheetName} | Table rows: ${table.length}`);
}
