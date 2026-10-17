import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, CanDeactivateFn, RedirectCommand, Router, RouterStateSnapshot } from '@angular/router';
import { AuthUsers } from '../services/auth-User';
import { Form } from '@angular/forms';

/**
 * Empêche l'accès aux pages réservées aux utilisateurs connectés (/tenant-signup, /admin)
 * Redirige vers /login si non authentifié.
 */
// export const authGuard: CanActivateFn = () => {
//   const authService = inject(AuthUsers);
//   const router = inject(Router);

//   if (authService.isAuthenticated()) {
//     return true;
//   }
//   router.navigate(['/login']);
//   return false;
// };

export const authGuard: CanActivateFn =(
  route:ActivatedRouteSnapshot,
  state:RouterStateSnapshot,
)=>{
  const authService = inject(AuthUsers)
  return authService.isAuthenticated()
}

// export const unsavedChangesGuard: CanDeactivateFn<Form> =(
//   component: Form,
//   currentRoute: ActivatedRouteSnapshot,
//   currentState: RouterStateSnapshot,
//   nextState: RouterStateSnapshot,
// )=>{
//   return component.getControl()
//    ? confirm('You have unsaved changes. Are you sure you want to leave?')
//   : true;

// }

/**
 * Empêche l'accès aux pages de connexion/inscription pour un utilisateur déjà connecté
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthUsers);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/tenant-signup']);
};
