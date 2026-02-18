const ALGORITHMS = ['CRYSTALS-Kyber-1024', 'CRYSTALS-Kyber-768', 'NTRU-HPS-4096'] as const;
const KEM_TYPES = ['ML-KEM-1024', 'ML-KEM-768', 'BIKE-L3'] as const;

function randomHex(length: number): string {
  const chars = '0123456789abcdef';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export function generateKeyFingerprint(): string {
  const segments = Array.from({ length: 4 }, () => randomHex(4));
  return segments.join(':');
}

export function generateEncryptionMetadata() {
  return {
    algorithm: ALGORITHMS[Math.floor(Math.random() * ALGORITHMS.length)],
    kem: KEM_TYPES[Math.floor(Math.random() * KEM_TYPES.length)],
    key_fingerprint: generateKeyFingerprint(),
    pfs: true,
  };
}

export function simulateEncrypt(plaintext: string): string {
  return btoa(plaintext);
}

export function simulateDecrypt(ciphertext: string): string {
  try {
    return atob(ciphertext);
  } catch {
    return ciphertext;
  }
}
