import { Routes } from '@angular/router';
import { FullComponent } from './layouts/full/full.component';
import { PersonaComponent } from './pages/persona/persona.component';
import { authGuard } from './pages/guards/auth.guard';
import { TipoDocumentoComponent } from './pages/tipo-documento/tipo-documento.component';
import { AplicacionComponent } from './pages/aplicacion/aplicacion.component';
import { SedeComponent } from './pages/sede/sede.component';
import { MenuComponent } from './pages/menu/menu.component';

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
       // canActivate: [authGuard],
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
       // canActivate: [authGuard],
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
        path: 'pages/sede',
       // canActivate: [authGuard],
        component: SedeComponent,
        data: {
          title: 'Sedes',
          urls: [
           //{ title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Sedes' },
          ],
        },
      },
      {
        path: 'pages/menu',
       // canActivate: [authGuard],
        component: MenuComponent,
        data: {
          title: 'Menus',
          urls: [
           // { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Menus' },
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
      import('../app/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },

  {
    path: 'register',
    pathMatch: 'full',
    loadComponent: () =>
      import('../app/pages/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'forgot-password',
    pathMatch: 'full',
    loadComponent: () =>
      import('../app/pages/forgot-password/forgot-password.component').then(
        (m) => m.ForgotPasswordComponent
      ),
  },
  {
    path: '**',
    redirectTo: 'authentication/error',
  },
];
