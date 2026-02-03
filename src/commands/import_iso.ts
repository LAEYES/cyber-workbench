import path from "node:path";
import { promises as fs } from "node:fs";
import * as XLSX from "xlsx";
import { writeYamlFile } from "../catalog/write.js";
import { splitList } from "../catalog/csv.js";

type IsoRow = {
  id: string;
  domain?: string;
  title_short?: string;
  tags_domains?: string;
  tags_cia?: string;
  tags_type?: string;
};

function norm(s: any): string {
  return String(s ?? "").trim();
}

export async function importIso27002(params: { inFile: string; outFile: string; version?: string }) {
  const inFile = path.resolve(params.inFile);
  const outFile = path.resolve(params.outFile);
  const version = params.version ?? "2022";

  const buf = await fs.readFile(inFile);
  const wb = XLSX.read(buf, { type: "buffer" });
  const sheetName = wb.SheetNames[0];
  if (!sheetName) throw new Error("No worksheet found");
  const ws = wb.Sheets[sheetName];

  const rows = XLSX.utils.sheet_to_json<IsoRow>(ws, { defval: "" });

  const controls = rows
    .map((r) => {
      const id = norm((r as any).id ?? (r as any).ID);
      if (!id) return null;

      const domain = norm((r as any).domain ?? (r as any).Domain);
      const title = norm((r as any).title_short ?? (r as any).title ?? (r as any).Title ?? id);

      return {
        id,
        framework: "iso-27002-2022",
        title,
        domain: domain || undefined,
        tags: {
          domains: splitList(norm((r as any).tags_domains ?? (r as any).Domains)),
          cia: splitList(norm((r as any).tags_cia ?? (r as any).CIA)) as any,
          type: splitList(norm((r as any).tags_type ?? (r as any).Type)) as any
        },
        sources: ["ISO/IEC 27002:2022"]
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => String(a.id).localeCompare(String(b.id), "en"));

  const payload = {
    id: "iso27002-2022.controls",
    framework: "iso-27002-2022",
    version,
    controls
  };

  await writeYamlFile(outFile, payload);
  console.log(`Imported ${controls.length} ISO controls -> ${outFile}`);
}
