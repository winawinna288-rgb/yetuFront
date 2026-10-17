import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthUsers } from '../services/auth-User';

/**
 * Intercepteur HTTP pour :
 * 1. Attacher automatiquement le header Authorization: Bearer <token>
 * 2. Définir le header Accept: application/json
 * 3. Intercepter les erreurs 401 (non autorisé / token expiré) et rediriger vers /login
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthUsers);
  const router = inject(Router);
  const token = localStorage.getItem('auth_token');

  let headers: Record<string, string> = {
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const authReq = req.clone({
    setHeaders: headers,
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/login') && !req.url.includes('/register')) {
        authService.logout();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
