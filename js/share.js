// ============================================================
// share.js — Permalinks, Web Share API, clipboard fallback,
//             and canvas share-card generation
// ES module
// ============================================================

import { t } from './i18n.js';
import { getSpeciesColor } from './trees.js';

// ── initShare ────────────────────────────────────────────────
/**
 * Attach a delegated click listener for the share button.
 * The button (#btn-share-tree) is created dynamically by ui.js
 * inside the tree-detail panel, so event delegation on document
 * is the correct approach.
 *
 * @param {object} state - Shared application state object.
 *   state.selectedTree is the full GeoJSON feature of the
 *   currently selected tree.
 */
export function initShare(state) {
  document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'btn-share-tree') {
      if (state.selectedTree) {
        shareTree(state, state.selectedTree);
      }
    }
  });
}

// ── shareTree ────────────────────────────────────────────────
/**
 * Share the currently selected tree via Web Share API,
 * clipboard, or a prompt() fallback.
 *
 * @param {object} state   - Application state (unused beyond feature).
 * @param {object} feature - GeoJSON feature for the tree.
 */
async function shareTree(state, feature) {
  const props = feature.properties || {};

  const baumnr        = props.ba_baumnr || '';
  const baumart       = props.baumart_deutsch || 'Baum';
  const strasse       = props.ba_strasse || '';
  const alter         = props.ba_baumalter != null ? props.ba_baumalter : null;

  const url = `${window.location.origin}${window.location.pathname}#/tree/${baumnr}`;

  const title = `${baumart} – Mein Baum Basel`;

  const agePart    = alter !== null ? `${alter} Jahre alt` : '';
  const streetPart = strasse ? `Standort: ${strasse}` : '';
  const text       = [agePart, streetPart].filter(Boolean).join(' · ');

  // 1. Web Share API (mobile-native, requires user gesture)
  if (navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return; // success — nothing more to do
    } catch (err) {
      // AbortError: user cancelled the share sheet — ignore silently.
      // Any other error falls through to clipboard.
      if (err.name === 'AbortError') return;
    }
  }

  // 2. Clipboard API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(url);
      showCopiedToast();
      return;
    } catch {
      // Clipboard blocked (e.g. no permission) — fall through.
    }
  }

  // 3. Final fallback: prompt()
  prompt('Link kopieren:', url);
}

// ── showCopiedToast ──────────────────────────────────────────
/**
 * Display a brief "copied" toast notification.
 * The toast fades in via the `toast-visible` CSS class and is
 * removed from the DOM after the transition completes.
 */
function showCopiedToast() {
  const toast = document.createElement('div');
  toast.className = 'toast';
  // Use textContent (not innerHTML) — safe, no XSS surface.
  toast.textContent = t('share.copied');
  document.body.appendChild(toast);

  // Trigger transition on next paint so the initial state
  // (opacity:0, translateY:20px) is actually rendered first.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.add('toast-visible');
    });
  });

  // After 2 s: start fade-out, then remove element after 300 ms.
  setTimeout(() => {
    toast.classList.remove('toast-visible');
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 300);
  }, 2000);
}

// ── generateShareCard ────────────────────────────────────────
/**
 * Render a 600×320 PNG share card for the given tree feature.
 * Returns a data-URL string suitable for an <img> src or a
 * download link.
 *
 * NOTE: This function is available for future use.
 *       v1 focuses on link sharing via initShare / shareTree.
 *
 * @param {object} state   - Application state (unused directly).
 * @param {object} feature - GeoJSON feature for the tree.
 * @returns {string} PNG data-URL.
 */
export function generateShareCard(state, feature) {
  const props = feature.properties || {};

  const baumart    = props.baumart_deutsch     || 'Baum';
  const latinName  = props.baumart_lateinisch || '';
  const strasse    = props.ba_strasse         || '';
  const quartier   = props.ba_kreis           || '';
  const alter      = props.ba_baumalter != null ? `${props.ba_baumalter} Jahre alt` : 'Alter unbekannt';
  const protected_ = !!props._protected;

  const accentColor  = getSpeciesColor(latinName) || '#4CAF50';

  const W = 600;
  const H = 320;

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ── White background ───────────────────────────────────────
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, W, H);

  // ── Coloured accent bar (top) ──────────────────────────────
  ctx.fillStyle = accentColor;
  ctx.fillRect(0, 0, W, 6);

  // ── Species colour dot ─────────────────────────────────────
  ctx.beginPath();
  ctx.arc(40, 60, 10, 0, Math.PI * 2);
  ctx.fillStyle = accentColor;
  ctx.fill();

  // ── Species name (German, bold 24 px) ──────────────────────
  ctx.fillStyle   = '#1a1a1a';
  ctx.font        = 'bold 24px Inter, system-ui, sans-serif';
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(baumart, 62, 68);

  // ── Latin name (italic 16 px) ──────────────────────────────
  ctx.fillStyle = '#666666';
  ctx.font      = 'italic 16px Inter, system-ui, sans-serif';
  ctx.fillText(latinName, 62, 92);

  // ── Age (18 px) ────────────────────────────────────────────
  ctx.fillStyle = '#1a1a1a';
  ctx.font      = '18px Inter, system-ui, sans-serif';
  ctx.fillText(alter, 40, 140);

  // ── Street (16 px) ────────────────────────────────────────
  ctx.fillStyle = '#444444';
  ctx.font      = '16px Inter, system-ui, sans-serif';
  ctx.fillText(strasse, 40, 170);

  // ── District (16 px) ──────────────────────────────────────
  ctx.fillText(quartier, 40, 194);

  // ── Protection badge (green pill) ─────────────────────────
  if (protected_) {
    const badgeText  = 'Geschützt';
    const badgePad   = { x: 12, y: 6 };
    ctx.font         = 'bold 13px Inter, system-ui, sans-serif';
    const textW      = ctx.measureText(badgeText).width;
    const badgeW     = textW + badgePad.x * 2;
    const badgeH     = 24;
    const badgeX     = 40;
    const badgeY     = 220;
    const radius     = badgeH / 2;

    // Pill background
    ctx.beginPath();
    ctx.moveTo(badgeX + radius, badgeY);
    ctx.lineTo(badgeX + badgeW - radius, badgeY);
    ctx.arcTo(badgeX + badgeW, badgeY, badgeX + badgeW, badgeY + badgeH, radius);
    ctx.lineTo(badgeX + badgeW, badgeY + radius);
    ctx.arcTo(badgeX + badgeW, badgeY + badgeH, badgeX, badgeY + badgeH, radius);
    ctx.lineTo(badgeX + radius, badgeY + badgeH);
    ctx.arcTo(badgeX, badgeY + badgeH, badgeX, badgeY, radius);
    ctx.lineTo(badgeX, badgeY + radius);
    ctx.arcTo(badgeX, badgeY, badgeX + badgeW, badgeY, radius);
    ctx.closePath();
    ctx.fillStyle = '#4CAF50';
    ctx.fill();

    // Pill label
    ctx.fillStyle    = '#ffffff';
    ctx.textBaseline = 'middle';
    ctx.fillText(badgeText, badgeX + badgePad.x, badgeY + badgeH / 2);
    ctx.textBaseline = 'alphabetic';
  }

  // ── Branding – bottom left ─────────────────────────────────
  ctx.fillStyle = '#999999';
  ctx.font      = '13px Inter, system-ui, sans-serif';
  ctx.fillText('meinbaumbasel.ch', 40, H - 20);

  // ── Branding – bottom right ────────────────────────────────
  ctx.fillStyle = '#1a1a1a';
  ctx.font      = 'bold 13px Inter, system-ui, sans-serif';
  const brandRight = 'Mein Baum Basel';
  const brandW     = ctx.measureText(brandRight).width;
  ctx.fillText(brandRight, W - 40 - brandW, H - 20);

  return canvas.toDataURL('image/png');
}
