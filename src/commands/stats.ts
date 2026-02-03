import path from "node:path";
import { promises as fs } from "node:fs";
import { loadYamlFile } from "../catalog/io.js";
import { ControlCatalogSchema, MappingSchema } from "../catalog/schemas.js";

async function listYml(dir: string) {
  const entries = await fs.readdir(dir);
  return entries.filter((f) => f.endsWith(".yml")).map((f) => path.join(dir, f));
}

export async function catalogStats(params: { rootDir: string }) {
  const root = path.resolve(params.rootDir);
  const controlsDir = path.join(root, "controls");
  const mappingsDir = path.join(root, "mappings");

  const controlFiles = await listYml(controlsDir);
  const mappingFiles = await listYml(mappingsDir);

  const controlCounts: Array<{ file: string; id: string; framework: string; n: number }> = [];
  for (const f of controlFiles) {
    const c = await loadYamlFile(f, ControlCatalogSchema);
    controlCounts.push({ file: path.basename(f), id: c.id, framework: c.framework, n: c.controls.length });
  }

  const mappingCounts: Array<{ file: string; id: string; from: string; to: string; n: number }> = [];
  for (const f of mappingFiles) {
    const m = await loadYamlFile(f, MappingSchema);
    mappingCounts.push({ file: path.basename(f), id: m.id, from: m.fromFramework, to: m.toFramework, n: m.items.length });
  }

  const out = {
    controls: {
      files: controlCounts,
      totalControls: controlCounts.reduce((a, x) => a + x.n, 0)
    },
    mappings: {
      files: mappingCounts,
      totalItems: mappingCounts.reduce((a, x) => a + x.n, 0)
    }
  };

  console.log(JSON.stringify(out, null, 2));
}
