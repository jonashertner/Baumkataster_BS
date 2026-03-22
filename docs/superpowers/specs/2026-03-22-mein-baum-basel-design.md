# Mein Baum Basel — Design Spec

## Overview

**Mein Baum Basel** is a citizen-first interactive tree map of Basel that makes the city's urban forest personal, explorable, and shareable. It combines a world-class interactive map of all 32,325 public trees with a "Find My Tree" feature and curated data-driven stories.

**Primary audience:** Basel residents and citizens discovering their neighborhood trees.
**Secondary audiences:** Urban planners, educators, international visitors.
**Language:** German (default) with English toggle.

## Data Source

- **Dataset:** Baumkataster Basel-Stadt (ID: 100052)
- **API:** `data.bs.ch` Open Data portal (ODS v2.1 API)
- **Records:** 32,325 trees, updated daily
- **License:** CC BY 4.0 (attribution: "Geodaten Kanton Basel-Stadt")
- **CORS:** Enabled (`access-control-allow-origin: *`) — client-side fetching works
- **Rate limit:** 500,000 requests/day
- **Key fields:** `ba_baumnr` (ID), `baumart_deutsch`, `baumart_lateinisch`, `ba_baumalter` (age, ~8% null), `ba_schutzstatus`, `ba_strasse` (~2% null), `ba_kreis`, `ba_gemeinde`, `timeposition` (planting date, ~3% null). Coordinates are in GeoJSON `geometry.coordinates` [lon, lat] — not in a separate property field.

### `ba_kreis` Values (District/Area)

The `ba_kreis` field contains 10 values that mix city districts with special areas:

| Value | Count | Type |
|-------|-------|------|
| Ost | 9,633 | City district (Grossbasel) |
| West | 8,724 | City district (Grossbasel) |
| Kleinbasel | 8,426 | City district |
| Nord | 2,220 | City district (Grossbasel) |
| Süd | 1,693 | City district (Grossbasel) |
| Hörnli | 1,471 | Cemetery/park area |
| Bettingen | 117 | Municipality |
| Gottesacker | 30 | Cemetery |
| Rebberg | 4 | Vineyard/park |
| (null) | 7 | Missing data |

### Data Quality Notes

- **Null values:** ~8% of trees have no age (`ba_baumalter`), ~2% have no street, ~3% have no planting date. All UI must handle nulls gracefully (show "Alter unbekannt" etc.).
- **Outlier ages:** One record shows 1,076 years (clearly erroneous). Realistic oldest tree: 267-year-old Sommer-Linde at Münsterplatz. Stories filter to `ba_baumalter < 500` to exclude bad data.
- **Protection status values:** "Gemäss Baumschutzgesetz (BSchG)", "Geschützt (Ersatzpflanzung)", "Geschützt (Umfang)", "Nicht geschützt (BL, Riehen, Waldzone, etc.)"

## Experience Flow

### 1. Landing — Map First

Full-screen map loads instantly (Mapbox tiles). Trees load asynchronously with an elegant progress indicator ("32'325 Bäume werden geladen...") overlaid on the already-visible basemap. Once loaded, all 32,325 trees appear as colored dots. A floating card in the bottom-left gently invites: *"Finde deinen Baum"* with a location icon. Dismissable, non-blocking.

### 2. Exploring

Pan, zoom, filter freely. Trees are color-coded by species family. Clicking any tree opens a detail card with species, age, protection status, and street. Hovering shows a tooltip with the species name.

### 3. Finding Your Tree

Tap the floating prompt → browser requests geolocation → map flies smoothly to the user's position → nearest tree pulses with animation → detail card opens with personalized copy:

> *"Dein nächster Baum: eine 87-jährige Platane (Platanus × acerifolia) an der Spalenvorstadt. Sie wurde ca. 1939 gepflanzt und steht unter Schutz."*

If geolocation is denied, the card transforms into a street name search.

Nearest tree calculated using Turf.js `nearestPoint` against the in-memory GeoJSON collection.

### 4. Stories

A collapsible left panel with curated scroll-driven narratives. Each story flies the map to the relevant location.

### 5. Filters & Stats

Clean filter bar for species, age, protection status, district. Stats overlay with species distribution, age histogram, and per-district bar chart.

## Architecture

### Tech Stack

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Map rendering | Mapbox GL JS | WebGL, handles 32K points at 60fps, clustering, data-driven styling. Requires access token (scoped to domain, exposed client-side — standard for tile APIs) |
| Spatial queries | Turf.js | Nearest-point calculation for "Find My Tree", distance display |
| Application | Vanilla JS + CSS | No build step, deployable anywhere, forkable |
| Data source | Basel Open Data API | GeoJSON export endpoint for full dataset |
| Charts | Lightweight (CSS-based or tiny lib) | Minimal dependency footprint |
| Hosting | Static files (GitHub Pages / Netlify) | No backend needed |

### Data Loading Strategy

**Verified API constraints:**
- Records API: max 100 per request (would need 323 requests — not viable)
- GeoJSON export: returns all records, but 12.8MB unoptimized (16s server time)
- **Optimized approach:** Use the `select` parameter to fetch only needed fields

```
GET /api/explore/v2.1/catalog/datasets/100052/exports/geojson
  ?select=ba_baumnr,baumart_deutsch,baumart_lateinisch,ba_baumalter,
          ba_schutzstatus,ba_strasse,ba_kreis,ba_gemeinde,timeposition
```

The export endpoint returns all records by default (no `limit` parameter needed).

This returns ~1.7MB compressed over the wire. Server processing takes 6-15 seconds — this is the bottleneck (not transfer size).

**Loading UX:**
1. Mapbox basemap loads instantly (tiles from CDN)
2. Fetch GeoJSON export begins immediately
3. Animated loading indicator overlays the visible basemap: progress ring + "Bäume werden geladen..."
4. On completion: trees fade in with a brief animation
5. Total expected wait: 6-15 seconds depending on server load

**Error handling:**
- **Timeout:** 30-second fetch timeout. On timeout, show "Daten konnten nicht geladen werden" with a retry button.
- **Retry:** One automatic retry on network failure, then show error state with manual retry button.
- **Malformed data:** If response is not valid GeoJSON or has 0 features, show error state.
- **Partial degradation:** If data loads but some features lack coordinates, silently skip those (don't block the whole app).

**Future optimization (out of scope for v1):** Pre-bundle a static GeoJSON snapshot as a project asset, updated daily via CI/CD. Would reduce load to <1 second.

### Data Flow

```
Page load
  → Mapbox basemap renders (instant, tiles from CDN)
  → Fetch GeoJSON export with field selection (~1.7MB compressed, 6-15s)
  → Parse into FeatureCollection
  → Filter out records with null coordinates
  → Add as Mapbox GeoJSON source
  → Render via circle layer with data-driven expressions
  → Compute story data (oldest tree, rarest species, etc.)
  → All subsequent interactions are local (no API calls)
```

### Key Decisions

- **All data loaded upfront:** Single GeoJSON export fetch. Loading state shows progress over the basemap. Once loaded, all filtering and exploration is instant.
- **No framework:** Vanilla JS keeps the project simple, dependency-free, and deployable as static files.
- **No backend:** The open data API provides everything. Tree permalinks use URL hash routing.
- **Responsive:** Full-screen map on all devices. UI components reflow: right panel on desktop, bottom sheet on mobile.

## Visual Design

### Aesthetic: Clean Modern

- White/light basemap, desaturated so tree dots pop
- Crisp sans-serif typography (Inter or system font stack)
- Generous whitespace, soft shadows on floating cards
- Vibrant but harmonious species color palette

### Tree Rendering

- Each tree: circle marker, default 4px radius, scaling on zoom
- Color-coded by species family (8-10 hues):
  - Linden → warm green
  - Platanen → gold
  - Kastanien → deep red
  - Eichen → brown
  - Ahorn → orange
  - Birken → light yellow
  - Eschen → teal
  - Nadelbäume → dark green
  - Other/rare → neutral gray
- Protected trees: subtle ring/halo effect
- Hover: circle grows, tooltip with species name
- Click: opens detail card
- At low zoom: clustering with count labels, colored by dominant species

### Basemap

Mapbox light style, further desaturated. Subtle street labels. Rhine as a calm blue divider. No visual noise competing with the tree layer.

## UI Components

### 1. Floating "Finde deinen Baum" Card

- Position: bottom-left (desktop), bottom-center (mobile)
- Rounded corners, white background, soft shadow
- Location icon + inviting text
- Dismissable with X button
- Reappears via a small FAB-style button after dismissal

### 2. Tree Detail Card

- Slides in from right (desktop) or bottom sheet (mobile)
- Contents:
  - Species name (German, large) + Latin name (smaller, italic)
  - Age in years + human-readable planting context ("Gepflanzt ca. 1939") — or "Alter unbekannt" if null
  - Protection status with colored badge (green=protected, gray=not protected)
  - Street name + district — or "Standort unbekannt" if null
  - Small species-color dot matching the map
  - "Teilen" (share) button
- Closable, one tree at a time

### 3. Filter Bar

- Top of screen, horizontal
- Pill-shaped controls:
  - Species: searchable dropdown (380+ options, grouped by family)
  - Age range: dual-handle slider
  - Protection status: toggle chips — "Gemäss Baumschutzgesetz", "Geschützt (Ersatzpflanzung)", "Geschützt (Umfang)", "Nicht geschützt"
  - District/Area: toggle chips for all `ba_kreis` values (Ost, West, Kleinbasel, Nord, Süd, Hörnli, Bettingen, Gottesacker, Rebberg). Show all values as-is — users familiar with Basel will recognize them.
- Active filters shown as removable tags
- "Reset" button when filters are active
- Collapsible on mobile (toggle via filter icon)

### 4. Stories Panel ("Geschichten")

- Triggered by "Geschichten" button in top nav
- Left panel (desktop), full overlay (mobile)
- Scroll-driven cards, each controlling the map:

**Story 1: "Der älteste Baum"**
Find the tree with highest `ba_baumalter` where age < 500 (to exclude data errors). Currently: a 267-year-old Sommer-Linde at Münsterplatz. Fly to it, pulse highlight. Show species, age, street, historical context ("Dieser Baum stand hier schon, als Basel noch...").

**Story 2: "Die seltensten Arten"**
Species with 1-3 specimens. Highlight as glowing dots across the city. "Basel hat 380 Baumarten — diese gibt es nur einmal."

**Story 3: "Die grünste Strasse"**
Street with most trees (aggregated by `ba_strasse`, excluding null values). Fly to it, highlight all trees along it. Show species mix breakdown.

**Story 4: "32'325 Bäume — wie Basel grüner wurde"**
The cinematic moment. As you scroll, trees appear by planting decade (derived from `timeposition`). 1950s, 60s, 70s... each wave pulsing in. Trees without planting dates excluded from this animation but visible in the final "today" state. No slider — pure scroll-driven animation. The map progressively fills with life.

**Story 5: "Unter Schutz"**
Show all protected trees (count computed at runtime from live data). Explain the three protection categories with their live counts. Fly to notable clusters.

**Story 6: "Kleinbasel vs. Grossbasel"**
Visual comparison across the Rhine: tree density, species diversity, average age. Kleinbasel = `ba_kreis == "Kleinbasel"` (8,426 trees). Grossbasel = `ba_kreis` in ["Ost", "West", "Nord", "Süd"] (22,270 trees). Excludes Hörnli, Gottesacker, Rebberg, and Bettingen from this comparison as they are special areas/municipalities.

All stories are computed from live data — they update as the dataset updates. All computations handle null values defensively.

### 5. Stats Overlay

- Toggle via chart icon in top nav
- Semi-transparent overlay with:
  - Species distribution (top 10 + "other" donut/pie chart)
  - Age histogram (decade bins, excluding null ages)
  - Trees per district (horizontal bar chart)
- Respects active filters (charts update when filters change)
- Lightweight rendering: CSS bars/arcs or a tiny chart library

### 6. Language Toggle

- DE/EN switch in top-right corner
- All UI text, story content, and detail card copy available in both languages
- Tree species names always show both German and Latin regardless of language

### 7. Top Navigation

Minimal bar: "Mein Baum Basel" wordmark (left), "Geschichten" button, stats icon, language toggle, filter icon (mobile). Semi-transparent white, not competing with the map.

## Shareability

### Tree Permalinks

Every tree gets a URL: `#/tree/BR005330` (relative to deployment domain).
Opening a shared link flies directly to that tree with its detail card open.

### Shareable Tree Portraits

"Teilen" button on detail card offers:
- Copyable permalink
- Shareable card image rendered via HTML Canvas (map initialized with `preserveDrawingBuffer: true` to support canvas export):
  - White card, species name, age, colored species dot, mini-map crop, "Mein Baum Basel" branding
- Native share sheet on mobile (Web Share API with fallback to copy-to-clipboard)

### Viral Loop

Find your tree → share it → friend clicks → discovers *their* tree → shares it. The personalized language ("dein Baum") creates a sense of ownership.

## Performance

### Loading

- Basemap loads instantly from Mapbox CDN
- Tree data: GeoJSON export with field selection (~1.7MB compressed)
- **Server processing: 6-15 seconds** — this is the primary bottleneck, not transfer size
- Elegant loading state: animated progress indicator over the already-visible basemap
- The wait is acceptable because the basemap provides immediate visual feedback

### Rendering

- Mapbox GL JS renders all 32K points via WebGL — GPU-accelerated
- Clustering at low zoom levels to reduce visual overload
- Smooth transitions between cluster and individual views
- Filtering via Mapbox `filter` expressions — no JS loop, instant

### Mobile

- Touch-friendly: larger tap targets
- Bottom sheet for detail cards
- Swipeable stories panel
- Geolocation as primary entry point
- Responsive breakpoints: map always full-screen, UI reflows around it

## File Structure

```
/
├── index.html          # Single entry point
├── css/
│   └── style.css       # All styles
├── js/
│   ├── app.js          # Main application, data loading, map setup
│   ├── trees.js        # Tree data processing, nearest-tree calculation
│   ├── ui.js           # UI components, detail cards, filters
│   ├── stories.js      # Stories panel, scroll-driven narratives
│   ├── share.js        # Sharing, canvas card generation, permalinks
│   └── i18n.js         # Internationalization (DE/EN)
└── assets/
    └── favicon.svg     # Tree icon favicon
```

## Out of Scope (v1)

- User accounts or saved favorites
- Tree health data or maintenance info (not in dataset)
- Augmented reality views
- Service worker / offline mode
- Custom basemap design (use Mapbox Studio style)
- Backend or database
- Pre-bundled static data snapshot (future optimization)
