import type { Metadata } from "next";

import { BookDetailView } from "@/views/book-detail-view";

export const metadata: Metadata = {
  title: "책 상세 · book-habit",
};

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ isbn: string }>;
}) {
  const { isbn } = await params;

  return <BookDetailView isbn={isbn} />;
}
