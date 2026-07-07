import { PROGRAMME } from '../data/programme.js';

export default function Programme() {
  return (
    <section id="programme" className="section">
      <div className="section-head">
        <div className="section-num">II.</div>
        <h2 className="section-title">Trois jours, <em>un seul</em> fil.</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 32 }}>
        <div />
        <div style={{ borderTop: '1px solid var(--ink-15)' }}>
          {PROGRAMME.map((day, i) => (
            <div key={i} style={{
              borderBottom: '1px solid var(--ink-15)',
              padding: '48px 0',
              background: day.highlight ? 'color-mix(in oklab, var(--accent) 5%, transparent)' : 'transparent',
              margin: day.highlight ? '0 -24px' : '0',
              paddingLeft: day.highlight ? '24px' : '0',
              paddingRight: day.highlight ? '24px' : '0'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48 }}>
                <div>
                  <div className="mono-label" style={{ color: day.highlight ? 'var(--accent)' : 'var(--ink-60)' }}>{day.day}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,3.5vw,48px)', fontStyle: 'italic', lineHeight: 1, marginTop: 12 }}>{day.date}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--ink-60)', marginTop: 12, maxWidth: 180 }}>{day.title}</div>
                </div>
                <div>
                  {day.items.map(([time, label, desc], j) => (
                    <div key={j} style={{
                      display: 'grid', gridTemplateColumns: '80px 1fr',
                      gap: 24, padding: '20px 0',
                      borderBottom: j < day.items.length - 1 ? '1px dashed var(--ink-15)' : 'none'
                    }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontVariantNumeric: 'tabular-nums' }}>{time}</div>
                      <div>
                        <div style={{ fontFamily: 'var(--serif)', fontSize: 22 }}>{label}</div>
                        <div style={{ color: 'var(--ink-60)', fontSize: 14, marginTop: 4 }}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
