import { Routes } from '@angular/router';
import { EntidadComponent } from './entidad/entidad.component';
import { AplicacionComponent } from './aplicacion/aplicacion.component';

import { UserComponent } from './user/user.component';
import { UnidadorganicaUserComponent } from './user/unidadorganica-user/unidadorganica-user.component';
import { UnidadorganicaComponent } from './unidadorganica/unidadorganica.component';
import { PersonaComponent } from './persona/persona.component';
import { TipoDocumentoComponent } from './tipo-documento/tipo-documento.component';
import { MenuComponent } from './menu/menu.component';
import { RolComponent } from './rol/rol.component';
import { authGuard } from './Authentication/guards/auth.guard';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',//3
       // canActivate: [authGuard],
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
            //canActivate: [authGuard],
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
        //canActivate: [authGuard],
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
        //canActivate: [authGuard],
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
        //canActivate: [authGuard],
        component: UnidadorganicaComponent,
        data: {
          title: 'Unidad Organica',
          urls: [
            { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Unidad Organica' },
          ],
        },
      },
      {
        path: 'persona',
       // canActivate: [authGuard],
        component: PersonaComponent,
        data: {
          title: 'Personas',
          urls: [
            { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Personas' },
          ],
        },
      },
       {
        path: 'tipo-documento',//7
        //canActivate: [authGuard],
        component: TipoDocumentoComponent,
        data: {
          title: 'Tipo Documento',
          urls: [
            { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Tipo Documento' },
          ],
        },
      },
      {
        path: 'menu',//7
       // canActivate: [authGuard],
        component: MenuComponent,
        data: {
          title: 'Menu',
          urls: [
            { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Menu' },
          ],
        },
      },
      {
        path: 'rol',//7
        //canActivate: [authGuard],
        component: RolComponent,
        data: {
          title: 'Roles',
          urls: [
            { title: 'Inicio', url: '/dashboards/dashboard1' },
            { title: 'Roles' },
          ],
        },
      },

    ],
  },
];
