export default function StaticPhoto({ src, alt, aspectRatio = '4/5', label, style }) {
  if (!src) {
    return (
      <div className="ph" style={{ aspectRatio, ...style }}>
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div>{label || 'photo à venir'}</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: '100%',
        aspectRatio,
        objectFit: 'cover',
        border: '1px solid var(--ink-15)',
        ...style
      }}
    />
  );
}
