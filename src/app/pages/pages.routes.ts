import { Routes } from '@angular/router';
import { EntidadComponent } from './entidad/entidad.component';
import { AplicacionComponent } from './aplicacion/aplicacion.component';
import { UnidadorganicaComponent } from './unidadorganica/unidadorganica.component';

export const PagesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'entidad',
        component: EntidadComponent,
        data: {
          title: 'Entidad',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Entidad' },
          ],
        },
      },
      {
        path: 'aplicacion',
        component: AplicacionComponent,
        data: {
          title: 'Aplicacion',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'Aplicacion' },
          ],
        },
      },
      {
        path: 'unidadOrganica',
        component: UnidadorganicaComponent,
        data: {
          title: 'UnidadOrganica',
          urls: [
            { title: 'Dashboard', url: '/dashboards/dashboard1' },
            { title: 'UnidadOrganica' },
          ],
        },
      },
    ],
  },
];

//   {
//     path: 'pages/persona',
//     component: StarterComponent,
//     data: {
//       title: 'Starter Page',
//     },
//   },
// ];
