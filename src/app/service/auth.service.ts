import {
  LoginApiResponse1,
  LoginRequestBody1,
} from './../model/auth1';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import {
  ForgotPasswordApiResponse,
  ForgotPasswordRequestBody,
  RegisterApiResponse,
  RegisterRequestBody,
} from '../model/auth';
import { NotificationsService } from 'angular2-notifications';
import { navItems } from '../layouts/full/vertical/sidebar/sidebar-data';

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
  nombreApellido = signal('');
  aplicacion = signal('');
  idAplicacion=signal('');
  sede = signal('');

  login(dni: string, password: string): Observable<LoginApiResponse1> {
    const apiUrl = this.baseUrl + '/api/users/login';
    const body: LoginRequestBody1 = { username: dni, password };
    return this.http.post<LoginApiResponse1>(apiUrl, body).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        const errorResponse: LoginApiResponse1 = {
          success: false,
          data: {
            expirationDate: '',
            token: '',
            roles: [],
            persona: {
              id: 0,
              nombres: '',
              apellidos: '',
              fechaNac: '',
              direccion: '',
              referencia: '',
              celular: '',
              edad: '',
              email: '',
              tipoDoc: '',
              nroDoc: '',
            },
            sede: { id: 0, descripcion: '' },
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
    this.notificationsService.success('Logout exitoso', 'Hasta luego');
    while (navItems.length > 0) {
      navItems.pop();
    }
  }

  constructor() {}
}
