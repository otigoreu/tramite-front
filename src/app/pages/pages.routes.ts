import { Routes } from '@angular/router';
import { authGuard } from './Authentication/guards/auth.guard';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',//3
        //canActivate: [authGuard],
        children: [
          {
            path: '',
            loadComponent: () => import('./user/user.component').then((m) => m.UserComponent), // página principal de usuario
            data: {
              title: 'Usuario',
              urls: [
                { title: 'Inicio', url: '/dashboards/dashboard1' },
                { title: 'Usuario' },
              ],
            },
          },
          {
            path: 'unidadorganica-user/:userId',
            //canActivate: [authGuard],
            loadComponent: () => import('./user/unidadorganica-user/unidadorganica-user.component').then((m) => m.UnidadorganicaUserComponent), // página completa
            data: {
              title: 'Unidad Orgánica (Usuario)',
              urls: [
                { title: 'Inicio', url: '/dashboards/dashboard1' },
                { title: 'Usuario', url: '/pages/user' },
                { title: 'Unidad Orgánica (User)' },
              ],
            },
          },
        ],
      },
      {
        path: 'entidad',//8
        //canActivate: [authGuard],
        loadComponent: () => import('./entidad/entidad.component').then((m) => m.EntidadComponent),
        data: {
          title: 'Entidad',
          urls: [
           // { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Entidad' },
          ],
        },
      },
      {
        path: 'aplicacion',//6
        //canActivate: [authGuard],
        loadComponent: () => import('./aplicacion/aplicacion.component').then((m) => m.AplicacionComponent),
        data: {
          title: 'Aplicación',
          urls: [
            //{ title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Aplicación' },
          ],
        },
      },
      {
        path: 'unidadorganica',//7
        //canActivate: [authGuard],
        loadComponent: () => import('./unidadorganica/unidadorganica.component').then((m) => m.UnidadorganicaComponent),
        data: {
          title: 'Unidad Orgánica',
          urls: [
            //{ title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Unidad Orgánica' },
          ],
        },
      },
      {
        path: 'persona',
        //canActivate: [authGuard],
        loadComponent: () => import('./persona/persona.component').then((m) => m.PersonaComponent),
        data: {
          title: 'Personas',
          urls: [
           // { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Personas' },
          ],
        },
      },
       {
        path: 'tipo-documento',//7
        //canActivate: [authGuard],
        loadComponent: () => import('./tipo-documento/tipo-documento.component').then((m) => m.TipoDocumentoComponent),
        data: {
          title: 'Tipo Documento',
          urls: [
           // { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Tipo Documento' },
          ],
        },
      },
      {
        path: 'menu',//7
        //canActivate: [authGuard],
        loadComponent: () => import('./menu/menu.component').then((m) => m.MenuComponent),
        data: {
          title: 'Menú',
          urls: [
           // { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Menú' },
          ],
        },
      },
      {
        path: 'rol',//7
        //canActivate: [authGuard],
        loadComponent: () => import('./rol/rol.component').then((m) => m.RolComponent),
        data: {
          title: 'Roles',
          urls: [
          //  { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Roles' },
          ],
        },
      },

    ],
  },
];
