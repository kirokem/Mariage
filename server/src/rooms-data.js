// Static room catalogue for Château les Oliviers de Salette (32 rooms / 5 wings).
// Ported from the Claude Design prototype (project/app.jsx, CHAMBRES generator).

const WINGS = [
  { wing: 'Château — Aile ouest', names: ['Olivier', 'Lavande', 'Romarin', 'Cyprès', 'Mistral', 'Iris', 'Myrte', 'Garrigue'] },
  { wing: 'Château — Aile est', names: ['Figuier', 'Amandier', 'Tournesol', 'Roseraie', 'Thym', 'Sauge', 'Verveine', 'Estragon'] },
  { wing: 'Orangerie', names: ['Clémentine', 'Bergamote', 'Yuzu', 'Néroli', 'Citron', 'Cédrat'] },
  { wing: 'Dépendance', names: ['Pin', 'Chêne', 'Abricot', 'Cerisier', 'Vigne', 'Laurier'] },
  { wing: 'Tour', names: ['Belvédère', 'Panorama', 'Mistral haut', 'Ponant'] }
];
const BED_TYPES = ['1 lit double', '1 lit king', '2 lits simples', '1 lit double + 1 simple', '2 lits doubles'];
const VIEWS = ['Cour pavée', 'Jardin sud', 'Orangerie', 'Oliveraie', 'Roseraie', 'Verger', 'Panorama', 'Potager', 'Lavandes'];
const FLOORS = ['RDC', '1er', '2e'];

export const FORFAIT = 220;

function slugify(name) {
  return name.toLowerCase().replace(/\s/g, '-').replace(/[^a-z0-9-]/g, '');
}

export const ROOMS = (() => {
  const rooms = [];
  let i = 0;
  WINGS.forEach(({ wing, names }) => {
    names.forEach((name, j) => {
      const beds = BED_TYPES[i % BED_TYPES.length];
      const capacity = beds.includes('+') ? 3 : beds.includes('doubles') ? 4 : 2;
      rooms.push({
        id: slugify(name),
        name,
        wing,
        floor: FLOORS[(j + (wing === 'Tour' ? 1 : 0)) % FLOORS.length],
        beds,
        capacity,
        view: VIEWS[i % VIEWS.length],
        accessible: i === 0 || i === 18
      });
      i++;
    });
  });
  return rooms;
})();

export const ROOM_IDS = new Set(ROOMS.map((r) => r.id));

// Rooms pre-booked by other guests before the site launches, matching the prototype's demo state.
export const SEED_RESERVED_ROOM_IDS = ['lavande', 'figuier', 'neroli', 'pin', 'tournesol'];
