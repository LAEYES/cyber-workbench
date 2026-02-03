import path from "node:path";
import { loadYamlFile } from "../catalog/io.js";
import { ControlCatalogSchema, MappingSchema } from "../catalog/schemas.js";

export async function validateCatalog(params: { rootDir: string }) {
  const root = path.resolve(params.rootDir);

  const controlFiles = [
    path.join(root, "controls", "iso27002-2022.controls.yml"),
    path.join(root, "controls", "nist-csf-2.0.subcategories.yml"),
    path.join(root, "controls", "cis-v8.safeguards.yml")
  ];

  const mappingFiles = [
    path.join(root, "mappings", "iso27002_to_nist-csf.yml"),
    path.join(root, "mappings", "cis_to_iso_nist.yml")
  ];

  for (const f of controlFiles) {
    await loadYamlFile(f, ControlCatalogSchema);
    console.log(`OK controls: ${f}`);
  }

  for (const f of mappingFiles) {
    await loadYamlFile(f, MappingSchema);
    console.log(`OK mapping: ${f}`);
  }
}
