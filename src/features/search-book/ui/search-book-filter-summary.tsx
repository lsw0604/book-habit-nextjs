import { Badge } from "@/shared/ui";

import { describeSearchFilters } from "../lib";
import type { SearchBookParams } from "../model";

interface SearchBookFilterSummaryProps {
  params: SearchBookParams;
}

/**
 * Popover를 열지 않아도 지금 걸린 필터를 알 수 있게 하는 요약 줄.
 *
 * 기본값과 다른 필터만 `highlight`로 강조한다. 셋 다 칠하면 DESIGN.md ①의
 * "블루는 인터랙션 하이라이트 전용"이 무너져서, 사용자가 **무엇을 직접 바꿨는지**가
 * 아니라 그냥 배지 세 개로만 읽힌다. 강조도 배경이 아니라 글자·테두리로만 한다 —
 * 이 배지는 클릭할 수 없는 표시 전용이라 블루 배경을 깔면 ⑦의 서피스 규칙에 걸린다.
 *
 * 폼 값이 아니라 URL에서 파싱한 `params`를 받는다 — 실제 검색 결과에 반영된
 * 조건은 URL이고, 폼은 사용자가 만지는 중일 수 있다.
 */
export function SearchBookFilterSummary({
  params,
}: SearchBookFilterSummaryProps) {
  const chips = describeSearchFilters(params);

  return (
    <ul aria-label="적용된 검색 필터" className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li key={chip.key}>
          <Badge variant={chip.isDefault ? "outline" : "highlight"}>
            {/* 배지만 보면 "10개"가 무엇의 10개인지 모른다. 시각적으로는
                라벨만 두고, 항목 이름은 스크린리더에만 읽힌다. */}
            <span className="sr-only">{chip.name}: </span>
            {chip.label}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
