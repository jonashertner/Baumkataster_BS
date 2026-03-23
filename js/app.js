// ============================================================
// app.js — Map initialisation and data loading
// Entry point loaded as ES module from index.html
// ============================================================

import {
  MAPBOX_TOKEN,
  API_URL,
  MAP_CENTER,
  MAP_ZOOM,
  MAP_BOUNDS,
  FETCH_TIMEOUT_MS,
} from './config.js';

import { processTreeData, computeStoryData } from './trees.js';

// ── Shared application state ─────────────────────────────────
export const state = {
  map:           null,
  treeData:      null,
  lang:          'de',
  selectedTree:  null,
  activeFilters: {},
  storyData:     null,
};

// ── Map initialisation ───────────────────────────────────────
/**
 * Creates and returns the Mapbox map.
 * Resolves when the 'load' event fires.
 * @returns {Promise<mapboxgl.Map>}
 */
function initMap() {
  mapboxgl.accessToken = MAPBOX_TOKEN;

  const map = new mapboxgl.Map({
    container:            'map',
    style:                window.matchMedia('(prefers-color-scheme: dark)').matches
                            ? 'mapbox://styles/mapbox/dark-v11'
                            : 'mapbox://styles/mapbox/light-v11',
    center:               MAP_CENTER,
    zoom:                 MAP_ZOOM,
    maxBounds:            MAP_BOUNDS,
    preserveDrawingBuffer: true,
  });

  // Navigation controls (zoom + compass) — top-right
  map.addControl(new mapboxgl.NavigationControl(), 'top-right');

  return new Promise((resolve) => {
    map.on('load', () => resolve(map));
  });
}

// ── Network helpers ──────────────────────────────────────────
/**
 * Fetch with a hard timeout via AbortController.
 * @param {string} url
 * @param {number} timeoutMs
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timerId    = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} – ${response.statusText}`);
    }
    return response;
  } finally {
    clearTimeout(timerId);
  }
}

// ── Data loading ─────────────────────────────────────────────
/**
 * Fetches tree GeoJSON from the Basel open data API.
 * Retries once on failure.
 * Validates that the response contains a non-empty features array
 * and filters out features with missing geometry coordinates.
 * @returns {Promise<GeoJSON.FeatureCollection>}
 */
async function loadTreeData() {
  let lastError;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetchWithTimeout(API_URL, FETCH_TIMEOUT_MS);
      const json     = await response.json();

      // Basic shape validation
      if (!json || !Array.isArray(json.features) || json.features.length === 0) {
        throw new Error('API response is missing a non-empty features array.');
      }

      // Filter out entries with null/missing geometry
      const validFeatures = json.features.filter(
        (f) => f.geometry && Array.isArray(f.geometry.coordinates) && f.geometry.coordinates.length >= 2,
      );

      return { ...json, features: validFeatures };
    } catch (err) {
      lastError = err;
      // Only log on first failure; silent retry
      console.warn(`[loadTreeData] attempt ${attempt + 1} failed:`, err.message);
    }
  }

  throw lastError;
}

// ── Map layer setup ──────────────────────────────────────────
/**
 * Adds the GeoJSON source and three map layers to display trees:
 *   1. clusters   – circle clusters for dense areas
 *   2. cluster-count – label showing point count inside clusters
 *   3. trees      – individual tree circles (with genus-based colour)
 *
 * NOTE: The `_color` and `_protected` properties are added by
 * processTreeData() (imported in Task 2). Until then the layer
 * falls back to the coalesce default colour (#9E9E9E).
 */
function addTreeLayer() {
  // Source with clustering enabled
  state.map.addSource('trees', {
    type:           'geojson',
    data:           state.treeData,
    cluster:        true,
    clusterMaxZoom: 14,
    clusterRadius:  50,
  });

  // ── Layer 1: cluster circles ─────────────────────────────
  state.map.addLayer({
    id:     'clusters',
    type:   'circle',
    source: 'trees',
    filter: ['has', 'point_count'],
    paint:  {
      'circle-color':   '#4CAF50',
      'circle-opacity': 0.7,
      'circle-radius': [
        'step',
        ['get', 'point_count'],
        18,   // default
        50,   24,
        200,  32,
        1000, 40,
      ],
    },
  });

  // ── Layer 2: cluster label ───────────────────────────────
  state.map.addLayer({
    id:     'cluster-count',
    type:   'symbol',
    source: 'trees',
    filter: ['has', 'point_count'],
    layout: {
      'text-field':  '{point_count_abbreviated}',
      'text-font':   ['DIN Pro Medium', 'Arial Unicode MS Bold'],
      'text-size':   12,
    },
    paint: {
      'text-color': '#ffffff',
    },
  });

  // ── Layer 3: individual trees ────────────────────────────
  // TODO (Task 2): processTreeData() will populate _color and _protected.
  // Until then _color is absent and the coalesce falls back to #9E9E9E.
  state.map.addLayer({
    id:     'trees',
    type:   'circle',
    source: 'trees',
    filter: ['!', ['has', 'point_count']],
    paint:  {
      // Radius grows with zoom level
      'circle-radius': [
        'interpolate', ['linear'], ['zoom'],
        10, 2,
        14, 4,
        18, 8,
      ],
      // Genus-based colour via feature property; gray fallback
      'circle-color': [
        'coalesce',
        ['get', '_color'],
        '#9E9E9E',
      ],
      'circle-opacity': 0.85,
      // Stroke: thicker ring for protected trees
      'circle-stroke-width': [
        'case',
        ['==', ['get', '_protected'], true],
        1.5,
        0,
      ],
      'circle-stroke-color': 'rgba(46, 125, 50, 0.5)',
    },
  });
}

// ── Permalink handler ────────────────────────────────────────
/**
 * Reads the URL hash and, if it matches #/tree/{id}, loads
 * the matching tree and opens the detail panel.
 */
async function handlePermalink() {
  const match = window.location.hash.match(/^#\/tree\/(.+)$/);
  if (!match) return;

  const targetId = match[1];
  const feature  = state.treeData?.features.find(
    (f) => String(f.properties?.ba_baumnr) === String(targetId),
  );

  if (!feature) {
    console.warn('[handlePermalink] No tree found for id:', targetId);
    return;
  }

  try {
    const { flyToTree, showTreeDetail } = await import('./ui.js');
    flyToTree(state.map, feature);
    showTreeDetail(state, feature);
  } catch (err) {
    // ui.js will be created in a later task — fail silently for now
    console.warn('[handlePermalink] ui.js not yet available:', err.message);
  }
}

// ── Helpers ──────────────────────────────────────────────────
function showLoadingOverlay() {
  const el = document.getElementById('loading-overlay');
  if (el) {
    el.classList.remove('fade-out', 'hidden');
  }
}

function hideLoadingOverlay() {
  const el = document.getElementById('loading-overlay');
  if (!el) return;

  // Snap counter to final value
  const counterEl = document.getElementById('loading-counter');
  if (counterEl) counterEl.textContent = '32\u2019325';

  // Brief pause so user registers the final count, then fade
  setTimeout(() => {
    el.classList.add('fade-out');
    el.addEventListener('transitionend', () => el.classList.add('hidden'), { once: true });
    setTimeout(() => el.classList.add('hidden'), 1200);
  }, 600);
}

function showErrorOverlay() {
  const el = document.getElementById('error-overlay');
  if (el) el.classList.remove('hidden');
}

function hideErrorOverlay() {
  const el = document.getElementById('error-overlay');
  if (el) el.classList.add('hidden');
}

// ── Dynamic module imports (fail gracefully during scaffolding) ──
async function importModules() {
  const modules = [
    { path: './ui.js',      init: 'initUI' },
    { path: './stories.js', init: 'initStories' },
    { path: './stats.js',   init: 'initStats' },
    { path: './share.js',   init: 'initShare' },
    { path: './i18n.js',    init: 'initI18n' },
  ];

  for (const { path, init } of modules) {
    try {
      const mod = await import(path);
      if (typeof mod[init] === 'function') {
        await mod[init](state);
      }
    } catch (err) {
      // Expected during scaffolding — modules added in later tasks
      console.warn(`[init] ${path} not yet available:`, err.message);
    }
  }
}

// ── Main init ────────────────────────────────────────────────
/**
 * Bootstraps the application.
 * Loads map and data in parallel, then wires up all layers and modules.
 */
async function init() {
  showLoadingOverlay();

  try {
    // Load map and data in parallel for maximum speed
    const [map, treeData] = await Promise.all([
      initMap(),
      loadTreeData(),
    ]);

    state.map      = map;
    state.treeData = treeData;

    // Enrich each feature with computed properties (_color, _protected, _genus,
    // _plantingYear, _decade) and precompute aggregate story data.
    processTreeData(state.treeData);
    state.storyData = computeStoryData(state.treeData);

    addTreeLayer();

    hideLoadingOverlay();

    // Dynamically load optional UI modules
    await importModules();

    // Handle deep-link to a specific tree
    await handlePermalink();

    console.info(
      `[init] Loaded ${treeData.features.length.toLocaleString('de-CH')} trees.`,
    );
  } catch (err) {
    console.error('[init] Fatal error during startup:', err);
    hideLoadingOverlay();
    showErrorOverlay();
  }
}

// ── Loading animation: Basel map fills with tree dots ────────
function animateLoading() {
  const dotsContainer = document.getElementById('loading-dots');
  const counterEl = document.getElementById('loading-counter');
  if (!dotsContainer || !counterEl) return;

  const TARGET = 32325;
  const DOT_COUNT = 300;
  const INTERVAL = 16; // ~60fps, place dots every frame

  // Pre-generate random positions roughly inside Basel boundary
  // Basel shape is roughly centered in the container, ~80% of area
  const positions = [];
  for (let i = 0; i < DOT_COUNT; i++) {
    // Polar distribution from center for organic spread
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * 0.42; // sqrt for uniform area distribution
    const cx = 0.5 + Math.cos(angle) * radius;
    const cy = 0.5 + Math.sin(angle) * radius * 0.9; // slightly squashed vertically
    positions.push({ x: cx, y: cy });
  }

  let placed = 0;
  const greens = ['#81C784', '#66BB6A', '#4CAF50', '#43A047', '#388E3C', '#2E7D32'];

  const timer = setInterval(() => {
    // Place 2-4 dots per frame — accelerating
    const accel = 1 + Math.floor(placed / DOT_COUNT * 3);
    const batch = Math.min(accel + Math.floor(Math.random() * 2), DOT_COUNT - placed);
    for (let i = 0; i < batch && placed < DOT_COUNT; i++) {
      const pos = positions[placed];
      const dot = document.createElement('div');
      dot.className = 'tree-dot';
      dot.style.left = (pos.x * 100) + '%';
      dot.style.top = (pos.y * 100) + '%';
      dot.style.backgroundColor = greens[Math.floor(Math.random() * greens.length)];
      const size = 3 + Math.random() * 4;
      dot.style.width = size + 'px';
      dot.style.height = size + 'px';
      dotsContainer.appendChild(dot);
      placed++;
    }

    // Update counter proportionally
    const progress = placed / DOT_COUNT;
    const eased = 1 - Math.pow(1 - progress, 2);
    counterEl.textContent = Math.round(eased * TARGET).toLocaleString('de-CH');

    if (placed >= DOT_COUNT) {
      clearInterval(timer);
      counterEl.textContent = TARGET.toLocaleString('de-CH');
    }
  }, INTERVAL);
}

// ── Boot ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Start loading animation
  animateLoading();

  const retryBtn = document.getElementById('btn-retry');
  if (retryBtn) {
    retryBtn.addEventListener('click', () => {
      document.getElementById('error-overlay').classList.add('hidden');
      init();
    });
  }
  init();
});
