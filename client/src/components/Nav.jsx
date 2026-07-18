import { useEffect, useState } from 'react';

const ITEMS = [
  ['histoire', 'I · Notre histoire'],
  ['programme', 'II · Programme'],
  ['lieu', 'III · Le lieu'],
  ['chambres', 'IV · Chambres'],
  ['acces', 'V · Accès'],
  ['dresscode', 'VI · Dress code']
];

export default function Nav({ active }) {
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    const onScroll = () => setHidden(window.scrollY < window.innerHeight * 0.6);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className="nav-bar" style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
      padding: '16px 48px',
      background: 'color-mix(in oklab, var(--paper) 88%, transparent)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--ink-08)',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      gap: 24,
      transform: hidden ? 'translateY(-110%)' : 'translateY(0)',
      transition: 'transform .5s cubic-bezier(.2,.7,.2,1)'
    }}>
      <a href="#top" style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 18 }}>Charlène &amp; Julien</a>
      <div style={{ display: 'flex', gap: 28, fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase' }}>
        {ITEMS.map(([id, label]) => (
          <a key={id} href={'#' + id} style={{
            color: active === id ? 'var(--ink)' : 'var(--ink-60)',
            borderBottom: active === id ? '1px solid var(--ink)' : '1px solid transparent',
            paddingBottom: 2, transition: 'color .2s, border-color .2s'
          }}>{label}</a>
        ))}
      </div>
      <span style={{ fontSize: 12, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>11—13 · VI · 2027</span>
    </nav>
  );
}
