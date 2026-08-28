import { API_ENDPOINTS, apiClient, type RequestOptions } from "@/shared/api";

import type { AccessDTO } from "./user.dto";

export interface UserService {
  me: (options?: RequestOptions) => Promise<AccessDTO>;
}

export const userService: UserService = {
  /**
   * 세션이 있다고 전제하는 요청이라 `apiClient`를 쓴다.
   * 401이면 인터셉터가 토큰을 갱신하고 한 번 재시도한다.
   *
   * 서버 컴포넌트에서 호출할 때는 `withServerAuth()`로 쿠키를 실어 보내야 한다.
   */
  me: (options) => apiClient.get<AccessDTO>(API_ENDPOINTS.AUTH.ME, options),
};
