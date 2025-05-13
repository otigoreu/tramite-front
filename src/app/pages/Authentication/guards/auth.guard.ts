import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  let continueNavigation = false;
  const token = localStorage.getItem('token');
  if (token) continueNavigation = true;
  else {
    const router = inject(Router);
    router.navigate(['/login']);
  }

  return continueNavigation;
};
