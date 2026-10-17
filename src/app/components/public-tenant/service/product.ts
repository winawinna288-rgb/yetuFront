import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Product, ProductsResponse } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private url = environment.apiUrl; // http://localhost:8000/api/v1

  // Calls GET /api/v1/product -> Scoped by Laravel using the X-Tenant header from tenantInterceptor
  getProducts(): Observable<ProductsResponse> {
    return this.http.get<ProductsResponse>(`${this.url}/product`);
  }

  // Renvoie directement la liste des produits
  getProductsList(): Observable<Product[]> {
    return this.getProducts().pipe(
      map(res => res.products || [])
    );
  }

  getProductBySlug(slug: string): Observable<{ product: Product; relatedProducts?: Product[] }> {
    return this.http.get<{ product: Product; relatedProducts?: Product[] }>(`${this.url}/product/${slug}`);
  }
}
