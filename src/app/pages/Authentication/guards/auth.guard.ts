import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');


  // ✅ Permitir acceso si hay token
  if (token) {
    //console.log('Ruta Permitida');
    return true;
  }
  // ❌ No hay token y la ruta no es pública → redirigir al login
  router.navigate(['/login']);
  return false;
};


