import Countdown from './Countdown.jsx';

export default function Hero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 48px 48px', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>
        <span>Provence · France</span>
        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', textTransform: 'none', letterSpacing: 'normal', fontSize: 16, color: 'var(--ink)' }}>C &amp; J</span>
        <span>MMXXVII</span>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '64px 0' }}>
        <div className="mono-label" style={{ marginBottom: 40 }}>— Nous nous marions —</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(64px,12vw,180px)', lineHeight: 0.92, letterSpacing: '-0.03em' }}>
          Charlène
          <div style={{ fontStyle: 'italic', fontSize: '0.55em', color: 'var(--ink-60)', margin: '8px 0', fontWeight: 400 }}>&amp;</div>
          Julien
        </h1>
        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 24 }}>
          <span className="rule-short" />
          <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(16px,1.6vw,22px)', letterSpacing: '0.04em' }}>
            Du 11 au 13 juin 2027
          </span>
          <span className="rule-short" />
        </div>
        <p style={{ marginTop: 16, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(16px,1.4vw,20px)', color: 'var(--ink-60)' }}>
          Château les Oliviers de Salette · Provence
        </p>
      </div>

      <div>
        <div className="rule" style={{ marginBottom: 32 }} />
        <Countdown />
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>
          ↓ défilez pour découvrir
        </div>
      </div>
    </section>
  );
}
