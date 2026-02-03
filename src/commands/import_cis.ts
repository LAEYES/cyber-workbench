import path from "node:path";
import { promises as fs } from "node:fs";
import { writeYamlFile } from "../catalog/write.js";
import { splitList } from "../catalog/csv.js";
import { parseCsv, rowsToObjects } from "../catalog/csv_parse.js";

function norm(s: any): string {
  return String(s ?? "").trim();
}

export async function importCisV8(params: { inFile: string; outFile: string; version?: string }) {
  const inFile = path.resolve(params.inFile);
  const outFile = path.resolve(params.outFile);
  const version = params.version ?? "8";

  const raw = await fs.readFile(inFile, "utf8");
  const rows = rowsToObjects(parseCsv(raw));

  const controls = rows
    .map((r) => {
      const id = norm((r as any).id ?? (r as any).ID);
      if (!id) return null;

      const title = norm((r as any).title_short ?? (r as any).title ?? (r as any).Title ?? id);
      const ig = splitList(norm((r as any).ig ?? (r as any).IG));
      const level = norm((r as any).level ?? (r as any).Level);

      return {
        id,
        framework: "cis-controls-v8",
        title,
        notes: [level ? `level=${level}` : null, ig.length ? `ig=${ig.join(",")}` : null].filter(Boolean).join("; ") || undefined,
        tags: {
          domains: splitList(norm((r as any).tags_domains ?? (r as any).Domains)),
          cia: splitList(norm((r as any).tags_cia ?? (r as any).CIA)) as any,
          type: splitList(norm((r as any).tags_type ?? (r as any).Type)) as any
        },
        sources: ["CIS Controls v8"]
      };
    })
    .filter(Boolean)
    .sort((a: any, b: any) => String(a.id).localeCompare(String(b.id), "en"));

  const payload = {
    id: "cis-v8.controls",
    framework: "cis-controls-v8",
    version,
    controls
  };

  await writeYamlFile(outFile, payload);
  console.log(`Imported ${controls.length} CIS items -> ${outFile}`);
}
