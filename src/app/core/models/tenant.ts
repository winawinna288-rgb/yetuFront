export interface TenantPivot {
  id?: string;
  user_id: string;
  tenant_id: string;
  is_owner: boolean;
  created_at?: string;
}

export interface Tenant {
  id: string;
  raison_sociale: string;
  slug: string;
  email?: string;
  telephone?: string;
  statut: 'actif' | 'inactif' | 'en_attente' | 'suspendu';
  is_active: boolean;
  type_entite?: string;
  url?: string;
  admin_url?: string;
  pivot?: TenantPivot;
}
