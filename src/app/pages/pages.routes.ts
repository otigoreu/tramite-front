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
        path: 'user',//3
        children: [
          {
            path: '',
            component: UserComponent, // página principal de usuario
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
            component: UnidadorganicaUserComponent, // página completa
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
        component: EntidadComponent,
        data: {
          title: 'Entidad',
          urls: [
            { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Entidad' },
          ],
        },
      },
      {
        path: 'aplicacion',//6
        component: AplicacionComponent,
        data: {
          title: 'Aplicacion',
          urls: [
            { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Aplicacion' },
          ],
        },
      },
      {
        path: 'unidadOrganica',//7
        component: UnidadorganicaComponent,
        data: {
          title: 'Unidad Organica',
          urls: [
            { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Unidad Organica' },
          ],
        },
      },
    ],
  },
];
