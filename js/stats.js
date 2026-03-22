// ============================================================
// stats.js — Stats Overlay
// ES module — export initStats()
// ============================================================

import { t } from './i18n.js';

// ── Guard: only bind the toggle button once ───────────────────
let _toggleBound = false;

// ── Public API ────────────────────────────────────────────────

/**
 * Initialises the stats overlay.
 *
 * - Binds #btn-stats click to toggle #stats-overlay visibility.
 * - When opening, closes the stories panel.
 * - When visible, immediately calls renderStats.
 * - Listens for 'filterschange' and 'langchange' to re-render
 *   whenever the overlay is open.
 *
 * @param {{ treeData: GeoJSON.FeatureCollection }} state
 */
export function initStats(state) {
  if (_toggleBound) return;
  _toggleBound = true;

  const btnStats = document.getElementById('btn-stats');
  if (!btnStats) return;

  btnStats.addEventListener('click', () => {
    const overlay = document.getElementById('stats-overlay');
    if (!overlay) return;

    // The overlay is "visible" when it does NOT have the .hidden class.
    // CSS: .stats-overlay:not(.hidden) { opacity: 1; pointer-events: auto; }
    const isVisible = !overlay.classList.contains('hidden');

    if (isVisible) {
      // Close overlay
      overlay.classList.add('hidden');
      overlay.setAttribute('aria-hidden', 'true');
      btnStats.classList.remove('active');
    } else {
      // Close stories panel first
      const storiesPanel = document.getElementById('stories-panel');
      const btnStories   = document.getElementById('btn-stories');
      if (storiesPanel) {
        storiesPanel.classList.add('hidden');
        storiesPanel.setAttribute('aria-hidden', 'true');
      }
      if (btnStories) btnStories.classList.remove('active');

      // Open stats overlay — remove .hidden so :not(.hidden) selector fires
      overlay.classList.remove('hidden');
      overlay.setAttribute('aria-hidden', 'false');
      btnStats.classList.add('active');

      renderStats(state);
    }
  });

  // Re-render on filter or language changes when overlay is open
  window.addEventListener('filterschange', () => {
    const overlay = document.getElementById('stats-overlay');
    if (overlay && !overlay.classList.contains('hidden')) {
      renderStats(state);
    }
  });

  window.addEventListener('langchange', () => {
    const overlay = document.getElementById('stats-overlay');
    if (overlay && !overlay.classList.contains('hidden')) {
      renderStats(state);
    }
  });
}

// ── Render ────────────────────────────────────────────────────

/**
 * Builds (or re-builds) the stats overlay content.
 * Uses safe DOM construction — no innerHTML with data.
 *
 * @param {{ treeData: GeoJSON.FeatureCollection }} state
 */
function renderStats(state) {
  const overlay = document.getElementById('stats-overlay');
  if (!overlay) return;

  // Clear existing content
  while (overlay.firstChild) overlay.removeChild(overlay.firstChild);

  const features = (state.treeData && state.treeData.features) || [];

  // ── Close button ─────────────────────────────────────────
  const closeBtn = document.createElement('button');
  closeBtn.className = 'stats-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '\u00d7'; // ×
  closeBtn.addEventListener('click', () => {
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    const btnStats = document.getElementById('btn-stats');
    if (btnStats) btnStats.classList.remove('active');
  });
  overlay.appendChild(closeBtn);

  // ── Grid wrapper ─────────────────────────────────────────
  const grid = document.createElement('div');
  grid.className = 'stats-grid';
  overlay.appendChild(grid);

  // ── Header ───────────────────────────────────────────────
  const totalTrees   = features.length;
  const speciesSet   = new Set();
  for (const f of features) {
    const sp = f.properties && f.properties.baumart_deutsch;
    if (sp) speciesSet.add(sp);
  }
  const totalSpecies = speciesSet.size;

  const header = document.createElement('div');
  header.className = 'stats-header';

  const h2 = document.createElement('h2');
  h2.textContent = t('stats.title');
  header.appendChild(h2);

  const summary = document.createElement('div');
  summary.className = 'stats-summary';

  const treesNum = document.createElement('span');
  treesNum.className = 'stats-big-number';
  treesNum.textContent = totalTrees.toLocaleString('de-CH');

  const treesLabel = document.createElement('span');
  treesLabel.className = 'stats-big-label';
  treesLabel.textContent = t('stats.trees');

  const separator = document.createElement('span');
  separator.className = 'stats-big-label';
  separator.textContent = '\u00b7'; // ·

  const speciesNum = document.createElement('span');
  speciesNum.className = 'stats-big-number';
  speciesNum.textContent = totalSpecies.toLocaleString('de-CH');

  const speciesLabel = document.createElement('span');
  speciesLabel.className = 'stats-big-label';
  speciesLabel.textContent = t('stats.species');

  summary.appendChild(treesNum);
  summary.appendChild(treesLabel);
  summary.appendChild(separator);
  summary.appendChild(speciesNum);
  summary.appendChild(speciesLabel);
  header.appendChild(summary);
  grid.appendChild(header);

  // ── Species distribution (top 10) ────────────────────────
  grid.appendChild(buildSpeciesSection(features));

  // ── Age histogram ─────────────────────────────────────────
  grid.appendChild(buildAgeSection(features));

  // ── Trees per district ────────────────────────────────────
  grid.appendChild(buildDistrictSection(features));

  // ── Attribution ───────────────────────────────────────────
  const attr = document.createElement('p');
  attr.className = 'stats-attribution';
  attr.textContent = t('attribution');
  grid.appendChild(attr);
}

// ── Section builders ──────────────────────────────────────────

/**
 * Builds the "Häufigste Baumarten" horizontal bar-chart section.
 * @param {Array} features
 * @returns {HTMLElement}
 */
function buildSpeciesSection(features) {
  // Count by baumart_deutsch
  const counts = {};
  for (const f of features) {
    const sp = f.properties && f.properties.baumart_deutsch;
    if (!sp) continue;
    counts[sp] = (counts[sp] || 0) + 1;
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const top10  = sorted.slice(0, 10);
  const others = sorted.slice(10).reduce((sum, [, n]) => sum + n, 0);

  const maxVal = top10.length > 0 ? top10[0][1] : 1;

  const section = document.createElement('div');
  section.className = 'stats-section';

  const h3 = document.createElement('h3');
  h3.textContent = t('stats.species_title');
  section.appendChild(h3);

  const chart = document.createElement('div');
  chart.className = 'bar-chart';

  for (const [name, count] of top10) {
    chart.appendChild(makeBarRow(name, count, maxVal, false));
  }

  if (others > 0) {
    const andereName = window.__meinBaumLang === 'en' ? 'Other' : 'Andere';
    chart.appendChild(makeBarRow(andereName, others, maxVal, true));
  }

  section.appendChild(chart);
  return section;
}

/**
 * Builds the "Altersverteilung" vertical histogram section.
 * @param {Array} features
 * @returns {HTMLElement}
 */
function buildAgeSection(features) {
  // Bin by decade, exclude null ages and age >= 500
  const bins = {};
  for (const f of features) {
    const age = f.properties && f.properties.ba_baumalter;
    if (age == null || age >= 500) continue;
    const decade = Math.floor(age / 10) * 10;
    bins[decade] = (bins[decade] || 0) + 1;
  }

  const sortedDecades = Object.keys(bins)
    .map(Number)
    .sort((a, b) => a - b);

  const maxBin = sortedDecades.length > 0
    ? Math.max(...sortedDecades.map((d) => bins[d]))
    : 1;

  const section = document.createElement('div');
  section.className = 'stats-section';

  const h3 = document.createElement('h3');
  h3.textContent = t('stats.age_title');
  section.appendChild(h3);

  const histogram = document.createElement('div');
  histogram.className = 'histogram';

  for (const decade of sortedDecades) {
    const count  = bins[decade];
    const pct    = maxBin > 0 ? Math.round((count / maxBin) * 100) : 0;

    const wrapper = document.createElement('div');
    wrapper.className = 'hist-bar-wrapper';
    wrapper.title = decade + (window.__meinBaumLang === 'en' ? 's: ' : 'er: ') + count.toLocaleString('de-CH');

    const bar = document.createElement('div');
    bar.className = 'hist-bar';
    bar.style.height = pct + '%';

    const label = document.createElement('div');
    label.className = 'hist-label';
    label.textContent = String(decade);

    wrapper.appendChild(bar);
    wrapper.appendChild(label);
    histogram.appendChild(wrapper);
  }

  section.appendChild(histogram);
  return section;
}

/**
 * Builds the "Bäume pro Quartier" horizontal bar-chart section.
 * @param {Array} features
 * @returns {HTMLElement}
 */
function buildDistrictSection(features) {
  // Count by ba_kreis, exclude nulls
  const counts = {};
  for (const f of features) {
    const district = f.properties && f.properties.ba_kreis;
    if (!district) continue;
    counts[district] = (counts[district] || 0) + 1;
  }

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  const maxVal = sorted.length > 0 ? sorted[0][1] : 1;

  const section = document.createElement('div');
  section.className = 'stats-section';

  const h3 = document.createElement('h3');
  h3.textContent = t('stats.district_title');
  section.appendChild(h3);

  const chart = document.createElement('div');
  chart.className = 'bar-chart';

  for (const [name, count] of sorted) {
    chart.appendChild(makeBarRow(name, count, maxVal, false));
  }

  section.appendChild(chart);
  return section;
}

// ── Shared helpers ────────────────────────────────────────────

/**
 * Creates a single horizontal bar row.
 * @param {string}  label   — display label (species name, district, etc.)
 * @param {number}  value   — raw count
 * @param {number}  maxVal  — maximum value for percentage calculation
 * @param {boolean} gray    — use muted fill (for "Andere" row)
 * @returns {HTMLElement}
 */
function makeBarRow(label, value, maxVal, gray) {
  const pct = maxVal > 0 ? Math.round((value / maxVal) * 100) : 0;

  const row = document.createElement('div');
  row.className = 'bar-row';

  const labelEl = document.createElement('div');
  labelEl.className = 'bar-label';
  labelEl.textContent = label;

  const track = document.createElement('div');
  track.className = 'bar-track';

  const fill = document.createElement('div');
  fill.className = gray ? 'bar-fill bar-fill-gray' : 'bar-fill';
  fill.style.width = pct + '%';

  track.appendChild(fill);

  const valueEl = document.createElement('div');
  valueEl.className = 'bar-value';
  valueEl.textContent = value.toLocaleString('de-CH');

  row.appendChild(labelEl);
  row.appendChild(track);
  row.appendChild(valueEl);

  return row;
}
