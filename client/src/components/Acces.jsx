const OPTIONS = [
  ['Depuis Fribourg', "Autoroute A1 → Lausanne → Genève, puis A40/A42 vers Lyon, enfin A7 Sud jusqu'à Montélimar-Sud (sortie 18). Parking gratuit sur place.", '~5h20 · 520 km'],
  ['Depuis Lausanne', "Autoroute A1/A9 jusqu'à Genève, puis A40/A42 vers Lyon, enfin A7 Sud jusqu'à Montélimar-Sud (sortie 18).", '~4h30 · 450 km'],
  ['En train', 'Gare TGV Valence ou Montélimar à 25–40 min du Château. Navettes organisées le vendredi & dimanche.', 'Navette gratuite'],
  ['En avion', 'Aéroports de Lyon‑Saint‑Exupéry (1h30) ou Genève (2h30). Location de voiture conseillée.', 'Lyon · Genève']
];

export default function Acces() {
  return (
    <section id="acces" className="section">
      <div className="section-head">
        <div className="section-num">V.</div>
        <h2 className="section-title">Pour nous <em>rejoindre</em>.</h2>
      </div>

      <div className="grid-stack-mobile" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        <div style={{
          aspectRatio: '4/5',
          background: 'var(--paper-2)',
          border: '1px solid var(--ink-15)',
          position: 'relative', overflow: 'hidden'
        }}>
          <svg viewBox="0 0 400 500" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <defs>
              <pattern id="dots" width="8" height="8" patternUnits="userSpaceOnUse">
                <circle cx="1" cy="1" r="0.6" fill="rgba(26,26,26,0.18)" />
              </pattern>
              <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--accent)" />
              </marker>
            </defs>
            <rect width="400" height="500" fill="url(#dots)" />

            <path d="M 260 20 Q 245 90 225 135 Q 215 160 200 175" fill="none" stroke="rgba(26,26,26,0.3)" strokeWidth="0.8" strokeDasharray="1 3" />
            <text x="268" y="60" fontFamily="Inter" fontSize="8" letterSpacing="2" fill="rgba(26,26,26,0.45)">CH</text>
            <text x="190" y="60" fontFamily="Inter" fontSize="8" letterSpacing="2" fill="rgba(26,26,26,0.45)">FR</text>

            <path d="M 215 145 Q 235 138 258 140 Q 275 142 278 150 Q 270 158 245 157 Q 225 156 215 153 Z"
                  fill="var(--accent)" opacity="0.18" stroke="var(--accent)" strokeWidth="0.5" />
            <text x="248" y="152" textAnchor="middle" fontFamily="EB Garamond" fontStyle="italic" fontSize="8" fill="rgba(26,26,26,0.5)">Léman</text>

            <path d="M 220 155 Q 180 200 160 240 Q 145 285 150 325 Q 155 375 175 425 Q 185 455 190 485"
                  fill="none" stroke="var(--accent)" strokeWidth="1.4" opacity="0.55" />
            <text x="135" y="340" fontFamily="EB Garamond" fontStyle="italic" fontSize="10" fill="rgba(26,26,26,0.45)" transform="rotate(-78 135 340)">Rhône</text>

            <path d="M 320 55 Q 290 90 255 115"
                  fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeDasharray="4 3" opacity="0.85" />
            <path d="M 255 115 Q 235 135 220 150"
                  fill="none" stroke="var(--accent)" strokeWidth="1.6" opacity="0.85" />
            <path d="M 220 150 Q 185 195 165 245 Q 150 300 160 355 Q 172 410 200 445"
                  fill="none" stroke="var(--accent)" strokeWidth="1.8" opacity="0.9"
                  markerEnd="url(#arrow)" />

            <text x="290" y="78" fontFamily="Inter" fontSize="8" letterSpacing="1.5" fill="rgba(26,26,26,0.5)">A1</text>
            <text x="190" y="210" fontFamily="Inter" fontSize="8" letterSpacing="1.5" fill="rgba(26,26,26,0.5)">A40</text>
            <text x="178" y="370" fontFamily="Inter" fontSize="8" letterSpacing="1.5" fill="rgba(26,26,26,0.5)">A7</text>

            <g fontFamily="EB Garamond" fontSize="12" fill="rgba(26,26,26,0.75)">
              <circle cx="320" cy="55" r="3.5" fill="var(--ink)" />
              <text x="328" y="52" fontStyle="italic">Fribourg</text>
              <text x="328" y="64" fontFamily="Inter" fontSize="8" letterSpacing="1.5" fill="rgba(26,26,26,0.45)">DÉPART</text>

              <circle cx="255" cy="115" r="3.5" fill="var(--ink)" />
              <text x="263" y="112" fontStyle="italic">Lausanne</text>
              <text x="263" y="124" fontFamily="Inter" fontSize="8" letterSpacing="1.5" fill="rgba(26,26,26,0.45)">DÉPART</text>

              <circle cx="220" cy="150" r="2" fill="rgba(26,26,26,0.55)" />
              <text x="200" y="166" textAnchor="end" fill="rgba(26,26,26,0.55)">Genève</text>

              <circle cx="165" cy="265" r="2" fill="rgba(26,26,26,0.55)" />
              <text x="150" y="270" textAnchor="end" fill="rgba(26,26,26,0.55)">Lyon</text>

              <circle cx="172" cy="395" r="2" fill="rgba(26,26,26,0.4)" />
              <text x="158" y="400" textAnchor="end" fill="rgba(26,26,26,0.45)">Valence</text>
            </g>

            <g transform="translate(200 445)">
              <circle r="32" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.35" />
              <circle r="20" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.65" />
              <circle r="10" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.9" />
              <circle r="4" fill="var(--accent)" />
            </g>
            <text x="200" y="420" textAnchor="middle" fontFamily="EB Garamond" fontStyle="italic" fontSize="16" fill="var(--ink)">Château les Oliviers</text>
            <text x="200" y="435" textAnchor="middle" fontFamily="Inter" fontSize="9" letterSpacing="2" fill="rgba(26,26,26,0.55)">MONTÉLIMAR · DRÔME</text>

            <g transform="translate(355 55)" fill="rgba(26,26,26,0.5)">
              <circle r="16" fill="none" stroke="rgba(26,26,26,0.3)" />
              <polygon points="0,-14 2.5,0 0,11 -2.5,0" fill="var(--accent)" />
              <text y="-20" textAnchor="middle" fontFamily="Inter" fontSize="8" letterSpacing="2">N</text>
            </g>

            <g transform="translate(30 475)" fill="rgba(26,26,26,0.5)">
              <line x1="0" y1="0" x2="60" y2="0" stroke="rgba(26,26,26,0.5)" strokeWidth="1" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke="rgba(26,26,26,0.5)" strokeWidth="1" />
              <line x1="60" y1="-3" x2="60" y2="3" stroke="rgba(26,26,26,0.5)" strokeWidth="1" />
              <text x="30" y="-6" textAnchor="middle" fontFamily="Inter" fontSize="8" letterSpacing="1.5">100 km</text>
            </g>
          </svg>
        </div>

        <div>
          <div className="mono-label">Adresse</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 24, marginTop: 8, lineHeight: 1.4 }}>
            Château les Oliviers de Salette<br />
            <span style={{ color: 'var(--ink-60)', fontStyle: 'italic' }}>26200 Montélimar · Drôme provençale</span>
          </div>
          <div style={{ height: 1, background: 'var(--ink-15)', margin: '32px 0' }} />
          {OPTIONS.map(([title, desc, meta], i) => (
            <div key={i} className="grid-stack-mobile" style={{ display: 'grid', gridTemplateColumns: '32px 1fr 140px', gap: 20, padding: '24px 0', borderBottom: i < OPTIONS.length - 1 ? '1px solid var(--ink-08)' : 'none' }}>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-40)' }}>0{i + 1}</div>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontStyle: 'italic' }}>{title}</div>
                <div style={{ color: 'var(--ink-60)', fontSize: 14, marginTop: 6, lineHeight: 1.55 }}>{desc}</div>
              </div>
              <div className="mono-label" style={{ textAlign: 'right' }}>{meta}</div>
            </div>
          ))}
          <div style={{ marginTop: 32, padding: 20, border: '1px solid var(--ink-15)', background: 'color-mix(in oklab, var(--accent) 6%, transparent)' }}>
            <div className="mono-label" style={{ color: 'var(--accent)' }}>Navette</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontStyle: 'italic', marginTop: 6 }}>
              Une navette gratuite circulera entre la gare TGV et le Château le vendredi (17h) et le dimanche (15h). Signalez-vous auprès de nous.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
