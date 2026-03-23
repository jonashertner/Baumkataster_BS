// ============================================================
// config.js — All application constants
// Replace MAPBOX_TOKEN with a real public token before deploy.
// ============================================================

export const MAPBOX_TOKEN =
  'pk.eyJ1Ijoiam9uYXNoZXJ0bmVyIiwiYSI6ImNtbjI3d2JzdzB2aTUycnNqdnU3azhhczYifQ.nblKYvXyQR8CYiSq5zTnqQ';

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
// Nature-inspired palette: warm, earthy, distinct but harmonious
export const SPECIES_COLORS = {
  // Broadleaf greens — warm to cool
  Tilia:     '#5B9A3C', // linden — warm sage green
  Carpinus:  '#6B8E4E', // hornbeam — olive green
  Fagus:     '#4A7C59', // beech — deep forest green
  Fraxinus:  '#3D8B7A', // ash — blue-green teal

  // Warm spectrum
  Platanus:  '#C49A3C', // plane — warm amber
  Acer:      '#D4783A', // maple — burnt orange
  Aesculus:  '#B85C38', // chestnut — terracotta
  Quercus:   '#8B6834', // oak — warm umber
  Betula:    '#D4B854', // birch — soft gold
  Prunus:    '#C7727A', // cherry — dusty rose
  Robinia:   '#9B7A5B', // robinia — warm taupe

  // Cool spectrum
  Zelkova:   '#5E8B94', // zelkova — steel teal
  Ginkgo:    '#B8A43C', // ginkgo — golden olive
  Juglans:   '#7A6B52', // walnut — warm stone

  // Conifers — deep blue-greens
  Picea:     '#2D6854', // spruce — deep blue-green
  Pinus:     '#3A6B4A', // pine — forest
  Abies:     '#2D5F4A', // fir — dark emerald
  Taxus:     '#385A42', // yew — dark myrtle
  Thuja:     '#3A6350', // cedar — juniper
  Cedrus:    '#346054', // cedar of Lebanon
  Larix:     '#4A7858', // larch — lighter conifer

  // Other notable genera
  Parrotia:  '#A65D3F', // ironwood — copper
  Cornus:    '#C4685A', // dogwood — coral
  Trachycarpus: '#6B8B5E', // palm — tropical green

  // Fallback
  _default:  '#7A8B78', // muted sage (not gray — feels natural)
};

// ── Protection-status accent colours ────────────────────────
export const PROTECTION_COLORS = {
  protected:   '#2E7D32', // dark green
  unprotected: '#9E9E9E', // gray
};

// ── Network ─────────────────────────────────────────────────
export const FETCH_TIMEOUT_MS = 30_000; // 30 s
