import { promises as fs } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";
import { exists } from "./fsx.js";

export type Lang = "fr" | "en" | "both";

export type CyberWbConfig = {
  org: string;
  lang: Lang;
  profiles: {
    pme: boolean;
    eti: boolean;
    regulated: boolean;
  };
};

export const defaultConfig: CyberWbConfig = {
  org: "ORG",
  lang: "both",
  profiles: { pme: true, eti: true, regulated: true }
};

export async function loadConfig(outDir: string): Promise<CyberWbConfig> {
  const cfgPath = path.join(outDir, "cyberwb.yml");
  if (!(await exists(cfgPath))) return defaultConfig;
  const raw = await fs.readFile(cfgPath, "utf8");
  const parsed = yaml.load(raw) as Partial<CyberWbConfig>;
  return {
    ...defaultConfig,
    ...parsed,
    profiles: { ...defaultConfig.profiles, ...(parsed?.profiles ?? {}) }
  };
}

export async function saveConfig(outDir: string, cfg: CyberWbConfig) {
  const cfgPath = path.join(outDir, "cyberwb.yml");
  const raw = yaml.dump(cfg, { lineWidth: 120 });
  await fs.mkdir(outDir, { recursive: true });
  await fs.writeFile(cfgPath, raw, "utf8");
}
