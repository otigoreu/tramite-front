import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Rol } from '../model/rol';
import { map } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse';
import { RolPaginationResponseDto } from '../pages/rol/models/RolPaginationResponseDto';

interface GetRol {
  data: Rol[];
  success: string;
  errorMessage: string;
}

interface DeleteRol {
  success: string;
  errorMessage: string;
}
interface InitRol {
  success: string;
  errorMessage: string;
}

interface EndApp {
  success: string;
  errorMessage: string;
}
@Injectable({
  providedIn: 'root',
})
export class RolService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  gets(
    idEntidad: number,
    idAplicacion: number,
    rolId?: string,
    search?: string,
    pagination?: { page: number; perPage: number }
  ) {
    let params = new HttpParams();

    if (search?.trim()) {
      params = params.set('search', search.trim());
    }

    if (pagination) {
      params = params
        .set('page', pagination.page.toString())
        .set('perPage', pagination.perPage.toString());
    }

    if (rolId) {
      params = params.set('rolId', rolId);
    }

    return this.http
      .get<ApiResponse<RolPaginationResponseDto[]>>(
        `${this.baseUrl}/api/roles/entidad/${idEntidad}/aplicacion/${idAplicacion}`,
        { params }
      )
      .pipe(map((response) => response.data ?? []));
  }

  getData() {
    return this.http
      .get<GetRol>(`${this.baseUrl}/api/roles`)
      .pipe(map((response) => response.data));
  }

  save(rol: Rol) {
    return this.http.post(`${this.baseUrl}/api/roles`, rol);
  }

  update(id: string, rol: Rol) {
    return this.http.put(`${this.baseUrl}/api/roles?id=${id}`, rol);
  }

  delete(id: string) {
    return this.http.delete<DeleteRol>(`${this.baseUrl}/api/roles?id=${id}`);
  }

  initialized(id: string) {
    return this.http.get<InitRol>(
      `${this.baseUrl}/api/roles/initialized?id=${id}`
    );
  }
  finalized(id: string) {
    return this.http.delete<DeleteRol>(
      `${this.baseUrl}/api/roles/finalized?id=${id}`
    );
  }
}
