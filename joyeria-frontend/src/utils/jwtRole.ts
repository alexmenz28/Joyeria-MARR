/** .NET ClaimTypes.Role serializes to this URI in JWT payloads by default */
const DOTNET_ROLE_CLAIM =
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

/**
 * Reads role from a decoded JWT payload (supports short `role` and .NET claim URI).
 */
export function getJwtRole(decoded: Record<string, unknown>): string | undefined {
  const r =
    decoded.role ??
    decoded.Role ??
    decoded[DOTNET_ROLE_CLAIM];
  return typeof r === 'string' ? r : undefined;
}

export function isAdminOrEmployee(role: string | undefined): boolean {
  return role === 'Admin' || role === 'Employee';
}

export function isAdmin(role: string | undefined): boolean {
  return role === 'Admin';
}

export function isCustomer(role: string | undefined): boolean {
  return role === 'Customer';
}
