import path from "node:path";
import { loadYamlFile } from "../catalog/io.js";
import { ControlCatalogSchema, MappingSchema } from "../catalog/schemas.js";

export async function validateCatalog(params: { rootDir: string }) {
  const root = path.resolve(params.rootDir);

  const controlsDir = path.join(root, "controls");
  const mappingsDir = path.join(root, "mappings");

  const controlFiles = (await (await import("node:fs/promises")).readdir(controlsDir)).filter((f) => f.endsWith(".yml"));
  const mappingFiles = (await (await import("node:fs/promises")).readdir(mappingsDir)).filter((f) => f.endsWith(".yml"));

  for (const f of controlFiles) {
    const full = path.join(controlsDir, f);
    await loadYamlFile(full, ControlCatalogSchema);
    console.log(`OK controls: ${full}`);
  }

  for (const f of mappingFiles) {
    const full = path.join(mappingsDir, f);
    await loadYamlFile(full, MappingSchema);
    console.log(`OK mapping: ${full}`);
  }
}
