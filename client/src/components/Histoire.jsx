import PhotoSlot from './PhotoSlot.jsx';

export default function Histoire() {
  return (
    <section id="histoire" className="section">
      <div className="section-head">
        <div className="section-num">I.</div>
        <h2 className="section-title">Notre <em>histoire</em></h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 32 }}>
        <div />
        <div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.5, textWrap: 'pretty' }}>
            Tout a commencé par un swipe — puis une rencontre au bord du lac Léman, bercé par la mélodie des vagues et du Montreux Jazz.
          </p>
          <p style={{ marginTop: 24, color: 'var(--ink-60)', fontSize: 15, lineHeight: 1.7, maxWidth: 420 }}>
            Nous avons choisi la Provence parce que le temps y avance plus doucement, parce que la pierre y tient chaud, parce que la lavande y garde le souvenir de l'été mieux que nous. Nous sommes heureux d'y célébrer avec vous.
          </p>
          <div style={{ marginTop: 40, display: 'flex', gap: 48, fontFamily: 'var(--serif)' }}>
            <div>
              <div className="mono-label">Rencontre</div>
              <div style={{ fontSize: 28, fontStyle: 'italic', marginTop: 6 }}>Printemps 2017</div>
            </div>
            <div>
              <div className="mono-label">Demande</div>
              <div style={{ fontSize: 28, fontStyle: 'italic', marginTop: 6 }}>Été 2025</div>
            </div>
          </div>
        </div>
        <div>
          <PhotoSlot id="couple" label="photo · couple" aspectRatio="3/4" />
          <div className="mono-label" style={{ marginTop: 12, textAlign: 'right' }}>— pl. Charlène &amp; Julien</div>
        </div>
      </div>
    </section>
  );
}
