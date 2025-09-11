import { HttpClient, HttpParams } from '@angular/common/http';
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

  getEntidades(userId: string, search = '', page?: number, pageSize?: number) {
    let params: any = { userId, search };

    // 👇 Solo agregamos paginación si se envían valores
    if (page !== undefined && pageSize !== undefined) {
      params = {
        ...params,
        Page: page,
        RecordsPerPage: pageSize,
      };
    }

    return this.http
      .get<ApiResponse<Entidad[]>>(`${this.baseUrl}/api/entidades`, {
        params,
        observe: 'response', // Necesario para leer headers
      })
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
              page: page ?? null,
              pageSize: pageSize ?? null,
            },
          };
        })
      );
  }

  getPaginadoEntidad(
    userId: string = '',
    rolId: string = '',
    search: string = '',
    page?: number,
    pageSize?: number
  ): Observable<{
    items: Entidad[];
    meta: { total: number; page?: number; pageSize?: number };
  }> {
    let params = new HttpParams()
      .set('userId', userId)
      .set('rolId', rolId)
      .set('search', search);

    if (page !== undefined && pageSize !== undefined) {
      params = params
        .set('Page', page.toString())
        .set('RecordsPerPage', pageSize.toString());
    }

    return this.http
      .get<ApiResponse<Entidad[]>>(`${this.baseUrl}/api/entidades`, {
        params,
        observe: 'response',
      })
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

  // getPaginadoEntidad(
  //   userId: string = '',
  //   rolId: string = '',
  //   search = '',
  //   page = 1,
  //   pageSize = 10
  // ) {
  //   const params = {
  //     userId,
  //     rolId,
  //     search,
  //     Page: page,
  //     RecordsPerPage: pageSize,
  //   };

  //   return this.http
  //     .get<ApiResponse<Entidad[]>>(`${this.baseUrl}/api/entidades`, {
  //       params,
  //       observe: 'response', // 👈 Esto es CLAVE para acceder a headers
  //     })
  //     .pipe(
  //       map((response) => {
  //         const items = response.body?.data ?? [];
  //         const total = parseInt(
  //           response.headers.get('totalrecordsquantity') ?? '0',
  //           10
  //         );
  //         return {
  //           items,
  //           meta: {
  //             total,
  //             page,
  //             pageSize,
  //           },
  //         };
  //       })
  //     );
  // }

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
