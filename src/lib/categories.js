// Canonical category list and slug helpers used across the app

export const rawCategories = [
  "TABLE TOP",
  "MARBLE TEMPLE",
  "MOSQUE WORKS",
  "FOUNTAINS",
  "INLAY WORK",
  "STONE WALL PANELS",
  "WASH BASIN",
  "ART / CRAFT / HANDICRAFT",
  "ART / HANDCRAFT",
  "MASJID MIMBER"
];

export function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export const categories = rawCategories.map((name) => ({
  name,
  slug: slugify(name),
}));

export function categoryBySlug(slug) {
  return categories.find((c) => c.slug === slug);
}
