import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { map, Observable } from 'rxjs';
import { ApiResponse, PaginatedResponse } from '../model/ApiResponse';
import { Entidad } from '../pages/entidad/Models/Entidad';
import { EntidadRequestDto } from '../pages/entidad/Models/EntidadRequestDto';

@Injectable({
  providedIn: 'root',
})
export class EntidadService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  getPaginadoEntidad(
    idEntidad: number = 0,
    search = '',
    page = 1,
    pageSize = 10
  ) {
    const params = {
      idEntidad,
      search,
      Page: page,
      RecordsPerPage: pageSize,
    };

    return this.http
      .get<ApiResponse<Entidad[]>>(
        `${this.baseUrl}/api/entidades/descripcion`,
        {
          params,
          observe: 'response', // 👈 Esto es CLAVE para acceder a headers
        }
      )
      .pipe(
        map((response) => {
          const items = response.body?.data ?? [];
          const total = parseInt(
            response.headers.get('totalrecordsquantity') ?? '0',
            10
          );
          return {
            items,
            meta: {
              total,
              page,
              pageSize,
            },
          };
        })
      );
  }

  agregarEntidad(dto: EntidadRequestDto): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.baseUrl}/api/entidades`,
      dto
    );
  }

  actualizarEntidad(
    id: number,
    dto: EntidadRequestDto
  ): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${this.baseUrl}/api/entidades/${id}`,
      dto
    );
  }

  eliminarEntidad(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.baseUrl}/api/entidades/${id}`
    );
  }

  deshabilitarEntidad(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/api/entidades/${id}/finalize`,
      null
    );
  }

  habilitarEntidad(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/api/entidades/${id}/initialize`,
      null
    );
  }
}
