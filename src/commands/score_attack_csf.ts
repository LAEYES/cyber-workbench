import path from "node:path";
import { promises as fs } from "node:fs";
import { loadYamlFile } from "../catalog/io.js";
import { writeYamlFile } from "../catalog/write.js";
import { MappingSchema } from "../catalog/schemas.js";

function csvEscape(v: string) {
  const s = String(v ?? "");
  if (/[",\n\r]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function invertCsfTo80053(map: any): Map<string, Set<string>> {
  const inv = new Map<string, Set<string>>();
  for (const item of map.items ?? []) {
    const csfId = item.from?.id;
    if (!csfId) continue;
    for (const to of item.to ?? []) {
      if (to.framework !== "nist-800-53-r5") continue;
      const ctrl = to.id;
      if (!inv.has(ctrl)) inv.set(ctrl, new Set());
      inv.get(ctrl)!.add(csfId);
    }
  }
  return inv;
}

export async function scoreAttackCsf(params: {
  attackTo80053File: string;
  csfTo80053File: string;
  outCsv: string;
  outEnrichedMapping?: string;
  topOutcomes?: number;
}) {
  const attack2ctrl = await loadYamlFile(path.resolve(params.attackTo80053File), MappingSchema);
  const csf2ctrl = await loadYamlFile(path.resolve(params.csfTo80053File), MappingSchema);

  const ctrlToCsf = invertCsfTo80053(csf2ctrl);

  // Precompute outcome -> set(controls)
  const csfOutcomeToCtrls = new Map<string, Set<string>>();
  for (const it of csf2ctrl.items ?? []) {
    const csfId = it.from.id;
    const set = new Set<string>();
    for (const to of it.to ?? []) {
      if (to.framework === "nist-800-53-r5") set.add(to.id);
    }
    csfOutcomeToCtrls.set(csfId, set);
  }

  const lines: string[] = [];
  lines.push("attack_technique,attack_80053_controls_count,csf_outcomes_count,top_outcomes");

  // Optional: enriched mapping items (tech -> csf) with meta scores
  const enrichedItems: any[] = [];

  for (const it of attack2ctrl.items ?? []) {
    const techId = it.from.id;
    const controls = new Set<string>();
    for (const to of it.to ?? []) {
      if (to.framework === "nist-800-53-r5") controls.add(to.id);
    }

    // outcome -> intersection size
    const scoreByOutcome = new Map<string, number>();

    for (const ctrl of controls) {
      const csfIds = ctrlToCsf.get(ctrl);
      if (!csfIds) continue;
      for (const cid of csfIds) scoreByOutcome.set(cid, (scoreByOutcome.get(cid) ?? 0) + 1);
    }

    const scored = [...scoreByOutcome.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([cid, s]) => ({ cid, s }));

    const topN = params.topOutcomes ?? 5;
    const top = scored.slice(0, topN);

    const topStr = top.map((x) => `${x.cid}:${x.s}`).join(";");

    lines.push([techId, String(controls.size), String(scored.length), topStr].map(csvEscape).join(","));

    // Build enriched mapping item with meta
    if (scored.length) {
      enrichedItems.push({
        from: { framework: "mitre-attack", id: techId },
        to: scored.slice(0, 10).map((x) => ({ framework: "nist-csf-2.0", id: x.cid })),
        confidence: "medium",
        rationale:
          "Derived from CTID ATT&CK→800-53 (high) chained with NIST CSF→800-53 informative references (high). Score = #shared 800-53 controls.",
        meta: {
          attack80053Controls: controls.size,
          csfOutcomes: scored.length,
          topScores: top
        }
      });
    }
  }

  const outCsv = path.resolve(params.outCsv);
  await fs.mkdir(path.dirname(outCsv), { recursive: true });
  await fs.writeFile(outCsv, lines.join("\n") + "\n", "utf8");
  console.log(`Wrote score CSV -> ${outCsv}`);

  if (params.outEnrichedMapping) {
    await writeYamlFile(path.resolve(params.outEnrichedMapping), {
      id: "mitre-attack_to_nist-csf-2.0_via_800-53_scored",
      fromFramework: "mitre-attack",
      toFramework: "nist-csf-2.0",
      items: enrichedItems
    });
    console.log(`Wrote enriched mapping -> ${params.outEnrichedMapping}`);
  }
}
