import type { DocumentLink } from "@/types/cms";

export function DownloadList({ documents }: { documents: DocumentLink[] }) {
  if (documents.length === 0) return <p>No downloads are available for this community yet.</p>;
  return (
    <ul>
      {documents.map((document) => (
        <li key={document.href}><a href={document.href}>{document.title}</a></li>
      ))}
    </ul>
  );
}
