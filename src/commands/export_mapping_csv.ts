import path from "node:path";
import { promises as fs } from "node:fs";
import { loadYamlFile } from "../catalog/io.js";
import { MappingSchema } from "../catalog/schemas.js";

function csvEscape(v: string) {
  const s = String(v ?? "");
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

export async function exportMappingCsv(params: {
  inFile: string;
  outFile: string;
  mode?: "long" | "wide";
}) {
  const inFile = path.resolve(params.inFile);
  const outFile = path.resolve(params.outFile);
  const mode = params.mode ?? "long";

  const mapping = await loadYamlFile(inFile, MappingSchema);

  const lines: string[] = [];

  if (mode === "wide") {
    lines.push("from_framework,from_id,to_framework,to_ids,confidence,rationale");
    for (const it of mapping.items) {
      const toFw = it.to?.[0]?.framework ?? mapping.toFramework;
      const toIds = it.to.map((x) => x.id).join(";");
      lines.push(
        [
          mapping.fromFramework,
          it.from.id,
          toFw,
          toIds,
          it.confidence ?? "",
          it.rationale ?? ""
        ]
          .map(csvEscape)
          .join(",")
      );
    }
  } else {
    lines.push("from_framework,from_id,to_framework,to_id,confidence,rationale");
    for (const it of mapping.items) {
      for (const to of it.to) {
        lines.push(
          [mapping.fromFramework, it.from.id, to.framework, to.id, it.confidence ?? "", it.rationale ?? ""]
            .map(csvEscape)
            .join(",")
        );
      }
    }
  }

  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, lines.join("\n") + "\n", "utf8");
  console.log(`Exported CSV (${mode}) -> ${outFile}`);
}
