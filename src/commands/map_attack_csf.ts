import path from "node:path";
import { loadYamlFile } from "../catalog/io.js";
import { writeYamlFile } from "../catalog/write.js";
import { ControlCatalogSchema, MappingSchema } from "../catalog/schemas.js";

function tokenize(text: string): string[] {
  const stop = new Set([
    "the",
    "and",
    "or",
    "to",
    "of",
    "in",
    "for",
    "with",
    "a",
    "an",
    "on",
    "by",
    "is",
    "are",
    "be",
    "as",
    "from",
    "that",
    "this",
    "these",
    "those",
    "using",
    "use",
    "via",
    "within",
    "at",
    "into",
    "it",
    "its",
    "their",
    "organization",
    "systems",
    "system",
    "data"
  ]);

  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter((t) => t.length >= 3 && !stop.has(t));
}

function scoreTokens(a: string[], b: string[]): number {
  const sa = new Set(a);
  let score = 0;
  for (const t of b) {
    if (sa.has(t)) score++;
  }
  return score;
}

export async function mapAttackToCsf(params: {
  attackTechniquesFile: string;
  attackMitigationsFile: string;
  techniqueToMitigationFile: string;
  csfOutcomesFile: string;
  outFile: string;
  topN?: number;
}) {
  const attackTechniques = await loadYamlFile(
    path.resolve(params.attackTechniquesFile),
    ControlCatalogSchema
  );
  const attackMitigations = await loadYamlFile(
    path.resolve(params.attackMitigationsFile),
    ControlCatalogSchema
  );
  const tech2mit = await loadYamlFile(path.resolve(params.techniqueToMitigationFile), MappingSchema);
  const csf = await loadYamlFile(path.resolve(params.csfOutcomesFile), ControlCatalogSchema);

  const csfById = new Map<string, any>();
  for (const c of csf.controls) csfById.set(c.id, c);

  const mitigationById = new Map<string, any>();
  for (const m of attackMitigations.controls) mitigationById.set(m.id, m);

  const techniqueById = new Map<string, any>();
  for (const t of attackTechniques.controls) techniqueById.set(t.id, t);

  const csfTokens = csf.controls.map((c) => ({ id: c.id, tokens: tokenize(String(c.title ?? "")) }));

  const topN = params.topN ?? 3;

  const items: any[] = [];

  for (const item of tech2mit.items) {
    const tid = item.from.id;
    const technique = techniqueById.get(tid);
    if (!technique) continue;

    // Build a text blob from technique + its mitigations
    const mitTitles: string[] = [];
    for (const toRef of item.to) {
      const mid = toRef.id;
      const m = mitigationById.get(mid);
      if (m?.title) mitTitles.push(String(m.title));
    }

    const text = `${technique.title} ${mitTitles.join(" ")}`;
    const tTokens = tokenize(text);

    const scored = csfTokens
      .map((x) => ({ id: x.id, s: scoreTokens(tTokens, x.tokens) }))
      .filter((x) => x.s >= 2)
      .sort((a, b) => b.s - a.s)
      .slice(0, topN);

    if (scored.length === 0) continue;

    // Confidence: heuristic
    const max = scored[0]?.s ?? 0;
    const confidence = max >= 5 ? "medium" : "low";

    items.push({
      from: { framework: "mitre-attack", id: tid },
      to: scored.map((x) => ({ framework: "nist-csf-2.0", id: x.id })),
      confidence,
      rationale: "Heuristic mapping based on keyword overlap between technique/mitigations and CSF outcome titles. Validate manually."
    });
  }

  const payload = {
    id: "mitre-attack_to_nist-csf-2.0",
    fromFramework: "mitre-attack",
    toFramework: "nist-csf-2.0",
    items
  };

  await writeYamlFile(path.resolve(params.outFile), payload);
  console.log(`Generated ATT&CK→CSF mapping items: ${items.length} -> ${params.outFile}`);
}
