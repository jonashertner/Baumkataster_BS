// ============================================================
// i18n.js — Internationalization (DE / EN)
// ES module — export t() and initI18n()
// ============================================================

// ── String catalogue ─────────────────────────────────────────
const strings = {
  de: {
    // ── Navigation ────────────────────────────────────────
    'nav.title':        'Mein Baum Basel',
    'nav.stories':      'Geschichten',
    'nav.lang':         'EN',

    // ── Loading / errors ──────────────────────────────────
    'loading.trees':    'Bäume werden geladen...',
    'loading.text':     'Bäume werden geladen…',
    'error.load':       'Die Baumdaten konnten nicht geladen werden.',
    'error.message':    'Die Baumdaten konnten nicht geladen werden.',
    'error.retry':      'Erneut versuchen',

    // ── "Find my tree" card ───────────────────────────────
    'find.title':       'Finde deinen Baum',
    'find.subtitle':    'Entdecke den Baum in deiner Nähe',
    'findTree.title':   'Finde deinen Baum',
    'findTree.sub':     'Entdecke den Baum in deiner Nähe',
    'find.nearest':     'Nächster Baum',
    'find.nearest_desc':'Der nächste Baum zu deinem Standort',
    'find.nearest_no_age': 'Alter unbekannt',
    'find.search_placeholder': 'Strasse oder Quartier suchen…',

    // ── Tree detail panel ─────────────────────────────────
    'detail.age':           '{age} Jahre alt',
    'detail.age_unknown':   'Alter unbekannt',
    'detail.planted':       'Gepflanzt ca. {year}',
    'detail.planted_unknown': 'Pflanzjahr unbekannt',
    'detail.protected':     'Geschützter Baum',
    'detail.not_protected': 'Nicht geschützt',
    'detail.share':         'Teilen',
    'detail.location_unknown': 'Standort unbekannt',

    // ── Filter bar ────────────────────────────────────────
    'filter.species':    'Art',
    'filter.age':        'Alter',
    'filter.protection': 'Schutz',
    'filter.district':   'Quartier',
    'filter.reset':      'Filter zurücksetzen',

    // ── Statistics overlay ────────────────────────────────
    'stats.title':         'Baumstatistiken Basel',
    'stats.species_title': 'Häufigste Baumarten',
    'stats.age_title':     'Altersverteilung',
    'stats.district_title':'Bäume pro Quartier',
    'stats.trees':         'Bäume',
    'stats.species':       'Arten',

    // ── Stories ───────────────────────────────────────────
    'story.oldest.title':     'Der älteste Baum',
    'story.oldest.body':      'Eine {age}-jährige {species} an der {street}. Dieser Baum stand hier schon, als Basel ganz anders aussah.',
    'story.rare.title':       'Seltene Arten',
    'story.rare.body':        'Basel hat {totalSpecies} Baumarten — {rareCount} davon gibt es nur ein- bis dreimal in der ganzen Stadt.',
    'story.greenest.title':   'Die baumreichste Strasse',
    'story.greenest.body':    '{street} — mit {count} Bäumen die baumreichste Strasse Basels.',
    'story.growth.title':     'Basels Baumbestand',
    'story.growth.body':      '{total} Bäume stehen heute in Basel. Scrolle, um zu sehen, wie der Baumbestand über die Jahrzehnte gewachsen ist.',
    'story.protected.title':  'Schutzwürdige Riesen',
    'story.protected.body':   '{count} Bäume in Basel stehen unter Schutz.',
    'story.comparison.title': 'Bäume am Rhein',
    'story.comparison.body':  'Wie verteilen sich die Bäume über den Rhein?',

    // ── Share ─────────────────────────────────────────────
    'share.copied':     'Link kopiert!',
    'share.card_title': 'Diesen Baum teilen',

    // ── Attribution ───────────────────────────────────────
    'attribution': 'Daten: Geodaten Kanton Basel-Stadt (CC BY 4.0)',
  },

  en: {
    // ── Navigation ────────────────────────────────────────
    'nav.title':        'My Tree Basel',
    'nav.stories':      'Stories',
    'nav.lang':         'DE',

    // ── Loading / errors ──────────────────────────────────
    'loading.trees':    'Loading trees...',
    'loading.text':     'Loading trees…',
    'error.load':       'The tree data could not be loaded.',
    'error.message':    'The tree data could not be loaded.',
    'error.retry':      'Try again',

    // ── "Find my tree" card ───────────────────────────────
    'find.title':       'Find Your Tree',
    'find.subtitle':    'Discover the tree nearest to you',
    'findTree.title':   'Find Your Tree',
    'findTree.sub':     'Discover the tree nearest to you',
    'find.nearest':     'Nearest tree',
    'find.nearest_desc':'The nearest tree to your location',
    'find.nearest_no_age': 'Age unknown',
    'find.search_placeholder': 'Search street or district…',

    // ── Tree detail panel ─────────────────────────────────
    'detail.age':           '{age} years old',
    'detail.age_unknown':   'Age unknown',
    'detail.planted':       'Planted approx. {year}',
    'detail.planted_unknown': 'Planting year unknown',
    'detail.protected':     'Protected tree',
    'detail.not_protected': 'Not protected',
    'detail.share':         'Share',
    'detail.location_unknown': 'Location unknown',

    // ── Filter bar ────────────────────────────────────────
    'filter.species':    'Species',
    'filter.age':        'Age',
    'filter.protection': 'Protection',
    'filter.district':   'District',
    'filter.reset':      'Reset filters',

    // ── Statistics overlay ────────────────────────────────
    'stats.title':         'Basel Tree Statistics',
    'stats.species_title': 'Most Common Species',
    'stats.age_title':     'Age Distribution',
    'stats.district_title':'Trees per District',
    'stats.trees':         'trees',
    'stats.species':       'species',

    // ── Stories ───────────────────────────────────────────
    'story.oldest.title':     'The Oldest Tree',
    'story.oldest.body':      'A {age}-year-old {species} on {street}. This tree was already here when Basel looked very different.',
    'story.rare.title':       'Rare Species',
    'story.rare.body':        'Basel has {totalSpecies} tree species — {rareCount} of them appear only one to three times in the entire city.',
    'story.greenest.title':   'The Greenest Street',
    'story.greenest.body':    '{street} — with {count} trees, the most tree-lined street in Basel.',
    'story.growth.title':     'Basel\'s Tree Population',
    'story.growth.body':      '{total} trees stand in Basel today. Scroll to see how the tree population has grown over the decades.',
    'story.protected.title':  'Protected Giants',
    'story.protected.body':   '{count} trees in Basel are under protection.',
    'story.comparison.title': 'Trees on the Rhine',
    'story.comparison.body':  'How are trees distributed across the Rhine?',

    // ── Share ─────────────────────────────────────────────
    'share.copied':     'Link copied!',
    'share.card_title': 'Share this tree',

    // ── Attribution ───────────────────────────────────────
    'attribution': 'Data: Geodata Canton Basel-Stadt (CC BY 4.0)',
  },
};

// ── Translation function ──────────────────────────────────────
/**
 * Looks up a translation key in the current language.
 * Falls back to German, then to the key itself.
 * Replaces {placeholder} tokens with values from params.
 *
 * @param {string} key    - i18n key, e.g. 'detail.age'
 * @param {Object} [params] - optional substitution map, e.g. { age: 42 }
 * @returns {string}
 */
export function t(key, params) {
  const lang   = window.__meinBaumLang || 'de';
  const catalogue = strings[lang] || strings.de;
  let str = catalogue[key] ?? strings.de[key] ?? key;

  if (params) {
    str = str.replace(/\{(\w+)\}/g, (_, token) =>
      Object.prototype.hasOwnProperty.call(params, token) ? params[token] : `{${token}}`
    );
  }

  return str;
}

// ── DOM update helper ─────────────────────────────────────────
/**
 * Updates all elements carrying a [data-i18n] attribute.
 * Sets textContent to the translated string for that key.
 */
function updateAllI18n() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
}

// ── Public init ───────────────────────────────────────────────
/**
 * Initialises the i18n system.
 *
 * - Sets window.__meinBaumLang from state.lang.
 * - Binds the #btn-lang button to toggle DE ↔ EN.
 *   The button label always shows the OTHER language (e.g. "EN" when active lang is "de").
 * - Calls updateAllI18n() on init and after every toggle.
 * - Dispatches a 'langchange' CustomEvent on window after each toggle.
 *
 * @param {{ lang: string }} state - shared application state object
 */
export function initI18n(state) {
  // Sync global language marker with app state
  window.__meinBaumLang = state.lang || 'de';

  // Initial render pass
  updateAllI18n();

  const btn = document.getElementById('btn-lang');
  if (!btn) return;

  btn.addEventListener('click', () => {
    // Toggle between 'de' and 'en'
    const next = window.__meinBaumLang === 'de' ? 'en' : 'de';
    window.__meinBaumLang = next;
    state.lang = next;

    updateAllI18n();

    // Update html lang attribute for accessibility
    document.documentElement.lang = next;

    // Dispatch custom event so other modules can react
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: next } }));
  });
}
