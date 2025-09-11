import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../model/ApiResponse';
import { EntidadAplicacionResponseDto } from '../pages/entidad/entidad-aplicacion/Models/EntidadAplicacionResponseDto';
import { map, Observable } from 'rxjs';
import { EntidadAplicacionRequestDto } from '../pages/entidad/entidad-aplicacion/Models/EntidadAplicacionRequestDto';
import { Aplicacion } from '../pages/aplicacion/Modals/Aplicacion';

@Injectable({
  providedIn: 'root',
})
export class EntidadaplicacionService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  getsAplicacion(idEntidad: number, rolId: string) {
    return this.http
      .get<ApiResponse<Aplicacion[]>>(
        `${this.baseUrl}/api/EntidadAplicacion/entidades/${idEntidad}/aplicaciones/activos`,
        {
          params: { rolId }, // ✅ se envía como ?rolId=valor
        }
      )
      .pipe(map((response) => response.data ?? []));
  }

  getPaginadoEntidadAplicacion(
    idEntidad: number,
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
      .get<ApiResponse<EntidadAplicacionResponseDto[]>>(
        `${this.baseUrl}/api/EntidadAplicacion/entidad/${idEntidad}/aplicaciones`,
        {
          params,
          observe: 'response', // 👈 Esto es CLAVE para acceder a headers
        }
      )
      .pipe(
        map((response) => {
          const data = response.body?.data ?? [];
          const total = parseInt(
            response.headers.get('totalrecordsquantity') ?? '0',
            10
          );
          return {
            data,
            meta: {
              total,
              page,
              pageSize,
            },
          };
        })
      );
  }

  agregarEntidadAplicacion(
    dto: EntidadAplicacionRequestDto
  ): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.baseUrl}/api/EntidadAplicacion`,
      dto
    );
  }

  actualizarEntidadAplicacion(
    id: number,
    dto: EntidadAplicacionRequestDto
  ): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${this.baseUrl}/api/EntidadAplicacion/${id}`,
      dto
    );
  }

  getEntidadAplicacion(
    idEntidad: number,
    idAplicacion: number
  ): Observable<ApiResponse<EntidadAplicacionResponseDto>> {
    const url = `${this.baseUrl}/api/EntidadAplicacion/entidad/${idEntidad}/aplicacion/${idAplicacion}`;
    return this.http.get<ApiResponse<EntidadAplicacionResponseDto>>(url);
  }
}
