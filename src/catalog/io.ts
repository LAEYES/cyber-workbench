import { promises as fs } from "node:fs";
import yaml from "js-yaml";
import { z } from "zod";

export async function loadYamlFile<T>(filePath: string, schema: z.ZodType<T>): Promise<T> {
  const raw = await fs.readFile(filePath, "utf8");
  const data = yaml.load(raw);
  return schema.parse(data);
}
