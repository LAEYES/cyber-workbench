import { Shield, Lock, Fingerprint } from 'lucide-react';
import type { EncryptionMetadata } from '../lib/types';

interface Props {
  metadata: EncryptionMetadata;
  compact?: boolean;
}

export default function EncryptionBadge({ metadata, compact = false }: Props) {
  if (compact) {
    return (
      <span className="badge badge--cyan" title={`${metadata.algorithm} | ${metadata.kem}`}>
        <Lock size={10} />
        PQC
      </span>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      padding: '8px 10px',
      background: 'var(--color-cyan-muted)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid rgba(6, 182, 212, 0.2)',
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      color: 'var(--color-cyan)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Shield size={12} />
        <span>{metadata.algorithm}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Lock size={12} />
        <span>KEM: {metadata.kem}</span>
      </div>
      {metadata.key_fingerprint && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Fingerprint size={12} />
          <span>{metadata.key_fingerprint}</span>
        </div>
      )}
      {metadata.pfs && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ color: 'var(--color-success)' }}>PFS Active</span>
        </div>
      )}
    </div>
  );
}
