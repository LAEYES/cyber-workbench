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
  | "compliance-checklist"
  | "iam-policy"
  | "mfa-standard"
  | "pam-standard"
  | "iam-pam-checklist";

function normalizeDoc(doc: string): DocKind {
  const raw = doc.trim();
  const v = raw.toLowerCase();

  // Domain D01
  if (v === "pssi" || v === "pol_d01_pssi" || v === "pol-d01-pssi") return "pssi";
  if (v === "risk-register" || v === "tmp_d01_riskregister" || v === "tmp-d01-riskregister")
    return "risk-register";
  if (v === "isms-pack" || v === "tmp_d01_isms_pack" || v === "tmp-d01-isms-pack") return "isms-pack";
  if (v === "asset-inventory" || v === "tmp_d01_assetinventory" || v === "tmp-d01-assetinventory")
    return "asset-inventory";
  if (v === "tprm-questionnaire" || v === "chk_d01_tprm_questionnaire" || v === "chk-d01-tprm-questionnaire")
    return "tprm-questionnaire";
  if (v === "compliance-checklist" || v === "chk_d01_compliance" || v === "chk-d01-compliance")
    return "compliance-checklist";

  // Domain D02
  if (v === "iam-policy" || v === "pol_d02_iam" || v === "pol-d02-iam") return "iam-policy";
  if (v === "mfa-standard" || v === "std_d02_mfa" || v === "std-d02-mfa") return "mfa-standard";
  if (v === "pam-standard" || v === "std_d02_pam" || v === "std-d02-pam") return "pam-standard";
  if (v === "iam-pam-checklist" || v === "chk_d02_iam_pam" || v === "chk-d02-iam-pam")
    return "iam-pam-checklist";

  throw new Error(`Doc inconnu: ${raw}`);
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

  if (doc === "iam-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("02-iam", "iam-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "02-iam", `POL_D02_IAM_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("02-iam", "iam-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "02-iam", `POL_D02_IAM_${org}_EN.md`)
      });
  }

  if (doc === "mfa-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("02-iam", "mfa-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "02-iam", `STD_D02_MFA_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("02-iam", "mfa-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "02-iam", `STD_D02_MFA_${org}_EN.md`)
      });
  }

  if (doc === "pam-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("02-iam", "pam-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "02-iam", `STD_D02_PAM_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("02-iam", "pam-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "02-iam", `STD_D02_PAM_${org}_EN.md`)
      });
  }

  if (doc === "iam-pam-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("02-iam", "iam-pam-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "02-iam", `CHK_D02_IAM_PAM_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("02-iam", "iam-pam-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "02-iam", `CHK_D02_IAM_PAM_${org}_EN.md`)
      });
  }

  for (const t of tasks) {
    const rendered = await renderTemplate(t.template, context);
    await writeFileEnsured(t.out, rendered);
    console.log(`OK: ${t.out}`);
  }
}
