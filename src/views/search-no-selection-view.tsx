import { BookOpenIcon } from "lucide-react";

import { EmptyState } from "@/shared/ui";

/**
 * master-detail에서 **아직 책을 고르지 않은** 상태의 detail 패널.
 *
 * "검색 결과가 없음"과는 다른 상황이다 — 결과가 20개 떠 있어도 그중 하나를
 * 선택하기 전까지는 이 화면이다. 결과 0건은 `SearchBookList`가 자체적으로 그린다.
 *
 * lg 미만에서는 목록이 전체 폭을 차지하므로 이 화면이 보이지 않는다.
 */
export function SearchNoSelectionView() {
  return (
    <EmptyState
      icon={BookOpenIcon}
      title="책을 선택해 주세요"
      description="왼쪽 검색 결과에서 책을 고르면 상세 정보가 여기에 표시됩니다."
    />
  );
}
