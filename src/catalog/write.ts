import { promises as fs } from "node:fs";
import path from "node:path";
import yaml from "js-yaml";

export async function writeYamlFile(filePath: string, data: unknown) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const raw = yaml.dump(data, { lineWidth: 140, noRefs: true });
  await fs.writeFile(filePath, raw, "utf8");
}
