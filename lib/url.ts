/**
 * URL utilities for reading and writing search parameters
 * Used for managing filters and selection state in the URL
 */

/**
 * Read a string parameter from URL search params
 */
export function getStringParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue?: string
): string | undefined {
  const value = searchParams.get(key);
  return value !== null ? value : defaultValue;
}

/**
 * Read a boolean parameter from URL search params
 */
export function getBooleanParam(
  searchParams: URLSearchParams,
  key: string,
  defaultValue = false
): boolean {
  const value = searchParams.get(key);
  if (value === null) return defaultValue;
  return value === "true" || value === "1";
}

/**
 * Build a new URL search string with updated parameters
 */
export function buildSearchString(
  currentParams: URLSearchParams,
  updates: Record<string, string | boolean | null | undefined>
): string {
  const newParams = new URLSearchParams(currentParams);

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === "") {
      newParams.delete(key);
    } else {
      newParams.set(key, String(value));
    }
  });

  const search = newParams.toString();
  return search ? `?${search}` : "";
}
