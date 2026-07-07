async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    credentials: 'include',
    headers: options.body instanceof FormData ? undefined : { 'Content-Type': 'application/json' },
    ...options
  });
  let data = null;
  try { data = await res.json(); } catch (e) { /* no body */ }
  if (!res.ok) {
    const error = new Error(data?.error || 'request_failed');
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  getSession: () => request('/auth/session'),
  login: (password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ password }) }),
  logout: () => request('/auth/logout', { method: 'POST' }),

  getRooms: () => request('/rooms'),
  createBooking: (payload) => request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),

  getPhotos: () => request('/photos'),
  uploadPhoto: (slotId, file) => {
    const form = new FormData();
    form.append('photo', file);
    return request(`/photos/${slotId}`, { method: 'POST', body: form });
  },
  deletePhoto: (slotId) => request(`/photos/${slotId}`, { method: 'DELETE' })
};
