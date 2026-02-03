#!/usr/bin/env node
import { Command } from "commander";
import { initWorkspace } from "./commands/init.js";
import { genDoc } from "./commands/gen.js";
import { validateCatalog } from "./commands/catalog.js";
import { importNistCsf } from "./commands/import_nist.js";
import { importIso27002 } from "./commands/import_iso.js";
import { importCisV8 } from "./commands/import_cis.js";

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
    "pssi|risk-register|isms-pack|asset-inventory|tprm-questionnaire|compliance-checklist"
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
  .command("catalog:import-nist")
  .description("Importe NIST CSF 2.0 (outcomes) depuis l'export xlsx officiel du CSF Reference Tool")
  .option("--url <url>", "URL de l'xlsx")
  .option("--out <file>", "Fichier de sortie", "./catalog/controls/nist-csf-2.0.outcomes.yml")
  .action(async (opts) => {
    await importNistCsf({ outFile: opts.out, url: opts.url });
  });

program
  .command("catalog:import-iso")
  .description("Importe ISO 27002 (IDs + métadonnées) depuis un fichier local CSV/XLSX (license-safe)")
  .requiredOption("--in <file>", "Fichier source (csv/xlsx)")
  .option("--out <file>", "Fichier de sortie", "./catalog/controls/iso27002-2022.controls.yml")
  .option("--version <v>", "Version", "2022")
  .action(async (opts) => {
    await importIso27002({ inFile: opts.in, outFile: opts.out, version: opts.version });
  });

program
  .command("catalog:import-cis")
  .description("Importe CIS v8 (controls/safeguards) depuis un fichier local CSV/XLSX (license-safe)")
  .requiredOption("--in <file>", "Fichier source (csv/xlsx)")
  .option("--out <file>", "Fichier de sortie", "./catalog/controls/cis-v8.controls.yml")
  .option("--version <v>", "Version", "8")
  .action(async (opts) => {
    await importCisV8({ inFile: opts.in, outFile: opts.out, version: opts.version });
  });

program.parseAsync(process.argv);
