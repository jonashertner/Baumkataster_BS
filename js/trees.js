// ============================================================
// trees.js — Tree data processing and story computation
// ============================================================

import { SPECIES_COLORS } from './config.js';

// ── Species helpers ──────────────────────────────────────────

/**
 * Extracts the genus (first word) from a Latin species name.
 * Returns the genus key if found in SPECIES_COLORS, otherwise '_default'.
 * @param {string|null|undefined} latinName
 * @returns {string}
 */
export function getSpeciesGenus(latinName) {
  if (!latinName || typeof latinName !== 'string') return '_default';
  const genus = latinName.trim().split(/\s+/)[0];
  return genus in SPECIES_COLORS ? genus : '_default';
}

/**
 * Returns the hex colour for a species via genus lookup.
 * Falls back to the _default colour if the genus is not recognised.
 * @param {string|null|undefined} latinName
 * @returns {string}
 */
export function getSpeciesColor(latinName) {
  return SPECIES_COLORS[getSpeciesGenus(latinName)];
}

/**
 * Returns true if the tree is protected (status does NOT start with
 * "Nicht geschützt").
 * @param {string|null|undefined} status
 * @returns {boolean}
 */
export function isProtected(status) {
  if (!status || typeof status !== 'string') return false;
  return !status.startsWith('Nicht geschützt');
}

// ── Feature enrichment ───────────────────────────────────────

const CURRENT_YEAR = new Date().getFullYear();

/**
 * Parses a planting year from the `timeposition` property string.
 * Returns the year as a number if it is > 1800 and <= current year,
 * otherwise returns null.
 * @param {string|null|undefined} timeposition
 * @returns {number|null}
 */
function parsePlantingYear(timeposition) {
  if (!timeposition) return null;
  const match = String(timeposition).match(/\b(\d{4})\b/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  if (year > 1800 && year <= CURRENT_YEAR) return year;
  return null;
}

/**
 * Iterates all features in the GeoJSON and adds computed properties:
 *   _color        — hex colour derived from the Latin species name
 *   _protected    — boolean; true when the tree has a protection status
 *   _genus        — genus key string used for SPECIES_COLORS lookup
 *   _plantingYear — validated planting year or null
 *   _decade       — decade bucket (e.g. 1990) or null
 * Mutates features in place; also returns the geojson for chaining.
 * @param {GeoJSON.FeatureCollection} geojson
 * @returns {GeoJSON.FeatureCollection}
 */
export function processTreeData(geojson) {
  if (!geojson || !Array.isArray(geojson.features)) return geojson;

  for (const feature of geojson.features) {
    const props = feature.properties ?? {};

    const latinName    = props.baumart_lateinisch ?? null;
    const status       = props.ba_schutzstatus   ?? null;
    const timeposition = props.timeposition       ?? null;

    const plantingYear = parsePlantingYear(timeposition);

    props._color        = getSpeciesColor(latinName);
    props._protected    = isProtected(status);
    props._genus        = getSpeciesGenus(latinName);
    props._plantingYear = plantingYear;
    props._decade       = plantingYear !== null ? Math.floor(plantingYear / 10) * 10 : null;

    // Ensure the mutated object is referenced back (safety for non-object props)
    feature.properties = props;
  }

  return geojson;
}

// ── Nearest-tree lookup ──────────────────────────────────────

/**
 * Finds the tree feature nearest to the given coordinate using Turf.js.
 * Requires `turf` to be available as a browser global.
 * @param {GeoJSON.FeatureCollection} geojson
 * @param {{ lng: number, lat: number }} lngLat
 * @returns {GeoJSON.Feature|null}
 */
export function findNearestTree(geojson, lngLat) {
  if (!geojson || !Array.isArray(geojson.features) || geojson.features.length === 0) {
    return null;
  }
  if (typeof turf === 'undefined') {
    console.warn('[findNearestTree] turf global not available.');
    return null;
  }

  const targetPoint   = turf.point([lngLat.lng, lngLat.lat]);
  const pointsFC      = turf.featureCollection(
    geojson.features
      .filter((f) => f.geometry && f.geometry.coordinates)
      .map((f, i) =>
        turf.point(f.geometry.coordinates, { featureIndex: i }),
      ),
  );

  const nearest = turf.nearestPoint(targetPoint, pointsFC);
  if (!nearest) return null;

  const idx = nearest.properties?.featureIndex;
  return idx != null ? geojson.features[idx] : null;
}

// ── Story data precomputation ────────────────────────────────

/**
 * Precomputes aggregate story values from the full dataset.
 * Returns a plain object consumed by the stories and stats panels.
 * @param {GeoJSON.FeatureCollection} geojson
 * @returns {object}
 */
export function computeStoryData(geojson) {
  if (!geojson || !Array.isArray(geojson.features)) {
    return {};
  }

  const features = geojson.features;

  // ── oldest ────────────────────────────────────────────────
  let oldest = null;
  let maxAge  = -Infinity;
  for (const f of features) {
    const age = f.properties?.ba_baumalter;
    if (age != null && typeof age === 'number' && age < 500 && age > maxAge) {
      maxAge  = age;
      oldest  = f;
    }
  }

  // ── rareSpecies ───────────────────────────────────────────
  // Count occurrences of each German species name
  const speciesCounts = new Map(); // baumart_deutsch → [feature, ...]
  for (const f of features) {
    const name = f.properties?.baumart_deutsch;
    if (!name) continue;
    if (!speciesCounts.has(name)) speciesCounts.set(name, []);
    speciesCounts.get(name).push(f);
  }

  const rareEntries = [...speciesCounts.entries()].filter(
    ([, arr]) => arr.length >= 1 && arr.length <= 3,
  );
  const rareNames    = rareEntries.map(([name]) => name);
  const rareFeatures = rareEntries.flatMap(([, arr]) => arr);
  const rareSpecies  = {
    names:    rareNames,
    features: rareFeatures,
    count:    rareNames.length,
  };

  // ── greenestStreet ────────────────────────────────────────
  const streetCounts = new Map(); // ba_strasse → [feature, ...]
  for (const f of features) {
    const street = f.properties?.ba_strasse;
    if (!street) continue;
    if (!streetCounts.has(street)) streetCounts.set(street, []);
    streetCounts.get(street).push(f);
  }

  let greenestStreet = { name: null, count: 0, features: [] };
  for (const [name, arr] of streetCounts) {
    if (arr.length > greenestStreet.count) {
      greenestStreet = { name, count: arr.length, features: arr };
    }
  }

  // ── decades ───────────────────────────────────────────────
  const decadeMap = new Map(); // decade (number) → [feature, ...]
  for (const f of features) {
    const decade = f.properties?._decade;
    if (decade == null) continue;
    if (!decadeMap.has(decade)) decadeMap.set(decade, []);
    decadeMap.get(decade).push(f);
  }
  const sortedDecadeKeys = [...decadeMap.keys()].sort((a, b) => a - b);
  const decades = {
    map:  decadeMap,
    keys: sortedDecadeKeys,
  };

  // ── protected ─────────────────────────────────────────────
  const protectedFeatures = features.filter((f) => f.properties?._protected === true);
  const categories        = new Map(); // status → count
  for (const f of protectedFeatures) {
    const status = f.properties?.ba_schutzstatus ?? 'Unbekannt';
    categories.set(status, (categories.get(status) ?? 0) + 1);
  }
  const protected_ = {
    features:   protectedFeatures,
    count:      protectedFeatures.length,
    categories, // Map<status, count>
  };

  // ── comparison: Kleinbasel vs Grossbasel ──────────────────
  const GROSSBASEL_KREISE = new Set(['Ost', 'West', 'Nord', 'Süd']);

  const kleinbaselFeatures  = features.filter((f) => f.properties?.ba_kreis === 'Kleinbasel');
  const grossbaselFeatures  = features.filter((f) => GROSSBASEL_KREISE.has(f.properties?.ba_kreis));

  function sideStats(sideFeatures) {
    const validAges = sideFeatures
      .map((f) => f.properties?.ba_baumalter)
      .filter((age) => age != null && typeof age === 'number' && age < 500);
    const avgAge = validAges.length > 0
      ? validAges.reduce((sum, a) => sum + a, 0) / validAges.length
      : null;

    const uniqueSpecies = new Set(
      sideFeatures
        .map((f) => f.properties?.baumart_deutsch)
        .filter(Boolean),
    ).size;

    return {
      count:         sideFeatures.length,
      avgAge,
      uniqueSpecies,
    };
  }

  const comparison = {
    kleinbasel: { ...sideStats(kleinbaselFeatures), features: kleinbaselFeatures },
    grossbasel: { ...sideStats(grossbaselFeatures), features: grossbaselFeatures },
  };

  // ── totals ────────────────────────────────────────────────
  const totalTrees   = features.length;
  const totalSpecies = new Set(
    features.map((f) => f.properties?.baumart_deutsch).filter(Boolean),
  ).size;

  return {
    oldest,
    rareSpecies,
    greenestStreet,
    decades,
    protected: protected_,
    comparison,
    totalTrees,
    totalSpecies,
  };
}
