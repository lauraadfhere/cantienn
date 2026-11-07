import ContentManager from "../_components/ContentManager";

export default function AdminBooks() {
  return <ContentManager title="Books" endpoint="/api/admin/content/books" />;
}
