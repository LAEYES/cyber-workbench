import path from "node:path";
import { promises as fs } from "node:fs";
import { parseCsv, rowsToObjects } from "../catalog/csv_parse.js";
import { writeYamlFile } from "../catalog/write.js";

// SAFEST MODE: user provides a CSV exported locally from the official NIST xlsx.
// We avoid xlsx parsing libraries.

export async function importNistCsfFromCsv(params: { inFile: string; outFile: string }) {
  const inFile = path.resolve(params.inFile);
  const outFile = path.resolve(params.outFile);

  const raw = await fs.readFile(inFile, "utf8");
  const rows = parseCsv(raw);
  const objs = rowsToObjects(rows);

  // Expected headers (from NIST sheet): Function, Category, Subcategory, ...
  const items = new Map<string, { id: string; title: string }>();

  for (const r of objs) {
    const sub = String(r["Subcategory"] ?? "").trim();
    if (!sub) continue;
    const m = sub.match(/^([A-Z]{2}\.[A-Z]{2}-\d{2})\s*:\s*(.+)$/);
    if (!m) continue;
    const id = m[1];
    const title = m[2];
    if (!items.has(id)) items.set(id, { id, title });
  }

  const controls = [...items.values()]
    .sort((a, b) => a.id.localeCompare(b.id, "en"))
    .map((x) => ({
      id: x.id,
      framework: "nist-csf-2.0",
      title: x.title,
      tags: { domains: [], cia: [], type: [] },
      sources: ["NIST CSF 2.0 (CSV export from NIST CSF Reference Tool xlsx)"]
    }));

  const payload = {
    id: "nist-csf-2.0.outcomes",
    framework: "nist-csf-2.0",
    version: "2.0",
    controls
  };

  await writeYamlFile(outFile, payload);
  console.log(`Imported ${controls.length} NIST CSF outcomes -> ${outFile}`);
}
