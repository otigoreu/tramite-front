import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../model/ApiResponse';
import { UnidadorganicaPaginatedResponseDto } from '../pages/unidadorganica/Models/UnidadorganicaPaginatedResponseDto';
import { map, Observable } from 'rxjs';
import { UnidadorganicaRequestDto } from '../pages/unidadorganica/Models/UnidadorganicaRequestDto';
import { BaseResponseGeneric } from '../model/BaseResponse';
import { UnidadOrganicaResponseDto } from '../model/unidadOrganica';

@Injectable({
  providedIn: 'root',
})
export class UnidadorganicaService {
  baseUrl = environment.baseUrl + '/api/UnidadOrganica';
  http = inject(HttpClient);

  constructor() {}

  getPaginado(
    search?: string,
    pageSize?: number,
    pageIndex?: number,
    idEntidad?: number // 👈 Parámetro opcional
  ) {
    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
    }
    if (pageSize != null) {
      params = params.set('recordsPerPage', pageSize.toString());
    }
    if (pageIndex != null) {
      params = params.set('page', pageIndex.toString());
    }

    if (idEntidad) {
      params = params.set('idEntidad', idEntidad.toString());
    }

    return this.http
      .get<BaseResponseGeneric<UnidadOrganicaResponseDto[]>>(
        `${this.baseUrl}/descripcion`,
        {
          params,
          observe: 'response',
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
            meta: { total, pageIndex, pageSize },
          };
        })
      );
  }

  agregarUnidadorganica(
    dto: UnidadorganicaRequestDto
  ): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(`${this.baseUrl}`, dto);
  }

  actualizarUnidadorganica(
    id: number,
    dto: UnidadorganicaRequestDto
  ): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(`${this.baseUrl}/${id}`, dto);
  }

  eliminarUnidadorganica(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/${id}`);
  }

  deshabilitarUnidadorganica(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/${id}/finalize`,
      null
    );
  }

  habilitarUnidadorganica(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/${id}/initialize`,
      null
    );
  }
}
