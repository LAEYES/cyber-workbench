import path from "node:path";
import { writeYamlFile } from "../catalog/write.js";
import ExcelJS from "exceljs";

const DEFAULT_URL = "https://csrc.nist.gov/extensions/nudp/services/json/csf/download?olirids=all";

function cellText(v: any): string {
  if (v === null || v === undefined) return "";
  if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") return String(v);

  // ExcelJS RichText
  if (Array.isArray(v?.richText)) {
    return v.richText.map((x: any) => String(x?.text ?? "")).join("");
  }

  // ExcelJS Hyperlink
  if (typeof v?.text === "string") return v.text;

  // ExcelJS Formula
  if (v?.result !== undefined) return String(v.result);

  return String(v);
}

function norm(s: any) {
  return cellText(s).replace(/\r?\n/g, "\n").replace(/\s+\n/g, "\n").replace(/\n\s+/g, "\n").trim();
}

function parse80053Refs(refsCell: string): string[] {
  // Matches: "SP 800-53 Rev 5.2.0: AC-2" or similar.
  const ids = new Set<string>();
  const lines = refsCell.split(/\r?\n/).map((l) => l.trim());
  for (const line of lines) {
    const m = line.match(/SP\s*800-53[^:]*:\s*([A-Z]{2}-\d{1,3}(?:\(\d+\))?)/i);
    if (m?.[1]) ids.add(m[1].toUpperCase());
  }
  return [...ids];
}

export async function importNistCsfFromXlsx(params: {
  outOutcomesFile: string;
  outCsfTo80053MappingFile: string;
  url?: string;
}) {
  const url = params.url ?? DEFAULT_URL;
  const outOutcomesFile = path.resolve(params.outOutcomesFile);
  const outMapFile = path.resolve(params.outCsfTo80053MappingFile);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} ${res.statusText}: ${url}`);
  const ab = await res.arrayBuffer();

  const wb = new ExcelJS.Workbook();
  const buf = Buffer.from(new Uint8Array(ab));
  await (wb.xlsx as any).load(buf);

  const ws = wb.getWorksheet("CSF 2.0") ?? wb.worksheets[0];
  if (!ws) throw new Error("No worksheet found");

  // Find header row with: Function | Category | Subcategory | Implementation Examples | Informative References
  let headerRowNumber = -1;
  const colIndex: Record<string, number> = {};

  ws.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    if (headerRowNumber !== -1) return;

    const cells: string[] = [];
    for (let c = 1; c <= row.cellCount; c++) {
      cells[c] = norm(row.getCell(c).value);
    }

    const required = ["Function", "Category", "Subcategory", "Informative References"];
    if (required.every((r) => cells.includes(r))) {
      headerRowNumber = rowNumber;
      for (let c = 1; c < cells.length; c++) {
        const name = cells[c];
        if (name) colIndex[name] = c;
      }
    }
  });

  if (headerRowNumber === -1) throw new Error("Could not locate CSF header row");

  const subCol = colIndex["Subcategory"];
  const refCol = colIndex["Informative References"];
  if (!subCol || !refCol) throw new Error("Missing Subcategory/Informative References columns");

  const outcomes = new Map<string, { id: string; title: string }>();
  const mapItems = new Map<string, Set<string>>();

  for (let r = headerRowNumber + 1; r <= ws.rowCount; r++) {
    const row = ws.getRow(r);
    const sub = norm(row.getCell(subCol).value);
    if (!sub) continue;

    const m = sub.match(/^([A-Z]{2}\.[A-Z]{2}-\d{2})\s*:\s*(.+)$/);
    if (!m) continue;

    const id = m[1];
    const title = m[2];
    if (!outcomes.has(id)) outcomes.set(id, { id, title });

    const refs = norm(row.getCell(refCol).value);
    if (!refs) continue;
    const ctrls = parse80053Refs(refs);
    if (ctrls.length) {
      if (!mapItems.has(id)) mapItems.set(id, new Set());
      const set = mapItems.get(id)!;
      for (const c of ctrls) set.add(c);
    }
  }

  const outcomesPayload = {
    id: "nist-csf-2.0.outcomes",
    framework: "nist-csf-2.0",
    version: "2.0",
    controls: [...outcomes.values()]
      .sort((a, b) => a.id.localeCompare(b.id, "en"))
      .map((x) => ({
        id: x.id,
        framework: "nist-csf-2.0",
        title: x.title,
        tags: { domains: [], cia: [], type: [] },
        sources: ["NIST CSF 2.0 (NIST CSF Reference Tool export)"]
      }))
  };

  const mappingPayload = {
    id: "nist-csf-2.0_to_nist-800-53-r5",
    fromFramework: "nist-csf-2.0",
    toFramework: "nist-800-53-r5",
    items: [...mapItems.entries()]
      .sort((a, b) => a[0].localeCompare(b[0], "en"))
      .map(([csfId, ctrls]) => ({
        from: { framework: "nist-csf-2.0", id: csfId },
        to: [...ctrls]
          .sort((a, b) => a.localeCompare(b, "en"))
          .map((id) => ({ framework: "nist-800-53-r5", id })),
        confidence: "high",
        rationale: "Mapping extracted from NIST CSF 2.0 Informative References (SP 800-53)."
      }))
  };

  await writeYamlFile(outOutcomesFile, outcomesPayload);
  await writeYamlFile(outMapFile, mappingPayload);

  console.log(`Imported CSF outcomes: ${outcomesPayload.controls.length} -> ${outOutcomesFile}`);
  console.log(`Generated CSF→800-53 mappings: ${mappingPayload.items.length} -> ${outMapFile}`);
}
