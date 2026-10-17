// src/app/core/guards/subdomain.guard.ts
import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { TenantContextService } from '../services/tenant-context';

/**
 * Matches ONLY when visiting a tenant store subdomain (e.g., store.yetufy.com or store.localhost:4200)
 */
export const isTenantDomainGuard: CanMatchFn = () => {
  const tenantContext = inject(TenantContextService);
  const subdomain = tenantContext.detectSubdomain();
  
  if (subdomain) {
    // Automatically set the active tenant in context for HTTP interceptors and components
    tenantContext.setTenant(subdomain);
    return true;
  }
  
  return false;
};

/**
 * Matches ONLY when visiting the central platform (e.g., yetufy.com, www.yetufy.com, or localhost:4200)
 */
export const isCentralDomainGuard: CanMatchFn = () => {
  const tenantContext = inject(TenantContextService);
  return !tenantContext.detectSubdomain();
};
