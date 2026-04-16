import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  //console.log('Guard → state.url:', state.url);

 // atrapa la URL sin query params para comparar con rutas públicas
  // const cleanUrl = state.url.split('?')[0].replace('#', '');
  // console.log('ruta', cleanUrl);

  // const publicRoutes = [
  //   '/login',
  //   '/forgot-password',
  //   '/reset-password',

  // ];

  // verifica si la URL de cleanUrl coincide con alguna ruta de publicRoutes
  // ✅ Permitir acceso a rutas públicas (aunque tengan query params)
  // if (publicRoutes.some((r) => cleanUrl.startsWith(r))) {
  //   console.log('cleanUrl', cleanUrl, 'esta dentro del arreglo :', publicRoutes);
  //   return true;
  // }

  // ✅ Permitir acceso si hay token
  if (token) {
    //console.log('Ruta Permitida');
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
