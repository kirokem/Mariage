import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../api.js';

const PhotosContext = createContext(null);

export function PhotosProvider({ children, enabled = true }) {
  const [photos, setPhotos] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    api.getPhotos().then((map) => { setPhotos(map || {}); setLoaded(true); }).catch(() => setLoaded(true));
  }, [enabled]);

  const upload = useCallback(async (slotId, file) => {
    const { url } = await api.uploadPhoto(slotId, file);
    setPhotos((prev) => ({ ...prev, [slotId]: `${url}?t=${Date.now()}` }));
  }, []);

  const remove = useCallback(async (slotId) => {
    await api.deletePhoto(slotId);
    setPhotos((prev) => {
      const next = { ...prev };
      delete next[slotId];
      return next;
    });
  }, []);

  return (
    <PhotosContext.Provider value={{ photos, loaded, upload, remove }}>
      {children}
    </PhotosContext.Provider>
  );
}

export function usePhotos() {
  const ctx = useContext(PhotosContext);
  if (!ctx) throw new Error('usePhotos must be used within a PhotosProvider');
  return ctx;
}
