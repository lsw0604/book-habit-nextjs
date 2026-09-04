import type { Metadata } from "next";

import { SearchNoSelectionView } from "@/views/search-no-selection-view";

export const metadata: Metadata = {
  title: "책 검색",
};

export default function SearchPage() {
  return <SearchNoSelectionView />;
}
