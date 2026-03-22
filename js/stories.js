// ============================================================
// stories.js — Stories Panel
// ES module — export initStories()
// ============================================================

import { t } from './i18n.js';

// ── Helpers ───────────────────────────────────────────────────

/**
 * Computes the bounding box [[minLng, minLat], [maxLng, maxLat]] for an
 * array of GeoJSON Point features.  Returns null if no valid coordinates.
 * @param {Array} features
 * @returns {[[number,number],[number,number]]|null}
 */
function featuresExtent(features) {
  if (!features || features.length === 0) return null;
  let minLng = Infinity, minLat = Infinity;
  let maxLng = -Infinity, maxLat = -Infinity;

  for (const f of features) {
    const coords = f.geometry && f.geometry.coordinates;
    if (!coords) continue;
    const lng = coords[0];
    const lat = coords[1];
    if (lng < minLng) minLng = lng;
    if (lat < minLat) minLat = lat;
    if (lng > maxLng) maxLng = lng;
    if (lat > maxLat) maxLat = lat;
  }

  return isFinite(minLng) ? [[minLng, minLat], [maxLng, maxLat]] : null;
}

/** Creates a story-card <div>. */
function createCard() {
  const card = document.createElement('div');
  card.className = 'story-card';
  return card;
}

// ── Default map filter ────────────────────────────────────────
const DEFAULT_FILTER = ['!', ['has', 'point_count']];

// ── Public API ────────────────────────────────────────────────

/**
 * Resets the 'trees' layer filter to show all unclustered trees and removes
 * any decade-active highlight classes from the panel.
 * @param {mapboxgl.Map} map
 */
export function resetStoryFilters(map) {
  if (!map) return;
  try {
    map.setFilter('trees', DEFAULT_FILTER);
  } catch (_) { /* layer may not be ready */ }
  document.querySelectorAll('.decade-active').forEach((el) => {
    el.classList.remove('decade-active');
  });
}

/**
 * Builds (or re-builds) the stories panel content inside #stories-panel.
 * Also wires up the #btn-stories toggle on first call.
 * @param {{ map: mapboxgl.Map, storyData: object, lang: string }} state
 */
export function initStories(state) {
  const panel = document.getElementById('stories-panel');
  if (!panel) return;

  // Clear existing content (needed on lang-change re-render)
  while (panel.firstChild) panel.removeChild(panel.firstChild);

  const map = state.map;

  // ── Header ────────────────────────────────────────────────
  const header = document.createElement('div');
  header.className = 'stories-header';

  const titleEl = document.createElement('span');
  titleEl.className = 'stories-title';
  titleEl.textContent = t('nav.stories');

  const closeBtn = document.createElement('button');
  closeBtn.className = 'stories-close';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '\u00d7'; // ×
  closeBtn.addEventListener('click', () => closeStoriesPanel(state));

  header.appendChild(titleEl);
  header.appendChild(closeBtn);
  panel.appendChild(header);

  // ── Scrollable container ──────────────────────────────────
  const container = document.createElement('div');
  container.className = 'stories-container';
  panel.appendChild(container);

  // Build story cards if data is available
  if (state.storyData) {
    buildCards(container, panel, map, state.storyData);
  }

  // ── Toggle button (attach once) ───────────────────────────
  setupToggle(state);

  // ── Language change re-render ─────────────────────────────
  setupLangChange(state);
}

// ── Panel open / close ────────────────────────────────────────

function openStoriesPanel(state) {
  const panel        = document.getElementById('stories-panel');
  const btnStories   = document.getElementById('btn-stories');
  const statsOverlay = document.getElementById('stats-overlay');
  const btnStats     = document.getElementById('btn-stats');

  if (panel)      { panel.classList.remove('hidden'); panel.setAttribute('aria-hidden', 'false'); }
  if (btnStories) btnStories.classList.add('active');

  // Close stats overlay if open
  if (statsOverlay) { statsOverlay.classList.add('hidden'); statsOverlay.classList.remove('visible'); }
  if (btnStats)     btnStats.classList.remove('active');
}

function closeStoriesPanel(state) {
  const panel      = document.getElementById('stories-panel');
  const btnStories = document.getElementById('btn-stories');

  if (panel)      { panel.classList.add('hidden'); panel.setAttribute('aria-hidden', 'true'); }
  if (btnStories) btnStories.classList.remove('active');

  resetStoryFilters(state.map);
}

// ── One-time listener setup ───────────────────────────────────

let _toggleBound   = false;
let _langChangeBound = false;

function setupToggle(state) {
  if (_toggleBound) return;
  _toggleBound = true;

  const btnStories = document.getElementById('btn-stories');
  if (!btnStories) return;

  btnStories.addEventListener('click', () => {
    const panel  = document.getElementById('stories-panel');
    const isOpen = panel && !panel.classList.contains('hidden');
    if (isOpen) {
      closeStoriesPanel(state);
    } else {
      openStoriesPanel(state);
    }
  });
}

function setupLangChange(state) {
  if (_langChangeBound) return;
  _langChangeBound = true;

  window.addEventListener('langchange', () => {
    // Re-render the full panel content
    initStories(state);
  });
}

// ── Story card builder ────────────────────────────────────────

/**
 * Creates all 6 story cards and appends them to container.
 * @param {HTMLElement} container  — .stories-container div
 * @param {HTMLElement} panel      — #stories-panel (used as IntersectionObserver root)
 * @param {mapboxgl.Map} map
 * @param {object} sd              — state.storyData
 */
function buildCards(container, panel, map, sd) {

  // ── Story 1 — Der älteste Baum ─────────────────────────
  {
    const oldest = sd.oldest;
    const card   = createCard();

    const titleNode = document.createElement('div');
    titleNode.className = 'story-title';
    titleNode.textContent = t('story.oldest.title');

    const bodyNode = document.createElement('div');
    bodyNode.className = 'story-body';
    bodyNode.textContent = t('story.oldest.body', {
      age:     oldest ? oldest.properties.ba_baumalter    : '?',
      species: oldest ? oldest.properties.baumart_deutsch : '?',
      street:  oldest ? oldest.properties.ba_strasse      : '?',
    });

    card.appendChild(titleNode);
    card.appendChild(bodyNode);

    card.addEventListener('click', () => {
      if (!map || !oldest) return;
      resetStoryFilters(map);
      map.flyTo({ center: oldest.geometry.coordinates, zoom: 17, duration: 2000 });
    });

    container.appendChild(card);
  }

  // ── Story 2 — Die seltensten Arten ─────────────────────
  {
    const rareSpecies = sd.rareSpecies || {};
    const card        = createCard();

    const titleNode = document.createElement('div');
    titleNode.className = 'story-title';
    titleNode.textContent = t('story.rare.title');

    const bodyNode = document.createElement('div');
    bodyNode.className = 'story-body';
    bodyNode.textContent = t('story.rare.body', {
      totalSpecies: sd.totalSpecies || 0,
      rareCount:    rareSpecies.count || 0,
    });

    card.appendChild(titleNode);
    card.appendChild(bodyNode);

    card.addEventListener('click', () => {
      if (!map) return;
      resetStoryFilters(map);
      const names    = rareSpecies.names    || [];
      const features = rareSpecies.features || [];
      if (names.length > 0) {
        map.setFilter('trees', ['in', ['get', 'baumart_deutsch'], ['literal', names]]);
      }
      const extent = featuresExtent(features);
      if (extent) map.fitBounds(extent, { padding: 80, duration: 2000 });
    });

    container.appendChild(card);
  }

  // ── Story 3 — Die grünste Strasse ──────────────────────
  {
    const gs   = sd.greenestStreet || {};
    const card = createCard();

    const titleNode = document.createElement('div');
    titleNode.className = 'story-title';
    titleNode.textContent = t('story.greenest.title');

    const bodyNode = document.createElement('div');
    bodyNode.className = 'story-body';
    bodyNode.textContent = t('story.greenest.body', {
      street: gs.name  || '?',
      count:  gs.count || 0,
    });

    card.appendChild(titleNode);
    card.appendChild(bodyNode);

    card.addEventListener('click', () => {
      if (!map) return;
      resetStoryFilters(map);
      if (gs.name) {
        map.setFilter('trees', ['==', ['get', 'ba_strasse'], gs.name]);
      }
      const extent = featuresExtent(gs.features || []);
      if (extent) map.fitBounds(extent, { padding: 80, duration: 2000 });
    });

    container.appendChild(card);
  }

  // ── Story 4 — Wie Basel grüner wurde ───────────────────
  {
    const decadeData = sd.decades || {};
    const sorted     = decadeData.sorted  || [];
    const byDecade   = decadeData.byDecade || {};
    const card       = createCard();

    const titleNode = document.createElement('div');
    titleNode.className = 'story-title';
    titleNode.textContent = t('story.growth.title');

    const bodyNode = document.createElement('div');
    bodyNode.className = 'story-body';
    bodyNode.textContent = t('story.growth.body', {
      total: (sd.totalTrees || 0).toLocaleString('de-CH'),
    });

    card.appendChild(titleNode);
    card.appendChild(bodyNode);

    // Decade timeline rows
    const timeline   = document.createElement('div');
    timeline.className = 'growth-timeline';

    const decadeSteps = [];

    for (const decade of sorted) {
      const count = (byDecade[decade] || []).length;

      const step = document.createElement('div');
      step.className      = 'decade-step';
      step.dataset.decade = String(decade);

      const labelEl = document.createElement('span');
      labelEl.className   = 'decade-label';
      labelEl.textContent = decade + 'er';

      const countEl = document.createElement('span');
      countEl.className   = 'decade-count';
      countEl.textContent = count.toLocaleString('de-CH');

      step.appendChild(labelEl);
      step.appendChild(countEl);
      timeline.appendChild(step);
      decadeSteps.push({ step, decade });
    }

    card.appendChild(timeline);

    // Click on card: reset + show earliest decade
    card.addEventListener('click', () => {
      if (!map) return;
      resetStoryFilters(map);
      if (sorted.length > 0) {
        const earliest = sorted[0];
        map.setFilter('trees', [
          'all',
          DEFAULT_FILTER,
          ['has', '_decade'],
          ['<=', ['get', '_decade'], earliest + 9],
        ]);
      }
      map.flyTo({ center: [7.5886, 47.5596], zoom: 12 });
    });

    // IntersectionObserver: progressively reveal decades as they scroll into view
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const currentDecade = Number(entry.target.dataset.decade);
        if (!isNaN(currentDecade) && map) {
          try {
            map.setFilter('trees', [
              'all',
              DEFAULT_FILTER,
              ['has', '_decade'],
              ['<=', ['get', '_decade'], currentDecade + 9],
            ]);
          } catch (_) { /* layer not yet ready */ }
        }
        // Update active state
        decadeSteps.forEach(({ step }) => step.classList.remove('decade-active'));
        entry.target.classList.add('decade-active');
      }
    }, { root: panel, threshold: 0.5 });

    for (const { step } of decadeSteps) {
      observer.observe(step);
    }

    container.appendChild(card);
  }

  // ── Story 5 — Unter Schutz ─────────────────────────────
  {
    const protData = sd.protected || {};
    const card     = createCard();

    const titleNode = document.createElement('div');
    titleNode.className = 'story-title';
    titleNode.textContent = t('story.protected.title');

    const bodyNode = document.createElement('div');
    bodyNode.className = 'story-body';
    bodyNode.textContent = t('story.protected.body', {
      count: (protData.count || 0).toLocaleString('de-CH'),
    });

    card.appendChild(titleNode);
    card.appendChild(bodyNode);

    card.addEventListener('click', () => {
      if (!map) return;
      resetStoryFilters(map);
      map.setFilter('trees', ['==', ['get', '_protected'], true]);
      map.flyTo({ center: [7.5886, 47.5596], zoom: 13 });
    });

    container.appendChild(card);
  }

  // ── Story 6 — Kleinbasel vs. Grossbasel ────────────────
  {
    const comp = sd.comparison || {};
    const kb   = comp.kleinbasel || {};
    const gb   = comp.grossbasel || {};
    const card = createCard();

    const titleNode = document.createElement('div');
    titleNode.className = 'story-title';
    titleNode.textContent = t('story.comparison.title');

    const bodyNode = document.createElement('div');
    bodyNode.className = 'story-body';
    bodyNode.textContent = t('story.comparison.body');

    card.appendChild(titleNode);
    card.appendChild(bodyNode);

    // Comparison grid
    const grid = document.createElement('div');
    grid.className = 'comparison-grid';

    // Left side: Kleinbasel
    const leftSide = document.createElement('div');
    leftSide.className = 'comparison-side';

    const leftH4 = document.createElement('h4');
    leftH4.textContent = 'Kleinbasel';

    const leftCount = document.createElement('p');
    leftCount.className   = 'comp-stat';
    leftCount.textContent = (kb.count || 0).toLocaleString('de-CH');

    const leftSpecies = document.createElement('p');
    leftSpecies.className   = 'comp-stat';
    leftSpecies.textContent = (kb.species || 0).toLocaleString('de-CH');

    const leftAge = document.createElement('p');
    leftAge.className   = 'comp-stat';
    leftAge.textContent = (kb.avgAge || 0).toLocaleString('de-CH');

    leftSide.appendChild(leftH4);
    leftSide.appendChild(leftCount);
    leftSide.appendChild(leftSpecies);
    leftSide.appendChild(leftAge);

    // Divider
    const divider = document.createElement('div');
    divider.className   = 'comparison-divider';
    divider.textContent = 'vs.';

    // Right side: Grossbasel
    const rightSide = document.createElement('div');
    rightSide.className = 'comparison-side';

    const rightH4 = document.createElement('h4');
    rightH4.textContent = 'Grossbasel';

    const rightCount = document.createElement('p');
    rightCount.className   = 'comp-stat';
    rightCount.textContent = (gb.count || 0).toLocaleString('de-CH');

    const rightSpecies = document.createElement('p');
    rightSpecies.className   = 'comp-stat';
    rightSpecies.textContent = (gb.species || 0).toLocaleString('de-CH');

    const rightAge = document.createElement('p');
    rightAge.className   = 'comp-stat';
    rightAge.textContent = (gb.avgAge || 0).toLocaleString('de-CH');

    rightSide.appendChild(rightH4);
    rightSide.appendChild(rightCount);
    rightSide.appendChild(rightSpecies);
    rightSide.appendChild(rightAge);

    grid.appendChild(leftSide);
    grid.appendChild(divider);
    grid.appendChild(rightSide);
    card.appendChild(grid);

    card.addEventListener('click', () => {
      if (!map) return;
      resetStoryFilters(map);
      map.flyTo({ center: [7.59, 47.56], zoom: 13 });
    });

    container.appendChild(card);
  }
}
