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
  | "iam-pam-checklist"
  | "network-security-policy"
  | "segmentation-standard"
  | "firewall-standard"
  | "vpn-ztna-standard"
  | "network-checklist"
  | "cloud-security-policy"
  | "cloud-iam-standard"
  | "iac-security-standard"
  | "secrets-management-standard"
  | "cloud-devsecops-checklist"
  | "endpoint-security-policy"
  | "hardening-standard"
  | "patch-management-standard"
  | "edr-standard"
  | "endpoint-checklist"
  | "application-security-policy"
  | "secure-development-standard"
  | "vulnerability-management-standard"
  | "appsec-checklist"
  | "data-protection-policy"
  | "data-classification-standard"
  | "encryption-key-management-standard"
  | "backup-recovery-standard"
  | "data-protection-checklist";

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

  // Domain D03
  if (
    v === "network-security-policy" ||
    v === "pol_d03_networksecurity" ||
    v === "pol-d03-networksecurity" ||
    v === "pol_d03_network_security" ||
    v === "pol-d03-network-security"
  )
    return "network-security-policy";
  if (v === "segmentation-standard" || v === "std_d03_segmentation" || v === "std-d03-segmentation")
    return "segmentation-standard";
  if (v === "firewall-standard" || v === "std_d03_firewall" || v === "std-d03-firewall")
    return "firewall-standard";
  if (v === "vpn-ztna-standard" || v === "std_d03_vpn_ztna" || v === "std-d03-vpn-ztna")
    return "vpn-ztna-standard";
  if (v === "network-checklist" || v === "chk_d03_network" || v === "chk-d03-network")
    return "network-checklist";

  // Domain D04
  if (
    v === "cloud-security-policy" ||
    v === "pol_d04_cloudsecurity" ||
    v === "pol-d04-cloudsecurity" ||
    v === "pol_d04_cloud_security" ||
    v === "pol-d04-cloud-security" ||
    v === "pol_d04_cloud" ||
    v === "pol-d04-cloud"
  )
    return "cloud-security-policy";

  if (
    v === "cloud-iam-standard" ||
    v === "std_d04_cloudiam" ||
    v === "std-d04-cloudiam" ||
    v === "std_d04_cloud_iam" ||
    v === "std-d04-cloud-iam"
  )
    return "cloud-iam-standard";

  if (
    v === "iac-security-standard" ||
    v === "std_d04_iac_security" ||
    v === "std-d04-iac-security" ||
    v === "std_d04_iac" ||
    v === "std-d04-iac"
  )
    return "iac-security-standard";

  if (
    v === "secrets-management-standard" ||
    v === "std_d04_secretsmanagement" ||
    v === "std-d04-secretsmanagement" ||
    v === "std_d04_secrets" ||
    v === "std-d04-secrets" ||
    v === "std_d04_secrets_management" ||
    v === "std-d04-secrets-management"
  )
    return "secrets-management-standard";

  if (
    v === "cloud-devsecops-checklist" ||
    v === "chk_d04_clouddevsecops" ||
    v === "chk-d04-clouddevsecops" ||
    v === "chk_d04_cloud_devsecops" ||
    v === "chk-d04-cloud-devsecops"
  )
    return "cloud-devsecops-checklist";

  // Domain D05
  if (
    v === "endpoint-security-policy" ||
    v === "pol_d05_endpointsecurity" ||
    v === "pol-d05-endpointsecurity" ||
    v === "pol_d05_endpoints" ||
    v === "pol-d05-endpoints" ||
    v === "pol_d05_endpoint" ||
    v === "pol-d05-endpoint"
  )
    return "endpoint-security-policy";

  if (
    v === "hardening-standard" ||
    v === "std_d05_hardening" ||
    v === "std-d05-hardening"
  )
    return "hardening-standard";

  if (
    v === "patch-management-standard" ||
    v === "std_d05_patch_management" ||
    v === "std-d05-patch-management" ||
    v === "std_d05_patchmanagement" ||
    v === "std-d05-patchmanagement" ||
    v === "std_d05_patching" ||
    v === "std-d05-patching"
  )
    return "patch-management-standard";

  if (
    v === "edr-standard" ||
    v === "std_d05_edr" ||
    v === "std-d05-edr" ||
    v === "std_d05_av" ||
    v === "std-d05-av"
  )
    return "edr-standard";

  if (
    v === "endpoint-checklist" ||
    v === "chk_d05_endpoints" ||
    v === "chk-d05-endpoints" ||
    v === "chk_d05_endpoint" ||
    v === "chk-d05-endpoint"
  )
    return "endpoint-checklist";

  // Domain D06
  if (
    v === "application-security-policy" ||
    v === "pol_d06_appsec" ||
    v === "pol-d06-appsec" ||
    v === "pol_d06_application_security" ||
    v === "pol-d06-application-security" ||
    v === "pol_d06_application" ||
    v === "pol-d06-application"
  )
    return "application-security-policy";

  if (
    v === "secure-development-standard" ||
    v === "std_d06_secure_development" ||
    v === "std-d06-secure-development" ||
    v === "std_d06_securedevelopment" ||
    v === "std-d06-securedevelopment" ||
    v === "std_d06_coding" ||
    v === "std-d06-coding"
  )
    return "secure-development-standard";

  if (
    v === "vulnerability-management-standard" ||
    v === "std_d06_vuln_mgmt" ||
    v === "std-d06-vuln-mgmt" ||
    v === "std_d06_vulnerability_management" ||
    v === "std-d06-vulnerability-management" ||
    v === "std_d06_vulnerabilitymanagement" ||
    v === "std-d06-vulnerabilitymanagement"
  )
    return "vulnerability-management-standard";

  if (
    v === "appsec-checklist" ||
    v === "chk_d06_appsec" ||
    v === "chk-d06-appsec"
  )
    return "appsec-checklist";

  // Domain D07
  if (
    v === "data-protection-policy" ||
    v === "pol_d07_dataprotection" ||
    v === "pol-d07-dataprotection" ||
    v === "pol_d07_data_protection" ||
    v === "pol-d07-data-protection"
  )
    return "data-protection-policy";

  if (
    v === "data-classification-standard" ||
    v === "std_d07_data_classification" ||
    v === "std-d07-data-classification" ||
    v === "std_d07_dataclassification" ||
    v === "std-d07-dataclassification" ||
    v === "std_d07_classification" ||
    v === "std-d07-classification"
  )
    return "data-classification-standard";

  if (
    v === "encryption-key-management-standard" ||
    v === "std_d07_encryption" ||
    v === "std-d07-encryption" ||
    v === "std_d07_encryptionandkeymanagement" ||
    v === "std-d07-encryptionandkeymanagement" ||
    v === "std_d07_kms" ||
    v === "std-d07-kms"
  )
    return "encryption-key-management-standard";

  if (
    v === "backup-recovery-standard" ||
    v === "std_d07_backup_recovery" ||
    v === "std-d07-backup-recovery" ||
    v === "std_d07_backupandrecovery" ||
    v === "std-d07-backupandrecovery" ||
    v === "std_d07_backup" ||
    v === "std-d07-backup"
  )
    return "backup-recovery-standard";

  if (
    v === "data-protection-checklist" ||
    v === "chk_d07_data_protection" ||
    v === "chk-d07-data-protection" ||
    v === "chk_d07_dataprotection" ||
    v === "chk-d07-dataprotection"
  )
    return "data-protection-checklist";

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

  // Domain D03
  if (doc === "network-security-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("03-reseau", "network-security-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "03-reseau", `POL_D03_NetworkSecurity_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("03-reseau", "network-security-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "03-reseau", `POL_D03_NetworkSecurity_${org}_EN.md`)
      });
  }

  if (doc === "segmentation-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("03-reseau", "segmentation-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "03-reseau", `STD_D03_Segmentation_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("03-reseau", "segmentation-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "03-reseau", `STD_D03_Segmentation_${org}_EN.md`)
      });
  }

  if (doc === "firewall-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("03-reseau", "firewall-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "03-reseau", `STD_D03_Firewall_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("03-reseau", "firewall-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "03-reseau", `STD_D03_Firewall_${org}_EN.md`)
      });
  }

  if (doc === "vpn-ztna-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("03-reseau", "vpn-ztna-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "03-reseau", `STD_D03_VPN_ZTNA_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("03-reseau", "vpn-ztna-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "03-reseau", `STD_D03_VPN_ZTNA_${org}_EN.md`)
      });
  }

  if (doc === "network-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("03-reseau", "network-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "03-reseau", `CHK_D03_Network_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("03-reseau", "network-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "03-reseau", `CHK_D03_Network_${org}_EN.md`)
      });
  }

  // Domain D04
  if (doc === "cloud-security-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("04-cloud-devsecops", "cloud-security-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "04-cloud-devsecops", `POL_D04_CloudSecurity_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("04-cloud-devsecops", "cloud-security-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "04-cloud-devsecops", `POL_D04_CloudSecurity_${org}_EN.md`)
      });
  }

  if (doc === "cloud-iam-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("04-cloud-devsecops", "cloud-iam-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "04-cloud-devsecops", `STD_D04_CloudIAM_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("04-cloud-devsecops", "cloud-iam-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "04-cloud-devsecops", `STD_D04_CloudIAM_${org}_EN.md`)
      });
  }

  if (doc === "iac-security-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("04-cloud-devsecops", "iac-security-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "04-cloud-devsecops", `STD_D04_IaC_Security_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("04-cloud-devsecops", "iac-security-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "04-cloud-devsecops", `STD_D04_IaC_Security_${org}_EN.md`)
      });
  }

  if (doc === "secrets-management-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("04-cloud-devsecops", "secrets-management-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "04-cloud-devsecops", `STD_D04_SecretsManagement_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("04-cloud-devsecops", "secrets-management-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "04-cloud-devsecops", `STD_D04_SecretsManagement_${org}_EN.md`)
      });
  }

  if (doc === "cloud-devsecops-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("04-cloud-devsecops", "cloud-devsecops-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "04-cloud-devsecops", `CHK_D04_CloudDevSecOps_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("04-cloud-devsecops", "cloud-devsecops-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "04-cloud-devsecops", `CHK_D04_CloudDevSecOps_${org}_EN.md`)
      });
  }

  // Domain D05
  if (doc === "endpoint-security-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("05-endpoints", "endpoint-security-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "05-endpoints", `POL_D05_EndpointSecurity_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("05-endpoints", "endpoint-security-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "05-endpoints", `POL_D05_EndpointSecurity_${org}_EN.md`)
      });
  }

  if (doc === "hardening-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("05-endpoints", "hardening-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "05-endpoints", `STD_D05_Hardening_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("05-endpoints", "hardening-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "05-endpoints", `STD_D05_Hardening_${org}_EN.md`)
      });
  }

  if (doc === "patch-management-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("05-endpoints", "patch-management-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "05-endpoints", `STD_D05_PatchManagement_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("05-endpoints", "patch-management-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "05-endpoints", `STD_D05_PatchManagement_${org}_EN.md`)
      });
  }

  if (doc === "edr-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("05-endpoints", "edr-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "05-endpoints", `STD_D05_EDR_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("05-endpoints", "edr-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "05-endpoints", `STD_D05_EDR_${org}_EN.md`)
      });
  }

  if (doc === "endpoint-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("05-endpoints", "endpoint-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "05-endpoints", `CHK_D05_Endpoints_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("05-endpoints", "endpoint-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "05-endpoints", `CHK_D05_Endpoints_${org}_EN.md`)
      });
  }

  // Domain D06
  if (doc === "application-security-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("06-appsec", "application-security-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "06-appsec", `POL_D06_AppSec_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("06-appsec", "application-security-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "06-appsec", `POL_D06_AppSec_${org}_EN.md`)
      });
  }

  if (doc === "secure-development-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("06-appsec", "secure-development-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "06-appsec", `STD_D06_SecureDevelopment_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("06-appsec", "secure-development-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "06-appsec", `STD_D06_SecureDevelopment_${org}_EN.md`)
      });
  }

  if (doc === "vulnerability-management-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("06-appsec", "vulnerability-management-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "06-appsec", `STD_D06_VulnerabilityManagement_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("06-appsec", "vulnerability-management-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "06-appsec", `STD_D06_VulnerabilityManagement_${org}_EN.md`)
      });
  }

  if (doc === "appsec-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("06-appsec", "appsec-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "06-appsec", `CHK_D06_AppSec_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("06-appsec", "appsec-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "06-appsec", `CHK_D06_AppSec_${org}_EN.md`)
      });
  }

  // Domain D07
  if (doc === "data-protection-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("07-data", "data-protection-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "07-data", `POL_D07_DataProtection_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("07-data", "data-protection-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "07-data", `POL_D07_DataProtection_${org}_EN.md`)
      });
  }

  if (doc === "data-classification-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("07-data", "data-classification-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "07-data", `STD_D07_DataClassification_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("07-data", "data-classification-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "07-data", `STD_D07_DataClassification_${org}_EN.md`)
      });
  }

  if (doc === "encryption-key-management-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("07-data", "encryption-key-management-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "07-data", `STD_D07_EncryptionAndKeyManagement_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("07-data", "encryption-key-management-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "07-data", `STD_D07_EncryptionAndKeyManagement_${org}_EN.md`)
      });
  }

  if (doc === "backup-recovery-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("07-data", "backup-recovery-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "07-data", `STD_D07_BackupAndRecovery_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("07-data", "backup-recovery-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "07-data", `STD_D07_BackupAndRecovery_${org}_EN.md`)
      });
  }

  if (doc === "data-protection-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("07-data", "data-protection-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "07-data", `CHK_D07_DataProtection_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("07-data", "data-protection-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "07-data", `CHK_D07_DataProtection_${org}_EN.md`)
      });
  }

  for (const t of tasks) {
    const rendered = await renderTemplate(t.template, context);
    await writeFileEnsured(t.out, rendered);
    console.log(`OK: ${t.out}`);
  }
}
