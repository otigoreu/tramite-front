import { Routes } from '@angular/router';
import { EntidadComponent } from './entidad/entidad.component';
import { AplicacionComponent } from './aplicacion/aplicacion.component';

import { UserComponent } from './user/user.component';
import { UnidadorganicaUserComponent } from './user/unidadorganica-user/unidadorganica-user.component';
import { UnidadorganicaComponent } from './unidadorganica/unidadorganica.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        children: [
          {
            path: '',
            component: UserComponent, // página principal de usuario
            data: {
              title: 'Usuario',
              urls: [
                { title: 'Dashboard', url: '/dashboards/dashboard1' },
                { title: 'Usuario' },
              ],
            },
          },
          {
            path: 'unidadorganica-user/:userId',
            component: UnidadorganicaUserComponent, // página completa
            data: {
              title: 'Unidad Orgánica (User)',
              urls: [
                { title: 'Dashboard', url: '/dashboards/dashboard1' },
                { title: 'Usuario', url: '/pages/user' },
                { title: 'Unidad Orgánica (User)' },
              ],
            },
          },
        ],
      },
      {
        path: 'entidad',
        component: EntidadComponent,
      },
      {
        path: 'aplicacion',
        component: AplicacionComponent,
      },
      {
        path: 'unidadOrganica',
        component: UnidadorganicaComponent,
      },
    ],
  },
];
