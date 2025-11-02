/**
 * In-memory token blacklist used for simple JWT revocation (logout).
 *
 * NOTE: This is ephemeral and will be cleared on process restart. For
 * production deployments with multiple instances use Redis or another
 * persistent store.
 */
const blacklist = new Set<string>();

/**
 * Add a token string to the blacklist.
 * @param token JWT string to blacklist
 */
export function addTokenToBlacklist(token: string) {
  if (!token) return;
  blacklist.add(token);
}

/**
 * Check if a token has been blacklisted.
 * @param token JWT string
 * @returns boolean whether token is blacklisted
 */
export function isTokenBlacklisted(token: string) {
  return blacklist.has(token);
}

export default { addTokenToBlacklist, isTokenBlacklisted };
