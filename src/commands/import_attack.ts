import path from "node:path";
import { writeYamlFile } from "../catalog/write.js";

type StixObj = Record<string, any>;

type AttackImportParams = {
  outFile: string;
  include: Array<"enterprise" | "ics">;
};

const SOURCES: Record<string, { url: string; framework: string; sourceName: string }> = {
  enterprise: {
    // Official MITRE ATT&CK STIX data (GitHub)
    url: "https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/enterprise-attack/enterprise-attack.json",
    framework: "mitre-attack-enterprise",
    sourceName: "mitre-attack"
  },
  ics: {
    url: "https://raw.githubusercontent.com/mitre-attack/attack-stix-data/master/ics-attack/ics-attack.json",
    framework: "mitre-attack-ics",
    sourceName: "mitre-ics-attack"
  }
};

function uniq<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

function parseBundle(bundle: any, framework: string, sourceName: string) {
  const objects: StixObj[] = Array.isArray(bundle?.objects) ? bundle.objects : [];
  const controls: any[] = [];

  for (const obj of objects) {
    if (obj?.type !== "attack-pattern") continue;
    if (obj?.revoked === true) continue;
    if (obj?.x_mitre_deprecated === true) continue;

    const extRefs = Array.isArray(obj?.external_references) ? obj.external_references : [];
    const mitreRef = extRefs.find((r: any) => r?.source_name === sourceName && typeof r?.external_id === "string");
    const externalId = mitreRef?.external_id as string | undefined;
    if (!externalId) continue;

    // Technique IDs look like Txxxx or Txxxx.xxx
    if (!/^T\d{4}(\.\d{3})?$/.test(externalId)) continue;

    const title = String(obj?.name ?? externalId).trim();

    const platforms = Array.isArray(obj?.x_mitre_platforms) ? obj.x_mitre_platforms.map(String) : [];
    const domains = Array.isArray(obj?.x_mitre_domains) ? obj.x_mitre_domains.map(String) : [];

    controls.push({
      id: externalId,
      framework,
      title,
      notes: [
        platforms.length ? `platforms=${uniq(platforms).join("|")}` : null,
        domains.length ? `domains=${uniq(domains).join("|")}` : null
      ]
        .filter(Boolean)
        .join("; ") || undefined,
      tags: { domains: [], cia: [], type: [] },
      sources: ["MITRE ATT&CK (STIX)"]
    });
  }

  controls.sort((a, b) => String(a.id).localeCompare(String(b.id), "en"));
  return controls;
}

export async function importMitreAttack(params: AttackImportParams) {
  const outFile = path.resolve(params.outFile);

  const all: any[] = [];
  for (const key of params.include) {
    const src = SOURCES[key];
    const res = await fetch(src.url);
    if (!res.ok) throw new Error(`Download failed ${res.status} ${res.statusText}: ${src.url}`);
    const json = await res.json();
    all.push(...parseBundle(json, src.framework, src.sourceName));
  }

  // Keep separate frameworks in a single file by storing framework per control.
  const payload = {
    id: "mitre-attack.techniques",
    framework: "mitre-attack",
    version: "stix",
    controls: all
  };

  await writeYamlFile(outFile, payload);
  console.log(`Imported ${all.length} ATT&CK techniques/sub-techniques -> ${outFile}`);
}
