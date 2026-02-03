import { promises as fs } from "node:fs";
import path from "node:path";
import Handlebars from "handlebars";

export async function renderTemplate(templatePath: string, context: any) {
  const raw = await fs.readFile(templatePath, "utf8");
  const tpl = Handlebars.compile(raw, { noEscape: true });
  return tpl(context);
}

export function tplPath(...parts: string[]) {
  return path.join(process.cwd(), "templates", ...parts);
}
