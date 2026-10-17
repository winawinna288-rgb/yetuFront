import { Injectable, signal } from '@angular/core';
import { Tenant } from '../models/tenant';

@Injectable({
  providedIn: 'root'
})
export class TenantContextService {
  // Signal contenant le slug du tenant actif
  public activeTenantSlug = signal<string | null>(
    localStorage.getItem('active_tenant_slug')
  );

  // Signal contenant l'objet Tenant complet
  public activeTenant = signal<Tenant | null>(null);

  constructor() {
    const savedTenant = localStorage.getItem('active_tenant_data');
    if (savedTenant) {
      try {
        this.activeTenant.set(JSON.parse(savedTenant));
      } catch (e) {
        localStorage.removeItem('active_tenant_data');
      }
    }
  }

  setTenant(tenantOrSlug: Tenant | string): void {
    if (typeof tenantOrSlug === 'string') {
      localStorage.setItem('active_tenant_slug', tenantOrSlug);
      this.activeTenantSlug.set(tenantOrSlug);
    } else {
      localStorage.setItem('active_tenant_slug', tenantOrSlug.slug);
      localStorage.setItem('active_tenant_data', JSON.stringify(tenantOrSlug));
      this.activeTenantSlug.set(tenantOrSlug.slug);
      this.activeTenant.set(tenantOrSlug);
    }
  }

  clearTenant(): void {
    localStorage.removeItem('active_tenant_slug');
    localStorage.removeItem('active_tenant_data');
    this.activeTenantSlug.set(null);
    this.activeTenant.set(null);
  }

  // Détection automatique du sous-domaine (ex: shop.yetufy.com ou shop.localhost)
  detectSubdomain(): string | null {
    const hostname = window.location.hostname.toLowerCase();

    // Si adresse IP directe (ex: 127.0.0.1 ou 192.168.x.x), domaine central
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return null;
    }

    const parts = hostname.split('.');

    // Développement local : ex: "boutique.localhost"
    if (hostname.includes('localhost')) {
      if (parts.length >= 2 && parts[0] !== 'localhost' && parts[0] !== 'www') {
        return parts[0];
      }
      return null;
    }

    // Production : ex: "boutique.yetufy.com" (parts = ["boutique", "yetufy", "com"])
    if (parts.length >= 3) {
      const subdomain = parts[0];
      const reservedSubdomains = ['www', 'api', 'admin', 'mail', 'app'];
      if (!reservedSubdomains.includes(subdomain)) {
        return subdomain;
      }
    }

    return null;
  }

  // Construit l'URL publique complète pour accéder au sous-domaine d'une boutique
  getTenantUrl(tenantOrSlug: Tenant | string): string {
    const slug = typeof tenantOrSlug === 'string' ? tenantOrSlug : tenantOrSlug.slug;

    if (typeof tenantOrSlug !== 'string' && tenantOrSlug.url) {
      return tenantOrSlug.url;
    }

    const { hostname, protocol, port } = window.location;
    const portSuffix = port ? `:${port}` : '';

    // En développement local (ex: localhost, 127.0.0.1 ou sous-domaine déjà actif)
    if (hostname.includes('localhost') || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
      return `${protocol}//${slug}.localhost${portSuffix}/`;
    }

    // En production : extrait le domaine de base (ex: yetufy.com)
    const parts = hostname.split('.');
    const rootDomain = parts.length >= 3 ? parts.slice(-2).join('.') : hostname;
    return `${protocol}//${slug}.${rootDomain}${portSuffix}/`;
  }
}
