import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TenantContextService } from '../../../core/services/tenant-context';
import { ProductService } from '../../../components/public-tenant/service/product';
import { Product } from '../../../components/public-tenant/models/product';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideStore,
  lucideShoppingBag,
  lucideSparkles,
  lucideTag,
  lucideArrowRight,
  lucideStar
} from '@ng-icons/lucide';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';

@Component({
  imports: [CommonModule, NgIcon, HlmButtonImports, HlmSkeletonImports],
  providers: [
    provideIcons({
      lucideStore,
      lucideShoppingBag,
      lucideSparkles,
      lucideTag,
      lucideArrowRight,
      lucideStar
    })
  ],
  selector: 'app-home-tenant',
  styleUrl: './home-tenant.css',
  templateUrl: './home-tenant.html',
})
export class HomeTenant implements OnInit {
  protected tenantContext = inject(TenantContextService);
  private productService = inject(ProductService);

  protected products = signal<Product[]>([]);
  protected isLoading = signal<boolean>(true);
  protected storeSlug = this.tenantContext.activeTenantSlug;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading.set(true);
    this.productService.getProductsList().subscribe({
      next: (items) => {
        this.products.set(items);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erreur chargement produits du tenant:', err);
        this.isLoading.set(false);
      }
    });
  }
}
