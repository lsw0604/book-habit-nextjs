/**
 * Intersection Observer API에 사용되는 옵션들의 인터페이스입니다.
 */
export interface IntersectionOptions {
  root?: Element | Document | null;
  rootMargin?: string;
  threshold?: number;
}
