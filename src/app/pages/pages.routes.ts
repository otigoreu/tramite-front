import { Routes } from '@angular/router';
import { StarterComponent } from './starter/starter.component';

export const PagesRoutes: Routes = [
  {
    path: 'pages/persona',
    component: StarterComponent,
    data: {
      title: 'Starter Page',
    },
  },
];
