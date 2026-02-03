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
  | "data-protection-checklist"
  | "compliance-legal-policy"
  | "regulatory-obligations-standard"
  | "incident-disclosure-standard"
  | "evidence-handling-standard"
  | "compliance-legal-checklist"
  | "crypto-trust-policy"
  | "pki-standard"
  | "pqc-hybrid-tls-standard"
  | "key-management-hsm-standard"
  | "crypto-trust-checklist"
  | "soc-detection-policy"
  | "siem-logging-standard"
  | "incident-response-standard"
  | "detection-usecases-standard"
  | "soc-detection-checklist"
  | "identity-zerotrust-policy"
  | "ztna-standard"
  | "continuous-auth-standard"
  | "identity-zerotrust-checklist"
  | "resilience-policy"
  | "drp-standard"
  | "bcp-standard"
  | "immutable-backup-standard"
  | "resilience-checklist"
  | "orchestration-automation-policy"
  | "playbooks-ir-soar-standard"
  | "policy-as-code-standard"
  | "evidence-audit-trails-standard"
  | "orchestration-automation-checklist"
  | "soc-interface-policy"
  | "dashboards-kpis-standard"
  | "case-management-workflows-standard"
  | "access-control-ui-standard"
  | "soc-interface-checklist";

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

  // Domain D08
  if (
    v === "compliance-legal-policy" ||
    v === "pol_d08_compliancelegal" ||
    v === "pol-d08-compliancelegal" ||
    v === "pol_d08_compliance_legal" ||
    v === "pol-d08-compliance-legal" ||
    v === "pol_d08_compliance" ||
    v === "pol-d08-compliance" ||
    v === "pol_d08_legal" ||
    v === "pol-d08-legal"
  )
    return "compliance-legal-policy";

  if (
    v === "regulatory-obligations-standard" ||
    v === "std_d08_regulatoryobligations" ||
    v === "std-d08-regulatoryobligations" ||
    v === "std_d08_regulatory_obligations" ||
    v === "std-d08-regulatory-obligations" ||
    v === "std_d08_obligations" ||
    v === "std-d08-obligations"
  )
    return "regulatory-obligations-standard";

  if (
    v === "incident-disclosure-standard" ||
    v === "std_d08_incidentdisclosure" ||
    v === "std-d08-incidentdisclosure" ||
    v === "std_d08_incident_disclosure" ||
    v === "std-d08-incident-disclosure" ||
    v === "std_d08_disclosure" ||
    v === "std-d08-disclosure"
  )
    return "incident-disclosure-standard";

  if (
    v === "evidence-handling-standard" ||
    v === "std_d08_evidencehandling" ||
    v === "std-d08-evidencehandling" ||
    v === "std_d08_evidence" ||
    v === "std-d08-evidence" ||
    v === "std_d08_chain_of_custody" ||
    v === "std-d08-chain-of-custody"
  )
    return "evidence-handling-standard";

  if (
    v === "compliance-legal-checklist" ||
    v === "chk_d08_compliancelegal" ||
    v === "chk-d08-compliancelegal" ||
    v === "chk_d08_compliance_legal" ||
    v === "chk-d08-compliance-legal" ||
    v === "chk_d08_compliance" ||
    v === "chk-d08-compliance"
  )
    return "compliance-legal-checklist";

  // Domain D09
  if (
    v === "crypto-trust-policy" ||
    v === "pol_d09_cryptotrust" ||
    v === "pol-d09-cryptotrust" ||
    v === "pol_d09_crypto_trust" ||
    v === "pol-d09-crypto-trust"
  )
    return "crypto-trust-policy";

  if (
    v === "pki-standard" ||
    v === "std_d09_pki" ||
    v === "std-d09-pki"
  )
    return "pki-standard";

  if (
    v === "pqc-hybrid-tls-standard" ||
    v === "std_d09_pqc" ||
    v === "std-d09-pqc" ||
    v === "std_d09_pqc_hybridtls" ||
    v === "std-d09-pqc-hybridtls" ||
    v === "std_d09_pqc_hybrid_tls" ||
    v === "std-d09-pqc-hybrid-tls" ||
    v === "std_d09_hybrid_tls" ||
    v === "std-d09-hybrid-tls"
  )
    return "pqc-hybrid-tls-standard";

  if (
    v === "key-management-hsm-standard" ||
    v === "std_d09_keymanagement_hsm" ||
    v === "std-d09-keymanagement-hsm" ||
    v === "std_d09_key_management_hsm" ||
    v === "std-d09-key-management-hsm" ||
    v === "std_d09_kms_hsm" ||
    v === "std-d09-kms-hsm" ||
    v === "std_d09_hsm" ||
    v === "std-d09-hsm"
  )
    return "key-management-hsm-standard";

  if (
    v === "crypto-trust-checklist" ||
    v === "chk_d09_cryptotrust" ||
    v === "chk-d09-cryptotrust" ||
    v === "chk_d09_crypto_trust" ||
    v === "chk-d09-crypto-trust"
  )
    return "crypto-trust-checklist";

  // Domain D10
  if (
    v === "soc-detection-policy" ||
    v === "pol_d10_soc" ||
    v === "pol-d10-soc" ||
    v === "pol_d10_detection" ||
    v === "pol-d10-detection" ||
    v === "pol_d10_soc_detection" ||
    v === "pol-d10-soc-detection"
  )
    return "soc-detection-policy";

  if (
    v === "siem-logging-standard" ||
    v === "std_d10_siem" ||
    v === "std-d10-siem" ||
    v === "std_d10_logging" ||
    v === "std-d10-logging" ||
    v === "std_d10_siem_logging" ||
    v === "std-d10-siem-logging"
  )
    return "siem-logging-standard";

  if (
    v === "incident-response-standard" ||
    v === "std_d10_ir" ||
    v === "std-d10-ir" ||
    v === "std_d10_incident_response" ||
    v === "std-d10-incident-response" ||
    v === "std_d10_incidentresponse" ||
    v === "std-d10-incidentresponse"
  )
    return "incident-response-standard";

  if (
    v === "detection-usecases-standard" ||
    v === "std_d10_usecases" ||
    v === "std-d10-usecases" ||
    v === "std_d10_detection_usecases" ||
    v === "std-d10-detection-usecases" ||
    v === "std_d10_detectionusecases" ||
    v === "std-d10-detectionusecases"
  )
    return "detection-usecases-standard";

  if (
    v === "soc-detection-checklist" ||
    v === "chk_d10_soc" ||
    v === "chk-d10-soc" ||
    v === "chk_d10_detection" ||
    v === "chk-d10-detection" ||
    v === "chk_d10_soc_detection" ||
    v === "chk-d10-soc-detection"
  )
    return "soc-detection-checklist";

  // Domain D11
  if (
    v === "identity-zerotrust-policy" ||
    v === "pol_d11_identity" ||
    v === "pol-d11-identity" ||
    v === "pol_d11_zerotrust" ||
    v === "pol-d11-zero-trust" ||
    v === "pol_d11_identity_zerotrust" ||
    v === "pol-d11-identity-zerotrust"
  )
    return "identity-zerotrust-policy";

  if (
    v === "ztna-standard" ||
    v === "std_d11_ztna" ||
    v === "std-d11-ztna"
  )
    return "ztna-standard";

  if (
    v === "continuous-auth-standard" ||
    v === "std_d11_continuous_auth" ||
    v === "std-d11-continuous-auth" ||
    v === "std_d11_continuousauth" ||
    v === "std-d11-continuousauth" ||
    v === "std_d11_conditional_access" ||
    v === "std-d11-conditional-access"
  )
    return "continuous-auth-standard";

  if (
    v === "identity-zerotrust-checklist" ||
    v === "chk_d11_zerotrust" ||
    v === "chk-d11-zero-trust" ||
    v === "chk_d11_identity_zerotrust" ||
    v === "chk-d11-identity-zerotrust"
  )
    return "identity-zerotrust-checklist";

  // Domain D12
  if (
    v === "resilience-policy" ||
    v === "pol_d12_resilience" ||
    v === "pol-d12-resilience" ||
    v === "pol_d12_backup" ||
    v === "pol-d12-backup"
  )
    return "resilience-policy";

  if (
    v === "drp-standard" ||
    v === "std_d12_drp" ||
    v === "std-d12-drp"
  )
    return "drp-standard";

  if (
    v === "bcp-standard" ||
    v === "std_d12_bcp" ||
    v === "std-d12-bcp"
  )
    return "bcp-standard";

  if (
    v === "immutable-backup-standard" ||
    v === "std_d12_immutable_backup" ||
    v === "std-d12-immutable-backup" ||
    v === "std_d12_immutablebackups" ||
    v === "std-d12-immutablebackups" ||
    v === "std_d12_immutable_backups" ||
    v === "std-d12-immutable-backups" ||
    v === "std_d12_worm" ||
    v === "std-d12-worm"
  )
    return "immutable-backup-standard";

  if (
    v === "resilience-checklist" ||
    v === "chk_d12_resilience" ||
    v === "chk-d12-resilience"
  )
    return "resilience-checklist";

  // Domain D13
  if (
    v === "orchestration-automation-policy" ||
    v === "pol_d13_orchestration" ||
    v === "pol-d13-orchestration" ||
    v === "pol_d13_orchestration_automation" ||
    v === "pol-d13-orchestration-automation" ||
    v === "pol_d13_automation" ||
    v === "pol-d13-automation"
  )
    return "orchestration-automation-policy";

  if (
    v === "playbooks-ir-soar-standard" ||
    v === "std_d13_playbooks" ||
    v === "std-d13-playbooks" ||
    v === "std_d13_playbooks_ir_soar" ||
    v === "std-d13-playbooks-ir-soar" ||
    v === "std_d13_soar" ||
    v === "std-d13-soar"
  )
    return "playbooks-ir-soar-standard";

  if (
    v === "policy-as-code-standard" ||
    v === "std_d13_policy_as_code" ||
    v === "std-d13-policy-as-code" ||
    v === "std_d13_policyascode" ||
    v === "std-d13-policyascode" ||
    v === "std_d13_pac" ||
    v === "std-d13-pac"
  )
    return "policy-as-code-standard";

  if (
    v === "evidence-audit-trails-standard" ||
    v === "std_d13_evidence" ||
    v === "std-d13-evidence" ||
    v === "std_d13_evidence_audittrails" ||
    v === "std-d13-evidence-audittrails" ||
    v === "std_d13_audit_trails" ||
    v === "std-d13-audit-trails"
  )
    return "evidence-audit-trails-standard";

  if (
    v === "orchestration-automation-checklist" ||
    v === "chk_d13_orchestration" ||
    v === "chk-d13-orchestration" ||
    v === "chk_d13_orchestration_automation" ||
    v === "chk-d13-orchestration-automation" ||
    v === "chk_d13_automation" ||
    v === "chk-d13-automation"
  )
    return "orchestration-automation-checklist";

  // Domain D14
  if (
    v === "soc-interface-policy" ||
    v === "pol_d14_soc_interface" ||
    v === "pol-d14-soc-interface" ||
    v === "pol_d14_soc" ||
    v === "pol-d14-soc"
  )
    return "soc-interface-policy";

  if (
    v === "dashboards-kpis-standard" ||
    v === "std_d14_dashboards" ||
    v === "std-d14-dashboards" ||
    v === "std_d14_dashboards_kpis" ||
    v === "std-d14-dashboards-kpis" ||
    v === "std_d14_dashboard_kpis" ||
    v === "std-d14-dashboard-kpis" ||
    v === "std_d14_kpis" ||
    v === "std-d14-kpis"
  )
    return "dashboards-kpis-standard";

  if (
    v === "case-management-workflows-standard" ||
    v === "std_d14_case_management" ||
    v === "std-d14-case-management" ||
    v === "std_d14_casemanagement_workflows" ||
    v === "std-d14-casemanagement-workflows" ||
    v === "std_d14_case_management_workflows" ||
    v === "std-d14-case-management-workflows" ||
    v === "std_d14_workflows" ||
    v === "std-d14-workflows"
  )
    return "case-management-workflows-standard";

  if (
    v === "access-control-ui-standard" ||
    v === "std_d14_accesscontrol_ui" ||
    v === "std-d14-accesscontrol-ui" ||
    v === "std_d14_access_control_ui" ||
    v === "std-d14-access-control-ui" ||
    v === "std_d14_rbac_ui" ||
    v === "std-d14-rbac-ui" ||
    v === "std_d14_ui_access" ||
    v === "std-d14-ui-access"
  )
    return "access-control-ui-standard";

  if (
    v === "soc-interface-checklist" ||
    v === "chk_d14_soc_interface" ||
    v === "chk-d14-soc-interface" ||
    v === "chk_d14_soc" ||
    v === "chk-d14-soc"
  )
    return "soc-interface-checklist";

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

  // Domain D08
  if (doc === "compliance-legal-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("08-compliance-legal", "compliance-legal-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "08-compliance-legal", `POL_D08_ComplianceLegal_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("08-compliance-legal", "compliance-legal-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "08-compliance-legal", `POL_D08_ComplianceLegal_${org}_EN.md`)
      });
  }

  if (doc === "regulatory-obligations-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("08-compliance-legal", "regulatory-obligations-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "08-compliance-legal", `STD_D08_RegulatoryObligations_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("08-compliance-legal", "regulatory-obligations-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "08-compliance-legal", `STD_D08_RegulatoryObligations_${org}_EN.md`)
      });
  }

  if (doc === "incident-disclosure-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("08-compliance-legal", "incident-disclosure-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "08-compliance-legal", `STD_D08_IncidentDisclosure_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("08-compliance-legal", "incident-disclosure-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "08-compliance-legal", `STD_D08_IncidentDisclosure_${org}_EN.md`)
      });
  }

  if (doc === "evidence-handling-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("08-compliance-legal", "evidence-handling-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "08-compliance-legal", `STD_D08_EvidenceHandling_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("08-compliance-legal", "evidence-handling-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "08-compliance-legal", `STD_D08_EvidenceHandling_${org}_EN.md`)
      });
  }

  if (doc === "compliance-legal-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("08-compliance-legal", "compliance-legal-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "08-compliance-legal", `CHK_D08_ComplianceLegal_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("08-compliance-legal", "compliance-legal-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "08-compliance-legal", `CHK_D08_ComplianceLegal_${org}_EN.md`)
      });
  }

  // Domain D09
  if (doc === "crypto-trust-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("09-crypto-trust", "crypto-trust-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "09-crypto-trust", `POL_D09_CryptoTrust_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("09-crypto-trust", "crypto-trust-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "09-crypto-trust", `POL_D09_CryptoTrust_${org}_EN.md`)
      });
  }

  if (doc === "pki-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("09-crypto-trust", "pki-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "09-crypto-trust", `STD_D09_PKI_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("09-crypto-trust", "pki-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "09-crypto-trust", `STD_D09_PKI_${org}_EN.md`)
      });
  }

  if (doc === "pqc-hybrid-tls-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("09-crypto-trust", "pqc-hybrid-tls-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "09-crypto-trust", `STD_D09_PQC_HybridTLS_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("09-crypto-trust", "pqc-hybrid-tls-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "09-crypto-trust", `STD_D09_PQC_HybridTLS_${org}_EN.md`)
      });
  }

  if (doc === "key-management-hsm-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("09-crypto-trust", "key-management-hsm-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "09-crypto-trust", `STD_D09_KeyManagement_HSM_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("09-crypto-trust", "key-management-hsm-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "09-crypto-trust", `STD_D09_KeyManagement_HSM_${org}_EN.md`)
      });
  }

  if (doc === "crypto-trust-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("09-crypto-trust", "crypto-trust-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "09-crypto-trust", `CHK_D09_CryptoTrust_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("09-crypto-trust", "crypto-trust-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "09-crypto-trust", `CHK_D09_CryptoTrust_${org}_EN.md`)
      });
  }

  // Domain D10
  if (doc === "soc-detection-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("10-soc-detection", "soc-detection-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "10-soc-detection", `POL_D10_SOC_Detection_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("10-soc-detection", "soc-detection-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "10-soc-detection", `POL_D10_SOC_Detection_${org}_EN.md`)
      });
  }

  if (doc === "siem-logging-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("10-soc-detection", "siem-logging-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "10-soc-detection", `STD_D10_SIEM_Logging_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("10-soc-detection", "siem-logging-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "10-soc-detection", `STD_D10_SIEM_Logging_${org}_EN.md`)
      });
  }

  if (doc === "incident-response-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("10-soc-detection", "incident-response-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "10-soc-detection", `STD_D10_IncidentResponse_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("10-soc-detection", "incident-response-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "10-soc-detection", `STD_D10_IncidentResponse_${org}_EN.md`)
      });
  }

  if (doc === "detection-usecases-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("10-soc-detection", "detection-usecases-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "10-soc-detection", `STD_D10_DetectionUseCases_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("10-soc-detection", "detection-usecases-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "10-soc-detection", `STD_D10_DetectionUseCases_${org}_EN.md`)
      });
  }

  if (doc === "soc-detection-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("10-soc-detection", "soc-detection-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "10-soc-detection", `CHK_D10_SOC_Detection_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("10-soc-detection", "soc-detection-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "10-soc-detection", `CHK_D10_SOC_Detection_${org}_EN.md`)
      });
  }

  // Domain D11
  if (doc === "identity-zerotrust-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("11-identity-zerotrust", "identity-zerotrust-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "11-identity-zerotrust", `POL_D11_Identity_ZeroTrust_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("11-identity-zerotrust", "identity-zerotrust-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "11-identity-zerotrust", `POL_D11_Identity_ZeroTrust_${org}_EN.md`)
      });
  }

  if (doc === "ztna-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("11-identity-zerotrust", "ztna-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "11-identity-zerotrust", `STD_D11_ZTNA_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("11-identity-zerotrust", "ztna-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "11-identity-zerotrust", `STD_D11_ZTNA_${org}_EN.md`)
      });
  }

  if (doc === "continuous-auth-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("11-identity-zerotrust", "continuous-auth-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "11-identity-zerotrust", `STD_D11_ContinuousAuth_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("11-identity-zerotrust", "continuous-auth-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "11-identity-zerotrust", `STD_D11_ContinuousAuth_${org}_EN.md`)
      });
  }

  if (doc === "identity-zerotrust-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("11-identity-zerotrust", "identity-zerotrust-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "11-identity-zerotrust", `CHK_D11_Identity_ZeroTrust_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("11-identity-zerotrust", "identity-zerotrust-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "11-identity-zerotrust", `CHK_D11_Identity_ZeroTrust_${org}_EN.md`)
      });
  }

  // Domain D12
  if (doc === "resilience-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("12-resilience-backup", "resilience-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "12-resilience-backup", `POL_D12_Resilience_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("12-resilience-backup", "resilience-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "12-resilience-backup", `POL_D12_Resilience_${org}_EN.md`)
      });
  }

  if (doc === "drp-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("12-resilience-backup", "drp-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "12-resilience-backup", `STD_D12_DRP_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("12-resilience-backup", "drp-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "12-resilience-backup", `STD_D12_DRP_${org}_EN.md`)
      });
  }

  if (doc === "bcp-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("12-resilience-backup", "bcp-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "12-resilience-backup", `STD_D12_BCP_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("12-resilience-backup", "bcp-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "12-resilience-backup", `STD_D12_BCP_${org}_EN.md`)
      });
  }

  if (doc === "immutable-backup-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("12-resilience-backup", "immutable-backup-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "12-resilience-backup", `STD_D12_ImmutableBackups_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("12-resilience-backup", "immutable-backup-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "12-resilience-backup", `STD_D12_ImmutableBackups_${org}_EN.md`)
      });
  }

  if (doc === "resilience-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("12-resilience-backup", "resilience-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "12-resilience-backup", `CHK_D12_Resilience_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("12-resilience-backup", "resilience-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "12-resilience-backup", `CHK_D12_Resilience_${org}_EN.md`)
      });
  }

  // Domain D13
  if (doc === "orchestration-automation-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("13-orchestration-automation", "orchestration-automation-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "13-orchestration-automation", `POL_D13_Orchestration_Automation_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("13-orchestration-automation", "orchestration-automation-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "13-orchestration-automation", `POL_D13_Orchestration_Automation_${org}_EN.md`)
      });
  }

  if (doc === "playbooks-ir-soar-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("13-orchestration-automation", "playbooks-ir-soar-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "13-orchestration-automation", `STD_D13_Playbooks_IR_SOAR_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("13-orchestration-automation", "playbooks-ir-soar-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "13-orchestration-automation", `STD_D13_Playbooks_IR_SOAR_${org}_EN.md`)
      });
  }

  if (doc === "policy-as-code-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("13-orchestration-automation", "policy-as-code-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "13-orchestration-automation", `STD_D13_PolicyAsCode_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("13-orchestration-automation", "policy-as-code-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "13-orchestration-automation", `STD_D13_PolicyAsCode_${org}_EN.md`)
      });
  }

  if (doc === "evidence-audit-trails-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("13-orchestration-automation", "evidence-audit-trails-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "13-orchestration-automation", `STD_D13_Evidence_AuditTrails_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("13-orchestration-automation", "evidence-audit-trails-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "13-orchestration-automation", `STD_D13_Evidence_AuditTrails_${org}_EN.md`)
      });
  }

  if (doc === "orchestration-automation-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("13-orchestration-automation", "orchestration-automation-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "13-orchestration-automation", `CHK_D13_Orchestration_Automation_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("13-orchestration-automation", "orchestration-automation-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "13-orchestration-automation", `CHK_D13_Orchestration_Automation_${org}_EN.md`)
      });
  }

  // Domain D14
  if (doc === "soc-interface-policy") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("14-soc-interface", "soc-interface-policy.fr.md.hbs"),
        out: path.join(outDir, "docs", "14-soc-interface", `POL_D14_SOC_Interface_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("14-soc-interface", "soc-interface-policy.en.md.hbs"),
        out: path.join(outDir, "docs", "14-soc-interface", `POL_D14_SOC_Interface_${org}_EN.md`)
      });
  }

  if (doc === "dashboards-kpis-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("14-soc-interface", "dashboards-kpis-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "14-soc-interface", `STD_D14_Dashboards_KPIs_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("14-soc-interface", "dashboards-kpis-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "14-soc-interface", `STD_D14_Dashboards_KPIs_${org}_EN.md`)
      });
  }

  if (doc === "case-management-workflows-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("14-soc-interface", "case-management-workflows-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "14-soc-interface", `STD_D14_CaseManagement_Workflows_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("14-soc-interface", "case-management-workflows-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "14-soc-interface", `STD_D14_CaseManagement_Workflows_${org}_EN.md`)
      });
  }

  if (doc === "access-control-ui-standard") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("14-soc-interface", "access-control-ui-standard.fr.md.hbs"),
        out: path.join(outDir, "docs", "14-soc-interface", `STD_D14_AccessControl_UI_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("14-soc-interface", "access-control-ui-standard.en.md.hbs"),
        out: path.join(outDir, "docs", "14-soc-interface", `STD_D14_AccessControl_UI_${org}_EN.md`)
      });
  }

  if (doc === "soc-interface-checklist") {
    if (lang === "fr" || lang === "both")
      tasks.push({
        template: tplPath("14-soc-interface", "soc-interface-checklist.fr.md.hbs"),
        out: path.join(outDir, "docs", "14-soc-interface", `CHK_D14_SOC_Interface_${org}_FR.md`)
      });
    if (lang === "en" || lang === "both")
      tasks.push({
        template: tplPath("14-soc-interface", "soc-interface-checklist.en.md.hbs"),
        out: path.join(outDir, "docs", "14-soc-interface", `CHK_D14_SOC_Interface_${org}_EN.md`)
      });
  }

  for (const t of tasks) {
    const rendered = await renderTemplate(t.template, context);
    await writeFileEnsured(t.out, rendered);
    console.log(`OK: ${t.out}`);
  }
}
