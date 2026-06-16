// Default content for the homepage "Features" bento grid tiles.
// `key` is the stable category identifier used for routing (/categories/[slug]).
// These act as starter defaults for the original canonical categories;
// any other category (created later via the admin) falls back to
// FALLBACK_TILE_CONTENT below until the CMS overrides it.
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

const DEFAULT_TILE_BY_KEY = new Map(
  DEFAULT_FEATURE_TILES.map((tile) => [tile.key, tile])
);

const LEGACY_FEATURED_NAMES = new Set(DEFAULT_FEATURE_TILES.map((t) => t.key));

// Categories created before the `featured` field existed default to
// featured=true only if they were part of the original homepage bento set.
export function resolveCategoryFeatured(categoryDoc) {
  if (typeof categoryDoc?.featured === "boolean") return categoryDoc.featured;
  return LEGACY_FEATURED_NAMES.has(categoryDoc?.name);
}

// Used for brand-new categories that don't have curated default content yet.
const FALLBACK_TILE_CONTENT = {
  video: "/videos/C1.mp4",
  desc: "",
};

// Build a single tile for a category, applying CMS overrides (by key) on top
// of curated defaults, falling back to generic content for new categories.
export function buildFeatureTile(categoryName, savedTile) {
  const def = DEFAULT_TILE_BY_KEY.get(categoryName);
  return {
    key: categoryName,
    name: savedTile?.name || def?.name || categoryName,
    video: savedTile?.video || def?.video || FALLBACK_TILE_CONTENT.video,
    desc: savedTile?.desc || def?.desc || FALLBACK_TILE_CONTENT.desc,
  };
}

// Build the ordered list of feature tiles for the given featured category
// names, applying any saved per-tile overrides and display order.
export function buildFeatureTiles(categoryNames, savedTiles, savedOrder) {
  const names = Array.isArray(categoryNames) ? categoryNames : [];
  const order = Array.isArray(savedOrder) ? savedOrder : [];
  const ordered = [
    ...order.filter((n) => names.includes(n)),
    ...names.filter((n) => !order.includes(n)),
  ];
  return ordered.map((name) => {
    const saved = Array.isArray(savedTiles)
      ? savedTiles.find((s) => s && s.key === name)
      : null;
    return buildFeatureTile(name, saved);
  });
}
