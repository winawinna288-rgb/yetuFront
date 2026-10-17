import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmSkeletonImports } from '@spartan-ng/helm/skeleton';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  lucideStore,
  lucidePlus,
  lucideArrowRight,
  lucideExternalLink,
  lucideCheckCircle2,
  lucideClock,
  lucideShieldAlert,
  lucideLogOut,
  lucideBuilding2,
  lucideSparkles
} from '@ng-icons/lucide';
import { AuthUsers } from '../../../core/services/auth-User';
import { TenantContextService } from '../../../core/services/tenant-context';
import { Tenant } from '../../../core/models/tenant';

@Component({
  selector: 'app-store-chose',
  imports: [CommonModule, RouterLink, HlmButtonImports, HlmSkeletonImports, NgIcon],
  providers: [
    provideIcons({
      lucideStore,
      lucidePlus,
      lucideArrowRight,
      lucideExternalLink,
      lucideCheckCircle2,
      lucideClock,
      lucideShieldAlert,
      lucideLogOut,
      lucideBuilding2,
      lucideSparkles
    })
  ],
  styleUrl: './store-chose.css',
  templateUrl: './store-chose.html',
})
export class StoreChose implements OnInit {
  protected authUsers = inject(AuthUsers);
  protected tenantContext = inject(TenantContextService);
  private router = inject(Router);

  protected isLoading = signal<boolean>(true);
  protected tenants = signal<Tenant[]>([]);
  protected userName = signal<string>('Vendeur');

  ngOnInit(): void {
    this.loadStores();
  }

  loadStores(): void {
    this.isLoading.set(true);

    // Initial check from signal
    const user = this.authUsers.currentUser();
    if (user?.tenants && user.tenants.length > 0) {
      this.tenants.set(user.tenants);
      this.userName.set(user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || user.email);
      this.isLoading.set(false);
    }

    // Refresh fresh data from backend
    this.authUsers.fetchCurrentUser().subscribe({
      next: (freshUser) => {
        if (freshUser?.tenants) {
          this.tenants.set(freshUser.tenants);
        }
        this.userName.set(freshUser.name || `${freshUser.first_name || ''} ${freshUser.last_name || ''}`.trim() || freshUser.email);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  selectStoreAndManage(tenant: Tenant){
    this.tenantContext.setTenant(tenant);
    this.router.navigate(['/admin']);
  }

  selectStoreAndView(tenant: Tenant){
    this.tenantContext.setTenant(tenant);
    const storeUrl = this.tenantContext.getTenantUrl(tenant);
    window.location.href = storeUrl;
  }

  logout(): void {
    this.authUsers.logout();
    this.tenantContext.clearTenant();
    this.router.navigate(['/login']);
  }
}
