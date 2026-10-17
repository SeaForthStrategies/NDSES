// Pin positions (percent of width/height) on the Walworth County detail map,
// public/nds-assets/service-area-detail.svg (800x486), projected from each
// place's real coordinates by scripts/build-service-area-map.cjs. Places not
// listed here fall back to the area's own coordinates from the CMS.
export const DETAIL_MAP = { width: 800, height: 486 };

export const MAP_POSITIONS: Record<string, { x: number; y: number }> = {
  "City of Delavan": { x: 31.1, y: 28.16 },
  "Town of Delavan": { x: 44.53, y: 47.15 },
  "Town of Walworth": { x: 39.47, y: 71.14 },
  "Town of Darien": { x: 19.05, y: 41.68 },
  "Town of Sharon": { x: 15.12, y: 83.35 }
};
