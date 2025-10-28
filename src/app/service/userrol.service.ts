import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { BaseResponse, BaseResponseGeneric } from '../model/BaseResponse';
import { UsuarioRol_UsuarioResponseDto } from '../model/UserRol';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserrolService {
  baseUrl = `${environment.baseUrl}/api/UserRole`;
  http = inject(HttpClient);

  constructor() {}

  getUsuariosPaginado(
    idEntidad: number,
    idAplicacion: number,
    rolId?: string | null,
    search: string = '',
    page: number = 0,
    pageSize: number = 10
  ) {
    let params = new HttpParams()
      .set('idEntidad', idEntidad.toString())
      .set('idAplicacion', idAplicacion.toString())
      .set('search', search)
      .set('page', page.toString())
      .set('recordsPerPage', pageSize.toString());

    if (rolId != null) {
      params = params.set('rolId', rolId);
    }

    return this.http
      .get<BaseResponseGeneric<UsuarioRol_UsuarioResponseDto[]>>(
        this.baseUrl, // 🔹 usa la ruta correcta del endpoint
        { params, observe: 'response' }
      )
      .pipe(
        map((response) => {
          const data = response.body?.data ?? [];
          const total =
            Number(response.headers.get('totalrecordsquantity')) || 0;

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

  deshabilitarUsuario(id: string): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(
      `${this.baseUrl}/${id}/finalize`,
      null
    );
  }

  habilitarUsuario(id: string): Observable<BaseResponse> {
    return this.http.patch<BaseResponse>(
      `${this.baseUrl}/${id}/initialize`,
      null
    );
  }
}
