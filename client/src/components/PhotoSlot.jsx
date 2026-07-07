import { useRef, useState } from 'react';
import { usePhotos } from '../context/PhotosContext.jsx';

export default function PhotoSlot({ id, label, aspectRatio = '4/5', style }) {
  const { photos, upload, remove } = usePhotos();
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const inputRef = useRef(null);
  const src = photos[id];

  const handleFile = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setBusy(true);
    try {
      await upload(id, file);
    } catch (err) {
      alert("Impossible d'envoyer cette photo. Essayez une image plus légère (< 8 Mo).");
    } finally {
      setBusy(false);
    }
  };

  const clear = async (e) => {
    e.stopPropagation();
    setBusy(true);
    try { await remove(id); } finally { setBusy(false); }
  };

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
      onDragLeave={() => setDrag(false)}
      onDrop={(e) => {
        e.preventDefault(); setDrag(false);
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
        opacity: busy ? 0.6 : 1,
        ...style
      }}
      className={src ? '' : 'ph'}
    >
      {src ? (
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
            }}
          >×</button>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: 16 }}>
          <div style={{ fontSize: 18, marginBottom: 8, opacity: 0.5 }}>＋</div>
          <div>{drag ? 'déposez ici' : label || 'ajouter une photo'}</div>
          <div style={{ fontSize: 9, marginTop: 6, opacity: 0.6, textTransform: 'none', letterSpacing: 'normal', fontFamily: 'var(--serif)', fontStyle: 'italic' }}>cliquez ou glissez-déposez</div>
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFile(e.target.files?.[0])}
        style={{ display: 'none' }}
      />
    </div>
  );
}
