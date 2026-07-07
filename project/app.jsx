const { useState, useEffect, useRef, useMemo } = React;

/* ────────────────────────────────────────────────── PHOTO SLOT */
function PhotoSlot({ id, label, aspectRatio = '4/5', style }) {
  const [src, setSrc] = useState(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef(null);
  const storageKey = 'cj-photo-' + id;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) setSrc(saved);
    } catch (e) {}
  }, [storageKey]);

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      setSrc(dataUrl);
      try {localStorage.setItem(storageKey, dataUrl);} catch (err) {
        alert("Image trop lourde pour être stockée localement. Essayez une image plus petite (< 2 Mo).");
      }
    };
    reader.readAsDataURL(file);
  };

  const clear = (e) => {
    e.stopPropagation();
    setSrc(null);
    try {localStorage.removeItem(storageKey);} catch (err) {}
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {e.preventDefault();setDrag(true);}}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault();setDrag(false);
        handleFile(e.dataTransfer.files?.[0]);
      }}
      style={{
        position: 'relative',
        aspectRatio,
        border: '1px solid ' + (drag ? 'var(--accent)' : 'var(--ink-15)'),
        cursor: 'pointer',
        overflow: 'hidden',
        background: src ? 'transparent' : undefined,
        transition: 'border-color .2s',
        ...style
      }}
      className={src ? '' : 'ph'}>
      
      {src ?
      <>
          <img src={src} alt={label} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <button
          onClick={clear}
          title="Retirer la photo"
          style={{
            position: 'absolute', top: 8, right: 8, zIndex: 2,
            width: 28, height: 28, borderRadius: '50%',
            border: '1px solid var(--ink-15)',
            background: 'var(--paper)', color: 'var(--ink)',
            cursor: 'pointer', fontSize: 14, lineHeight: 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: 0.85
          }}>
          ×</button>
        </> :

      <div style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 18, marginBottom: 8, opacity: 0.5 }}>＋</div>
          <div>{drag ? 'déposez ici' : label || 'ajouter une photo'}</div>
          <div style={{ fontSize: 9, marginTop: 6, opacity: 0.6, textTransform: 'none', letterSpacing: 'normal', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>cliquez ou glissez-déposez</div>
        </div>
      }
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        style={{ display: 'none' }} />
      
    </div>);

}

/* ────────────────────────────────────────────────── TWEAKS */
const PALETTES = {
  creme: { paper: '#faf7f2', paper2: '#f2ede4', ink: '#1a1a1a' },
  ivoire: { paper: '#f6f3ec', paper2: '#ebe6d9', ink: '#141410' },
  albatre: { paper: '#ffffff', paper2: '#f1eee8', ink: '#1a1a1a' },
  nuit: { paper: '#111110', paper2: '#1c1b19', ink: '#f3efe6' }
};
const ACCENTS = {
  terracotta: 'oklch(0.58 0.06 45)',
  olive: 'oklch(0.55 0.04 120)',
  encre: 'oklch(0.35 0.02 250)',
  bordeaux: 'oklch(0.42 0.08 20)'
};
const SERIFS = {
  'EB Garamond': "'EB Garamond', 'Times New Roman', serif",
  'Fraunces': "'Fraunces', 'EB Garamond', serif",
  'Playfair': "'Playfair Display', 'EB Garamond', serif"
};

function applyTweaks(t) {
  const p = PALETTES[t.palette] || PALETTES.creme;
  const r = document.documentElement.style;
  r.setProperty('--paper', p.paper);
  r.setProperty('--paper-2', p.paper2);
  r.setProperty('--ink', p.ink);
  const isDark = t.palette === 'nuit';
  r.setProperty('--ink-60', isDark ? 'rgba(243,239,230,.62)' : 'rgba(26,26,26,.62)');
  r.setProperty('--ink-40', isDark ? 'rgba(243,239,230,.42)' : 'rgba(26,26,26,.42)');
  r.setProperty('--ink-15', isDark ? 'rgba(243,239,230,.18)' : 'rgba(26,26,26,.15)');
  r.setProperty('--ink-08', isDark ? 'rgba(243,239,230,.10)' : 'rgba(26,26,26,.08)');
  r.setProperty('--accent', ACCENTS[t.accent] || ACCENTS.terracotta);
  r.setProperty('--serif', SERIFS[t.serif] || SERIFS['EB Garamond']);
}

/* ────────────────────────────────────────────────── HERO */
function Countdown() {
  const target = new Date('2027-06-11T16:00:00+02:00').getTime();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, target - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff % 86400000 / 3600000);
  const m = Math.floor(diff % 3600000 / 60000);
  const s = Math.floor(diff % 60000 / 1000);
  const cell = (n, l) =>
  <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,4vw,48px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>{String(n).padStart(2, '0')}</div>
      <div className="mono-label" style={{ marginTop: 8 }}>{l}</div>
    </div>;

  return (
    <div style={{ display: 'flex', gap: 'clamp(24px,4vw,64px)', justifyContent: 'center' }}>
      {cell(d, 'jours')}{cell(h, 'heures')}{cell(m, 'minutes')}{cell(s, 'secondes')}
    </div>);

}

function Hero() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '32px 48px 48px', position: 'relative' }}>
      {/* top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>
        <span>Provence · France</span>
        <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', textTransform: 'none', letterSpacing: 'normal', fontSize: 16, color: 'var(--ink)' }}>C &amp; J</span>
        <span>MMXXVII</span>
      </div>

      {/* center */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '64px 0' }}>
        <div className="mono-label" style={{ marginBottom: 40 }}>— Nous nous marions —</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontWeight: 400, fontSize: 'clamp(64px,12vw,180px)', lineHeight: 0.92, letterSpacing: '-0.03em' }}>
          Charlène
          <div style={{ fontStyle: 'italic', fontSize: '0.55em', color: 'var(--ink-60)', margin: '8px 0', fontWeight: 400 }}>&amp;</div>
          Julien
        </h1>
        <div style={{ marginTop: 48, display: 'flex', alignItems: 'center', gap: 24 }}>
          <span className="rule-short"></span>
          <span style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(16px,1.6vw,22px)', letterSpacing: '0.04em' }}>
            Du 11 au 13 juin 2027
          </span>
          <span className="rule-short"></span>
        </div>
        <p style={{ marginTop: 16, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 'clamp(16px,1.4vw,20px)', color: 'var(--ink-60)' }}>
          Château les Oliviers de Salette · Provence
        </p>
      </div>

      {/* bottom countdown */}
      <div>
        <div className="rule" style={{ marginBottom: 32 }} />
        <Countdown />
        <div style={{ textAlign: 'center', marginTop: 32, fontSize: 12, letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>
          ↓ défilez pour découvrir
        </div>
      </div>
    </section>);

}

/* ────────────────────────────────────────────────── NAV */
function Nav({ active }) {
  const items = [
  ['histoire', 'I · Notre histoire'],
  ['programme', 'II · Programme'],
  ['lieu', 'III · Le lieu'],
  ['chambres', 'IV · Chambres'],
  ['acces', 'V · Accès'],
  ['dresscode', 'VI · Dress code']];

  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY < window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: '16px 48px',
      background: 'color-mix(in oklab, var(--paper) 88%, transparent)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--ink-08)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      transform: hidden ? 'translateY(-110%)' : 'translateY(0)',
      transition: 'transform .5s cubic-bezier(.2,.7,.2,1)'
    }}>
      <a href="#top" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18 }}>Charlène &amp; Julien</a>
      <div style={{ display: 'flex', gap: 28, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
        {items.map(([id, label]) =>
        <a key={id} href={'#' + id} style={{
          color: active === id ? 'var(--ink)' : 'var(--ink-60)',
          borderBottom: active === id ? '1px solid var(--ink)' : '1px solid transparent',
          paddingBottom: 2, transition: 'color .2s, border-color .2s'
        }}>{label}</a>
        )}
      </div>
      <span style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>11—13 · VI · 2027</span>
    </nav>);

}

/* ────────────────────────────────────────────────── HISTOIRE */
function Histoire() {
  return (
    <section id="histoire" className="section">
      <div className="section-head">
        <div className="section-num">I.</div>
        <h2 className="section-title">Notre <em>histoire</em></h2>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 32 }}>
        <div></div>
        <div>
          <p style={{ fontFamily: 'var(--serif)', fontSize: 22, lineHeight: 1.5, textWrap: 'pretty' }}>Tout a commencé par un swipe — puis une rencontre au bord du lac Léman, bercé par la mélodie des vagues et du Montreux Jazz.

          </p>
          <p style={{ marginTop: 24, color: 'var(--ink-60)', fontSize: 15, lineHeight: 1.7, maxWidth: 420 }}>Nous avons choisi la Provence parce que le temps y avance plus doucement, parce que la pierre y tient chaud, parce que la lavande y garde le souvenir de l'été mieux que nous. Nous sommes heureux d'y célébrer avec vous.

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
    </section>);

}

/* ────────────────────────────────────────────────── PROGRAMME */
const PROGRAMME = [
{
  day: 'Vendredi', date: '11 juin',
  title: 'Arrivée & dîner champêtre',
  items: [
  ['16:00', 'Accueil des invités au Château', 'Check-in des chambres sur place et vin frais sous les platanes.'],
  ['19:30', 'Apéritif au jardin', 'Rencontres, retrouvailles, premières tablées.'],
  ['21:00', 'Dîner champêtre', 'Grande tablée en extérieur, cuisine de saison.']]

},
{
  day: 'Samedi', date: '12 juin',
  title: 'Le grand jour',
  highlight: true,
  items: [
  ['11:00', 'Brunch doux', 'Pour ceux qui veulent prolonger le matin.'],
  ['16:00', 'Cérémonie laïque', 'Sous la roseraie. Prévoir un chapeau.'],
  ['17:30', 'Cocktail', 'Musique live et vin de Provence.'],
  ['20:00', 'Dîner', 'Au cœur de l\'orangerie.'],
  ['23:00', 'Ouverture du bal', 'Jusqu\'au bout de la nuit.']]

},
{
  day: 'Dimanche', date: '13 juin',
  title: 'Brunch & au revoir',
  items: [
  ['11:00', 'Brunch sous les oliviers', 'Pour se dire au revoir doucement.'],
  ['14:00', 'Départ', 'On ne pleure pas, on s\'écrit.']]

}];


function Programme() {
  return (
    <section id="programme" className="section">
      <div className="section-head">
        <div className="section-num">II.</div>
        <h2 className="section-title">Trois jours, <em>un seul</em> fil.</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 32 }}>
        <div></div>
        <div style={{ borderTop: '1px solid var(--ink-15)' }}>
          {PROGRAMME.map((day, i) =>
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
                  {day.items.map(([time, label, desc], j) =>
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
                )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

/* ────────────────────────────────────────────────── LIEU */
function Lieu() {
  return (
    <section id="lieu" className="section">
      <div className="section-head">
        <div className="section-num">III.</div>
        <h2 className="section-title">Un <em>château</em>, quelques oliviers.</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
        <div>
          <PhotoSlot id="chateau" label="photo · château les oliviers de salette" aspectRatio="4/5" />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
            <PhotoSlot id="jardin" label="photo · jardin" aspectRatio="1/1" />
            <PhotoSlot id="orangerie" label="photo · orangerie" aspectRatio="1/1" />
          </div>
        </div>
        <div>
          <div className="mono-label">Le domaine</div>
          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,3vw,44px)', lineHeight: 1.05, marginTop: 12, fontStyle: 'italic' }}>
            Château les Oliviers de Salette
          </h3>
          <p style={{ marginTop: 20, fontFamily: 'var(--serif)', fontSize: 19, lineHeight: 1.55 }}>Une bâtisse du XVIᵉ siècle posée au milieu de 31 hectares de vignes, de prairies et de champs de lavande à perte de vue.</p>
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
    </section>);

}

/* ────────────────────────────────────────────────── CHAMBRES */
const FORFAIT = 220;

const CHAMBRES = (() => {
  const wings = [
    { wing:'Château — Aile ouest',  names:['Olivier','Lavande','Romarin','Cyprès','Mistral','Iris','Myrte','Garrigue'] },
    { wing:'Château — Aile est',    names:['Figuier','Amandier','Tournesol','Roseraie','Thym','Sauge','Verveine','Estragon'] },
    { wing:'Orangerie',              names:['Clémentine','Bergamote','Yuzu','Néroli','Citron','Cédrat'] },
    { wing:'Dépendance',             names:['Pin','Chêne','Abricot','Cerisier','Vigne','Laurier'] },
    { wing:'Tour',                   names:['Belvédère','Panorama','Mistral haut','Ponant'] },
  ];
  const bedTypes = ['1 lit double','1 lit king','2 lits simples','1 lit double + 1 simple','2 lits doubles'];
  const views = ['Cour pavée','Jardin sud','Orangerie','Oliveraie','Roseraie','Verger','Panorama','Potager','Lavandes'];
  const floors = ['RDC','1er','2e'];
  const rooms = [];
  let i = 0;
  wings.forEach(({wing, names}) => {
    names.forEach((name, j) => {
      const beds = bedTypes[i % bedTypes.length];
      const capacity = beds.includes('+') ? 3 : (beds.includes('doubles') ? 4 : 2);
      rooms.push({
        id: name.toLowerCase().replace(/\s/g,'-').replace(/[^a-z0-9-]/g,''),
        name, wing,
        floor: floors[(j + (wing==='Tour'?1:0)) % floors.length],
        beds, capacity,
        view: views[i % views.length],
        accessible: (i === 0 || i === 18),
      });
      i++;
    });
  });
  return rooms;
})();

const inputStyle = {
  width:'100%', padding:'10px 12px',
  border:'1px solid var(--ink-15)', background:'var(--paper)',
  fontFamily:'var(--serif)', fontSize:17,
  color:'var(--ink)', outline:'none',
  boxSizing:'border-box',
};

function Chambres() {
  const [reserved, setReserved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cj-reserved') || '["lavande","figuier","neroli","pin","tournesol"]'); }
    catch(e) { return ['lavande','figuier','neroli','pin','tournesol']; }
  });
  const [selected, setSelected] = useState(() => {
    try { return localStorage.getItem('cj-my-room') || null; } catch(e) { return null; }
  });
  const [guests, setGuests] = useState(() => {
    try { return Number(localStorage.getItem('cj-guests')) || 2; } catch(e) { return 2; }
  });
  const [form, setForm] = useState({ nom:'', email:'' });
  const [confirmed, setConfirmed] = useState(false);
  const [filter, setFilter] = useState('toutes');

  useEffect(() => { try { localStorage.setItem('cj-my-room', selected || ''); } catch(e){} }, [selected]);
  useEffect(() => { try { localStorage.setItem('cj-guests', String(guests)); } catch(e){} }, [guests]);

  const current = CHAMBRES.find(c => c.id === selected);
  const total = guests * FORFAIT;

  const confirm = () => {
    if (!selected || !form.nom || !form.email) return;
    const next = [...reserved, selected];
    setReserved(next);
    try { localStorage.setItem('cj-reserved', JSON.stringify(next)); } catch(e){}
    setConfirmed(true);
  };

  const wings = [...new Set(CHAMBRES.map(c => c.wing))];
  const dispo = CHAMBRES.length - reserved.length;

  return (
    <section id="chambres" className="section">
      <div className="section-head">
        <div className="section-num">IV.</div>
        <h2 className="section-title">Choisissez votre <em>chambre</em>.</h2>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'120px 1fr', gap:32, marginBottom:40 }}>
        <div/>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:24, padding:'24px 0', borderTop:'1px solid var(--ink-15)', borderBottom:'1px solid var(--ink-15)' }}>
          <div>
            <div className="mono-label">Forfait</div>
            <div style={{ fontFamily:'var(--serif)', fontSize:28, fontStyle:'italic', marginTop:4 }}>{FORFAIT} €<span style={{ fontSize:14, color:'var(--ink-60)' }}> / personne</span></div>
          </div>
          <div>
            <div className="mono-label">Inclus</div>
            <div style={{ fontFamily:'var(--serif)', fontSize:16, marginTop:6, color:'var(--ink-60)' }}>2 nuits · petits-déjeuners · brunch du dimanche</div>
          </div>
          <div>
            <div className="mono-label">Disponibles</div>
            <div style={{ fontFamily:'var(--serif)', fontSize:28, fontStyle:'italic', marginTop:4 }}>{dispo}<span style={{ fontSize:14, color:'var(--ink-60)' }}> / {CHAMBRES.length}</span></div>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:48, alignItems:'start' }}>
        <div>
          {/* Filter */}
          <div style={{ display:'flex', flexWrap:'wrap', gap:8, marginBottom:24 }}>
            {['toutes', ...wings].map(w => (
              <button key={w} onClick={() => setFilter(w)} style={{
                border:'1px solid ' + (filter===w ? 'var(--ink)' : 'var(--ink-15)'),
                background: filter===w ? 'var(--ink)' : 'transparent',
                color: filter===w ? 'var(--paper)' : 'var(--ink)',
                padding:'6px 12px', fontSize:11, letterSpacing:'.1em',
                textTransform:'uppercase', cursor:'pointer', fontFamily:'inherit',
              }}>{w}</button>
            ))}
          </div>

          {wings.filter(w => filter === 'toutes' || filter === w).map(wing => (
            <div key={wing} style={{ marginBottom:32 }}>
              <div className="mono-label" style={{ marginBottom:12 }}>— {wing}</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(210px,1fr))', gap:12 }}>
                {CHAMBRES.filter(c => c.wing === wing).map(c => {
                  const taken = reserved.includes(c.id);
                  const mine = selected === c.id;
                  return (
                    <button
                      key={c.id}
                      disabled={taken && !mine}
                      onClick={() => !taken && setSelected(c.id)}
                      style={{
                        textAlign:'left', padding:16,
                        background: mine ? 'var(--ink)' : (taken ? 'var(--paper-2)' : 'var(--paper)'),
                        color: mine ? 'var(--paper)' : (taken ? 'var(--ink-40)' : 'var(--ink)'),
                        border:'1px solid ' + (mine ? 'var(--ink)' : 'var(--ink-15)'),
                        cursor: taken && !mine ? 'not-allowed' : 'pointer',
                        opacity: taken && !mine ? 0.55 : 1,
                        transition:'all .2s',
                        fontFamily:'inherit',
                      }}
                    >
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                        <span style={{ fontFamily:'var(--serif)', fontStyle:'italic', fontSize:22 }}>{c.name}</span>
                        <span style={{ fontSize:10, letterSpacing:'.12em', textTransform:'uppercase', opacity:0.6 }}>{c.floor}</span>
                      </div>
                      <div style={{ fontSize:13, marginTop:8, opacity:0.75, lineHeight:1.5 }}>
                        {c.beds}<br/>
                        <span style={{ fontStyle:'italic', fontFamily:'var(--serif)', fontSize:14 }}>Vue : {c.view}</span>
                      </div>
                      <div style={{ marginTop:10, display:'flex', gap:8, fontSize:10, letterSpacing:'.08em', textTransform:'uppercase', opacity:0.7 }}>
                        <span>{c.capacity} pers.</span>
                        {c.accessible && <span>· PMR</span>}
                        {taken && !mine && <span style={{ marginLeft:'auto', opacity:1 }}>Réservée</span>}
                        {mine && <span style={{ marginLeft:'auto', opacity:1 }}>✓ votre choix</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div style={{ position:'sticky', top:100 }}>
          <div style={{ border:'1px solid var(--ink)', padding:32, background:'var(--paper)' }}>
            <div className="mono-label">Récapitulatif</div>
            <h3 style={{ fontFamily:'var(--serif)', fontSize:32, fontStyle:'italic', lineHeight:1.1, marginTop:8 }}>
              {current ? current.name : 'Aucune chambre'}
            </h3>
            {current ? (
              <div style={{ fontSize:13, color:'var(--ink-60)', marginTop:6 }}>
                {current.wing} · {current.floor} · {current.beds}
              </div>
            ) : (
              <div style={{ fontSize:13, color:'var(--ink-60)', marginTop:6, fontStyle:'italic', fontFamily:'var(--serif)' }}>
                Sélectionnez une chambre dans la liste.
              </div>
            )}

            <div style={{ borderTop:'1px solid var(--ink-15)', marginTop:24, paddingTop:20 }}>
              <label style={{ display:'block', marginBottom:16 }}>
                <div className="mono-label" style={{ marginBottom:6 }}>Nombre de personnes</div>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  <button onClick={() => setGuests(Math.max(1, guests-1))} disabled={!current} style={{ width:32, height:32, border:'1px solid var(--ink-15)', background:'transparent', cursor: current ? 'pointer' : 'not-allowed', fontSize:18, fontFamily:'inherit' }}>−</button>
                  <span style={{ fontFamily:'var(--serif)', fontSize:24, fontStyle:'italic', minWidth:24, textAlign:'center' }}>{guests}</span>
                  <button onClick={() => setGuests(Math.min(current?.capacity || 1, guests+1))} disabled={!current} style={{ width:32, height:32, border:'1px solid var(--ink-15)', background:'transparent', cursor: current ? 'pointer' : 'not-allowed', fontSize:18, fontFamily:'inherit' }}>+</button>
                  {current && <span style={{ fontSize:12, color:'var(--ink-40)' }}>max {current.capacity}</span>}
                </div>
              </label>
              <label style={{ display:'block', marginBottom:12 }}>
                <div className="mono-label" style={{ marginBottom:6 }}>Nom(s)</div>
                <input value={form.nom} onChange={e => setForm({...form, nom:e.target.value})} placeholder="Jeanne & Paul Dupont" style={inputStyle} />
              </label>
              <label style={{ display:'block' }}>
                <div className="mono-label" style={{ marginBottom:6 }}>Email</div>
                <input type="email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} placeholder="jeanne@exemple.fr" style={inputStyle} />
              </label>
            </div>

            <div style={{ borderTop:'1px solid var(--ink-15)', marginTop:24, paddingTop:20, display:'grid', gap:8 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'var(--ink-60)' }}>
                <span>{guests} × {FORFAIT} €</span><span>{guests * FORFAIT} €</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'var(--ink-60)' }}>
                <span>Taxe de séjour</span><span>offerte</span>
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontFamily:'var(--serif)', fontSize:24, fontStyle:'italic', marginTop:8, borderTop:'1px solid var(--ink-15)', paddingTop:12 }}>
                <span>Total</span><span>{total} €</span>
              </div>
            </div>

            {confirmed ? (
              <div style={{ marginTop:24, padding:16, background:'color-mix(in oklab, var(--accent) 8%, transparent)', border:'1px solid color-mix(in oklab, var(--accent) 30%, transparent)', textAlign:'center' }}>
                <div style={{ fontFamily:'var(--serif)', fontStyle:'italic', fontSize:20 }}>✓ Réservation confirmée</div>
                <div style={{ fontSize:13, color:'var(--ink-60)', marginTop:6 }}>Un email de confirmation vous a été envoyé avec le lien de paiement sécurisé.</div>
              </div>
            ) : (
              <button
                onClick={confirm}
                disabled={!selected || !form.nom || !form.email}
                style={{
                  marginTop:24, width:'100%', padding:'16px',
                  background: (selected && form.nom && form.email) ? 'var(--ink)' : 'var(--ink-15)',
                  color:'var(--paper)', border:'none',
                  cursor: (selected && form.nom && form.email) ? 'pointer' : 'not-allowed',
                  fontSize:11, letterSpacing:'.18em', textTransform:'uppercase', fontWeight:500,
                  fontFamily:'inherit',
                }}
              >
                Réserver — {total} €
              </button>
            )}
            <div style={{ fontSize:11, color:'var(--ink-40)', marginTop:12, textAlign:'center', fontStyle:'italic', fontFamily:'var(--serif)' }}>
              Paiement sécurisé par carte · annulation gratuite jusqu'au 1er mars 2027
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ────────────────────────────────────────────────── ACCÈS */
function Acces() {
  const options = [
  ['Depuis Fribourg', 'Autoroute A1 → Lausanne → Genève, puis A40/A42 vers Lyon, enfin A7 Sud jusqu\'à Montélimar-Sud (sortie 18). Parking gratuit sur place.', '~5h20 · 520 km'],
  ['Depuis Lausanne', 'Autoroute A1/A9 jusqu\'à Genève, puis A40/A42 vers Lyon, enfin A7 Sud jusqu\'à Montélimar-Sud (sortie 18).', '~4h30 · 450 km'],
  ['En train', 'Gare TGV Valence ou Montélimar à 25–40 min du Château. Navettes organisées le vendredi & dimanche.', 'Navette gratuite'],
  ['En avion', 'Aéroports de Lyon‑Saint‑Exupéry (1h30) ou Genève (2h30). Location de voiture conseillée.', 'Lyon · Genève']];

  return (
    <section id="acces" className="section">
      <div className="section-head">
        <div className="section-num">V.</div>
        <h2 className="section-title">Pour nous <em>rejoindre</em>.</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
        {/* Stylised map */}
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

            {/* national border CH / FR (dashed) */}
            <path d="M 260 20 Q 245 90 225 135 Q 215 160 200 175" fill="none" stroke="rgba(26,26,26,0.3)" strokeWidth="0.8" strokeDasharray="1 3" />
            <text x="268" y="60" fontFamily="Inter" fontSize="8" letterSpacing="2" fill="rgba(26,26,26,0.45)">CH</text>
            <text x="190" y="60" fontFamily="Inter" fontSize="8" letterSpacing="2" fill="rgba(26,26,26,0.45)">FR</text>

            {/* Lake Geneva (Léman) */}
            <path d="M 215 145 Q 235 138 258 140 Q 275 142 278 150 Q 270 158 245 157 Q 225 156 215 153 Z"
                  fill="var(--accent)" opacity="0.18" stroke="var(--accent)" strokeWidth="0.5" />
            <text x="248" y="152" textAnchor="middle" fontFamily="EB Garamond" fontStyle="italic" fontSize="8" fill="rgba(26,26,26,0.5)">Léman</text>

            {/* Rhône river — from Léman down to Montélimar */}
            <path d="M 220 155 Q 180 200 160 240 Q 145 285 150 325 Q 155 375 175 425 Q 185 455 190 485"
                  fill="none" stroke="var(--accent)" strokeWidth="1.4" opacity="0.55" />
            <text x="135" y="340" fontFamily="EB Garamond" fontStyle="italic" fontSize="10" fill="rgba(26,26,26,0.45)" transform="rotate(-78 135 340)">Rhône</text>

            {/* Route: Fribourg → Lausanne → Genève → Lyon → Montélimar */}
            <path d="M 320 55 Q 290 90 255 115"
                  fill="none" stroke="var(--accent)" strokeWidth="1.6" strokeDasharray="4 3" opacity="0.85" />
            <path d="M 255 115 Q 235 135 220 150"
                  fill="none" stroke="var(--accent)" strokeWidth="1.6" opacity="0.85" />
            <path d="M 220 150 Q 185 195 165 245 Q 150 300 160 355 Q 172 410 200 445"
                  fill="none" stroke="var(--accent)" strokeWidth="1.8" opacity="0.9"
                  markerEnd="url(#arrow)" />

            {/* Autoroute labels */}
            <text x="290" y="78" fontFamily="Inter" fontSize="8" letterSpacing="1.5" fill="rgba(26,26,26,0.5)">A1</text>
            <text x="190" y="210" fontFamily="Inter" fontSize="8" letterSpacing="1.5" fill="rgba(26,26,26,0.5)">A40</text>
            <text x="178" y="370" fontFamily="Inter" fontSize="8" letterSpacing="1.5" fill="rgba(26,26,26,0.5)">A7</text>

            {/* Cities — origin points */}
            <g fontFamily="EB Garamond" fontSize="12" fill="rgba(26,26,26,0.75)">
              <circle cx="320" cy="55" r="3.5" fill="var(--ink)" />
              <text x="328" y="52" fontStyle="italic">Fribourg</text>
              <text x="328" y="64" fontFamily="Inter" fontSize="8" letterSpacing="1.5" fill="rgba(26,26,26,0.45)">DÉPART</text>

              <circle cx="255" cy="115" r="3.5" fill="var(--ink)" />
              <text x="263" y="112" fontStyle="italic">Lausanne</text>
              <text x="263" y="124" fontFamily="Inter" fontSize="8" letterSpacing="1.5" fill="rgba(26,26,26,0.45)">DÉPART</text>

              {/* Transit points */}
              <circle cx="220" cy="150" r="2" fill="rgba(26,26,26,0.55)" />
              <text x="200" y="166" textAnchor="end" fill="rgba(26,26,26,0.55)">Genève</text>

              <circle cx="165" cy="265" r="2" fill="rgba(26,26,26,0.55)" />
              <text x="150" y="270" textAnchor="end" fill="rgba(26,26,26,0.55)">Lyon</text>

              <circle cx="172" cy="395" r="2" fill="rgba(26,26,26,0.4)" />
              <text x="158" y="400" textAnchor="end" fill="rgba(26,26,26,0.45)">Valence</text>
            </g>

            {/* Destination pin — Montélimar */}
            <g transform="translate(200 445)">
              <circle r="32" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.35" />
              <circle r="20" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.65" />
              <circle r="10" fill="none" stroke="var(--accent)" strokeWidth="0.8" opacity="0.9" />
              <circle r="4" fill="var(--accent)" />
            </g>
            <text x="200" y="420" textAnchor="middle" fontFamily="EB Garamond" fontStyle="italic" fontSize="16" fill="var(--ink)">Château les Oliviers</text>
            <text x="200" y="435" textAnchor="middle" fontFamily="Inter" fontSize="9" letterSpacing="2" fill="rgba(26,26,26,0.55)">MONTÉLIMAR · DRÔME</text>

            {/* Compass */}
            <g transform="translate(355 55)" fill="rgba(26,26,26,0.5)">
              <circle r="16" fill="none" stroke="rgba(26,26,26,0.3)" />
              <polygon points="0,-14 2.5,0 0,11 -2.5,0" fill="var(--accent)" />
              <text y="-20" textAnchor="middle" fontFamily="Inter" fontSize="8" letterSpacing="2">N</text>
            </g>

            {/* Scale */}
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
          {options.map(([title, desc, meta], i) =>
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr 140px', gap: 20, padding: '24px 0', borderBottom: i < options.length - 1 ? '1px solid var(--ink-08)' : 'none' }}>
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-40)' }}>0{i + 1}</div>
              <div>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontStyle: 'italic' }}>{title}</div>
                <div style={{ color: 'var(--ink-60)', fontSize: 14, marginTop: 6, lineHeight: 1.55 }}>{desc}</div>
              </div>
              <div className="mono-label" style={{ textAlign: 'right' }}>{meta}</div>
            </div>
          )}
          <div style={{ marginTop: 32, padding: 20, border: '1px solid var(--ink-15)', background: 'color-mix(in oklab, var(--accent) 6%, transparent)' }}>
            <div className="mono-label" style={{ color: 'var(--accent)' }}>Navette</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontStyle: 'italic', marginTop: 6 }}>
              Une navette gratuite circulera entre la gare TGV et le Château le vendredi (17h) et le dimanche (15h). Signalez-vous auprès de nous.
            </div>
          </div>
        </div>
      </div>
    </section>);

}

/* ────────────────────────────────────────────────── DRESS CODE */
function Dresscode() {
  const palette = [
  ['Écru', '#eae1d1'],
  ['Sable', '#d8c8ae'],
  ['Terre', '#b48a6c'],
  ['Sauge', '#a6a88b'],
  ['Ciel pâle', '#c3cdd1'],
  ['Olive', '#6f7555']];

  return (
    <section id="dresscode" className="section" style={{ paddingBottom: 160 }}>
      <div className="section-head">
        <div className="section-num">VI.</div>
        <h2 className="section-title">Dress <em>code</em>.</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 1fr', gap: 48, alignItems: 'start' }}>
        <div></div>
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
            {palette.map(([name, hex], i) =>
            <div key={i} style={{ background: 'var(--paper)', padding: 16, aspectRatio: '1/1.2', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div style={{ background: hex, flex: 1, marginBottom: 12, border: '1px solid rgba(0,0,0,0.05)' }} />
                <div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15 }}>{name}</div>
                  <div className="mono-label" style={{ fontSize: 9, marginTop: 2 }}>{hex}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

/* ────────────────────────────────────────────────── FOOTER */
function Footer() {
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
    </footer>);

}

/* ────────────────────────────────────────────────── TWEAKS PANEL */
function TweaksPanel({ tweaks, setTweaks, active, setActive }) {
  if (!active) return null;
  const row = (label, children) =>
  <div style={{ padding: '12px 0', borderBottom: '1px solid rgba(26,26,26,0.08)' }}>
      <div style={{ fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(26,26,26,.6)', marginBottom: 6 }}>{label}</div>
      {children}
    </div>;

  const opt = (cur, val, setter, label) =>
  <button onClick={() => setter(val)} style={{
    border: '1px solid', borderColor: cur === val ? '#1a1a1a' : 'rgba(26,26,26,.15)',
    background: cur === val ? '#1a1a1a' : 'transparent',
    color: cur === val ? '#faf7f2' : '#1a1a1a',
    padding: '6px 10px', fontSize: 11, cursor: 'pointer', marginRight: 6, marginBottom: 6,
    fontFamily: 'Inter, sans-serif',
    letterSpacing: '.04em'
  }}>{label}</button>;

  const update = (k, v) => {
    const next = { ...tweaks, [k]: v };
    setTweaks(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };
  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, zIndex: 100,
      width: 280, background: '#faf7f2', color: '#1a1a1a',
      border: '1px solid #1a1a1a',
      fontFamily: 'Inter, sans-serif',
      boxShadow: '0 20px 40px rgba(0,0,0,.15)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #1a1a1a' }}>
        <span style={{ fontFamily: "'EB Garamond', serif", fontStyle: 'italic', fontSize: 18 }}>Tweaks</span>
        <button onClick={() => setActive(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
      </div>
      <div style={{ padding: '4px 16px 16px' }}>
        {row('Palette', Object.keys(PALETTES).map((p) => opt(tweaks.palette, p, (v) => update('palette', v), p)))}
        {row('Serif', Object.keys(SERIFS).map((p) => opt(tweaks.serif, p, (v) => update('serif', v), p)))}
        {row('Accent', Object.keys(ACCENTS).map((p) => opt(tweaks.accent, p, (v) => update('accent', v), p)))}
      </div>
    </div>);

}

/* ────────────────────────────────────────────────── GATE */
const SITE_PASSWORD = 'provence2027';

function Gate({ onUnlock }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (value.trim().toLowerCase() === SITE_PASSWORD) {
      try { localStorage.setItem('cj-unlocked', '1'); } catch(err){}
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{
      position:'fixed', inset:0, zIndex:9999,
      background:'var(--paper)', color:'var(--ink)',
      display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center',
      padding:'32px', textAlign:'center',
    }}>
      <style>{`@keyframes cj-shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }`}</style>

      <div style={{ position:'absolute', top:32, left:48, fontSize:11, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--ink-60)' }}>
        Charlène <span style={{ fontFamily:'var(--serif)', fontStyle:'italic', textTransform:'none', letterSpacing:0, fontSize:14 }}>&</span> Julien
      </div>
      <div style={{ position:'absolute', top:32, right:48, fontSize:11, letterSpacing:'.22em', textTransform:'uppercase', color:'var(--ink-60)' }}>
        11—13 juin 2027
      </div>

      <div style={{ maxWidth:520, animation: shake ? 'cj-shake .45s' : 'none' }}>
        <div className="mono-label" style={{ marginBottom:20 }}>— Accès privé</div>
        <h1 style={{ fontFamily:'var(--serif)', fontSize:'clamp(40px,6vw,72px)', lineHeight:1.02, fontStyle:'italic', fontWeight:400, margin:0 }}>
          Un mot,<br/>et la porte s'ouvre.
        </h1>
        <p style={{ fontFamily:'var(--serif)', fontSize:18, color:'var(--ink-60)', marginTop:24, lineHeight:1.5 }}>
          Ce site est réservé aux invités de notre mariage.<br/>
          Le mot de passe figure sur votre faire-part.
        </p>

        <form onSubmit={submit} style={{ marginTop:40, display:'flex', flexDirection:'column', gap:16, alignItems:'stretch' }}>
          <input
            autoFocus
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Votre mot de passe"
            style={{
              padding:'18px 20px',
              border:'1px solid ' + (error ? 'var(--accent, #b85a3e)' : 'var(--ink)'),
              background:'transparent',
              fontFamily:'var(--serif)', fontSize:22, fontStyle:'italic',
              color:'var(--ink)', outline:'none', textAlign:'center',
              letterSpacing:'.3em',
            }}
          />
          <button type="submit" style={{
            padding:'18px 20px', background:'var(--ink)', color:'var(--paper)',
            border:'none', cursor:'pointer',
            fontSize:11, letterSpacing:'.22em', textTransform:'uppercase', fontFamily:'inherit',
          }}>Entrer</button>
          {error && (
            <div style={{ fontSize:13, color:'var(--accent, #b85a3e)', fontStyle:'italic', fontFamily:'var(--serif)' }}>
              Mot de passe incorrect. Vérifiez votre faire-part.
            </div>
          )}
        </form>

        <div style={{ marginTop:48, fontSize:11, letterSpacing:'.15em', textTransform:'uppercase', color:'var(--ink-40)' }}>
          Un doute ? Écrivez-nous — charlene.julien.2027@mail.fr
        </div>
      </div>

      <div style={{ position:'absolute', bottom:32, left:0, right:0, textAlign:'center', fontSize:10, letterSpacing:'.2em', textTransform:'uppercase', color:'var(--ink-40)' }}>
        Provence · France
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────── APP */
function App() {
  const [unlocked, setUnlocked] = useState(() => {
    try { return localStorage.getItem('cj-unlocked') === '1'; } catch(e) { return false; }
  });
  const [tweaks, setTweaks] = useState(window.TWEAK_DEFAULTS);
  const [editActive, setEditActive] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {applyTweaks(tweaks);}, [tweaks]);

  useEffect(() => {
    const onMsg = (e) => {
      if (e.data?.type === '__activate_edit_mode') setEditActive(true);
      if (e.data?.type === '__deactivate_edit_mode') setEditActive(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  useEffect(() => {
    const ids = ['histoire', 'programme', 'lieu', 'chambres', 'acces', 'dresscode'];
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {if (e.isIntersecting) setActiveSection(e.target.id);});
    }, { rootMargin: '-45% 0px -45% 0px' });
    ids.forEach((id) => {const el = document.getElementById(id);if (el) io.observe(el);});
    return () => io.disconnect();
  }, []);

  return (
    <>
      {!unlocked && <Gate onUnlock={() => setUnlocked(true)} />}
      <div id="top" style={{ filter: unlocked ? 'none' : 'blur(20px)', pointerEvents: unlocked ? 'auto' : 'none' }} aria-hidden={!unlocked}>
      <Nav active={activeSection} />
      <Hero />
      <Histoire />
      <Programme />
      <Lieu />
      <Chambres />
      <Acces />
      <Dresscode />
      <Footer />
      <TweaksPanel tweaks={tweaks} setTweaks={setTweaks} active={editActive} setActive={setEditActive} />
    </div></>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);