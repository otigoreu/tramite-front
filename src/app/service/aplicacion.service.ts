import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';

import { map, Observable } from 'rxjs';
import { ApiResponse } from '../model/ApiResponse';
import { AplicacionRequestDto } from '../pages/aplicacion/Modals/AplicacionRequestDto';
import { Aplicacion } from '../pages/aplicacion/Modals/Aplicacion';

@Injectable({
  providedIn: 'root',
})
export class AplicacionService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  getPaginadoAplicacion(search = '', page = 1, pageSize = 10) {
    const params = {
      search,
      Page: page,
      RecordsPerPage: pageSize,
    };

    return this.http
      .get<ApiResponse<Aplicacion[]>>(
        `${this.baseUrl}/api/aplicaciones/descripcion`,
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

  agregarAplicacion(
    dto: AplicacionRequestDto
  ): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.baseUrl}/api/aplicaciones`,
      dto
    );
  }

  actualizarAplicacion(
    id: number,
    dto: AplicacionRequestDto
  ): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${this.baseUrl}/api/aplicaciones/${id}`,
      dto
    );
  }

  eliminarAplicacion(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.baseUrl}/api/aplicaciones/${id}`
    );
  }

  deshabilitarAplicacion(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/api/aplicaciones/${id}/finalize`,
      null
    );
  }

  habilitarAplicacion(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/api/aplicaciones/${id}/initialize`,
      null
    );
  }

  getDataIgnoreQuery() {
    return this.http
      .get<GetAplicacion>(`${this.baseUrl}/api/aplicaciones/descripcion`)
      .pipe(map((response) => response.data));
  }
}

interface GetAplicacion {
  data: Aplicacion[];
  success: string;
  errorMessage: string;
}
