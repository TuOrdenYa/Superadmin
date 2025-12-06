// Currency utilities
export const toCents = (amount: number): number => Math.round(amount * 100);
export const fromCents = (cents: number): number => cents / 100;

export const formatCurrency = (
  cents: number,
  currency: string = 'COP'
): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
  }).format(fromCents(cents));
};

// Date utilities
export const formatDate = (date: Date | string): string => {
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
};

// Multi-tenant utilities
export function getTenantFromParams(
  searchParams: URLSearchParams
): { tenantId: number; locationId: number | null } {
  const tenantId = parseInt(searchParams.get('tenant_id') || '1', 10);
  const locationId = searchParams.get('location_id')
    ? parseInt(searchParams.get('location_id')!, 10)
    : null;

  return { tenantId, locationId };
}
