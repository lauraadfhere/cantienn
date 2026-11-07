import ContentManager from "../_components/ContentManager";

export default function AdminArticles() {
  return <ContentManager title="Articles" endpoint="/api/admin/articles" />;
}
