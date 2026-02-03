import path from "node:path";
import { writeYamlFile } from "../catalog/write.js";

type StixObj = Record<string, any>;

type AttackImportParams = {
  outTechniquesFile: string;
  outMitigationsFile: string;
  outTechniqueToMitigationFile: string;
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

  const techniqueByStixId = new Map<string, string>(); // stix-id -> Txxxx
  const mitigationByStixId = new Map<string, { id: string; title: string }>(); // stix-id -> Mxxxx

  const techniques: any[] = [];
  const mitigations: any[] = [];

  for (const obj of objects) {
    if (obj?.revoked === true) continue;
    if (obj?.x_mitre_deprecated === true) continue;

    // Techniques
    if (obj?.type === "attack-pattern") {
      const extRefs = Array.isArray(obj?.external_references) ? obj.external_references : [];
      const mitreRef = extRefs.find((r: any) => r?.source_name === sourceName && typeof r?.external_id === "string");
      const externalId = mitreRef?.external_id as string | undefined;
      if (!externalId) continue;
      if (!/^T\d{4}(\.\d{3})?$/.test(externalId)) continue;

      const title = String(obj?.name ?? externalId).trim();
      const platforms = Array.isArray(obj?.x_mitre_platforms) ? obj.x_mitre_platforms.map(String) : [];
      const domains = Array.isArray(obj?.x_mitre_domains) ? obj.x_mitre_domains.map(String) : [];

      techniqueByStixId.set(String(obj.id), externalId);

      techniques.push({
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

    // Mitigations
    if (obj?.type === "course-of-action") {
      const extRefs = Array.isArray(obj?.external_references) ? obj.external_references : [];
      const mitreRef = extRefs.find((r: any) => r?.source_name === sourceName && typeof r?.external_id === "string");
      const externalId = mitreRef?.external_id as string | undefined;
      if (!externalId) continue;
      if (!/^M\d{4}$/.test(externalId)) continue;

      const title = String(obj?.name ?? externalId).trim();
      mitigationByStixId.set(String(obj.id), { id: externalId, title });

      mitigations.push({
        id: externalId,
        framework: "mitre-attack",
        title,
        notes: framework ? `source=${framework}` : undefined,
        tags: { domains: [], cia: [], type: [] },
        sources: ["MITRE ATT&CK (STIX)"]
      });
    }
  }

  // Relationships: mitigation mitigates technique
  const rel = new Map<string, Set<string>>();
  for (const obj of objects) {
    if (obj?.type !== "relationship") continue;
    if (obj?.relationship_type !== "mitigates") continue;

    const source = mitigationByStixId.get(String(obj.source_ref));
    const targetTech = techniqueByStixId.get(String(obj.target_ref));
    if (!source || !targetTech) continue;

    if (!rel.has(targetTech)) rel.set(targetTech, new Set());
    rel.get(targetTech)!.add(source.id);
  }

  const mappingItems = [...rel.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "en"))
    .map(([techId, mids]) => ({
      from: { framework: "mitre-attack", id: techId },
      to: [...mids].sort().map((id) => ({ framework: "mitre-attack", id })),
      confidence: "high",
      rationale: "Relationship 'mitigates' extracted from MITRE ATT&CK STIX."
    }));

  techniques.sort((a, b) => String(a.id).localeCompare(String(b.id), "en"));
  mitigations.sort((a, b) => String(a.id).localeCompare(String(b.id), "en"));

  return { techniques, mitigations, mappingItems };
}

export async function importMitreAttack(params: AttackImportParams) {
  const outTechniquesFile = path.resolve(params.outTechniquesFile);
  const outMitigationsFile = path.resolve(params.outMitigationsFile);
  const outTechniqueToMitigationFile = path.resolve(params.outTechniqueToMitigationFile);

  const allTechniques: any[] = [];
  const allMitigations: any[] = [];
  const allMappingItems: any[] = [];

  for (const key of params.include) {
    const src = SOURCES[key];
    const res = await fetch(src.url);
    if (!res.ok) throw new Error(`Download failed ${res.status} ${res.statusText}: ${src.url}`);
    const json = await res.json();
    const parsed = parseBundle(json, src.framework, src.sourceName);
    allTechniques.push(...parsed.techniques);
    allMitigations.push(...parsed.mitigations);
    allMappingItems.push(...parsed.mappingItems);
  }

  // Dedup techniques/mitigations by id
  const dedupById = (arr: any[]) => {
    const m = new Map<string, any>();
    for (const x of arr) if (!m.has(x.id)) m.set(x.id, x);
    return [...m.values()].sort((a, b) => String(a.id).localeCompare(String(b.id), "en"));
  };

  const techniques = dedupById(allTechniques);
  const mitigations = dedupById(allMitigations);

  // Merge mapping items by from.id
  const merged = new Map<string, Set<string>>();
  for (const it of allMappingItems) {
    const fromId = it.from.id;
    if (!merged.has(fromId)) merged.set(fromId, new Set());
    for (const t of it.to) merged.get(fromId)!.add(t.id);
  }

  const mappingItems = [...merged.entries()]
    .sort((a, b) => a[0].localeCompare(b[0], "en"))
    .map(([techId, mids]) => ({
      from: { framework: "mitre-attack", id: techId },
      to: [...mids].sort().map((id) => ({ framework: "mitre-attack", id })),
      confidence: "high",
      rationale: "Relationship 'mitigates' extracted from MITRE ATT&CK STIX."
    }));

  await writeYamlFile(outTechniquesFile, {
    id: "mitre-attack.techniques",
    framework: "mitre-attack",
    version: "stix",
    controls: techniques
  });

  await writeYamlFile(outMitigationsFile, {
    id: "mitre-attack.mitigations",
    framework: "mitre-attack",
    version: "stix",
    controls: mitigations
  });

  await writeYamlFile(outTechniqueToMitigationFile, {
    id: "mitre-attack.techniques_to_mitigations",
    fromFramework: "mitre-attack",
    toFramework: "mitre-attack",
    items: mappingItems
  });

  console.log(`Imported ATT&CK techniques: ${techniques.length} -> ${outTechniquesFile}`);
  console.log(`Imported ATT&CK mitigations: ${mitigations.length} -> ${outMitigationsFile}`);
  console.log(`Generated technique→mitigation mappings: ${mappingItems.length} -> ${outTechniqueToMitigationFile}`);
}
