// In src/app/core/interceptors/auth.interceptor.ts (or a new tenant.interceptor.ts)
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantContextService } from '../services/tenant-context';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
  const tenantContext = inject(TenantContextService);
  const activeSlug = tenantContext.detectSubdomain() || tenantContext.activeTenantSlug();

  let headers = req.headers.set('Accept', 'application/json');

  // If a tenant is active, inject the X-Tenant header for Laravel
  if (activeSlug) {
    headers = headers.set('X-Tenant', activeSlug);
  }

  return next(req.clone({ headers }));
};
