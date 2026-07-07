import { useEffect, useState } from 'react';

const TARGET = new Date('2027-06-11T16:00:00+02:00').getTime();

export default function Countdown() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const diff = Math.max(0, TARGET - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);

  const cell = (n, l) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,4vw,48px)', lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
        {String(n).padStart(2, '0')}
      </div>
      <div className="mono-label" style={{ marginTop: 8 }}>{l}</div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 'clamp(24px,4vw,64px)', justifyContent: 'center' }}>
      {cell(d, 'jours')}{cell(h, 'heures')}{cell(m, 'minutes')}{cell(s, 'secondes')}
    </div>
  );
}
