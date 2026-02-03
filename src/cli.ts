#!/usr/bin/env node
import { Command } from "commander";
import { initWorkspace } from "./commands/init.js";
import { genDoc } from "./commands/gen.js";

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
  .argument("<doc>", "pssi|risk-register")
  .option("--org <name>", "Nom de l'organisation")
  .option("--lang <lang>", "fr|en|both")
  .option("--out <dir>", "Dossier de sortie", "./deliverables")
  .action(async (doc, opts) => {
    await genDoc({ doc, org: opts.org, lang: opts.lang, outDir: opts.out });
  });

program.parseAsync(process.argv);
