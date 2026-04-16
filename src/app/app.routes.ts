import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { authGuard } from './pages/Authentication/guards/auth.guard';


export const routes: Routes = [
  // 🔓 RUTAS PÚBLICAS primero
  {
    path: 'login',
    loadComponent: () =>import('./pages/Authentication/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'forgot-password',
    loadComponent: () =>import('./pages/Authentication/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
  },
  {
    path: 'reset-password',
    loadComponent: () =>import('./pages/Authentication/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent),
  },
  // 🔒 LUEGO tu layout principal protegido
  {
    path: 'pages',
    canActivate: [authGuard],
    component: FullComponent,
    loadChildren: () =>import('./pages/pages.routes').then((m) => m.PagesRoutes),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

