// ============================================================
// config.js — All application constants
// Replace MAPBOX_TOKEN with a real public token before deploy.
// ============================================================

export const MAPBOX_TOKEN =
  'pk.REPLACE_WITH_YOUR_MAPBOX_PUBLIC_TOKEN';

export const API_URL =
  'https://data.bs.ch/api/explore/v2.1/catalog/datasets/100052/exports/geojson' +
  '?select=ba_baumnr,baumart_deutsch,baumart_lateinisch,ba_baumalter,' +
  'ba_schutzstatus,ba_strasse,ba_kreis,ba_gemeinde,timeposition';

// ── Map defaults (WGS-84, Basel city centre) ────────────────
export const MAP_CENTER = [7.5886, 47.5596]; // [lng, lat]
export const MAP_ZOOM   = 13;
export const MAP_BOUNDS = [
  [7.45, 47.50],  // SW corner
  [7.75, 47.62],  // NE corner
];

// ── Species genus → accent colour ───────────────────────────
// Key: leading Latin genus (matched via startsWith on baumart_lateinisch)
// Value: hex colour string
export const SPECIES_COLORS = {
  Tilia:    '#4CAF50', // warm green
  Platanus: '#FFB300', // gold
  Aesculus: '#C62828', // deep red
  Quercus:  '#795548', // brown
  Acer:     '#FF8F00', // orange
  Betula:   '#FDD835', // light yellow
  Fraxinus: '#00897B', // teal
  // Conifers – all map to dark green
  Picea:    '#2E7D32',
  Pinus:    '#2E7D32',
  Abies:    '#2E7D32',
  Taxus:    '#2E7D32',
  Thuja:    '#2E7D32',
  Cedrus:   '#2E7D32',
  Larix:    '#2E7D32',
  // Fallback
  _default: '#9E9E9E', // gray
};

// ── Protection-status accent colours ────────────────────────
export const PROTECTION_COLORS = {
  protected:   '#2E7D32', // dark green
  unprotected: '#9E9E9E', // gray
};

// ── Network ─────────────────────────────────────────────────
export const FETCH_TIMEOUT_MS = 30_000; // 30 s
