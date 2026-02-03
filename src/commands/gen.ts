import path from "node:path";
import { loadConfig, Lang } from "../lib/config.js";
import { renderTemplate, tplPath } from "../lib/templating.js";
import { writeFileEnsured } from "../lib/fsx.js";

type DocKind = "pssi" | "risk-register";

function normalizeDoc(doc: string): DocKind {
  if (doc === "pssi") return "pssi";
  if (doc === "risk-register") return "risk-register";
  throw new Error(`Doc inconnu: ${doc}`);
}

function normalizeLang(lang: string | undefined, fallback: Lang): Lang {
  const v = (lang ?? fallback) as Lang;
  if (v !== "fr" && v !== "en" && v !== "both") return fallback;
  return v;
}

export async function genDoc(params: { doc: string; org?: string; lang?: string; outDir: string }) {
  const outDir = path.resolve(params.outDir);
  const cfg = await loadConfig(outDir);

  const doc = normalizeDoc(params.doc);
  const lang = normalizeLang(params.lang, cfg.lang);
  const org = params.org ?? cfg.org;

  const context = {
    org,
    profiles: cfg.profiles,
    today: new Date().toISOString().slice(0, 10)
  };

  const tasks: Array<{ template: string; out: string }> = [];

  if (doc === "pssi") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "pssi.fr.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `PSSI_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "pssi.en.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `ISMS_Policy_${org}_EN.md`)
      });
  }

  if (doc === "risk-register") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "risk-register.fr.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `Registre_Risques_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "risk-register.en.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `Risk_Register_${org}_EN.md`)
      });
  }

  for (const t of tasks) {
    const rendered = await renderTemplate(t.template, context);
    await writeFileEnsured(t.out, rendered);
    console.log(`OK: ${t.out}`);
  }
}
