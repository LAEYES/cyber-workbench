import path from "node:path";
import { ensureDir, writeFileEnsured } from "../lib/fsx.js";
import { defaultConfig, Lang, saveConfig } from "../lib/config.js";

export async function initWorkspace(params: { org: string; lang: Lang | string; outDir: string }) {
  const outDir = path.resolve(params.outDir);
  const lang = (params.lang ?? "both") as Lang;

  await ensureDir(outDir);

  const cfg = { ...defaultConfig, org: params.org ?? defaultConfig.org, lang };
  await saveConfig(outDir, cfg);

  await writeFileEnsured(
    path.join(outDir, "README.md"),
    `# Deliverables - ${cfg.org}\n\nGénérés par cyber-workbench.\n`
  );

  // Base folders
  await ensureDir(path.join(outDir, "docs", "01-gouvernance"));
  await ensureDir(path.join(outDir, "docs", "02-iam"));
  await ensureDir(path.join(outDir, "docs", "03-reseau"));
  await ensureDir(path.join(outDir, "docs", "04-cloud-devsecops"));
  await ensureDir(path.join(outDir, "docs", "05-endpoints"));
  await ensureDir(path.join(outDir, "docs", "06-appsec"));
  await ensureDir(path.join(outDir, "docs", "07-data"));
  await ensureDir(path.join(outDir, "docs", "08-compliance-legal"));
  await ensureDir(path.join(outDir, "docs", "09-crypto-trust"));
  await ensureDir(path.join(outDir, "docs", "10-soc-detection"));
  await ensureDir(path.join(outDir, "docs", "11-identity-zerotrust"));
  await ensureDir(path.join(outDir, "docs", "12-resilience-backup"));

  console.log(`OK: workspace initialisé dans ${outDir}`);
  console.log(`Config: ${path.join(outDir, "cyberwb.yml")}`);
}
