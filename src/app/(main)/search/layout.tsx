import type { ReactNode } from "react";

import { SearchListDetailView } from "@/views/search-list-detail-view";

export default function SearchLayout({ children }: { children: ReactNode }) {
  return <SearchListDetailView>{children}</SearchListDetailView>;
}
