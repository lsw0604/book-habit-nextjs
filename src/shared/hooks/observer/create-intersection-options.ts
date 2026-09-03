import type { IntersectionOptions } from "./types";

/**
 * Intersection Observer API에 사용되는 기본 옵션을 생성합니다.
 */
export const createIntersectionOptions = (
  customOptions: Partial<IntersectionOptions> = {},
): IntersectionOptions => {
  const defaultOptions: IntersectionOptions = {
    root: null,
    rootMargin: "20px",
    threshold: 1.0,
  };

  return {
    ...defaultOptions,
    ...customOptions,
  };
};
