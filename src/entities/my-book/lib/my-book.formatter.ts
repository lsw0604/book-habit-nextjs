import { formatDate } from "@/shared/lib";

/** 날짜가 없는 항목이 많다(시작만 하고 안 끝낸 책 등). 그때는 호출부가 줄을 뺀다. */
export const formatMyBookDate = (value: string | null): string | null =>
  value ? formatDate(value, "medium") : null;

/** `234 / 380쪽`처럼 진행을 절대값으로 보여준다. 총 페이지를 모르면 현재 값만. */
export const formatPageProgress = (
  currentPage: number,
  totalPage: number | null,
): string =>
  totalPage ? `${currentPage} / ${totalPage}쪽` : `${currentPage}쪽`;
