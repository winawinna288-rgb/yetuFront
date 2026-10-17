import { Routes } from '@angular/router';
import { Public } from './layout/public/public/public';
import { Publictenant } from './layout/public-tenant/publictenant/publictenant';
import { HomeTenant } from './pages/public-tenant/home-tenant/home-tenant';
import { HomePage } from './pages/public/home-page/home-page';
import { Admin } from './layout/Admin-tenant/admin/admin';
import {StepperTenant} from './pages/public/stepper-tenant/stepper-tenant';
import { Register } from './pages/public/register/register';
import { Login } from './pages/public/login/login';
import { StoreChoices } from './pages/public/store-choices/store-choices';
import { isTenantDomainGuard, isCentralDomainGuard } from './core/guards/subdomain.guard';

import { authGuard, guestGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    // ==========================================
    // 1. TENANT STORE SUBDOMAIN ROUTES (e.g. mon-shop.yetufy.com or mon-shop.localhost:4200)
    // ==========================================
    {
        path:'',
        canMatch:[isTenantDomainGuard],
        children:[
            {
                path:'',
                component:Publictenant,
                children:[{path:'',component:HomeTenant}]
                
            }
        ]
        
    },
    // ==========================================
    // 2. CENTRAL PLATFORM HOMEPAGE (yetufy.com or localhost:4200)
    // ==========================================
    {
        path: '',
        canMatch: [isCentralDomainGuard], // Only active on yetufy.com / localhost without subdomain
        component: Public,
        children: [
            {
                path: '',
                component: HomePage,
            }
        ]
    },    
    // ==========================================
    // 3. COMMON PUBLIC ROUTES
    // ==========================================
    { path: 'tenant-signup', component: StepperTenant },
    { path: 'login', component: Login },
    { path: 'StoreChoices', component: StoreChoices },
    { path: 'register', component: Register },    
    {
        path:'admin',
        component:Admin,
        canActivate: [authGuard],
    },

     { path: '**', redirectTo: '' }
];
