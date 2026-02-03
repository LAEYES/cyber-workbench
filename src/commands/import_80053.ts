import path from "node:path";
import { writeYamlFile } from "../catalog/write.js";

// NIST SP 800-53 Rev5 is available in OSCAL content (JSON) from NIST.
// We'll import controls with IDs (e.g., AC-2) and titles.

type ImportParams = {
  outFile: string;
  url?: string;
};

const DEFAULT_URL =
  "https://raw.githubusercontent.com/usnistgov/oscal-content/main/nist.gov/SP800-53/rev5/json/NIST_SP-800-53_rev5_catalog.json";

export async function importNist80053(params: ImportParams) {
  const url = params.url ?? DEFAULT_URL;
  const outFile = path.resolve(params.outFile);

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} ${res.statusText}: ${url}`);
  const catalog = await res.json();

  const groups = catalog?.catalog?.groups;
  const controls: any[] = [];

  function walkControls(node: any) {
    if (!node) return;
    const arr = Array.isArray(node) ? node : [node];
    for (const x of arr) {
      const ctrls = Array.isArray(x?.controls) ? x.controls : [];
      for (const c of ctrls) {
        const id = String(c?.id ?? "").trim();
        if (!id) continue;
        const title = String(c?.title ?? id).trim();
        controls.push({
          id,
          framework: "nist-800-53-r5",
          title,
          tags: { domains: [], cia: [], type: [] },
          sources: ["NIST SP 800-53 Rev.5 (OSCAL)"]
        });

        // Include enhancements as separate entries (e.g., AC-2(1)) if present.
        const enhancements = Array.isArray(c?.controls) ? c.controls : [];
        for (const e of enhancements) {
          const eid = String(e?.id ?? "").trim();
          if (!eid) continue;
          const etitle = String(e?.title ?? eid).trim();
          controls.push({
            id: eid,
            framework: "nist-800-53-r5",
            title: etitle,
            tags: { domains: [], cia: [], type: [] },
            sources: ["NIST SP 800-53 Rev.5 (OSCAL)"]
          });
        }
      }

      // Recurse into subgroups
      const subgroups = Array.isArray(x?.groups) ? x.groups : [];
      walkControls(subgroups);
    }
  }

  walkControls(groups);

  // Deduplicate by id
  const seen = new Map<string, any>();
  for (const c of controls) {
    if (!seen.has(c.id)) seen.set(c.id, c);
  }

  const deduped = [...seen.values()].sort((a, b) => String(a.id).localeCompare(String(b.id), "en"));

  const payload = {
    id: "nist-800-53-r5.controls",
    framework: "nist-800-53-r5",
    version: "rev5",
    controls: deduped
  };

  await writeYamlFile(outFile, payload);
  console.log(`Imported ${deduped.length} NIST 800-53 controls/enhancements -> ${outFile}`);
}
