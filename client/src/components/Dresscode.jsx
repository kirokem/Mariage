const PALETTE = [
  ['Écru', '#eae1d1'],
  ['Sable', '#d8c8ae'],
  ['Terre', '#b48a6c'],
  ['Sauge', '#a6a88b'],
  ['Ciel pâle', '#c3cdd1'],
  ['Olive', '#6f7555']
];

export default function Dresscode() {
  return (
    <section id="dresscode" className="section" style={{ paddingBottom: 160 }}>
      <div className="section-head">
        <div className="section-num">VI.</div>
        <h2 className="section-title">Dress <em>code</em>.</h2>
      </div>

      <div className="grid-stack-mobile" style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 48, alignItems: 'start' }}>
        <div />
        <div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 24, lineHeight: 1.4, textWrap: 'pretty' }}>
            <em>Champêtre chic, teintes naturelles.</em>
            <br />
            Pensez <span style={{ color: 'var(--accent)' }}>lin, coton, soie</span> — et chaussures compatibles avec l'herbe sèche.
          </p>
          <div style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div>
              <div className="mono-label">Recommandé</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', fontFamily: 'var(--serif)', fontSize: 17 }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--ink-08)' }}>Tons naturels, pastels doux</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--ink-08)' }}>Matières fluides, naturelles</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--ink-08)' }}>Chapeaux, canotiers</li>
                <li style={{ padding: '8px 0' }}>Chaussures plates si pelouse</li>
              </ul>
            </div>
            <div>
              <div className="mono-label" style={{ color: 'var(--accent)' }}>À éviter</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0', fontFamily: 'var(--serif)', fontSize: 17 }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--ink-08)' }}>Total look blanc</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--ink-08)' }}>Talons aiguilles</li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid var(--ink-08)' }}>Fluo, néons</li>
                <li style={{ padding: '8px 0' }}>Tenues trop formelles</li>
              </ul>
            </div>
          </div>
        </div>
        <div>
          <div className="mono-label" style={{ marginBottom: 20 }}>Palette suggérée</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1, background: 'var(--ink-15)', border: '1px solid var(--ink-15)' }}>
            {PALETTE.map(([name, hex], i) => (
              <div key={i} style={{ background: 'var(--paper)', padding: 16, aspectRatio: '1/1.2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ background: hex, flex: 1, marginBottom: 12, border: '1px solid rgba(0,0,0,0.05)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15 }}>{name}</div>
                  <div className="mono-label" style={{ fontSize: 9, marginTop: 2 }}>{hex}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
