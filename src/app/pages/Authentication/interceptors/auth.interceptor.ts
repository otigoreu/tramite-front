import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, tap } from 'rxjs';
import { AuthService } from 'src/app/service/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req);
};

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const excludedUrls = ['/reset-password', '/auth/login', '/auth/register'];

  if (excludedUrls.some((url) => req.url.includes(url))) {
    // No inyectar token para rutas públicas
    return next(req);
  }

  const token = localStorage.getItem('token');
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(cloned);
  }

  return next(req);
};

// export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
//   console.log('jwtInterceptor');
//   const token = localStorage.getItem('token');
//   let clonedRequest = req;
//   if (token) {
//     clonedRequest = req.clone({
//       headers: req.headers.set('Authorization', `Bearer ${token}`),
//     });
//   }
//   return next(clonedRequest);
// };

export const loadingScreenInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return next(req).pipe(
    tap(() => {
      //show loading screen
      authService.loading.set(true);
    }),
    finalize(() => {
      //hide loading screen
      authService.loading.set(false);
    })
  );
};
