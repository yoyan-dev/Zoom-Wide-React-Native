import type { ApiResponse } from "@/types/h3Response";

const DEFAULT_API_BASE_URL = "https://zoom-wide-backend-nitro.vercel.app/api";

const rawBaseUrl =
  process.env.EXPO_PUBLIC_API_URL ??
  process.env.VITE_API_URL ??
  DEFAULT_API_BASE_URL;

export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export class ApiClientError extends Error {
  statusCode?: number;
  payload?: ApiResponse;

  constructor(message: string, statusCode?: number, payload?: ApiResponse) {
    super(message);
    this.name = "ApiClientError";
    this.statusCode = statusCode;
    this.payload = payload;
  }
}

type RequestOptions = Omit<RequestInit, "body"> & {
  accessToken?: string | null;
  body?: unknown;
};

function buildHeaders(options: RequestOptions) {
  const headers = new Headers(options.headers);

  if (options.body !== undefined && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (options.accessToken) {
    headers.set("Authorization", `Bearer ${options.accessToken}`);
  }

  return headers;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    body:
      options.body === undefined ? undefined : JSON.stringify(options.body),
    headers: buildHeaders(options),
  });

  const payload = (await response.json().catch(() => null)) as
    | ApiResponse<T>
    | null;

  if (!response.ok || payload?.status === "error") {
    const message =
      payload?.status === "error"
        ? payload.message || payload.error?.message
        : "The server could not complete the request.";

    throw new ApiClientError(
      message,
      payload?.statusCode ?? response.status,
      payload ?? undefined,
    );
  }

  if (payload && "data" in payload) {
    return payload.data as T;
  }

  return payload as T;
}
