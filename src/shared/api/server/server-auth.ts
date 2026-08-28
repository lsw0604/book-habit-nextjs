import { cookies } from "next/headers";

import type { RequestOptions } from "../types";

/**
 * 서버 컴포넌트에서 인증이 필요한 API를 호출할 때 쓴다.
 *
 * `axiosConfig`의 `withCredentials: true`는 "쿠키를 실어 보내라"고 브라우저에
 * 지시하는 값이라 서버(Node.js)에서는 아무 효과가 없다. 쿠키를 보관하고
 * 자동으로 붙여주는 주체가 브라우저이기 때문이다. 게다가 인증 인터셉터는
 * 클라이언트에서 바인딩하므로 서버에서는 붙지 않는다.
 *
 * 따라서 서버에서는 들어온 요청의 쿠키를 직접 헤더로 전달해야 한다.
 *
 * Next 16에서 `cookies()`는 `Promise`를 반환하므로 반드시 `await` 해야 한다.
 * `Promise`도 `Object.prototype.toString()`을 상속해서, await 없이 쓰면
 * 타입 체크는 통과하고 헤더에 `"[object Promise]"`가 들어간다.
 *
 * ⚠️ 이 모듈은 `shared/api` 배럴에 넣지 않는다.
 *    클라이언트 컴포넌트가 `next/headers`를 끌어오면 빌드가 깨진다.
 *    `@/shared/api/server`에서 직접 import한다.
 */
export const withServerAuth = async (
  options?: RequestOptions,
): Promise<RequestOptions> => ({
  ...options,
  headers: {
    ...options?.headers,
    Cookie: (await cookies()).toString(),
  },
});
