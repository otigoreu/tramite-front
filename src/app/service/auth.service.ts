import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, EMPTY, map, Observable, of } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { navItems } from '../layouts/full/vertical/sidebar/sidebar-data';
import { environment } from 'src/environments/environment.development';
import { Rol } from '../model/rol';
import { notify5 } from '../data/mensajes.data';
import {
  ChangePasswordApiResponse,
  ChangePasswordRequestBody,
  ForgotPasswordApiResponse,
  ForgotPasswordRequestBody,
  LoginApiResponse,
  LoginRequestBody,
  RegisterApiResponse,
  RegisterRequestBody,
  ResetPasswordApiResponse,
  ResetPasswordRequestBody,
} from '../model/usuario';

interface GetRol {
  data: Rol[];
  success: string;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private notificationsService = inject(NotificationsService);
  loading = signal(false);
  loggedIn = signal(false);
  isAdministrator = signal(false);
  userRole = signal('');
  userName = signal('');
  userEmail = signal('');
  nombresApellidos = signal('');
  aplicacion = signal('');
  idAplicacion = signal('');
  unidadOrganicas = signal('');
  entidad = signal('');

  login(dni: string, password: string): Observable<LoginApiResponse> {
    const apiUrl = this.baseUrl + '/api/users/login';
    const body: LoginRequestBody = { username: dni, password };
    return this.http.post<LoginApiResponse>(apiUrl, body).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        const errorResponse: LoginApiResponse = {
          success: false,
          data: {
            expirationDate: '',
            token: '',
            roles: [],
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
          errorMessage: httpErrorResponse.error.errorMessage || 'Unknown error',
        };

        return of(errorResponse);
      })
    );
  }

  register(body: RegisterRequestBody): Observable<RegisterApiResponse> {
    const apiUrl = this.baseUrl + '/api/users/register';
    return this.http.post<RegisterApiResponse>(apiUrl, body).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        const errorResponse: RegisterApiResponse = {
          success: false,
          data: { expirationDate: '', token: '', userId: '', roles: [] },
          errorMessage: httpErrorResponse.error.errorMessage || 'Unknown error',
        };
        return of(errorResponse);
      })
    );
  }
  forgotPassword(email: string): Observable<ForgotPasswordApiResponse> {
    const apiUrl = this.baseUrl + '/api/users/RequestTokenToResetPassword';
    const body: ForgotPasswordRequestBody = { email };
    return this.http.post<ForgotPasswordApiResponse>(apiUrl, body).pipe(
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
  logout() {
    localStorage.clear();
    this.loggedIn.set(false);
    this.isAdministrator.set(false);
    // this.notificationsService.success('sesion cerrada', 'Hasta luego');
    this.notificationsService.set(notify5, true);
    while (navItems.length > 0) {
      navItems.pop();
    }
  }
  getDataRoles() {
    return this.http
      .get<GetRol>('${this.baseUrl}/users/roles')
      .pipe(map((response) => response.data));
  }

  resetPassword(
    email: string,
    token: string,
    newPassword: string,
    confirmNewPassword: string
  ) {
    const body: ResetPasswordRequestBody = {
      email,
      token,
      newPassword,
      confirmNewPassword,
    };
    return this.http
      .post<ResetPasswordApiResponse>(
        this.baseUrl + '/api/users/ResetPassword',
        body
      )
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          const errorResponse: ChangePasswordApiResponse = {
            success: false,
            errorMessage:
              httpErrorResponse.error?.errorMessage || 'Unknown error',
          };
          return of(errorResponse);
        })
      );
  }
  changePassword(
    oldPassword: string,
    newPassword: string
  ): Observable<ChangePasswordApiResponse> {
    const apiUrl = this.baseUrl + '/api/users/ChangePassword';
    const body: ChangePasswordRequestBody = { oldPassword, newPassword };
    return this.http.post<ChangePasswordApiResponse>(apiUrl, body).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        const errorResponse: ChangePasswordApiResponse = {
          success: false,
          errorMessage:
            httpErrorResponse.error?.errorMessage || 'Unknown error',
        };
        return of(errorResponse);
      })
    );
  }

  constructor() {}
}
