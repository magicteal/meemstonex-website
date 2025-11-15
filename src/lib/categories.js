// Canonical category list and slug helpers used across the app

export const rawCategories = [
  "Marble Temple",
  "Marble Masjid Work",
  "Stone Fountain",
  "Inlay Work",
  "Wall Panels",
  "Moral",
  "Marble Wash Basin",
  "Table Top",
  "Handicrafts Products",
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
