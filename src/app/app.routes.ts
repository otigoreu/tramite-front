import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './pages/Authentication/guards/auth.guard';


export const routes: Routes = [
  // 🔓 RUTAS PÚBLICAS primero
  {
    path: 'login',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../app/pages/Authentication/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/Authentication/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'forgot-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        '../app/pages/Authentication/forgot-password/forgot-password.component'
      ).then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './pages/Authentication/reset-password/reset-password.component'
      ).then((m) => m.ResetPasswordComponent),
  },
  {
    path: 'change-password',
    loadComponent: () =>
      import(
        './pages/Authentication/change-Password/change-Password.component'
      ).then((m) => m.ChangePasswordComponent),
  },

  // 🔒 LUEGO tu layout principal protegido
  {
    path: '',
    canActivate: [authGuard],
    component: FullComponent,
    children: [
      {
        path: 'pages',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

