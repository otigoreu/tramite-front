import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../model/ApiResponse';
import { UnidadorganicaPaginatedResponseDto } from '../pages/unidadorganica/Models/UnidadorganicaPaginatedResponseDto';
import { map, Observable } from 'rxjs';
import { UnidadorganicaRequestDto } from '../pages/unidadorganica/Models/UnidadorganicaRequestDto';

@Injectable({
  providedIn: 'root',
})
export class UnidadorganicaService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  getPaginadoUnidadorganica(
    search: string = '',
    page: number = 1,
    pageSize: number = 10,
    idUnidadorganica?: number // 👈 Parámetro opcional
  ) {
    let params: any = {
      search,
      Page: page,
      RecordsPerPage: pageSize,
    };

    if (idUnidadorganica) {
      params.idUnidadorganica = idUnidadorganica; // 👈 Solo se agrega si existe
    }

    return this.http
      .get<ApiResponse<UnidadorganicaPaginatedResponseDto[]>>(
        `${this.baseUrl}/api/UnidadOrganica/descripcion`,
        {
          params,
          observe: 'response',
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
            meta: { total, page, pageSize },
          };
        })
      );
  }

  agregarUnidadorganica(
    dto: UnidadorganicaRequestDto
  ): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.baseUrl}/api/UnidadOrganica`,
      dto
    );
  }

  actualizarUnidadorganica(
    id: number,
    dto: UnidadorganicaRequestDto
  ): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${this.baseUrl}/api/UnidadOrganica/${id}`,
      dto
    );
  }

  eliminarUnidadorganica(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(
      `${this.baseUrl}/api/UnidadOrganica/${id}`
    );
  }

  deshabilitarUnidadorganica(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/api/UnidadOrganica/${id}/finalize`,
      null
    );
  }

  habilitarUnidadorganica(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/api/UnidadOrganica/${id}/initialize`,
      null
    );
  }
}
