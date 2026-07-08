import StaticPhoto from './StaticPhoto.jsx';

const PHOTOS_BASE = `${import.meta.env.BASE_URL}photos`;

export default function Lieu() {
  return (
    <section id="lieu" className="section">
      <div className="section-head">
        <div className="section-num">III.</div>
        <h2 className="section-title">Un <em>château</em>, quelques oliviers.</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        <div>
          <StaticPhoto src={`${PHOTOS_BASE}/chateau.jpg`} alt="Château les Oliviers de Salette" aspectRatio="4/5" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <StaticPhoto src={`${PHOTOS_BASE}/jardin.jpg`} alt="Jardin" aspectRatio="1/1" />
            <StaticPhoto src={`${PHOTOS_BASE}/orangerie.jpg`} alt="Orangerie" aspectRatio="1/1" />
          </div>
        </div>
        <div>
          <div className="mono-label">Le domaine</div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,3vw,44px)', lineHeight: 1.05, marginTop: 12, fontStyle: 'italic' }}>
            Château les Oliviers de Salette
          </h3>
          <p style={{ marginTop: 20, fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.55 }}>
            Une bâtisse du XVIᵉ siècle posée au milieu de 31 hectares de vignes, de prairies et de champs de lavande à perte de vue.
          </p>
          <div style={{ display: 'flex', gap: 40, marginTop: 32, borderTop: '1px solid var(--ink-15)', borderBottom: '1px solid var(--ink-15)', padding: '20px 0' }}>
            <div><div className="mono-label">Hectares</div><div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontStyle: 'italic' }}>31</div></div>
            <div><div className="mono-label">Chambres</div><div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontStyle: 'italic' }}>32</div></div>
            <div><div className="mono-label">BÂTI (M2)</div><div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontStyle: 'italic' }}>2850</div></div>
          </div>

          <p style={{ marginTop: 32, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink-60)', lineHeight: 1.5 }}>
            Tous les invités dorment sur place — 32 chambres réparties sur le domaine.
          </p>
          <a href="#chambres" style={{ marginTop: 20, display: 'inline-block', fontFamily: 'var(--serif)', fontSize: 16, borderBottom: '1px solid var(--ink)', paddingBottom: 2 }}>
            Choisir ma chambre →
          </a>
        </div>
      </div>
    </section>
  );
}
