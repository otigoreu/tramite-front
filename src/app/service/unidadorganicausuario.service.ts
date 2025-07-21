import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/ApiResponse';
import { UnidadorganicaUsuarioResponseDto } from '../pages/unidadorganica/unidadorganica-usuario/Models/UnidadorganicaUsuarioResponseDto';
import { map, Observable } from 'rxjs';
import { UnidadorganicaUsuarioRequestDto } from '../pages/unidadorganica/unidadorganica-usuario/Models/UnidadorganicaUsuarioRequestDto';

@Injectable({
  providedIn: 'root',
})
export class UnidadorganicausuarioService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  getPaginadoUnidadorgnicaUsuario(
    idUnidadorganica: number,
    search = '',
    page = 1,
    pageSize = 10
  ) {
    const params = {
      idUnidadorganica,
      search,
      Page: page,
      RecordsPerPage: pageSize,
    };

    return this.http
      .get<ApiResponse<UnidadorganicaUsuarioResponseDto[]>>(
        `${this.baseUrl}/api/usuarioUnidadOrganicas/unidadorganica/${idUnidadorganica}/usuarios`,
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

  agregarUnidadorganicaUsuario(
    dto: UnidadorganicaUsuarioRequestDto
  ): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.baseUrl}/api/usuarioUnidadOrganicas`,
      dto
    );
  }

  actualizarUnidadorganicaUsuario(
    id: number,
    dto: UnidadorganicaUsuarioRequestDto
  ): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${this.baseUrl}/api/usuarioUnidadOrganicas/${id}`,
      dto
    );
  }

  getUnidadorganicaUsuario(
    idUnidadorganica: number,
    idUsuario: number
  ): Observable<ApiResponse<UnidadorganicaUsuarioResponseDto>> {
    const url = `${this.baseUrl}/api/usuarioUnidadOrganicas/unidadorganica/${idUnidadorganica}/usuario/${idUsuario}`;
    return this.http.get<ApiResponse<UnidadorganicaUsuarioResponseDto>>(url);
  }
}
