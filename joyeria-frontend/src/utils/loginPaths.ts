/** Paths that must not be used as post-login redirect for customers. */
export function isStaffOnlyPath(path: string): boolean {
  return path === '/dashboard' || path.startsWith('/admin');
}
