import { DashboardsRoutes } from './../pages/dashboards/dashboards.routes';
import { Data } from './../model/auth1';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Menu } from '../model/menu';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  GetByAplicationAsync(idAplicacion: number) {
    return this.http
      .get<Menu>(this.baseUrl + '/api/Menu/' + idAplicacion)
      .pipe(map((response) => response.data));
  }
}
