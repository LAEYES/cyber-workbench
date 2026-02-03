import path from "node:path";
import { loadConfig, Lang } from "../lib/config.js";
import { renderTemplate, tplPath } from "../lib/templating.js";
import { writeFileEnsured } from "../lib/fsx.js";

type DocKind =
  | "pssi"
  | "risk-register"
  | "isms-pack"
  | "asset-inventory"
  | "tprm-questionnaire"
  | "compliance-checklist";

function normalizeDoc(doc: string): DocKind {
  if (doc === "pssi") return "pssi";
  if (doc === "risk-register") return "risk-register";
  if (doc === "isms-pack") return "isms-pack";
  if (doc === "asset-inventory") return "asset-inventory";
  if (doc === "tprm-questionnaire") return "tprm-questionnaire";
  if (doc === "compliance-checklist") return "compliance-checklist";
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
        out: path.join(outDir, "docs", "01-gouvernance", `POL_D01_PSSI_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "pssi.en.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `POL_D01_ISMS_Policy_${org}_EN.md`)
      });
  }

  if (doc === "risk-register") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "risk-register.fr.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `TMP_D01_RiskRegister_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "risk-register.en.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `TMP_D01_RiskRegister_${org}_EN.md`)
      });
  }

  if (doc === "isms-pack") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "isms-pack.fr.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `TMP_D01_ISMS_Pack_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "isms-pack.en.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `TMP_D01_ISMS_Pack_${org}_EN.md`)
      });
  }

  if (doc === "asset-inventory") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "asset-inventory.fr.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `TMP_D01_AssetInventory_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "asset-inventory.en.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `TMP_D01_AssetInventory_${org}_EN.md`)
      });
  }

  if (doc === "tprm-questionnaire") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "tprm-questionnaire.fr.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `CHK_D01_TPRM_Questionnaire_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "tprm-questionnaire.en.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `CHK_D01_TPRM_Questionnaire_${org}_EN.md`)
      });
  }

  if (doc === "compliance-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "compliance-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `CHK_D01_Compliance_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("01-gouvernance", "compliance-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "01-gouvernance", `CHK_D01_Compliance_${org}_EN.md`)
      });
  }

  for (const t of tasks) {
    const rendered = await renderTemplate(t.template, context);
    await writeFileEnsured(t.out, rendered);
    console.log(`OK: ${t.out}`);
  }
}
