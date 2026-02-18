interface Props {
  name: string;
  color: string;
  size?: number;
  status?: string;
}

export default function Avatar({ name, color, size = 32, status }: Props) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: size * 0.38,
          fontWeight: 600,
          color: '#fff',
          userSelect: 'none',
        }}
      >
        {initials}
      </div>
      {status && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: size * 0.3,
            height: size * 0.3,
            borderRadius: '50%',
            background:
              status === 'online'
                ? 'var(--color-success)'
                : status === 'away'
                  ? 'var(--color-warning)'
                  : 'var(--color-text-muted)',
            border: '2px solid var(--color-bg-primary)',
          }}
        />
      )}
    </div>
  );
}
