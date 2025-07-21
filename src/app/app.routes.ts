import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { PersonaComponent } from './pages/persona/persona.component';
import { authGuard } from './pages/Authentication/guards/auth.guard';
import { TipoDocumentoComponent } from './pages/tipo-documento/tipo-documento.component';
import { AplicacionComponent } from './pages/aplicacion/aplicacion.component';
import { SedeComponent } from './pages/sede/sede.component';
import { MenuComponent } from './pages/menu/menu.component';
import { RolComponent } from './pages/rol/rol.component';

export const routes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      {
        path: '',
        //redirectTo: '/dashboards/dashboard1',
        redirectTo: '/login',
        pathMatch: 'full',
      },

      {
        path: 'pages/persona',
        canActivate: [authGuard],
        component: PersonaComponent,
        data: {
          title: 'Personas',
          urls: [
           //{ title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Personas' },
          ],
        },
      },
      {
        path: 'pages/tipo-documento',
       canActivate: [authGuard],
        component: TipoDocumentoComponent,
        data: {
          title: 'Tipo Documento',
          urls: [
           //{ title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Tipo Documento' },
          ],
        },
      },
      {
        path: 'pages/aplicacion',
       canActivate: [authGuard],
        component: AplicacionComponent,
        data: {
          title: 'Aplicaciones',
          urls: [
           // { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Aplicaicon' },
          ],
        },
      },
      {
        path: 'pages/unidadOrganica',
       canActivate: [authGuard],
        component: SedeComponent,
        data: {
          title: 'Unidad Organica',
          urls: [
           //{ title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sedes' },
          ],
        },
      },
      {
        path: 'pages/menu',
       canActivate: [authGuard],
        component: MenuComponent,
        data: {
          title: 'Menu',
          urls: [
           // { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Menus' },
          ],
        },
      },
      {
        path: 'pages/rol',
       canActivate: [authGuard],
        component: RolComponent,
        data: {
          title: 'Rol',
          urls: [
           // { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Rol' },
          ],
        },
      },
      {
        path: 'starter',
        loadChildren: () =>
          import('./pages/pages.routes').then((m) => m.PagesRoutes),
      },



    ],
  },

  {
    path: 'login',
    pathMatch: 'full',
    loadComponent: () =>
      import('../app/pages/Authentication/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'register',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/Authentication/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'forgot-password',
    pathMatch: 'full',
    loadComponent: () =>
      import('../app/pages/Authentication/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: 'reset-password',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/Authentication/reset-password/reset-password.component').then(
        (m) => m.ResetPasswordComponent
      ),
  },
  {
    path: 'change-password',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/Authentication/change-Password/change-Password.component').then(
        (m) => m.ChangePasswordComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
