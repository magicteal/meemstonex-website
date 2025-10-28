import CategoryClient from "../../../components/CategoryClient";

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  return <CategoryClient slug={slug} />;
}
