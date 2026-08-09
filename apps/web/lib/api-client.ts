import { env } from "@/config/env";
import axios, { AxiosInstance } from "axios";

const DEFAULT_TIMEOUT = 30000;

export const api: AxiosInstance = axios.create({
  baseURL: `http://localhost:${env.NEXT_PUBLIC_API_PORT}`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: DEFAULT_TIMEOUT,
});
