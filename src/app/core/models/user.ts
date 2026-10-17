import { Tenant } from './tenant';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'TENANT_OWNER'
  | 'TENANT_ADMIN'
  | 'STAFF';

export interface User {
    id?: string;
    first_name: string;
    last_name: string;
    name?: string;
    email: string;
    password: string;
    confirmPassword: string;
    tenants?: Tenant[];
}
