"use client";

import { useEffect } from "react";
import { useIntersectionObserver } from "usehooks-ts";

import { createIntersectionOptions } from "./create-intersection-options";
import type { IntersectionOptions } from "./types";

/**
 * 무한 스크롤 구현을 위한 훅입니다.
 * @function useInfiniteScroll
 * @param {() => void} fetchNextPage - 다음 페이지를 불러오는 함수
 * @param {boolean} hasNextPage - 다음 페이지가 있는지 여부
 * @param {Partial<IntersectionOptions>} [options] - 가시성 감지에 사용할 옵션
 * @returns {(node: Element | null) => void} 참조 설정 함수
 */
export const useInfiniteScroll = (
  fetchNextPage: () => void,
  hasNextPage: boolean,
  options?: Partial<IntersectionOptions>,
) => {
  const { isIntersecting, ref } = useIntersectionObserver(
    createIntersectionOptions({ threshold: 0.5, ...options }),
  );

  useEffect(() => {
    if (isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, fetchNextPage]);

  return ref;
};
