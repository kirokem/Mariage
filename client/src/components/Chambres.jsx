import { useEffect, useMemo, useState } from 'react';
import { api } from '../api.js';

const inputStyle = {
  width: '100%', padding: '10px 12px',
  border: '1px solid var(--ink-15)', background: 'var(--paper)',
  fontFamily: 'var(--serif)', fontSize: 17,
  color: 'var(--ink)', outline: 'none',
  boxSizing: 'border-box'
};

function loadBookingSummary() {
  try { return JSON.parse(localStorage.getItem('cj-booking') || 'null'); }
  catch (e) { return null; }
}

export default function Chambres({ enabled = true }) {
  const [rooms, setRooms] = useState([]);
  const [forfait, setForfait] = useState(220);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [bookingSummary, setBookingSummary] = useState(loadBookingSummary);
  const [selectedId, setSelectedId] = useState(() => loadBookingSummary()?.roomId || null);
  const [guests, setGuests] = useState(() => loadBookingSummary()?.guests || 2);
  const [form, setForm] = useState(() => ({ nom: loadBookingSummary()?.nom || '', email: loadBookingSummary()?.email || '' }));
  const [filter, setFilter] = useState('toutes');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const refreshRooms = () => {
    setLoading(true);
    api.getRooms()
      .then(({ rooms, forfait }) => { setRooms(rooms); setForfait(forfait); setLoadError(false); })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { if (enabled) refreshRooms(); }, [enabled]);

  const current = rooms.find((r) => r.id === selectedId);
  const mine = bookingSummary?.roomId === selectedId;
  const confirmed = Boolean(bookingSummary && bookingSummary.roomId === selectedId);
  const total = guests * forfait;

  const wings = useMemo(() => [...new Set(rooms.map((r) => r.wing))], [rooms]);
  const dispo = rooms.filter((r) => !r.reserved).length;

  const selectRoom = (room) => {
    if (room.reserved && bookingSummary?.roomId !== room.id) return;
    setSelectedId(room.id);
    setSubmitError('');
    if (bookingSummary?.roomId !== room.id) {
      setGuests(Math.min(2, room.capacity));
    }
  };

  const confirm = async () => {
    if (!selectedId || !form.nom || !form.email || submitting) return;
    setSubmitting(true);
    setSubmitError('');
    try {
      const result = await api.createBooking({ roomId: selectedId, guests, nom: form.nom, email: form.email });
      const summary = { roomId: result.roomId, guests: result.guests, total: result.total, nom: result.nom, email: result.email };
      setBookingSummary(summary);
      try { localStorage.setItem('cj-booking', JSON.stringify(summary)); } catch (e) {}
      setRooms((prev) => prev.map((r) => (r.id === selectedId ? { ...r, reserved: true } : r)));
    } catch (err) {
      if (err.status === 409) {
        setSubmitError('Cette chambre vient d\'être réservée par quelqu\'un d\'autre. Choisissez-en une autre.');
        refreshRooms();
      } else {
        setSubmitError('Une erreur est survenue. Réessayez.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="chambres" className="section">
      <div className="section-head">
        <div className="section-num">IV.</div>
        <h2 className="section-title">Choisissez votre <em>chambre</em>.</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 32, marginBottom: 40 }}>
        <div />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24, padding: '24px 0', borderTop: '1px solid var(--ink-15)', borderBottom: '1px solid var(--ink-15)' }}>
          <div>
            <div className="mono-label">Forfait</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontStyle: 'italic', marginTop: 4 }}>{forfait} €<span style={{ fontSize: 14, color: 'var(--ink-60)' }}> / personne</span></div>
          </div>
          <div>
            <div className="mono-label">Inclus</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 16, marginTop: 6, color: 'var(--ink-60)' }}>2 nuits · petits-déjeuners · brunch du dimanche</div>
          </div>
          <div>
            <div className="mono-label">Disponibles</div>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 28, fontStyle: 'italic', marginTop: 4 }}>{dispo}<span style={{ fontSize: 14, color: 'var(--ink-60)' }}> / {rooms.length}</span></div>
          </div>
        </div>
      </div>

      {loadError ? (
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-60)' }}>
          Impossible de charger les chambres pour le moment. Rechargez la page.
        </div>
      ) : loading ? (
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-60)' }}>Chargement des chambres…</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 48, alignItems: 'start' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {['toutes', ...wings].map((w) => (
                <button key={w} onClick={() => setFilter(w)} style={{
                  border: '1px solid ' + (filter === w ? 'var(--ink)' : 'var(--ink-15)'),
                  background: filter === w ? 'var(--ink)' : 'transparent',
                  color: filter === w ? 'var(--paper)' : 'var(--ink)',
                  padding: '6px 12px', fontSize: 11, letterSpacing: '.1em',
                  textTransform: 'uppercase', cursor: 'pointer', fontFamily: 'inherit'
                }}>{w}</button>
              ))}
            </div>

            {wings.filter((w) => filter === 'toutes' || filter === w).map((wing) => (
              <div key={wing} style={{ marginBottom: 32 }}>
                <div className="mono-label" style={{ marginBottom: 12 }}>— {wing}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px,1fr))', gap: 12 }}>
                  {rooms.filter((r) => r.wing === wing).map((room) => {
                    const taken = room.reserved;
                    const isMine = selectedId === room.id;
                    return (
                      <button
                        key={room.id}
                        disabled={taken && !isMine}
                        onClick={() => selectRoom(room)}
                        style={{
                          textAlign: 'left', padding: 16,
                          background: isMine ? 'var(--ink)' : (taken ? 'var(--paper-2)' : 'var(--paper)'),
                          color: isMine ? 'var(--paper)' : (taken ? 'var(--ink-40)' : 'var(--ink)'),
                          border: '1px solid ' + (isMine ? 'var(--ink)' : 'var(--ink-15)'),
                          cursor: taken && !isMine ? 'not-allowed' : 'pointer',
                          opacity: taken && !isMine ? 0.55 : 1,
                          transition: 'all .2s',
                          fontFamily: 'inherit'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22 }}>{room.name}</span>
                          <span style={{ fontSize: 10, letterSpacing: '.12em', textTransform: 'uppercase', opacity: 0.6 }}>{room.floor}</span>
                        </div>
                        <div style={{ fontSize: 13, marginTop: 8, opacity: 0.75, lineHeight: 1.5 }}>
                          {room.beds}<br />
                          <span style={{ fontStyle: 'italic', fontFamily: 'var(--serif)', fontSize: 14 }}>Vue : {room.view}</span>
                        </div>
                        <div style={{ marginTop: 10, display: 'flex', gap: 8, fontSize: 10, letterSpacing: '.08em', textTransform: 'uppercase', opacity: 0.7 }}>
                          <span>{room.capacity} pers.</span>
                          {room.accessible && <span>· PMR</span>}
                          {taken && !isMine && <span style={{ marginLeft: 'auto', opacity: 1 }}>Réservée</span>}
                          {isMine && <span style={{ marginLeft: 'auto', opacity: 1 }}>✓ votre choix</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div style={{ position: 'sticky', top: 100 }}>
            <div style={{ border: '1px solid var(--ink)', padding: 32, background: 'var(--paper)' }}>
              <div className="mono-label">Récapitulatif</div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 32, fontStyle: 'italic', lineHeight: 1.1, marginTop: 8 }}>
                {current ? current.name : 'Aucune chambre'}
              </h3>
              {current ? (
                <div style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 6 }}>
                  {current.wing} · {current.floor} · {current.beds}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 6, fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
                  Sélectionnez une chambre dans la liste.
                </div>
              )}

              {!confirmed && (
                <div style={{ borderTop: '1px solid var(--ink-15)', marginTop: 24, paddingTop: 20 }}>
                  <label style={{ display: 'block', marginBottom: 16 }}>
                    <div className="mono-label" style={{ marginBottom: 6 }}>Nombre de personnes</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <button onClick={() => setGuests(Math.max(1, guests - 1))} disabled={!current} style={{ width: 32, height: 32, border: '1px solid var(--ink-15)', background: 'transparent', cursor: current ? 'pointer' : 'not-allowed', fontSize: 18, fontFamily: 'inherit' }}>−</button>
                      <span style={{ fontFamily: 'var(--serif)', fontSize: 24, fontStyle: 'italic', minWidth: 24, textAlign: 'center' }}>{guests}</span>
                      <button onClick={() => setGuests(Math.min(current?.capacity || 1, guests + 1))} disabled={!current} style={{ width: 32, height: 32, border: '1px solid var(--ink-15)', background: 'transparent', cursor: current ? 'pointer' : 'not-allowed', fontSize: 18, fontFamily: 'inherit' }}>+</button>
                      {current && <span style={{ fontSize: 12, color: 'var(--ink-40)' }}>max {current.capacity}</span>}
                    </div>
                  </label>
                  <label style={{ display: 'block', marginBottom: 12 }}>
                    <div className="mono-label" style={{ marginBottom: 6 }}>Nom(s)</div>
                    <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} placeholder="Jeanne & Paul Dupont" style={inputStyle} />
                  </label>
                  <label style={{ display: 'block' }}>
                    <div className="mono-label" style={{ marginBottom: 6 }}>Email</div>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jeanne@exemple.fr" style={inputStyle} />
                  </label>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--ink-15)', marginTop: 24, paddingTop: 20, display: 'grid', gap: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-60)' }}>
                  <span>{guests} × {forfait} €</span><span>{guests * forfait} €</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: 'var(--ink-60)' }}>
                  <span>Taxe de séjour</span><span>offerte</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'var(--serif)', fontSize: 24, fontStyle: 'italic', marginTop: 8, borderTop: '1px solid var(--ink-15)', paddingTop: 12 }}>
                  <span>Total</span><span>{total} €</span>
                </div>
              </div>

              {confirmed ? (
                <div style={{ marginTop: 24, padding: 16, background: 'color-mix(in oklab, var(--accent) 8%, transparent)', border: '1px solid color-mix(in oklab, var(--accent) 30%, transparent)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20 }}>✓ Réservation confirmée</div>
                  <div style={{ fontSize: 13, color: 'var(--ink-60)', marginTop: 6 }}>Un email de confirmation vous a été envoyé avec le lien de paiement sécurisé.</div>
                </div>
              ) : (
                <>
                  <button
                    onClick={confirm}
                    disabled={!selectedId || !form.nom || !form.email || submitting}
                    style={{
                      marginTop: 24, width: '100%', padding: '16px',
                      background: (selectedId && form.nom && form.email && !submitting) ? 'var(--ink)' : 'var(--ink-15)',
                      color: 'var(--paper)', border: 'none',
                      cursor: (selectedId && form.nom && form.email && !submitting) ? 'pointer' : 'not-allowed',
                      fontSize: 11, letterSpacing: '.18em', textTransform: 'uppercase', fontWeight: 500,
                      fontFamily: 'inherit'
                    }}
                  >
                    {submitting ? 'Réservation…' : `Réserver — ${total} €`}
                  </button>
                  {submitError && (
                    <div style={{ fontSize: 12, color: 'var(--accent, #b85a3e)', marginTop: 10, fontStyle: 'italic', fontFamily: 'var(--serif)' }}>{submitError}</div>
                  )}
                </>
              )}
              <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 12, textAlign: 'center', fontStyle: 'italic', fontFamily: 'var(--serif)' }}>
                Paiement sécurisé par carte · annulation gratuite jusqu'au 1er mars 2027
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
