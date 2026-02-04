import crypto from "node:crypto";

export function sha256Hex(buf: Buffer | Uint8Array) {
  return crypto.createHash("sha256").update(buf).digest("hex");
}

export async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download failed ${res.status} ${res.statusText}: ${url}`);
  const ab = await res.arrayBuffer();
  return Buffer.from(ab);
}

export async function fetchBufferVerified(url: string, expectedSha256?: string): Promise<Buffer> {
  const buf = await fetchBuffer(url);
  if (expectedSha256) {
    const actual = sha256Hex(buf);
    if (actual.toLowerCase() !== expectedSha256.toLowerCase()) {
      throw new Error(`SHA256_MISMATCH url=${url} expected=${expectedSha256} actual=${actual}`);
    }
  }
  return buf;
}
