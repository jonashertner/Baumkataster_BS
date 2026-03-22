# Mein Baum Basel Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a world-class interactive tree map of Basel's 32,325 public trees with "Find My Tree" geolocation, curated stories, filtering, and sharing.

**Architecture:** Single-page vanilla JS application. Mapbox GL JS renders all trees as a WebGL circle layer. Data loaded upfront from Basel Open Data API GeoJSON export. No backend, no build step, no framework.

**Tech Stack:** Mapbox GL JS (map), Turf.js (spatial queries), vanilla JS/CSS, Basel Open Data API.

**Spec:** `docs/superpowers/specs/2026-03-22-mein-baum-basel-design.md`

**Security note:** All tree data comes from a trusted government open data API. Tree property values (species names, street names) are rendered using `textContent` for plain text contexts. Where HTML structure is needed for UI components, values are escaped or inserted via safe DOM methods to prevent XSS.

---

## File Structure

```
/
├── index.html          # Single entry point, loads all JS/CSS, contains HTML structure
├── css/
│   └── style.css       # All styles: layout, components, responsive, animations
├── js/
│   ├── app.js          # Entry point: map init, data loading, error handling, coordinates modules
│   ├── config.js       # Mapbox token, API URL, species color map, constants
│   ├── trees.js        # Data processing: species family classification, nearest-tree, story computations
│   ├── ui.js           # UI components: detail card, filter bar, nav, loading state
│   ├── stories.js      # Stories panel: 6 stories, scroll-driven map control
│   ├── stats.js        # Stats overlay: species chart, age histogram, district bars
│   ├── share.js        # Sharing: permalinks, canvas card generation, Web Share API
│   └── i18n.js         # All DE/EN strings, language toggle logic
└── assets/
    └── favicon.svg     # Tree icon
```

---

### Task 1: Project Scaffolding & Map

**Files:**
- Create: `index.html`
- Create: `css/style.css`
- Create: `js/config.js`
- Create: `js/app.js`
- Create: `assets/favicon.svg`

- [ ] **Step 1: Create `js/config.js` with all constants**

Contains: Mapbox token (placeholder — must be replaced with real token), API URL with field selection, map center/zoom/bounds for Basel, species genus-to-color mapping, protection status colors, fetch timeout.

Species color map keyed by Latin genus prefix:
- Tilia → #4CAF50 (warm green), Platanus → #FFB300 (gold), Aesculus → #C62828 (deep red)
- Quercus → #795548 (brown), Acer → #FF8F00 (orange), Betula → #FDD835 (light yellow)
- Fraxinus → #00897B (teal), conifers (Picea/Pinus/Abies/Taxus/Thuja/Cedrus/Larix) → #2E7D32 (dark green)
- _default → #9E9E9E (gray)

API URL: `https://data.bs.ch/api/explore/v2.1/catalog/datasets/100052/exports/geojson?select=ba_baumnr,baumart_deutsch,baumart_lateinisch,ba_baumalter,ba_schutzstatus,ba_strasse,ba_kreis,ba_gemeinde,timeposition`

Map center: [7.5886, 47.5596], zoom: 13, maxBounds: [[7.45, 47.50], [7.75, 47.62]]

- [ ] **Step 2: Create `assets/favicon.svg`**

Simple tree icon: green circle (canopy) + brown rectangle (trunk).

- [ ] **Step 3: Create `index.html` with full HTML structure**

Single HTML file that loads Mapbox GL JS v3 + CSS from CDN, Turf.js from CDN, project CSS, and `js/app.js` as ES module.

Contains all structural elements as empty/skeleton containers:
- `#top-nav` — fixed nav bar with logo, Geschichten button, stats icon, language toggle, mobile filter toggle
- `#filter-bar` — horizontal filter bar (populated by ui.js)
- `#map` — Mapbox map container
- `#loading-overlay` — spinner + "Bäume werden geladen..." text
- `#error-overlay` — error message + retry button (hidden by default)
- `#find-my-tree` — floating card with location icon + "Finde deinen Baum"
- `#find-my-tree-fab` — FAB button (hidden, shows after card dismissed)
- `#tree-detail` — right panel for tree detail (hidden, populated by ui.js)
- `#stories-panel` — left panel for stories (hidden, populated by stories.js)
- `#stats-overlay` — fullscreen overlay for stats (hidden, populated by stats.js)

All text elements use `data-i18n` attributes for i18n.

- [ ] **Step 4: Create `css/style.css` with base layout and loading state**

CSS custom properties for design tokens (colors, radii, fonts, nav height).
Full layout: fixed nav, absolute-positioned map below nav, z-indexed overlays.
Loading overlay: centered spinner with CSS animation over semi-transparent backdrop.
Error overlay: centered message with retry button.
Floating card: bottom-left positioned, rounded, shadowed, hover lift effect.
Detail card: right-side panel (translateX slide animation), bottom sheet on mobile.
Stories panel: left-side panel (translateX slide animation), full-width on mobile.
Stats overlay: fullscreen with backdrop blur, opacity transition.
Filter bar: fixed below nav, horizontal flex layout with gap.
Responsive breakpoints at 768px and 375px.
Utility class `.hidden` for display:none.

- [ ] **Step 5: Create `js/app.js` — map initialization and data loading**

Exports a `state` object: `{ map, treeData, lang, selectedTree, activeFilters, storyData }`.

`initMap()`: Creates Mapbox map with light-v11 style, `preserveDrawingBuffer: true`, nav controls. Returns promise that resolves on map load.

`fetchWithTimeout(url, timeoutMs)`: Fetch wrapper with AbortController timeout.

`loadTreeData()`: Fetches GeoJSON export. On failure, retries once automatically. Validates response has features. Filters out features with null coordinates. Throws on final failure.

`addTreeLayer()`: Adds GeoJSON source with clustering (maxZoom 14, radius 50). Three layers:
1. `clusters` — circle layer for clustered points, radius stepped by point_count, green fill
2. `cluster-count` — symbol layer for cluster count labels
3. `trees` — circle layer for individual trees, radius interpolated by zoom (2px at z10, 4px at z14, 8px at z18), color from `_color` property, stroke for protected trees

`handlePermalink()`: Reads `window.location.hash`, matches `#/tree/{id}`, finds feature, flies to it and opens detail card.

`init()`: Runs on DOMContentLoaded. Parallel-loads map + data. Calls processTreeData and computeStoryData (from trees.js). Calls addTreeLayer. Dynamically imports and initializes ui.js, stories.js, stats.js, share.js, i18n.js. Shows error overlay on failure. Retry button re-runs init.

- [ ] **Step 6: Verify — open in browser via local server**

```bash
python3 -m http.server 8000
```

Expected: nav bar visible, Mapbox basemap centered on Basel, loading spinner while data loads. (Trees won't render with colors until Task 2.)

Note: Replace placeholder Mapbox token in config.js with a real one first.

- [ ] **Step 7: Commit**

```bash
git init && git add index.html css/style.css js/config.js js/app.js assets/favicon.svg && git commit -m "feat: project scaffolding with Mapbox map and data loading"
```

---

### Task 2: Tree Data Processing

**Files:**
- Create: `js/trees.js`
- Modify: `js/app.js` (import and call processTreeData + computeStoryData before addTreeLayer)

- [ ] **Step 1: Create `js/trees.js`**

`getSpeciesGenus(latinName)`: Extracts first word (genus) from Latin name. Returns genus if it's in SPECIES_COLORS, else '_default'.

`getSpeciesColor(latinName)`: Returns the color hex for a species via genus lookup.

`isProtected(status)`: Returns true if status string does NOT start with "Nicht geschützt".

`processTreeData(geojson)`: Iterates all features, adds computed properties:
- `_color`: species color hex
- `_protected`: boolean
- `_genus`: genus key string
- `_plantingYear`: parsed from timeposition (validated > 1800 and <= current year)
- `_decade`: floor(plantingYear / 10) * 10

`findNearestTree(geojson, lngLat)`: Uses `turf.nearestPoint()` to find closest tree to a coordinate. Returns the original feature from geojson.features using featureIndex.

`computeStoryData(geojson)`: Precomputes all story values from the dataset:
- **oldest**: Feature with max ba_baumalter where age < 500
- **rareSpecies**: Species (baumart_deutsch) with 1-3 specimens; list of names, matching features, count
- **greenestStreet**: Street (ba_strasse) with highest tree count; name, count, matching features
- **decades**: Map of decade → features array, sorted decade keys
- **protected**: Protected features, count, categories map (status → count)
- **comparison**: Kleinbasel (ba_kreis == "Kleinbasel") vs Grossbasel (ba_kreis in [Ost, West, Nord, Süd]). Each side: count, avgAge (excluding nulls and age >= 500), uniqueSpecies count
- **totalTrees**: features.length
- **totalSpecies**: unique baumart_deutsch count

- [ ] **Step 2: Update `js/app.js`**

Add import of `processTreeData` and `computeStoryData` from trees.js. Call them in init() after setting state.treeData and before addTreeLayer.

- [ ] **Step 3: Verify — trees render with species colors**

Zoom in past level 14 to see individual colored dots. Different species show different colors. Check browser console for state.storyData values.

- [ ] **Step 4: Commit**

```bash
git add js/trees.js js/app.js && git commit -m "feat: tree data processing with species colors and story computations"
```

---

### Task 3: Internationalization (i18n)

**Files:**
- Create: `js/i18n.js`

- [ ] **Step 1: Create `js/i18n.js`**

Contains a `strings` object with `de` and `en` keys, each mapping i18n keys to translated strings. Covers all UI text: nav, loading, error, find-my-tree, detail card (age, planted, protected, share, location), filter labels, stats titles, all 6 story titles and body templates, share toast, attribution.

String templates use `{placeholder}` syntax for interpolation (e.g., `{age}`, `{species}`, `{street}`, `{count}`).

`t(key, params)`: Looks up key in current language, falls back to German, then to key itself. Replaces `{placeholder}` with params values.

`updateAllI18n()`: Queries all `[data-i18n]` elements and sets their `textContent` to `t(el.dataset.i18n)`.

`initI18n(state)`: Sets `window.__meinBaumLang` from state.lang. Binds click on `#btn-lang` to toggle de/en, update button text (shows the OTHER language as label), call updateAllI18n, dispatch `langchange` CustomEvent. Calls updateAllI18n on init.

- [ ] **Step 2: Verify — toggle language**

Click "EN" → all data-i18n text switches to English, button shows "DE". Click "DE" → back to German.

- [ ] **Step 3: Commit**

```bash
git add js/i18n.js && git commit -m "feat: internationalization with DE/EN toggle"
```

---

### Task 4: UI Components — Detail Card, Find My Tree, Tooltips

**Files:**
- Create: `js/ui.js`
- Modify: `css/style.css` (detail card styles, street search styles)

- [ ] **Step 1: Create `js/ui.js`**

**Tree Detail Card:**
- `showTreeDetail(state, feature)`: Builds detail card content using safe DOM construction (createElement + textContent for all user-facing data values). Shows species name (German + Latin italic), age with human-readable planting year (or "Alter unbekannt"), protection badge (colored), street + district (or "Standort unbekannt"), species color dot, share button. Adds `visible` class to slide in. Updates `window.location.hash`.
- `hideTreeDetail()`: Removes visible class, clears hash.
- `flyToTree(map, feature)`: Smooth flyTo at zoom 17 with 1.5s duration.

**Map Interactions:**
- `setupMapInteractions(state)`:
  - Hover on 'trees' layer: cursor pointer, Mapbox Popup tooltip with species name (using `setHTML` with escaped content or `setText`)
  - MouseLeave: remove popup
  - Click on 'trees': find original feature by ba_baumnr, flyToTree + showTreeDetail
  - Click on 'clusters': getClusterExpansionZoom, flyTo
  - Click on empty space: hideTreeDetail

**Find My Tree:**
- `setupFindMyTree(state)`:
  - Click on floating card → request geolocation
  - On success: findNearestTree, flyToTree, showTreeDetail, pulseTree animation, hide card, show FAB
  - On failure/denied: transform card into street search input
  - Close button: hide card, show FAB
  - FAB click: same as card click
- `showStreetSearch(state)`: Replaces card content with text input + results dropdown. Collects unique streets from data, filters on input (min 2 chars), click result → fly to first tree on that street
- `pulseTree(map, feature)`: Adds temporary GeoJSON source + circle layer with animated radius/opacity pulse. Removes after 3 seconds.

**Filter Bar:**
- `setupFilterBar(state)`: Builds filter bar using safe DOM construction. Components:
  - Species: `<select>` dropdown with all unique baumart_deutsch values sorted
  - Age: dual `<input type="range">` sliders (0 to max valid age), display showing "min – max"
  - Protection: chip buttons for each of the 4 protection status values (abbreviated labels)
  - District: chip buttons for each of the 9 ba_kreis values
  - Reset button (hidden when no filters active)
- `applyFilters()`: Builds Mapbox filter expression array from active filters. Sets map filter on 'trees' layer. Dispatches `filterschange` CustomEvent.
- Mobile filter toggle: `#btn-filter-mobile` click toggles filter bar visibility.

- [ ] **Step 2: Add styles to `css/style.css`**

Detail card inner styles: close button, header with color dot + species names, info rows, badges (protected green, not-protected gray), share button.
Street search: input with focus border, results dropdown with hover highlights.
Filter components: filter-group flex layout, select styling, range inputs with accent color, chips with active state (green fill), reset button (red outline).

- [ ] **Step 3: Verify full interaction flow**

1. Click tree → detail card slides in with correct data
2. Hover → tooltip
3. Click cluster → zoom in
4. Click empty space → card closes
5. "Finde deinen Baum" → geolocation prompt → nearest tree highlighted
6. Deny geolocation → street search appears
7. Filter by species → map updates instantly
8. Filter by district → map shows only those areas
9. Reset → all trees back

- [ ] **Step 4: Commit**

```bash
git add js/ui.js css/style.css && git commit -m "feat: detail card, find my tree, tooltips, filter bar"
```

---

### Task 5: Stories Panel

**Files:**
- Create: `js/stories.js`
- Modify: `css/style.css` (story styles)

- [ ] **Step 1: Create `js/stories.js`**

`initStories(state)`: Builds stories panel content. Creates header with title + close button. Creates story cards using safe DOM construction:

**Story 1 — "Der älteste Baum":** Click → resetStoryFilters, flyTo oldest tree coordinates at zoom 17.

**Story 2 — "Die seltensten Arten":** Click → resetStoryFilters, set map filter to show only rare species names, fitBounds to their extent.

**Story 3 — "Die grünste Strasse":** Click → resetStoryFilters, set map filter to greenest street name, fitBounds to matching trees.

**Story 4 — "Wie Basel grüner wurde":** Renders decade timeline (decade label + count per row). Click → reset, filter to only trees with _decade, show earliest decade. IntersectionObserver on each decade-step (root: panel, threshold 0.5): as each scrolls into view, update map filter to show trees up to that decade. Visual highlight on active decade row.

**Story 5 — "Unter Schutz":** Click → resetStoryFilters, set map filter `_protected == true`, flyTo city center.

**Story 6 — "Kleinbasel vs. Grossbasel":** Renders comparison grid with counts, species diversity, avg age for each side. Click → reset, flyTo city center.

`resetStoryFilters(map)`: Sets tree layer filter back to default (hide clusters only). Removes decade highlights.

Toggle: `#btn-stories` click toggles panel visible class + button active class. Closes stats overlay if open. Closing resets story filters.

Language change listener: re-renders panel.

- [ ] **Step 2: Add story styles to `css/style.css`**

Stories header, story card (padded, bordered, hover shadow), story title/body typography. Growth timeline: vertical flex of decade rows, active state with green background + slight scale. Comparison grid: two-column flex with centered stats + "vs." divider.

- [ ] **Step 3: Verify — all 6 stories work**

Click each story card, verify map responds correctly. Scroll decade timeline in Story 4, verify trees appear progressively. Close panel, verify filters reset.

- [ ] **Step 4: Commit**

```bash
git add js/stories.js css/style.css && git commit -m "feat: stories panel with 6 data-driven narratives"
```

---

### Task 6: Stats Overlay

**Files:**
- Create: `js/stats.js`
- Modify: `css/style.css` (chart styles)

- [ ] **Step 1: Create `js/stats.js`**

`initStats(state)`: Binds `#btn-stats` click to toggle overlay visibility. Closes stories panel when opening. Listens for `filterschange` and `langchange` events to re-render.

`renderStats(state)`: Computes and renders all charts using safe DOM construction:
- **Header**: total trees count + total species count as large numbers
- **Species distribution**: Top 10 species by count as horizontal bar chart (CSS width percentages). "Andere" row for remaining. Bar labels use textContent.
- **Age histogram**: Decade bins (floor(age/10)*10) as vertical bars. Height as percentage of max bin. Labels below each bar.
- **Trees per district**: Horizontal bar chart sorted by count descending.
- **Attribution**: data source credit
- Close button in top-right corner

All numeric formatting uses `toLocaleString('de-CH')` for Swiss number formatting.

- [ ] **Step 2: Add chart styles to `css/style.css`**

Stats overlay layout: max-width 800px centered, grid of sections. Close button fixed position. Big numbers in primary green. Horizontal bar chart: flex rows with label (140px), track (flex:1, gray bg), fill (green, width transition), value. Histogram: flex row of equal-width wrappers, bars grow upward from bottom (margin-top: auto), 160px container height. Attribution: small gray text.

- [ ] **Step 3: Verify — stats overlay**

Click chart icon → overlay with 3 charts and summary numbers. Close via X. Verify numbers match expectations (32K+ trees, 380+ species).

- [ ] **Step 4: Commit**

```bash
git add js/stats.js css/style.css && git commit -m "feat: stats overlay with species, age, and district charts"
```

---

### Task 7: Sharing — Permalinks, Canvas Card, Web Share

**Files:**
- Create: `js/share.js`
- Modify: `css/style.css` (toast style)

- [ ] **Step 1: Create `js/share.js`**

`initShare(state)`: Delegates click events on `#btn-share-tree` buttons (dynamically created in detail card).

`shareTree(state, feature)`: Constructs URL with `#/tree/{ba_baumnr}` hash. Tries `navigator.share()` first (mobile). Falls back to `navigator.clipboard.writeText()`. Final fallback: `prompt()` with URL. Shows toast on clipboard copy.

`showCopiedToast()`: Creates temporary toast element at bottom-center with "Link kopiert!" text. Animates in with CSS transition, removes after 2 seconds.

`generateShareCard(state, feature)`: Creates 600x320 canvas. Draws: white background with rounded corners, colored accent bar at top, species color dot, species name (bold 24px), Latin name (italic 16px), age text, street, district, protection badge (if protected), branding text. Returns `canvas.toDataURL('image/png')`. (Available for future use — v1 focuses on link sharing.)

- [ ] **Step 2: Add toast style to `css/style.css`**

Fixed position bottom-center, dark background, white text, pill-shaped, opacity/transform transition for enter/exit animation.

- [ ] **Step 3: Verify sharing**

Click tree → Share button → link copied toast (desktop) or native share (mobile). Open copied URL in new tab → correct tree loads.

- [ ] **Step 4: Commit**

```bash
git add js/share.js css/style.css && git commit -m "feat: sharing with permalinks, Web Share API, and clipboard fallback"
```

---

### Task 8: Polish & Responsive Refinement

**Files:**
- Modify: `index.html` (add Inter font)
- Modify: `css/style.css` (animations, refinements)

- [ ] **Step 1: Add Inter font**

Add Google Fonts preconnect + Inter import (400, 500, 600, 700 weights) to index.html head.

- [ ] **Step 2: Add polish styles**

- Floating card entrance animation (fadeInUp with 1s delay)
- Smooth scrollbar styling for panels (thin, gray thumb)
- Print media query: hide nav, cards, filter bar
- Hover media query: only apply hover effects on non-touch devices
- Small mobile (< 375px): reduce font sizes in nav

- [ ] **Step 3: Verify responsiveness across breakpoints**

Desktop (1200px+), tablet (768px), mobile (375px), small mobile (320px). Check all panels, cards, filter bar, map interactions.

- [ ] **Step 4: Commit**

```bash
git add index.html css/style.css && git commit -m "feat: Inter font, animations, responsive polish"
```

---

### Task 9: Final Integration & QA

- [ ] **Step 1: Replace Mapbox token placeholder**

Get real Mapbox public token from mapbox.com, update `js/config.js`.

- [ ] **Step 2: Create `.gitignore`**

```
.DS_Store
.superpowers/
```

- [ ] **Step 3: Full manual QA checklist**

Start local server: `python3 -m http.server 8000`

Verify each item:
- [ ] Map loads with basemap visible immediately
- [ ] Loading spinner shows during data fetch (6-15 seconds)
- [ ] Trees appear as colored dots after loading
- [ ] Zoom in past level 14: individual trees with species colors
- [ ] Zoom out: green clusters with count labels
- [ ] Hover tree: tooltip with species name
- [ ] Click tree: detail card slides in with species, age, protection, street
- [ ] "Finde deinen Baum": geolocation → fly to nearest tree with pulse
- [ ] Geolocation denied: street search fallback works
- [ ] Filter bar: species dropdown filters map
- [ ] Filter bar: age sliders filter map
- [ ] Filter bar: protection chips toggle filter
- [ ] Filter bar: district chips toggle filter
- [ ] Filter bar: reset clears all filters
- [ ] Stories: "Der älteste Baum" flies to oldest tree
- [ ] Stories: "Die seltensten Arten" highlights rare species
- [ ] Stories: "Die grünste Strasse" zooms to greenest street
- [ ] Stories: decade timeline reveals trees progressively on scroll
- [ ] Stories: "Unter Schutz" shows only protected trees
- [ ] Stories: Kleinbasel vs Grossbasel comparison shows stats
- [ ] Stats overlay: species bars, age histogram, district bars render correctly
- [ ] Share: copies permalink, toast appears
- [ ] Permalink: opening shared URL flies to correct tree
- [ ] Language toggle: DE ↔ EN switches all text
- [ ] Mobile (375px): bottom sheet detail card, centered floating card, responsive nav
- [ ] Error state: disconnect network, reload → error message + retry button
- [ ] Null handling: trees without age show "Alter unbekannt", without street show "Standort unbekannt"

- [ ] **Step 4: Final commit**

```bash
git add -A && git commit -m "feat: complete Mein Baum Basel v1"
```
