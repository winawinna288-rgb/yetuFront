export interface Store {
  id: string;
  tenantId: string;
  name: string;
  slug: string;
  description?: string;
  logoUrl?: string;
  currency: string;
  country: string;
  status: 'active' | 'inactive';
}