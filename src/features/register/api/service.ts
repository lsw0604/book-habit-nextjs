import { API_ENDPOINTS, authClient } from "@/shared/api";

import type { AccessDTO } from "@/entities/user";

import type { RegisterRequestDTO } from "./register.dto";

export interface RegisterService {
  register: (payload: RegisterRequestDTO) => Promise<AccessDTO>;
}

export const registerService: RegisterService = {
  register: async (payload) => {
    const response = await authClient.post<AccessDTO, RegisterRequestDTO>(
      API_ENDPOINTS.AUTH.SIGNUP,
      payload,
    );
    return response;
  },
};
