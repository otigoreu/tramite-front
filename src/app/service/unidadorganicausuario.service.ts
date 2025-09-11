import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../model/ApiResponse';
import { UnidadorganicaUsuarioResponseDto } from '../pages/unidadorganica/unidadorganica-usuario/Models/UnidadorganicaUsuarioResponseDto';
import { map, Observable } from 'rxjs';
import { UnidadorganicaUsuarioRequestDto } from '../pages/unidadorganica/unidadorganica-usuario/Models/UnidadorganicaUsuarioRequestDto';
import { BaseResponse } from '../model/BaseResponse';

export interface UnidadOrganicaUsuario_UsuarioAsociadoUOsPaginatedResponse {
  id: number;
  descripcion_UnidadOrganica: string;
  desde?: Date;
  hasta?: Date;
  estado: boolean;
}

export interface UsuarioUnidadOrganicaRequestDto {
  idUnidadOrganica: number;
  idUsuario: string;
  desde: Date;
  hasta: Date | null;
  estado?: boolean | null;
}

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

  getPaginado_UsuarioAsociadoUOs(
    idEntidad: number,
    search = '',
    page = 1,
    pageSize = 10,
    userId: string
  ) {
    const params = {
      idEntidad,
      search,
      Page: page,
      RecordsPerPage: pageSize,
      userId,
    };

    return this.http
      .get<
        ApiResponse<UnidadOrganicaUsuario_UsuarioAsociadoUOsPaginatedResponse[]>
      >(
        `${this.baseUrl}/api/usuarioUnidadOrganicas/usuario/${userId}/unidadorganicas`,
        {
          params,
          observe: 'response', // 👈 Esto es CLAVE para acceder a headers
        }
      )
      .pipe(
        map((response) => {
          console.log('==> response <==');
          console.log(response);
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

  agregar(
    dto: UsuarioUnidadOrganicaRequestDto
  ): Observable<ApiResponse<number>> {
    return this.http.post<ApiResponse<number>>(
      `${this.baseUrl}/api/usuarioUnidadOrganicas`,
      dto
    );
  }

  actualizar(
    id: number,
    dto: UsuarioUnidadOrganicaRequestDto
  ): Observable<ApiResponse<null>> {
    return this.http.put<ApiResponse<null>>(
      `${this.baseUrl}/api/usuarioUnidadOrganicas/${id}`,
      dto
    );
  }

  deshabilitar(id: number, observacion: string): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(
      `${this.baseUrl}/api/usuarioUnidadOrganicas/${id}/finalize`,
      { observacion } // ✅ en JSON
    );
  }

  habilitar(id: number): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/api/usuarioUnidadOrganicas/${id}/initialize`,
      null
    );
  }

  getUnidadorganicaUsuario(
    idUnidadorganica: number,
    idUsuario: number
  ): Observable<ApiResponse<UnidadorganicaUsuarioResponseDto>> {
    const url = `${this.baseUrl}/api/usuarioUnidadOrganicas/unidadorganica/${idUnidadorganica}/usuario/${idUsuario}`;
    return this.http.get<ApiResponse<UnidadorganicaUsuarioResponseDto>>(url);
  }

  get(Id: number): Observable<ApiResponse<UnidadorganicaUsuarioResponseDto>> {
    const url = `${this.baseUrl}/api/usuarioUnidadOrganicas/${Id}`;
    return this.http.get<ApiResponse<UnidadorganicaUsuarioResponseDto>>(url);
  }
}
