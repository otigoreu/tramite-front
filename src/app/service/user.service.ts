import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

import { catchError, map, Observable, of } from 'rxjs';
import {
  ChangePasswordRequestBody,
  ForgotPasswordApiResponse,
  LoginApiResponse,
  LoginRequestBody,
  RegisterApiResponse,
  RegisterRequestBody,
  ResetPasswordRequestBody,
  Usuario,
} from '../model/usuario';
import { RegisterRequestDto } from '../pages/user/Models/RegisterRequestDto';
import { ApiResponse } from '../model/ApiResponse';
import { UsuarioPaginatedResponseDto } from '../pages/user/Models/UsuarioPaginatedResponseDto';

interface GetUsuario {
  data: Usuario[];
  success: string;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  registerUser(user: RegisterRequestDto) {
    return this.http
      .post<RegisterApiResponse>(`${this.baseUrl}/api/users/Register`, user)
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const errorResponse: RegisterApiResponse = {
            success: false,
            data: { expirationDate: '', token: '', userId: '', roles: [] },
            errorMessage:
              httpErrorResponse.error.errorMessage || 'Unknown error',
          };
          return of(errorResponse);
        })
      );
  }

  loginUser(login: LoginRequestBody) {
    return this.http
      .post<LoginApiResponse>(`${this.baseUrl}/api/users/Login`, login)
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const errorResponse: LoginApiResponse = {
            success: false,
            data: {
              expirationDate: '',
              token: '',
              roles: [],
              idUsuario: '',
              persona: {
                id: 0,
                nombres: '',
                apellidoPat: '',
                apellidoMat: '',
                fechaNac: '',
                edad: 0,
                email: '',
                idTipoDoc: 0,
                nroDoc: '',
                estado: '',
              },
              entidad: { id: 0, descripcion: '', ruc: '', estado: '' },
              unidadOrganicas: [],
              aplicaciones: [],
            },
            errorMessage:
              httpErrorResponse.error.errorMessage || 'Unknown error',
          };

          return of(errorResponse);
        })
      );
  }

  requestTokenPassword(email: string) {
    return this.http
      .post<ForgotPasswordApiResponse>(
        `${this.baseUrl}/api/users/RequestTokenToResetPassword`,
        email
      )
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const errorResponse: ForgotPasswordApiResponse = {
            success: false,
            errorMessage:
              httpErrorResponse.error?.errorMessage || 'Unknown error',
          };
          return of(errorResponse);
        })
      );
  }

  resetPassword(body: ResetPasswordRequestBody) {
    return this.http.post(`${this.baseUrl}/api/users/ResetPassword`, body);
  }

  changePassword(body: ChangePasswordRequestBody) {
    return this.http.post(`${this.baseUrl}api/users/changePassword`, body);
  }

  getUsersByRoleAll() {
    return this.http.get(`${this.baseUrl}/api/users/GetUsersByRole`);
  }

  getUsersByRole(rol: string) {
    return this.http.get(
      `${this.baseUrl}/api/users/GetUsersByRole?role=${rol}`
    );
  }

  getUsersByEmail(email: string) {
    return this.http.get(
      `${this.baseUrl}/api/users/GetUserbyEmail?email=${email}`
    );
  }

  createRole(name: string) {
    return this.http.post(`${this.baseUrl}/api/users/roles/create`, name);
  }

  deleteRole(name: string) {
    return this.http.delete(`${this.baseUrl}/api/users/role/remove/:${name}`);
  }

  getRoles() {
    return this.http.get(`${this.baseUrl}/api/users/roles`);
  }

  grantRoleById(id: String, roleName: string) {
    return this.http.post(
      `${this.baseUrl}/api/users/roles/grant/:${id}`,
      roleName
    );
  }

  grantRoleByEmail(email: string, roleName: string) {
    return this.http.post(
      `${this.baseUrl}/api/users/roles/grantByEmail`,
      roleName
    );
  }

  rovokeRolesById(id: string) {
    return this.http.post(`${this.baseUrl}/api/roles/revoke/`, id);
  }

  revokeRoleNameById(id: string, roleName: string) {
    return this.http.post(`${this.baseUrl}/api/users/role/revoke`, id);
  }

  getPaginadoUsuario(
    idEntidad: number,
    idAplicacion: number,
    rolId?: string | null, // 👈 acepta ambos
    search: string = '',
    page: number = 1,
    pageSize: number = 10
  ) {
    let params: any = {
      idEntidad,
      idAplicacion,
      search,
      Page: page,
      RecordsPerPage: pageSize,
    };

    if (rolId) {
      params.rolId = rolId;
    }

    return this.http
      .get<ApiResponse<UsuarioPaginatedResponseDto[]>>(
        `${this.baseUrl}/api/users`,
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
            meta: { total, page, pageSize },
          };
        })
      );
  }

  deshabilitarUsuario(id: string): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/api/users/${id}/finalize`,
      null
    );
  }

  habilitarUsuario(id: string): Observable<ApiResponse<null>> {
    return this.http.patch<ApiResponse<null>>(
      `${this.baseUrl}/api/users/${id}/initialize`,
      null
    );
  }
}
