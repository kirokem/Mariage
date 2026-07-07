export default function Footer() {
  return (
    <footer style={{ padding: '64px 48px 48px', borderTop: '1px solid var(--ink-15)', marginTop: 40 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 32 }}>
        <div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(48px,8vw,120px)', fontStyle: 'italic', lineHeight: 0.9 }}>
            à bientôt.
          </div>
          <div className="mono-label" style={{ marginTop: 16 }}>Charlène &amp; Julien · 11—13 juin 2027</div>
        </div>
        <div style={{ textAlign: 'right', color: 'var(--ink-60)', fontSize: 13, lineHeight: 1.7 }}>
          <div>Une question ? Écrivez-nous.</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink)', marginTop: 4 }}>bonjour@charlene-et-julien.fr</div>
          <div style={{ marginTop: 16, fontFamily: 'var(--serif)', fontStyle: 'italic' }}>Provence · MMXXVII</div>
        </div>
      </div>
    </footer>
  );
}
