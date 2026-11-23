/** GitHub Pages serves /portal as /portal/. Those are the same door. */
export function normaliseQuestPath(path: string): string {
  const hashAt = path.indexOf("#");
  const hash = hashAt >= 0 ? path.slice(hashAt) : "";
  const beforeHash = hashAt >= 0 ? path.slice(0, hashAt) : path;
  const queryAt = beforeHash.indexOf("?");
  const pathname = queryAt >= 0 ? beforeHash.slice(0, queryAt) : beforeHash;
  const search = queryAt >= 0 ? beforeHash.slice(queryAt) : "";
  const trimmed = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  return `${trimmed}${search}${hash}`;
}
