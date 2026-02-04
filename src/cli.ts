#!/usr/bin/env node
import { Command } from "commander";
import { initWorkspace } from "./commands/init.js";
import { genDoc } from "./commands/gen.js";
import { validateCatalog } from "./commands/catalog.js";
import { importNistCsfFromCsv } from "./commands/import_nist_csv.js";
import { importNistCsfFromXlsx } from "./commands/import_nist_xlsx.js";
import { importIso27002 } from "./commands/import_iso.js";
import { importCisV8 } from "./commands/import_cis.js";
import { importNist80053 } from "./commands/import_80053.js";
import { importMitreAttack } from "./commands/import_attack.js";
import { importCtidAttackToNist80053 } from "./commands/import_ctid_nist80053.js";
import { mapAttackToCsf } from "./commands/map_attack_csf.js";
import { mapAttackToCsfVia80053 } from "./commands/map_attack_csf_via80053.js";
import { mapAttackToCsfFrom80053 } from "./commands/map_attack_csf_from80053.js";
import { exportMappingCsv } from "./commands/export_mapping_csv.js";
import { scoreAttackCsf } from "./commands/score_attack_csf.js";
import { catalogStats } from "./commands/stats.js";
import { catalogRefresh } from "./commands/refresh.js";
import { loadSourcesFile, resolveSource } from "./catalog/sources.js";
import { natoMvpExport } from "./commands/nato_mvp_export.js";
import { natoMvpVerifyBundle } from "./commands/nato_mvp_verify.js";
import { natoMvpVerifyManifest } from "./commands/nato_mvp_verify_manifest.js";
import { natoMvpGenerateSigningKey } from "./commands/nato_mvp_keys.js";
import { natoMvpRiskCreate, natoMvpRiskGet } from "./commands/nato_mvp_risk.js";
import { natoMvpDecisionCreate } from "./commands/nato_mvp_decision.js";
import { natoMvpExportFromStore } from "./commands/nato_mvp_export_from_store.js";
import { natoMvpExportFromRequestId } from "./commands/nato_mvp_export_from_requestid.js";
import { natoMvpCaseCreate, natoMvpCaseGet } from "./commands/nato_mvp_case.js";

const program = new Command();

program
  .name("cyberwb")
  .description("Cyber Workbench: génération de livrables cyber (FR/EN)")
  .version("0.1.0");

program
  .command("init")
  .description("Initialise une arborescence de livrables + configuration")
  .option("--org <name>", "Nom de l'organisation", "ORG")
  .option("--lang <lang>", "fr|en|both", "both")
  .option("--out <dir>", "Dossier cible", "./deliverables")
  .action(async (opts) => {
    await initWorkspace({ org: opts.org, lang: opts.lang, outDir: opts.out });
  });

program
  .command("gen")
  .description("Génère un livrable")
  .argument(
    "<doc>",
    "pssi|risk-register|isms-pack|asset-inventory|tprm-questionnaire|compliance-checklist|iam-policy|mfa-standard|pam-standard|iam-pam-checklist|network-security-policy|segmentation-standard|firewall-standard|vpn-ztna-standard|network-checklist|cloud-security-policy|cloud-iam-standard|iac-security-standard|secrets-management-standard|cloud-devsecops-checklist|endpoint-security-policy|hardening-standard|patch-management-standard|edr-standard|endpoint-checklist|application-security-policy|secure-development-standard|vulnerability-management-standard|appsec-checklist|data-protection-policy|data-classification-standard|encryption-key-management-standard|backup-recovery-standard|data-protection-checklist|compliance-legal-policy|regulatory-obligations-standard|incident-disclosure-standard|evidence-handling-standard|compliance-legal-checklist|crypto-trust-policy|pki-standard|pqc-hybrid-tls-standard|key-management-hsm-standard|crypto-trust-checklist|soc-detection-policy|siem-logging-standard|incident-response-standard|detection-usecases-standard|soc-detection-checklist|identity-zerotrust-policy|ztna-standard|continuous-auth-standard|identity-zerotrust-checklist|resilience-policy|drp-standard|bcp-standard|immutable-backup-standard|resilience-checklist|orchestration-automation-policy|playbooks-ir-soar-standard|policy-as-code-standard|evidence-audit-trails-standard|orchestration-automation-checklist (aliases: POL_D02_IAM, STD_D02_MFA, STD_D02_PAM, CHK_D02_IAM_PAM, POL_D03_NetworkSecurity, STD_D03_Segmentation, STD_D03_Firewall, STD_D03_VPN_ZTNA, CHK_D03_Network, POL_D04_CloudSecurity, STD_D04_CloudIAM, STD_D04_IaC_Security, STD_D04_SecretsManagement, CHK_D04_CloudDevSecOps, POL_D05_EndpointSecurity, STD_D05_Hardening, STD_D05_PatchManagement, STD_D05_EDR, CHK_D05_Endpoints, POL_D06_AppSec, STD_D06_SecureDevelopment, STD_D06_VulnerabilityManagement, CHK_D06_AppSec, POL_D07_DataProtection, STD_D07_DataClassification, STD_D07_EncryptionAndKeyManagement, STD_D07_BackupAndRecovery, CHK_D07_DataProtection, POL_D08_ComplianceLegal, STD_D08_RegulatoryObligations, STD_D08_IncidentDisclosure, STD_D08_EvidenceHandling, CHK_D08_ComplianceLegal, POL_D09_CryptoTrust, STD_D09_PKI, STD_D09_PQC_HybridTLS, STD_D09_KeyManagement_HSM, CHK_D09_CryptoTrust, POL_D10_SOC_Detection, STD_D10_SIEM_Logging, STD_D10_IncidentResponse, STD_D10_DetectionUseCases, CHK_D10_SOC_Detection, POL_D11_Identity_ZeroTrust, STD_D11_ZTNA, STD_D11_ContinuousAuth, CHK_D11_Identity_ZeroTrust, POL_D12_Resilience, STD_D12_DRP, STD_D12_BCP, STD_D12_ImmutableBackups, CHK_D12_Resilience, POL_D13_Orchestration_Automation, STD_D13_Playbooks_IR_SOAR, STD_D13_PolicyAsCode, STD_D13_Evidence_AuditTrails, CHK_D13_Orchestration_Automation, POL_D14_SOC_Interface, STD_D14_Dashboards_KPIs, STD_D14_CaseManagement_Workflows, STD_D14_AccessControl_UI, CHK_D14_SOC_Interface, POL_D15_RiskEngine, STD_D15_RiskScoringModel, STD_D15_Control_Evidence_Linkage, STD_D15_AI_Assist_Guardrails, CHK_D15_RiskEngine, POL_D16_SupplyChainSecurity, STD_D16_SoftwareProvenance_SLSA, STD_D16_SBOM_VEX_Management, STD_D16_ArtifactSigning_Verification, CHK_D16_SupplyChainSecurity, POL_D17_WorkloadIdentity, STD_D17_WorkloadIdentity, STD_D17_Attestation_RuntimeIntegrity, STD_D17_SecretlessAccess, CHK_D17_WorkloadIdentity, POL_D18_Deception, STD_D18_HoneypotDeployment, STD_D18_Honeytokens_Canary, STD_D18_DeceptionResponse_Playbooks, CHK_D18_Deception, POL_MASTER_CyberProgram, IDX_MASTER_Deliverables, MAT_MASTER_Coverage, CHK_MASTER_AuditReadiness)"
  )
  .option("--org <name>", "Nom de l'organisation")
  .option("--lang <lang>", "fr|en|both")
  .option("--out <dir>", "Dossier de sortie", "./deliverables")
  .action(async (doc, opts) => {
    await genDoc({ doc, org: opts.org, lang: opts.lang, outDir: opts.out });
  });

program
  .command("catalog:validate")
  .description("Valide la structure du catalog et des mappings")
  .option("--root <dir>", "Racine du catalog", "./catalog")
  .action(async (opts) => {
    await validateCatalog({ rootDir: opts.root });
  });

program
  .command("nato:mvp-export")
  .description("MVP: génère un EvidencePackage bundle + manifest.json (NATO Trinity)")
  .requiredOption("--scope <ref>", "ScopeRef (riskId/caseId/etc)")
  .requiredOption("--in <file...>", "Fichiers preuves à inclure (paths locaux)")
  .option("--out <dir>", "Dossier de sortie", "./deliverables")
  .option("--org <id>", "OrgId (optionnel)")
  .option("--classification <c>", "public|internal|sensitive", "internal")
  .option("--retention <r>", "short|standard|long|legal", "standard")
  .option(
    "--evidence-type <t>",
    "logExport|configSnapshot|ticket|report|sbom|vex|attestation|signature|screenshot",
    "report"
  )
  .option("--sign", "Signe le manifest.json (MVP local)", false)
  .option("--signing-key <pem>", "Chemin vers la clé privée PEM (ed25519)")
  .option("--key-id <id>", "KeyId à inclure dans signature", "mvp-local-1")
  .action(async (opts) => {
    await natoMvpExport({
      scopeRef: opts.scope,
      inputs: opts.in,
      outDir: opts.out,
      orgId: opts.org,
      classification: opts.classification,
      retentionClass: opts.retention,
      evidenceType: opts.evidenceType,
      sign: Boolean(opts.sign),
      signingKey: opts.signingKey,
      keyId: opts.keyId
    });
  });

program
  .command("nato:mvp-verify-bundle")
  .description("MVP: vérifie les hashes des fichiers du bundle vs manifest.json")
  .requiredOption("--manifest <file>", "Chemin vers manifest.json")
  .action(async (opts) => {
    await natoMvpVerifyBundle({ manifest: opts.manifest });
  });

program
  .command("nato:mvp-verify-manifest")
  .description("MVP: vérifie manifestHash (evidence-package.json) + signature optionnelle")
  .requiredOption("--bundle <dir>", "Dossier bundle (contient manifest.json + evidence-package.json)")
  .option("--verify-key <pem>", "Chemin vers clé publique PEM (ed25519)")
  .action(async (opts) => {
    await natoMvpVerifyManifest({ bundleDir: opts.bundle, verifyKey: opts.verifyKey });
  });

program
  .command("nato:mvp-gen-keys")
  .description("MVP: génère une paire ed25519 PEM (public/private)")
  .option("--out <dir>", "Dossier de sortie", "./deliverables")
  .option("--name <name>", "Nom de base des fichiers", "nato-mvp-ed25519")
  .action(async (opts) => {
    await natoMvpGenerateSigningKey({ outDir: opts.out, name: opts.name });
  });

program
  .command("nato:mvp-risk-create")
  .description("MVP: crée un Risk dans un store local (JSON)")
  .requiredOption("--title <t>", "Titre")
  .requiredOption("--owner <o>", "Owner")
  .requiredOption("--likelihood <n>", "1..5")
  .requiredOption("--impact <n>", "1..5")
  .requiredOption("--due <yyyy-mm-dd>", "Due date")
  .option("--risk-id <id>", "RiskId (optionnel)")
  .option("--desc <text>", "Description")
  .option("--status <s>", "new|open|accepted|mitigated|closed", "open")
  .option("--org <id>", "OrgId", "ORG")
  .option("--actor <id>", "Actor", "user")
  .option("--out <dir>", "Dossier store", "./deliverables")
  .action(async (opts) => {
    await natoMvpRiskCreate({
      outDir: opts.out,
      orgId: opts.org,
      actor: opts.actor,
      riskId: opts.riskId,
      title: opts.title,
      owner: opts.owner,
      likelihood: Number(opts.likelihood),
      impact: Number(opts.impact),
      dueDate: opts.due,
      status: opts.status,
      description: opts.desc
    });
  });

program
  .command("nato:mvp-risk-get")
  .description("MVP: affiche un Risk depuis le store local")
  .requiredOption("--risk-id <id>", "RiskId")
  .option("--org <id>", "OrgId", "ORG")
  .option("--out <dir>", "Dossier store", "./deliverables")
  .action(async (opts) => {
    await natoMvpRiskGet({ outDir: opts.out, orgId: opts.org, riskId: opts.riskId });
  });

program
  .command("nato:mvp-case-create")
  .description("MVP: crée un Case (store local)")
  .requiredOption("--severity <s>", "low|medium|high|critical")
  .requiredOption("--owner <o>", "Owner")
  .option("--case-id <id>", "CaseId (optionnel)")
  .option("--status <s>", "new|triage|investigate|contain|eradicate|recover|closed", "new")
  .option("--org <id>", "OrgId", "ORG")
  .option("--actor <id>", "Actor", "user")
  .option("--out <dir>", "Dossier store", "./deliverables")
  .action(async (opts) => {
    await natoMvpCaseCreate({
      outDir: opts.out,
      orgId: opts.org,
      actor: opts.actor,
      caseId: opts.caseId,
      severity: opts.severity,
      status: opts.status,
      owner: opts.owner
    });
  });

program
  .command("nato:mvp-case-get")
  .description("MVP: affiche un Case depuis le store local")
  .requiredOption("--case-id <id>", "CaseId")
  .option("--org <id>", "OrgId", "ORG")
  .option("--out <dir>", "Dossier store", "./deliverables")
  .action(async (opts) => {
    await natoMvpCaseGet({ outDir: opts.out, orgId: opts.org, caseId: opts.caseId });
  });

program
  .command("nato:mvp-decision-create")
  .description("MVP: crée une Decision (SoD + expiry) dans le store local")
  .requiredOption("--risk-id <id>", "RiskId")
  .requiredOption("--type <t>", "treat|avoid|transfer|accept")
  .requiredOption("--rationale <t>", "Rationale")
  .requiredOption("--approved-by <id>", "ApprovedBy")
  .option("--expiry <yyyy-mm-dd>", "Expiry (required for accept)")
  .option("--org <id>", "OrgId", "ORG")
  .option("--actor <id>", "Actor", "user")
  .option("--out <dir>", "Dossier store", "./deliverables")
  .action(async (opts) => {
    await natoMvpDecisionCreate({
      outDir: opts.out,
      orgId: opts.org,
      actor: opts.actor,
      riskId: opts.riskId,
      decisionType: opts.type,
      rationale: opts.rationale,
      approvedBy: opts.approvedBy,
      expiryDate: opts.expiry
    });
  });

program
  .command("nato:mvp-export-from-store")
  .description("MVP: export EvidencePackage pour risk:<id> en incluant Risk + Decisions depuis le store")
  .requiredOption("--scope <ref>", "ScopeRef (risk:<id>)")
  .option("--org <id>", "OrgId", "ORG")
  .option("--actor <id>", "Actor", "user")
  .option("--store <dir>", "Dossier store (nato-mvp-store)", "./deliverables")
  .option("--out <dir>", "Dossier bundle", "./deliverables")
  .option("--in <file...>", "Fichiers preuves supplémentaires")
  .option("--sign", "Signe le manifest.json (MVP local)", false)
  .option("--signing-key <pem>", "Chemin vers la clé privée PEM (ed25519)")
  .option("--key-id <id>", "KeyId à inclure dans signature", "mvp-local-1")
  .action(async (opts) => {
    await natoMvpExportFromStore({
      scopeRef: opts.scope,
      orgId: opts.org,
      actor: opts.actor,
      storeOutDir: opts.store,
      outDir: opts.out,
      inputs: opts.in || [],
      sign: Boolean(opts.sign),
      signingKey: opts.signingKey,
      keyId: opts.keyId
    });
  });

program
  .command("nato:mvp-export-from-requestid")
  .description("MVP: export EvidencePackage pour requestId:<id> en incluant AuditEvents + objets liés")
  .requiredOption("--request <id>", "RequestId (req_...)")
  .option("--org <id>", "OrgId", "ORG")
  .option("--actor <id>", "Actor", "user")
  .option("--store <dir>", "Dossier store (nato-mvp-store)", "./deliverables")
  .option("--out <dir>", "Dossier bundle", "./deliverables")
  .option("--sign", "Signe le manifest.json (MVP local)", false)
  .option("--signing-key <pem>", "Chemin vers la clé privée PEM (ed25519)")
  .option("--key-id <id>", "KeyId à inclure dans signature", "mvp-local-1")
  .action(async (opts) => {
    await natoMvpExportFromRequestId({
      requestId: opts.request,
      orgId: opts.org,
      actor: opts.actor,
      storeOutDir: opts.store,
      outDir: opts.out,
      sign: Boolean(opts.sign),
      signingKey: opts.signingKey,
      keyId: opts.keyId
    });
  });

program
  .command("catalog:import-nist")
  .description("Importe NIST CSF 2.0 (outcomes) depuis un CSV exporté localement (mode le plus sûr)")
  .requiredOption("--in <file>", "CSV exporté depuis la feuille 'CSF 2.0'")
  .option("--out <file>", "Fichier de sortie", "./catalog/controls/nist-csf-2.0.outcomes.yml")
  .action(async (opts) => {
    await importNistCsfFromCsv({ inFile: opts.in, outFile: opts.out });
  });

program
  .command("catalog:import-nist-xlsx")
  .description(
    "Importe NIST CSF 2.0 depuis l'export xlsx officiel ET génère le mapping CSF→NIST 800-53 (SP 800-53) depuis les informative references"
  )
  .option("--sources <file>", "Fichier sources.yml", "./catalog/sources.yml")
  .option("--allow-dynamic", "Autorise une source dynamique (non pinnée)", false)
  .option("--url <url>", "URL de l'xlsx NIST (requires --allow-dynamic)")
  .option("--out-outcomes <file>", "Sortie outcomes", "./catalog/controls/nist-csf-2.0.outcomes.yml")
  .option(
    "--out-map-80053 <file>",
    "Sortie mapping CSF→800-53",
    "./catalog/mappings/nist-csf-2.0_to_nist-800-53-r5.yml"
  )
  .action(async (opts) => {
    let url = opts.url as string | undefined;
    let expectedSha256: string | undefined;

    if (url) {
      if (!opts.allowDynamic) throw new Error("Use --allow-dynamic to pass a custom --url");
    } else {
      const sources = await loadSourcesFile(opts.sources);
      const src = resolveSource(sources, "nist.csf_xlsx", { allowDynamic: opts.allowDynamic });
      url = src.url;
      expectedSha256 = src.sha256;
    }

    await importNistCsfFromXlsx({
      url,
      expectedSha256,
      outOutcomesFile: opts.outOutcomes,
      outCsfTo80053MappingFile: opts.outMap80053
    });
  });

program
  .command("catalog:import-iso")
  .description("Importe ISO 27002 (IDs + métadonnées) depuis un fichier local CSV (license-safe)")
  .requiredOption("--in <file>", "Fichier source (csv)")
  .option("--out <file>", "Fichier de sortie", "./catalog/controls/iso27002-2022.controls.yml")
  .option("--version <v>", "Version", "2022")
  .action(async (opts) => {
    await importIso27002({ inFile: opts.in, outFile: opts.out, version: opts.version });
  });

program
  .command("catalog:import-cis")
  .description("Importe CIS v8 (controls/safeguards) depuis un fichier local CSV (license-safe)")
  .requiredOption("--in <file>", "Fichier source (csv)")
  .option("--out <file>", "Fichier de sortie", "./catalog/controls/cis-v8.controls.yml")
  .option("--version <v>", "Version", "8")
  .action(async (opts) => {
    await importCisV8({ inFile: opts.in, outFile: opts.out, version: opts.version });
  });

program
  .command("catalog:import-80053")
  .description("Importe NIST SP 800-53 Rev.5 (OSCAL JSON) — public")
  .option("--sources <file>", "Fichier sources.yml", "./catalog/sources.yml")
  .option("--allow-dynamic", "Autorise une source dynamique (non pinnée)", false)
  .option("--url <url>", "URL OSCAL JSON (requires --allow-dynamic)")
  .option("--out <file>", "Fichier de sortie", "./catalog/controls/nist-800-53-r5.controls.yml")
  .action(async (opts) => {
    let url = opts.url as string | undefined;
    let expectedSha256: string | undefined;

    if (url) {
      if (!opts.allowDynamic) throw new Error("Use --allow-dynamic to pass a custom --url");
    } else {
      const sources = await loadSourcesFile(opts.sources);
      const src = resolveSource(sources, "nist.sp800_53_r5_oscal_json", { allowDynamic: opts.allowDynamic });
      url = src.url;
      expectedSha256 = src.sha256;
    }

    await importNist80053({ outFile: opts.out, url, expectedSha256 });
  });

program
  .command("catalog:import-ctid-attack-80053")
  .description("Importe les mappings CTID (ATT&CK → NIST 800-53 rev5) — public")
  .option("--sources <file>", "Fichier sources.yml", "./catalog/sources.yml")
  .option("--allow-dynamic", "Autorise une source dynamique (non pinnée)", false)
  .option("--url <url>", "URL du JSON CTID (requires --allow-dynamic)")
  .option(
    "--out <file>",
    "Fichier de sortie",
    "./catalog/mappings/mitre-attack_to_nist-800-53-r5.yml"
  )
  .action(async (opts) => {
    let url = opts.url as string | undefined;
    let expectedSha256: string | undefined;

    if (url) {
      if (!opts.allowDynamic) throw new Error("Use --allow-dynamic to pass a custom --url");
    } else {
      const sources = await loadSourcesFile(opts.sources);
      const src = resolveSource(sources, "ctid.attack_to_80053_r5", { allowDynamic: opts.allowDynamic });
      url = src.url;
      expectedSha256 = src.sha256;
    }

    await importCtidAttackToNist80053({ url, outFile: opts.out, expectedSha256 });
  });

program
  .command("catalog:import-attack")
  .description("Importe MITRE ATT&CK (Enterprise + Cloud + ICS) via STIX — public")
  .option("--sources <file>", "Fichier sources.yml", "./catalog/sources.yml")
  .option("--allow-dynamic", "Autorise une source dynamique (non pinnée)", false)
  .option("--out-techniques <file>", "Sortie techniques", "./catalog/controls/mitre-attack.techniques.yml")
  .option("--out-mitigations <file>", "Sortie mitigations", "./catalog/controls/mitre-attack.mitigations.yml")
  .option(
    "--out-tech2mit <file>",
    "Sortie mapping technique→mitigation",
    "./catalog/mappings/mitre-attack.techniques_to_mitigations.yml"
  )
  .action(async (opts) => {
    const sources = await loadSourcesFile(opts.sources);
    const enterprise = resolveSource(sources, "mitre.attack_stix.enterprise_url", { allowDynamic: opts.allowDynamic });
    const ics = resolveSource(sources, "mitre.attack_stix.ics_url", { allowDynamic: opts.allowDynamic });

    await importMitreAttack({
      outTechniquesFile: opts.outTechniques,
      outMitigationsFile: opts.outMitigations,
      outTechniqueToMitigationFile: opts.outTech2mit,
      sources: [
        { id: "enterprise", url: enterprise.url, expectedSha256: enterprise.sha256 },
        { id: "ics", url: ics.url, expectedSha256: ics.sha256 }
      ]
    });
  });

program
  .command("catalog:map-attack-csf")
  .description("Génère un premier mapping ATT&CK→CSF (heuristique) à partir des mitigations")
  .option("--attack-techniques <file>", "Techniques", "./catalog/controls/mitre-attack.techniques.yml")
  .option("--attack-mitigations <file>", "Mitigations", "./catalog/controls/mitre-attack.mitigations.yml")
  .option(
    "--attack-tech2mit <file>",
    "Mapping technique→mitigation",
    "./catalog/mappings/mitre-attack.techniques_to_mitigations.yml"
  )
  .option("--csf <file>", "CSF outcomes", "./catalog/controls/nist-csf-2.0.outcomes.yml")
  .option("--out <file>", "Fichier de sortie", "./catalog/mappings/mitre-attack_to_nist-csf-2.0.yml")
  .option("--top <n>", "Nombre de outcomes max par technique", "3")
  .action(async (opts) => {
    await mapAttackToCsf({
      attackTechniquesFile: opts.attackTechniques,
      attackMitigationsFile: opts.attackMitigations,
      techniqueToMitigationFile: opts.attackTech2mit,
      csfOutcomesFile: opts.csf,
      outFile: opts.out,
      topN: Number(opts.top)
    });
  });

program
  .command("catalog:map-attack-csf-via80053")
  .description("Génère un mapping ATT&CK→800-53 puis ATT&CK→CSF en chaînant des sources officielles")
  .option(
    "--tech2mit <file>",
    "Mapping technique→mitigation",
    "./catalog/mappings/mitre-attack.techniques_to_mitigations.yml"
  )
  .option(
    "--mit2ctrl <file>",
    "Mapping mitigation→800-53",
    "./catalog/mappings/mitre-attack.mitigations_to_nist-800-53-r5.yml"
  )
  .option(
    "--csf2ctrl <file>",
    "Mapping CSF→800-53",
    "./catalog/mappings/nist-csf-2.0_to_nist-800-53-r5.yml"
  )
  .option("--out-attack-80053 <file>", "Sortie ATT&CK→800-53", "./catalog/mappings/mitre-attack_to_nist-800-53-r5.yml")
  .option(
    "--out-attack-csf <file>",
    "Sortie ATT&CK→CSF",
    "./catalog/mappings/mitre-attack_to_nist-csf-2.0_via_800-53.yml"
  )
  .action(async (opts) => {
    await mapAttackToCsfVia80053({
      techniqueToMitigationFile: opts.tech2mit,
      mitigationTo80053File: opts.mit2ctrl,
      csfTo80053File: opts.csf2ctrl,
      outAttackTo80053File: opts.outAttack80053,
      outAttackToCsfFile: opts.outAttackCsf
    });
  });

program
  .command("catalog:map-attack-csf-from80053")
  .description("Génère ATT&CK→CSF à partir d'un mapping ATT&CK→800-53 + CSF→800-53")
  .option(
    "--attack2ctrl <file>",
    "Mapping ATT&CK→800-53",
    "./catalog/mappings/mitre-attack_to_nist-800-53-r5.yml"
  )
  .option(
    "--csf2ctrl <file>",
    "Mapping CSF→800-53",
    "./catalog/mappings/nist-csf-2.0_to_nist-800-53-r5.yml"
  )
  .option(
    "--out <file>",
    "Sortie ATT&CK→CSF",
    "./catalog/mappings/mitre-attack_to_nist-csf-2.0_via_800-53.yml"
  )
  .action(async (opts) => {
    await mapAttackToCsfFrom80053({
      attackTo80053File: opts.attack2ctrl,
      csfTo80053File: opts.csf2ctrl,
      outFile: opts.out
    });
  });

program
  .command("catalog:export-mapping-csv")
  .description("Exporte un fichier mapping YAML en CSV")
  .requiredOption("--in <file>", "Fichier mapping YAML")
  .option("--out <file>", "Fichier CSV de sortie", "./catalog/exports/mapping.csv")
  .option("--mode <mode>", "long|wide", "long")
  .action(async (opts) => {
    await exportMappingCsv({ inFile: opts.in, outFile: opts.out, mode: opts.mode });
  });

program
  .command("catalog:stats")
  .description("Affiche des stats (controls/mappings) en JSON")
  .option("--root <dir>", "Racine du catalog", "./catalog")
  .action(async (opts) => {
    await catalogStats({ rootDir: opts.root });
  });

program
  .command("catalog:refresh")
  .description("Rafraîchit le catalog depuis catalog/sources.yml (imports reproductibles)")
  .option("--root <dir>", "Racine du catalog", "./catalog")
  .option("--sources <file>", "Fichier sources.yml", "./catalog/sources.yml")
  .option("--allow-dynamic", "Autorise les sources dynamiques (non pinnées)", false)
  .action(async (opts) => {
    await catalogRefresh({ rootDir: opts.root, sourcesFile: opts.sources, allowDynamic: opts.allowDynamic });
  });

program
  .command("catalog:score-attack-csf")
  .description("Produit un CSV de scoring ATT&CK→CSF (score = #contrôles 800-53 partagés)")
  .option(
    "--attack2ctrl <file>",
    "Mapping ATT&CK→800-53",
    "./catalog/mappings/mitre-attack_to_nist-800-53-r5.yml"
  )
  .option(
    "--csf2ctrl <file>",
    "Mapping CSF→800-53",
    "./catalog/mappings/nist-csf-2.0_to_nist-800-53-r5.yml"
  )
  .option("--out-csv <file>", "CSV de sortie", "./catalog/exports/attack_to_csf_scores.csv")
  .option(
    "--out-mapping <file>",
    "Optionnel: écrit un mapping enrichi (avec meta)",
    "./catalog/mappings/mitre-attack_to_nist-csf-2.0_via_800-53_scored.yml"
  )
  .option("--top <n>", "Top outcomes dans le CSV", "5")
  .action(async (opts) => {
    await scoreAttackCsf({
      attackTo80053File: opts.attack2ctrl,
      csfTo80053File: opts.csf2ctrl,
      outCsv: opts.outCsv,
      outEnrichedMapping: opts.outMapping,
      topOutcomes: Number(opts.top)
    });
  });

program.parseAsync(process.argv);
