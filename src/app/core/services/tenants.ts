import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Plan, PlansResponse } from '../models/plan';

export interface DomainCheckResponse {
  available: boolean;
  cleaned_slug: string;
  errors?: string[];
  suggestions?: string[];
}

export interface DomainSuggestionsResponse {
  suggestions: {
    slug: string;
    domain: string;
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private http = inject(HttpClient);
  private url = environment.apiUrl;

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('auth_token');
    let headers = new HttpHeaders({
      Accept: 'application/json'
    });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getPlans(): Observable<PlansResponse> {
    return this.http.get<PlansResponse>(`${this.url}/devenir-vendeur/plans`, {
      headers: this.getAuthHeaders()
    });
  }

  checkDomain(slug: string): Observable<DomainCheckResponse> {
    return this.http.post<DomainCheckResponse>(
      `${this.url}/devenir-vendeur/check-domain`,
      { slug },
      { headers: this.getAuthHeaders() }
    );
  }

  suggestDomain(shop_name: string): Observable<DomainSuggestionsResponse> {
    return this.http.post<DomainSuggestionsResponse>(
      `${this.url}/devenir-vendeur/suggest-domain`,
      { shop_name },
      { headers: this.getAuthHeaders() }
    );
  }

  createShop(payload: any): Observable<any> {
    return this.http.post(`${this.url}/devenir-vendeur/store`, payload, {
      headers: this.getAuthHeaders()
    });
  }
}
