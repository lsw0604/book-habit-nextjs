"use client";

import { useMutation } from "@tanstack/react-query";

import { notifyAuthenticated } from "@/entities/user";
import { APIError } from "@/shared/api";

import { RegisterRequestDTO, registerService } from "../api";

type RegisterResponse = Awaited<ReturnType<typeof registerService.register>>;

export const useRegister = () =>
  useMutation<RegisterResponse, APIError, RegisterRequestDTO>({
    mutationFn: async (payload) => await registerService.register(payload),
    onSuccess: notifyAuthenticated,
  });
