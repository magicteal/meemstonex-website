// Default content for the homepage "Features" bento grid tiles.
// `key` is the stable category identifier used for routing (/categories/[slug])
// and must not be changed via CMS. `name`, `video`, and `desc` are editable.
export const DEFAULT_FEATURE_TILES = [
  {
    key: "MARBLE TEMPLE",
    name: "MARBLE TEMPLE",
    video: "/videos/C2.mp4",
    desc: "Meemstonex Mandirs sacred spaces sculpted in pure marble, embodying devotion, peace, and eternal grace",
  },
  {
    key: "INLAY WORK",
    name: "INLAY WORK",
    video: "/videos/C5.mp4",
    desc: "Artful stone inlay that blends tradition with precision craftsmanship.",
  },
  {
    key: "FOUNTAINS",
    name: "FOUNTAINS",
    video: "/videos/C4.mp4",
    desc: "Let serenity flow with Meemstonex Fountains, where artistry in stone brings movement, life, and timeless beauty.",
  },
  {
    key: "STONE WALL PANELS",
    name: "STONE WALL PANELS",
    video: "/videos/C6.mp4",
    desc: "Statement wall claddings in marble that elevate interiors with depth and texture.",
  },
  {
    key: "ART / CRAFT / HANDICRAFT",
    name: "ART / CRAFT / HANDICRAFT",
    video: "/videos/C9.mp4",
    desc: "Handcrafted marble artefacts that showcase intricate workmanship.",
  },
  {
    key: "MOSQUE WORKS",
    name: "MOSQUE WORKS",
    video: "/videos/C3.mp4",
    desc: "Sacred mosque elements crafted in premium marble with uncompromising quality.",
  },
  {
    key: "WASH BASIN",
    name: "WASH BASIN",
    video: "/videos/C8.mp4",
    desc: "Sleek and refined basins carved from premium marble for timeless bathrooms.",
  },
  {
    key: "TABLE TOP",
    name: "TABLE TOP",
    video: "/videos/C1.mp4",
    desc: "Where sophistication meets strength — Meemstonex Counters, crafted to define modern elegance in every space",
  },
];

// Merge CMS-saved tile overrides (by key) onto the default tiles.
export function mergeFeatureTiles(savedTiles) {
  if (!Array.isArray(savedTiles) || savedTiles.length === 0) {
    return DEFAULT_FEATURE_TILES;
  }
  return DEFAULT_FEATURE_TILES.map((def) => {
    const saved = savedTiles.find((s) => s && s.key === def.key);
    if (!saved) return def;
    return {
      key: def.key,
      name: saved.name || def.name,
      video: saved.video || def.video,
      desc: saved.desc || def.desc,
    };
  });
}
