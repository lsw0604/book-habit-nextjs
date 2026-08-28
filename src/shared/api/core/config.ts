import type { AxiosRequestConfig } from "axios";

const REQUEST_TIMEOUT_MS = 10_000;

export const axiosConfig: AxiosRequestConfig = {
  baseURL: process.env.NEXT_PUBLIC_SERVER,
  timeout: REQUEST_TIMEOUT_MS,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
    Accept: "application/json",
  },
  withCredentials: true,
};
