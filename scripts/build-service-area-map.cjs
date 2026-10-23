// Builds the service-area map: projects county outlines from us-atlas
// (US Census cartographic boundaries) and computes marker positions.
const path = require("path");
const fs = require("fs");
// Run from a folder with us-atlas@3.0.1 and topojson-client@3.1.0 installed:
//   NODE_PATH=<that folder>/node_modules node scripts/build-service-area-map.cjs
const deps = process.env.NODE_PATH || path.join(__dirname, "deps/node_modules");
const topo = require(path.join(deps, "us-atlas/counties-10m.json"));
const { feature, mesh } = require(path.join(deps, "topojson-client"));

const SERVICE = { "55127": "Walworth", "55105": "Rock", "55055": "Jefferson", "55133": "Waukesha", "55059": "Kenosha" };
const CONTEXT = ["55101", "55079", "55025", "55045", "55027", "55131", "17007", "17111", "17097", "17201", "17177", "55089", "55117", "55065"];
const counties = feature(topo, topo.objects.counties).features;
const pick = (ids) => counties.filter((f) => ids.includes(f.id));
const service = pick(Object.keys(SERVICE));
const context = pick(CONTEXT);

// Frame: the service counties' bounds plus a margin.
const coords = [];
const walk = (c) => (typeof c[0] === "number" ? coords.push(c) : c.forEach(walk));
service.forEach((f) => walk(f.geometry.coordinates));
const lons = coords.map((c) => c[0]), lats = coords.map((c) => c[1]);
const pad = 0.08;
const minLon = Math.min(...lons) - pad, maxLon = Math.max(...lons) + pad;
const minLat = Math.min(...lats) - pad, maxLat = Math.max(...lats) + pad;
const k = Math.cos(((minLat + maxLat) / 2) * Math.PI / 180);
const W = 800;
const H = Math.round(W * (maxLat - minLat) / ((maxLon - minLon) * k));
const px = (lon) => ((lon - minLon) * k) / ((maxLon - minLon) * k) * W;
const py = (lat) => ((maxLat - lat) / (maxLat - minLat)) * H;
const pathOf = (geom) => {
  const rings = geom.type === "Polygon" ? [geom.coordinates] : geom.coordinates;
  return rings.map((poly) => poly.map((ring) => "M" + ring.map(([lo, la]) => `${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join("L") + "Z").join("")).join("");
};
const lineOf = (geom) => geom.coordinates.map((line) => "M" + line.map(([lo, la]) => `${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join("L")).join("");

// Visual centroid (mean of outline points) for county labels and markers.
const centroid = (f) => {
  const pts = []; const w = (c) => (typeof c[0] === "number" ? pts.push(c) : c.forEach(w)); w(f.geometry.coordinates);
  return [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
};

const stateLine = mesh(topo, topo.objects.states, (a, b) => a !== b && [a.id, b.id].sort().join() === "17,55");

const places = {
  "City of Delavan": [-88.6437, 42.6331],
  "Town of Delavan": [-88.572, 42.588],
  "Town of Walworth": [-88.599, 42.531],
  "Town of Darien": [-88.708, 42.601],
  "Town of Sharon": [-88.729, 42.502]
};
const positions = {};
for (const [name, [lo, la]] of Object.entries(places)) positions[name] = { x: +(px(lo) / W * 100).toFixed(2), y: +(py(la) / H * 100).toFixed(2) };
const countyLabels = service.map((f) => {
  const [lo, la] = centroid(f);
  const name = SERVICE[f.id] + " County";
  positions[name] = { x: +(px(lo) / W * 100).toFixed(2), y: +(py(la) / H * 100).toFixed(2) };
  return { name, x: px(lo), y: py(la), id: f.id };
});

// Residential communities cluster in southwestern Walworth County; a soft
// outline marks that area on the map, and numbered pins (HTML overlay)
// sit on each community.
const placePts = Object.values(places).map(([lo, la]) => [px(lo), py(la)]);
const cx = (Math.min(...placePts.map((p) => p[0])) + Math.max(...placePts.map((p) => p[0]))) / 2;
const cy = (Math.min(...placePts.map((p) => p[1])) + Math.max(...placePts.map((p) => p[1]))) / 2;
const rx = (Math.max(...placePts.map((p) => p[0])) - Math.min(...placePts.map((p) => p[0]))) / 2 + 30;
const ry = (Math.max(...placePts.map((p) => p[1])) - Math.min(...placePts.map((p) => p[1]))) / 2 + 30;
const label = (txt, x, y, size, extra = "") => `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" font-size="${size}" ${extra}>${txt}</text>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Map of the NDS service area: Walworth, Rock, Jefferson, Waukesha, and Kenosha counties in southern Wisconsin, with the residential service area in southwestern Walworth County">
<rect width="${W}" height="${H}" fill="#dce8ee"/>
<g fill="#f2f4f0" stroke="#dde3da" stroke-width="1">${context.map((f) => `<path d="${pathOf(f.geometry)}"/>`).join("")}</g>
<g stroke="#ffffff" stroke-width="2.5" stroke-linejoin="round">${service.map((f) => `<path fill="${f.id === "55127" ? "#c9e2cf" : "#e2eee1"}" d="${pathOf(f.geometry)}"/>`).join("")}</g>
<path d="${lineOf(stateLine)}" fill="none" stroke="#a3afa6" stroke-width="1.2" stroke-dasharray="5 5"/>
<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${ry.toFixed(1)}" fill="#1d6b3e" fill-opacity="0.08" stroke="#1d6b3e" stroke-opacity="0.55" stroke-width="1.5" stroke-dasharray="4 4"/>
<g font-family="Public Sans, Arial, sans-serif" font-weight="600" fill="#24382c" text-anchor="middle" paint-order="stroke" stroke="#ffffff" stroke-width="4" stroke-linejoin="round">${countyLabels.map((c) => label(c.name, c.x, c.id === "55127" ? c.y - 58 : c.y + 5, 15)).join("")}</g>
<g font-family="Public Sans, Arial, sans-serif" font-weight="600" fill="#6b7a70" letter-spacing="0.04em">
${label("Wisconsin", W - 16, py(42.4925) - 8, 12, 'text-anchor="end"')}
${label("Illinois", W - 16, py(42.4925) + 18, 12, 'text-anchor="end"')}
<text transform="translate(${W - 14} ${(H * 0.3).toFixed(1)}) rotate(90)" fill="#4f7486" text-anchor="middle" font-size="12" font-style="italic">Lake Michigan</text>
</g>
</svg>`;

fs.writeFileSync(path.join(__dirname, "service-area-map.svg"), svg);
fs.writeFileSync(path.join(__dirname, "positions.json"), JSON.stringify({ width: W, height: H, positions }, null, 2));
console.log("size", W, "x", H, "svg bytes", svg.length);
console.log(JSON.stringify(positions));
