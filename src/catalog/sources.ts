import { z } from "zod";
import { loadYamlFile } from "./io.js";

export type ResolvedSource = {
  url: string;
  sha256?: string;
  retrievedAt?: string;
  allowDynamic: boolean;
};

function isHex64(s: string | undefined) {
  return typeof s === "string" && /^[0-9a-f]{64}$/i.test(s);
}

function getNode(doc: any, dottedPath: string): any {
  return dottedPath.split(".").reduce((acc: any, key) => acc?.[key], doc);
}

export async function loadSourcesFile(sourcesPath: string) {
  return loadYamlFile(sourcesPath, z.any());
}

export function resolveSource(doc: any, dottedPath: string, opts: { allowDynamic: boolean; requireSha?: boolean }): ResolvedSource {
  const node = getNode(doc, dottedPath);
  if (!node || typeof node.url !== "string") {
    throw new Error(`Missing source url: ${dottedPath}`);
  }

  const allowDynamic = node.allowDynamic === true;
  if (allowDynamic && !opts.allowDynamic) {
    throw new Error(`Source ${dottedPath} is dynamic. Pass --allow-dynamic to proceed.`);
  }

  const requireSha = opts.requireSha ?? !allowDynamic;
  if (requireSha) {
    if (!isHex64(node.sha256)) {
      throw new Error(`Source ${dottedPath} missing/invalid sha256`);
    }
    if (typeof node.retrievedAt !== "string" || node.retrievedAt.length < 8) {
      throw new Error(`Source ${dottedPath} missing retrievedAt`);
    }
  }

  return {
    url: node.url,
    sha256: node.sha256,
    retrievedAt: node.retrievedAt,
    allowDynamic
  };
}
