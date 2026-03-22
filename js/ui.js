// ============================================================
// ui.js — Detail card, Find My Tree, Tooltips, Filter Bar
// ============================================================

import { t } from './i18n.js';
import { findNearestTree, getSpeciesColor } from './trees.js';

// ── Internal references ──────────────────────────────────────
let _popup = null; // Mapbox Popup instance (tooltip)

// ── DOM helper: remove all children of an element ────────────
function clearChildren(el) {
  while (el.firstChild) el.removeChild(el.firstChild);
}

// ============================================================
// Tree Detail Card
// ============================================================

/**
 * Builds and shows the tree detail side panel.
 * Uses safe DOM construction — no innerHTML with data values.
 * @param {object} state  - shared app state
 * @param {GeoJSON.Feature} feature - tree feature to display
 */
export function showTreeDetail(state, feature) {
  const panel = document.getElementById('tree-detail');
  if (!panel) return;

  const props = feature.properties ?? {};
  const {
    ba_baumnr,
    baumart_deutsch,
    baumart_lateinisch,
    ba_baumalter,
    ba_strasse,
    ba_kreis,
    _color,
    _protected,
    _plantingYear,
  } = props;

  const color = _color || getSpeciesColor(baumart_lateinisch) || '#9E9E9E';

  // Clear previous content safely
  clearChildren(panel);

  // ── Close button ─────────────────────────────────────────
  const closeBtn = document.createElement('button');
  closeBtn.className = 'detail-close';
  closeBtn.setAttribute('aria-label', 'Schliessen');
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => hideTreeDetail());
  panel.appendChild(closeBtn);

  // ── Header: color dot + species names ────────────────────
  const header = document.createElement('div');
  header.className = 'detail-header';

  const dot = document.createElement('div');
  dot.className = 'detail-color-dot';
  dot.style.backgroundColor = color;
  header.appendChild(dot);

  const namesWrap = document.createElement('div');

  const speciesEl = document.createElement('div');
  speciesEl.className = 'detail-species';
  speciesEl.textContent = baumart_deutsch || '—';
  namesWrap.appendChild(speciesEl);

  if (baumart_lateinisch) {
    const latinEl = document.createElement('div');
    latinEl.className = 'detail-latin';
    latinEl.textContent = baumart_lateinisch;
    namesWrap.appendChild(latinEl);
  }

  header.appendChild(namesWrap);
  panel.appendChild(header);

  // ── Info rows ─────────────────────────────────────────────
  const infoWrap = document.createElement('div');
  infoWrap.className = 'detail-info';

  // Age row
  const ageRow = document.createElement('div');
  ageRow.className = 'detail-row';

  const ageLabel = document.createElement('div');
  ageLabel.className = 'detail-label';
  const ageValid = ba_baumalter != null && typeof ba_baumalter === 'number' && ba_baumalter < 500;
  ageLabel.textContent = ageValid
    ? t('detail.age', { age: ba_baumalter })
    : t('detail.age_unknown');
  ageRow.appendChild(ageLabel);

  const plantedSub = document.createElement('div');
  plantedSub.className = 'detail-sublabel';
  plantedSub.textContent = _plantingYear
    ? t('detail.planted', { year: _plantingYear })
    : t('detail.planted_unknown');
  ageRow.appendChild(plantedSub);
  infoWrap.appendChild(ageRow);

  // Protection badge row
  const protRow = document.createElement('div');
  protRow.className = 'detail-row';

  const badge = document.createElement('span');
  if (_protected) {
    badge.className = 'badge badge-protected';
    badge.textContent = t('detail.protected');
  } else {
    badge.className = 'badge badge-not-protected';
    badge.textContent = t('detail.not_protected');
  }
  protRow.appendChild(badge);
  infoWrap.appendChild(protRow);

  // Location row
  const locRow = document.createElement('div');
  locRow.className = 'detail-row';

  const locLabel = document.createElement('div');
  locLabel.className = 'detail-label';
  if (ba_strasse && ba_kreis) {
    locLabel.textContent = ba_strasse + ', ' + ba_kreis;
  } else if (ba_strasse) {
    locLabel.textContent = ba_strasse;
  } else if (ba_kreis) {
    locLabel.textContent = ba_kreis;
  } else {
    locLabel.textContent = t('detail.location_unknown');
  }
  locRow.appendChild(locLabel);
  infoWrap.appendChild(locRow);

  panel.appendChild(infoWrap);

  // ── Share button ──────────────────────────────────────────
  const shareBtn = document.createElement('button');
  shareBtn.id = 'btn-share-tree';
  shareBtn.className = 'btn-share';
  shareBtn.setAttribute('data-tree-id', String(ba_baumnr ?? ''));
  shareBtn.textContent = t('detail.share');
  panel.appendChild(shareBtn);

  // ── Show panel ────────────────────────────────────────────
  panel.classList.remove('hidden');
  panel.classList.add('visible');
  panel.setAttribute('aria-hidden', 'false');

  // Update state
  state.selectedTree = feature;

  // Update URL hash
  if (ba_baumnr != null) {
    window.location.hash = '#/tree/' + ba_baumnr;
  }
}

/**
 * Hides the tree detail panel and clears the URL hash if it was a tree link.
 */
export function hideTreeDetail() {
  const panel = document.getElementById('tree-detail');
  if (!panel) return;

  panel.classList.remove('visible');
  panel.classList.add('hidden');
  panel.setAttribute('aria-hidden', 'true');

  if (window.location.hash.startsWith('#/tree/')) {
    history.replaceState(null, '', window.location.pathname + window.location.search);
  }
}

/**
 * Flies the map to a tree feature.
 * @param {mapboxgl.Map} map
 * @param {GeoJSON.Feature} feature
 */
export function flyToTree(map, feature) {
  if (!map || !feature?.geometry?.coordinates) return;
  map.flyTo({
    center: feature.geometry.coordinates,
    zoom: 17,
    duration: 1500,
  });
}

// ============================================================
// Map Interactions
// ============================================================

/**
 * Wires up map hover, click, and cluster interactions.
 * @param {object} state - shared app state
 */
function setupMapInteractions(state) {
  const map = state.map;
  if (!map) return;

  _popup = new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 10,
  });

  // ── Hover: trees layer ───────────────────────────────────
  map.on('mouseenter', 'trees', (e) => {
    map.getCanvas().style.cursor = 'pointer';

    const feature = e.features?.[0];
    if (!feature) return;

    const name = feature.properties?.baumart_deutsch
      || feature.properties?.baumart_lateinisch
      || '—';

    _popup
      .setLngLat(e.lngLat)
      .setText(name) // Safe: uses setText, not setHTML
      .addTo(map);
  });

  map.on('mousemove', 'trees', (e) => {
    if (_popup.isOpen()) {
      _popup.setLngLat(e.lngLat);
    }
  });

  map.on('mouseleave', 'trees', () => {
    map.getCanvas().style.cursor = '';
    _popup.remove();
  });

  // ── Click: individual tree ───────────────────────────────
  map.on('click', 'trees', (e) => {
    const clickedFeature = e.features?.[0];
    if (!clickedFeature) return;

    // Find the original full feature in state.treeData by ba_baumnr
    const id = clickedFeature.properties?.ba_baumnr;
    const original = state.treeData?.features.find(
      (f) => String(f.properties?.ba_baumnr) === String(id),
    ) ?? clickedFeature;

    flyToTree(map, original);
    showTreeDetail(state, original);
  });

  // ── Click: cluster ───────────────────────────────────────
  map.on('click', 'clusters', (e) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
    if (!features.length) return;

    const clusterId = features[0].properties.cluster_id;
    const source = map.getSource('trees');

    source.getClusterExpansionZoom(clusterId, (err, zoom) => {
      if (err) return;
      map.flyTo({
        center: features[0].geometry.coordinates,
        zoom: zoom + 1,
      });
    });
  });

  // ── Cursor on cluster ────────────────────────────────────
  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer';
  });
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = '';
  });

  // ── Click: empty map space → hide detail ─────────────────
  map.on('click', (e) => {
    const treeFeaturesAtPoint = map.queryRenderedFeatures(e.point, {
      layers: ['trees', 'clusters'],
    });
    if (!treeFeaturesAtPoint.length) {
      hideTreeDetail();
    }
  });
}

// ============================================================
// Find My Tree
// ============================================================

/**
 * Animates a brief pulse ring around the selected tree on the map.
 * @param {mapboxgl.Map} map
 * @param {GeoJSON.Feature} feature
 */
function pulseTree(map, feature) {
  if (!map || !feature?.geometry?.coordinates) return;

  const SOURCE_ID = 'pulse-source';
  const LAYER_ID  = 'pulse-layer';

  // Clean up any previous pulse
  if (map.getLayer(LAYER_ID))  map.removeLayer(LAYER_ID);
  if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);

  map.addSource(SOURCE_ID, {
    type: 'geojson',
    data: feature,
  });

  map.addLayer({
    id:     LAYER_ID,
    type:   'circle',
    source: SOURCE_ID,
    paint: {
      'circle-radius':  20,
      'circle-color':   'transparent',
      'circle-stroke-width': 3,
      'circle-stroke-color': '#4CAF50',
      'circle-stroke-opacity': 0.4,
    },
  });

  let elapsed  = 0;
  const STEP_MS = 50;
  const TOTAL_MS = 3000;

  const interval = setInterval(() => {
    elapsed += STEP_MS;
    const progress = (elapsed % 1500) / 1500; // 0 → 1 within each 1.5 s cycle
    // Radius: 20 → 30 → 20
    const radius  = 20 + 10 * Math.sin(progress * Math.PI);
    // Opacity: 0.4 → 0 → 0.4
    const opacity = 0.4 * Math.abs(Math.cos(progress * Math.PI));

    try {
      map.setPaintProperty(LAYER_ID, 'circle-radius', radius);
      map.setPaintProperty(LAYER_ID, 'circle-stroke-opacity', opacity);
    } catch (_) {
      // Layer may already be removed
    }

    if (elapsed >= TOTAL_MS) {
      clearInterval(interval);
      try {
        if (map.getLayer(LAYER_ID))  map.removeLayer(LAYER_ID);
        if (map.getSource(SOURCE_ID)) map.removeSource(SOURCE_ID);
      } catch (_) {
        // Ignore
      }
    }
  }, STEP_MS);
}

/**
 * Replaces the find-my-tree card content with a street search input.
 * Collects unique streets from treeData, offers filtered results.
 * @param {object} state
 */
function showStreetSearch(state) {
  const card = document.getElementById('find-my-tree');
  if (!card) return;

  // Collect unique, sorted street names
  const streets = Array.from(
    new Set(
      (state.treeData?.features ?? [])
        .map((f) => f.properties?.ba_strasse)
        .filter(Boolean),
    ),
  ).sort((a, b) => a.localeCompare(b, 'de'));

  // Clear card and rebuild with safe DOM construction
  clearChildren(card);
  card.style.position = 'relative';

  const closeBtn = document.createElement('button');
  closeBtn.id = 'find-my-tree-close';
  closeBtn.className = 'detail-close';
  closeBtn.setAttribute('aria-label', 'Schliessen');
  closeBtn.textContent = '×';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '8px';
  closeBtn.style.right = '10px';
  card.appendChild(closeBtn);

  const wrap = document.createElement('div');
  wrap.style.padding = '14px 16px 12px';
  wrap.style.minWidth = '260px';

  const input = document.createElement('input');
  input.type = 'text';
  input.className = 'street-search-input';
  input.setAttribute('placeholder', t('find.search_placeholder'));
  input.setAttribute('autocomplete', 'off');
  wrap.appendChild(input);

  const results = document.createElement('div');
  results.className = 'street-results';
  wrap.appendChild(results);

  card.appendChild(wrap);
  input.focus();

  // ── Input handler ─────────────────────────────────────────
  input.addEventListener('input', () => {
    const query = input.value.trim();
    clearChildren(results);

    if (query.length < 2) return;

    const queryLower = query.toLowerCase();
    const matches = streets
      .filter((s) => s.toLowerCase().includes(queryLower))
      .slice(0, 8);

    for (const street of matches) {
      const item = document.createElement('div');
      item.className = 'street-result';
      item.textContent = street; // safe: textContent

      item.addEventListener('click', () => {
        const found = state.treeData?.features.find(
          (f) => f.properties?.ba_strasse === street,
        );
        if (found) {
          flyToTree(state.map, found);
          showTreeDetail(state, found);
        }
        card.classList.add('hidden');
        const fab = document.getElementById('find-my-tree-fab');
        if (fab) fab.classList.remove('hidden');
      });

      results.appendChild(item);
    }
  });

  // Close button handler
  closeBtn.addEventListener('click', () => {
    card.classList.add('hidden');
    const fab = document.getElementById('find-my-tree-fab');
    if (fab) fab.classList.remove('hidden');
  });
}

/**
 * Uses geolocation to find and highlight the nearest tree.
 * Falls back to street search if geolocation is unavailable or denied.
 * @param {object} state
 */
function handleFindMyTree(state) {
  if (!navigator.geolocation) {
    showStreetSearch(state);
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lngLat = { lng: pos.coords.longitude, lat: pos.coords.latitude };
      const nearest = findNearestTree(state.treeData, lngLat);

      if (nearest) {
        flyToTree(state.map, nearest);
        showTreeDetail(state, nearest);
        pulseTree(state.map, nearest);
      }

      const card = document.getElementById('find-my-tree');
      if (card) card.classList.add('hidden');
      const fab = document.getElementById('find-my-tree-fab');
      if (fab) fab.classList.remove('hidden');
    },
    (_err) => {
      showStreetSearch(state);
    },
    { enableHighAccuracy: true, timeout: 10000 },
  );
}

/**
 * Wires up the "Find My Tree" card and FAB interactions.
 * @param {object} state
 */
function setupFindMyTree(state) {
  const card = document.getElementById('find-my-tree');
  const fab  = document.getElementById('find-my-tree-fab');

  if (card) {
    card.addEventListener('click', (e) => {
      if (e.target.closest('#find-my-tree-close')) return;
      handleFindMyTree(state);
    });
  }

  if (fab) {
    fab.addEventListener('click', () => {
      handleFindMyTree(state);
    });
  }
}

// ============================================================
// Filter Bar
// ============================================================

/**
 * Applies the current activeFilters to the Mapbox 'trees' layer.
 * @param {object} state
 */
function applyFilters(state) {
  const map = state.map;
  if (!map) return;

  const filters = state.activeFilters ?? {};
  const conditions = [
    ['!', ['has', 'point_count']], // always exclude clusters from 'trees' layer
  ];

  // Species filter
  if (filters.species) {
    conditions.push(['==', ['get', 'baumart_deutsch'], filters.species]);
  }

  // Age range filter
  if (filters.ageMin != null) {
    conditions.push(['>=', ['coalesce', ['get', 'ba_baumalter'], 0], filters.ageMin]);
  }
  if (filters.ageMax != null) {
    conditions.push(['<=', ['coalesce', ['get', 'ba_baumalter'], 9999], filters.ageMax]);
  }

  // Protection filter (match start of status string)
  if (filters.protection) {
    if (filters.protection === 'Nicht geschützt') {
      conditions.push(['==', ['get', '_protected'], false]);
    } else {
      conditions.push([
        'all',
        ['==', ['get', '_protected'], true],
        ['in', filters.protection, ['coalesce', ['get', 'ba_schutzstatus'], '']],
      ]);
    }
  }

  // District filter (multi-select chips → array)
  if (filters.districts && filters.districts.length > 0) {
    conditions.push(['in', ['get', 'ba_kreis'], ['literal', filters.districts]]);
  }

  const expr = conditions.length === 1 ? conditions[0] : ['all', ...conditions];
  map.setFilter('trees', expr);

  window.dispatchEvent(new CustomEvent('filterschange', { detail: { filters } }));
}

/**
 * Builds the filter bar UI and wires up all filter interactions.
 * @param {object} state
 */
function setupFilterBar(state) {
  const bar = document.getElementById('filter-bar');
  if (!bar || !state.treeData) return;

  clearChildren(bar);

  // ── Collect data for filter options ──────────────────────
  const features = state.treeData.features;

  const speciesList = Array.from(
    new Set(features.map((f) => f.properties?.baumart_deutsch).filter(Boolean)),
  ).sort((a, b) => a.localeCompare(b, 'de'));

  const validAges = features
    .map((f) => f.properties?.ba_baumalter)
    .filter((a) => a != null && typeof a === 'number' && a < 500 && a >= 0);
  const maxAge = validAges.length > 0 ? Math.max(...validAges) : 200;

  // Initialise filter state defaults
  if (!state.activeFilters) state.activeFilters = {};
  if (state.activeFilters.ageMin == null) state.activeFilters.ageMin = 0;
  if (state.activeFilters.ageMax == null) state.activeFilters.ageMax = maxAge;
  if (!state.activeFilters.districts) state.activeFilters.districts = [];

  // ── Helper: create a labelled filter group ────────────────
  function makeGroup(labelKey) {
    const group = document.createElement('div');
    group.className = 'filter-group';

    const label = document.createElement('span');
    label.className = 'filter-label';
    label.textContent = t(labelKey);
    group.appendChild(label);

    return group;
  }

  // ── Species select ────────────────────────────────────────
  const speciesGroup = makeGroup('filter.species');

  const speciesSelect = document.createElement('select');
  speciesSelect.className = 'filter-select';

  const defaultOpt = document.createElement('option');
  defaultOpt.value = '';
  defaultOpt.textContent = '—';
  speciesSelect.appendChild(defaultOpt);

  for (const name of speciesList) {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name; // safe: textContent
    speciesSelect.appendChild(opt);
  }

  speciesSelect.addEventListener('change', () => {
    state.activeFilters.species = speciesSelect.value || null;
    applyFilters(state);
    updateResetBtn();
  });

  speciesGroup.appendChild(speciesSelect);
  bar.appendChild(speciesGroup);

  // ── Age range ─────────────────────────────────────────────
  const ageGroup = makeGroup('filter.age');

  const ageRangeWrap = document.createElement('div');
  ageRangeWrap.className = 'filter-age-range';

  const minSlider = document.createElement('input');
  minSlider.type = 'range';
  minSlider.className = 'filter-range';
  minSlider.min = '0';
  minSlider.max = String(maxAge);
  minSlider.value = '0';

  const maxSlider = document.createElement('input');
  maxSlider.type = 'range';
  maxSlider.className = 'filter-range';
  maxSlider.min = '0';
  maxSlider.max = String(maxAge);
  maxSlider.value = String(maxAge);

  const ageDisplay = document.createElement('span');
  ageDisplay.className = 'filter-range-display';

  function updateAgeDisplay() {
    ageDisplay.textContent = minSlider.value + ' \u2013 ' + maxSlider.value;
  }
  updateAgeDisplay();

  minSlider.addEventListener('input', () => {
    if (parseInt(minSlider.value, 10) > parseInt(maxSlider.value, 10)) {
      minSlider.value = maxSlider.value;
    }
    state.activeFilters.ageMin = parseInt(minSlider.value, 10);
    updateAgeDisplay();
    applyFilters(state);
    updateResetBtn();
  });

  maxSlider.addEventListener('input', () => {
    if (parseInt(maxSlider.value, 10) < parseInt(minSlider.value, 10)) {
      maxSlider.value = minSlider.value;
    }
    state.activeFilters.ageMax = parseInt(maxSlider.value, 10);
    updateAgeDisplay();
    applyFilters(state);
    updateResetBtn();
  });

  ageRangeWrap.appendChild(minSlider);
  ageRangeWrap.appendChild(ageDisplay);
  ageRangeWrap.appendChild(maxSlider);
  ageGroup.appendChild(ageRangeWrap);
  bar.appendChild(ageGroup);

  // ── Protection chips ──────────────────────────────────────
  const protGroup = makeGroup('filter.protection');
  const protChips = document.createElement('div');
  protChips.className = 'filter-chips';

  const PROTECTION_OPTIONS = [
    { label: 'Baumschutzgesetz', value: 'Baumschutzgesetz' },
    { label: 'Ersatzpflanzung',  value: 'Ersatzpflanzung'  },
    { label: 'Umfang',           value: 'Umfang'           },
    { label: 'Nicht geschützt',  value: 'Nicht geschützt'  },
  ];

  for (const opt of PROTECTION_OPTIONS) {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = opt.label;
    chip.setAttribute('data-value', opt.value);

    chip.addEventListener('click', () => {
      const current = state.activeFilters.protection;
      if (current === opt.value) {
        state.activeFilters.protection = null;
        chip.classList.remove('active');
      } else {
        protChips.querySelectorAll('.chip.active').forEach((c) => c.classList.remove('active'));
        state.activeFilters.protection = opt.value;
        chip.classList.add('active');
      }
      applyFilters(state);
      updateResetBtn();
    });

    protChips.appendChild(chip);
  }

  protGroup.appendChild(protChips);
  bar.appendChild(protGroup);

  // ── District chips ────────────────────────────────────────
  const distGroup = makeGroup('filter.district');
  const distChips = document.createElement('div');
  distChips.className = 'filter-chips';

  const DISTRICTS = [
    'Ost', 'West', 'Kleinbasel', 'Nord', 'Süd',
    'Hörnli', 'Bettingen', 'Gottesacker', 'Rebberg',
  ];

  for (const district of DISTRICTS) {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = district;
    chip.setAttribute('data-value', district);

    chip.addEventListener('click', () => {
      const idx = state.activeFilters.districts.indexOf(district);
      if (idx > -1) {
        state.activeFilters.districts.splice(idx, 1);
        chip.classList.remove('active');
      } else {
        state.activeFilters.districts.push(district);
        chip.classList.add('active');
      }
      applyFilters(state);
      updateResetBtn();
    });

    distChips.appendChild(chip);
  }

  distGroup.appendChild(distChips);
  bar.appendChild(distGroup);

  // ── Reset button ──────────────────────────────────────────
  const resetBtn = document.createElement('button');
  resetBtn.className = 'btn-reset hidden';
  resetBtn.textContent = t('filter.reset');

  resetBtn.addEventListener('click', () => {
    state.activeFilters.species    = null;
    state.activeFilters.protection = null;
    state.activeFilters.ageMin     = 0;
    state.activeFilters.ageMax     = maxAge;
    state.activeFilters.districts  = [];

    speciesSelect.value  = '';
    minSlider.value      = '0';
    maxSlider.value      = String(maxAge);
    updateAgeDisplay();

    protChips.querySelectorAll('.chip.active').forEach((c) => c.classList.remove('active'));
    distChips.querySelectorAll('.chip.active').forEach((c) => c.classList.remove('active'));

    applyFilters(state);
    resetBtn.classList.add('hidden');
  });

  bar.appendChild(resetBtn);

  function updateResetBtn() {
    const hasFilters =
      !!state.activeFilters.species ||
      !!state.activeFilters.protection ||
      state.activeFilters.ageMin > 0 ||
      state.activeFilters.ageMax < maxAge ||
      (state.activeFilters.districts && state.activeFilters.districts.length > 0);

    resetBtn.classList.toggle('hidden', !hasFilters);
  }

  // ── Mobile filter toggle ──────────────────────────────────
  // Support both IDs used in HTML (#btn-filter-toggle) and task spec (#btn-filter-mobile)
  const mobileToggle =
    document.getElementById('btn-filter-mobile') ||
    document.getElementById('btn-filter-toggle');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      bar.classList.toggle('visible-mobile');
      bar.classList.toggle('hidden-mobile');
    });
  }
}

// ============================================================
// Public init
// ============================================================

/**
 * Initialises all UI modules.
 * Called by app.js after map and data are ready.
 * @param {object} state - shared app state
 */
export function initUI(state) {
  setupMapInteractions(state);
  setupFindMyTree(state);
  setupFilterBar(state);
}
