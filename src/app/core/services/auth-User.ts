import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { environment } from '../../../environments/environment';
import { Tenant } from '../models/tenant';



import { Observable, tap } from 'rxjs';

export interface AuthResponse {
    user: any;
    access_token: string;
    token_type: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthUsers {
    private http = inject(HttpClient);
    private url = environment.apiUrl;

    // Signals pour l'état de la session
    public currentUser = signal<User | null>(null);
    public isAuthenticated = signal<boolean>(!!localStorage.getItem('auth_token'));

    constructor() {
        // Restaurer l'utilisateur sauvegardé au rechargement de la page
        const savedUser = localStorage.getItem('user_data');
        if (savedUser) {
            try {
                this.currentUser.set(JSON.parse(savedUser));
            } catch (e) {
                this.logout();
            }
        }
    }

   createUser(user: User): Observable<AuthResponse> {
     const payload = {
        name:`${user.first_name} ${user.last_name}`.trim(),
        email:user.email,
        password:user.password,
        password_confirmation: user.confirmPassword
     };
     return this.http.post<AuthResponse>(`${this.url}/register`, payload).pipe(
       tap((response) => {
         if (response?.access_token) {
           localStorage.setItem('auth_token', response.access_token);
           localStorage.setItem('user_data', JSON.stringify(response.user));
           this.currentUser.set(response.user);
           this.isAuthenticated.set(true);
         }
       })
     );
   }

   login(credentials: { email: string; password: string }): Observable<AuthResponse> {
     return this.http.post<AuthResponse>(`${this.url}/login`, credentials).pipe(
       tap((response) => {
         if (response?.access_token) {
           localStorage.setItem('auth_token', response.access_token);
           localStorage.setItem('user_data', JSON.stringify(response.user));
           this.currentUser.set(response.user);
           this.isAuthenticated.set(true);
         }
       })
     );
   }

   fetchCurrentUser(): Observable<User> {
     return this.http.get<User>(`${this.url}/user`).pipe(
       tap((user) => {
         this.currentUser.set(user);
         localStorage.setItem('user_data', JSON.stringify(user));
       })
     );
   }

   createTenant(tenant: Tenant): Observable<Tenant> {
     return this.http.post<Tenant>(this.url, tenant);
   }

    logout(): void {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        this.currentUser.set(null);
        this.isAuthenticated.set(false);
    }
}

