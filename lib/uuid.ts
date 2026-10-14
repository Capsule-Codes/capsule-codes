const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** True for a canonical UUID; route params that are not UUIDs can 404 without a DB round trip. */
export function isUuid(value: string): boolean {
  return UUID_PATTERN.test(value);
}
