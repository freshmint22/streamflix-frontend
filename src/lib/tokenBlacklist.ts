const blacklist = new Set<string>();

export function addTokenToBlacklist(token: string) {
  if (!token) return;
  blacklist.add(token);
}

export function isTokenBlacklisted(token: string) {
  return blacklist.has(token);
}

export default { addTokenToBlacklist, isTokenBlacklisted };
