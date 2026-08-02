// lib/api-client-react/src/custom-fetch.ts

export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  // Read Vite env variable at build time, falling back to empty string for relative dev URLs
  const baseUrl = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
  const cleanUrl = url.startsWith("/") ? url : `/${url}`;
  const fullUrl = baseUrl ? `${baseUrl}${cleanUrl}` : cleanUrl;

  const response = await fetch(fullUrl, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`,
    );
  }

  return response.json();
};
