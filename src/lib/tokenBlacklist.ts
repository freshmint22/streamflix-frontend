/**
 * In-memory token blacklist used for simple JWT revocation (logout).
 * NOTE: ephemeral — use Redis or a persistent store for production.
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
 * @returns boolean
 */
export function isTokenBlacklisted(token: string) {
  return blacklist.has(token);
}

export default { addTokenToBlacklist, isTokenBlacklisted };
