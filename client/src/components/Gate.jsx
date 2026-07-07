import { useState } from 'react';
import { api } from '../api.js';

export default function Gate({ onUnlock }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      await api.login(value);
      onUnlock();
    } catch (err) {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'var(--paper)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      padding: '32px', textAlign: 'center'
    }}>
      <div style={{ position: 'absolute', top: 32, left: 48, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>
        Charlène <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', textTransform: 'none', letterSpacing: 0, fontSize: 14 }}>&</span> Julien
      </div>
      <div style={{ position: 'absolute', top: 32, right: 48, fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--ink-60)' }}>
        11—13 juin 2027
      </div>

      <div style={{ maxWidth: 520, animation: shake ? 'cj-shake .45s' : 'none' }}>
        <div className="mono-label" style={{ marginBottom: 20 }}>— Accès privé</div>
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px,6vw,72px)', lineHeight: 1.02, fontStyle: 'italic', fontWeight: 400, margin: 0 }}>
          Un mot,<br />et la porte s'ouvre.
        </h1>
        <p style={{ fontFamily: 'var(--serif)', fontSize: 18, color: 'var(--ink-60)', marginTop: 24, lineHeight: 1.5 }}>
          Ce site est réservé aux invités de notre mariage.<br />
          Le mot de passe figure sur votre faire-part.
        </p>

        <form onSubmit={submit} style={{ marginTop: 40, display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'stretch' }}>
          <input
            autoFocus
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            placeholder="Votre mot de passe"
            style={{
              padding: '18px 20px',
              border: '1px solid ' + (error ? 'var(--accent, #b85a3e)' : 'var(--ink)'),
              background: 'transparent',
              fontFamily: 'var(--serif)', fontSize: 22, fontStyle: 'italic',
              color: 'var(--ink)', outline: 'none', textAlign: 'center',
              letterSpacing: '.3em'
            }}
          />
          <button type="submit" disabled={submitting} style={{
            padding: '18px 20px', background: 'var(--ink)', color: 'var(--paper)',
            border: 'none', cursor: submitting ? 'wait' : 'pointer',
            fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', fontFamily: 'inherit'
          }}>Entrer</button>
          {error && (
            <div style={{ fontSize: 13, color: 'var(--accent, #b85a3e)', fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
              Mot de passe incorrect. Vérifiez votre faire-part.
            </div>
          )}
        </form>

        <div style={{ marginTop: 48, fontSize: 11, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>
          Un doute ? Écrivez-nous — charlene.julien.2027@mail.fr
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 32, left: 0, right: 0, textAlign: 'center', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--ink-40)' }}>
        Provence · France
      </div>
    </div>
  );
}
