import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  console.log('Guard → state.url:', state.url);

  const cleanUrl = state.url.split('?')[0];

  const publicRoutes = [
    '/login',
    '/register',
    '/forgot-password',
    '/reset-password',
    '/change-password',
  ];

  // ✅ Permitir acceso a rutas públicas (aunque tengan query params)
  if (publicRoutes.some((r) => cleanUrl.startsWith(r))) {
    return true;
  }

  // ✅ Permitir acceso si hay token
  if (token) {
    return true;
  }

  // ❌ No hay token y la ruta no es pública → redirigir al login
  router.navigate(['/login']);
  return false;
};

// export const authGuard: CanActivateFn = (route, state) => {
//   let continueNavigation = false;
//   const token = localStorage.getItem('token');
//   if (token) continueNavigation = true;
//   else {
//     const router = inject(Router);
//     router.navigate(['/login']);
//   }

//   return continueNavigation;
// };
