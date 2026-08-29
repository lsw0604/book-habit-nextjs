"use client";

import { useRouter } from "next/navigation";

import { buildKakaoAuthorizeUrl } from "../lib";

export const useKakaoLogin = () => {
  const router = useRouter();

  const pushToKakaoLogin = () => {
    router.push(buildKakaoAuthorizeUrl());
  };

  return { pushToKakaoLogin };
};
