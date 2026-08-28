/**
 * `shared/api` 공개 API.
 *
 * `server/`는 여기 포함하지 않는다 — `next/headers`를 끌어오면
 * 클라이언트 컴포넌트 빌드가 깨진다. 서버 전용 헬퍼는
 * `@/shared/api/server`에서 직접 import한다.
 */
export * from "./core";
export * from "./constants";
export * from "./types";
export * from "./interceptors";
