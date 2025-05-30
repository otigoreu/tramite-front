import { ChangePassword, Login, LoginResponse, RegisterRequest, RegisterResponse } from './../model/usuario';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { NewPasswordRequest, Usuario } from '../model/usuario';
import { catchError, of } from 'rxjs';


interface RegisterApiResponse{
  data:RegisterResponse;
  success:boolean;
  errorMessage:string;
}

interface LoginApiResponse{
  data:LoginResponse;
  success:boolean;
  errorMessage:string;
}

interface ForgotPasswordApiResponse {
  success: boolean;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

baseUrl=environment.baseUrl;
http=inject (HttpClient);

  constructor() { }



  registerUser(user:RegisterRequest){
    return this.http.post<RegisterApiResponse>(`${this.baseUrl}/api/users/Register`,user).pipe(
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

  loginUser(login:Login){
    return this.http.post<LoginApiResponse>(`${this.baseUrl}/api/users/Login`,login).pipe(
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
                  direccion: '',
                  referencia: '',
                  celular: '',
                  edad: '',
                  email: '',
                  tipoDoc: '',
                  nroDoc: '',
                  status:'true'
                },
                sede: { id: 0, descripcion: '',status:'true' },
                aplicaciones: [],
              },
              errorMessage: httpErrorResponse.error.errorMessage || 'Unknown error',
            };

            return of(errorResponse);
          })
        );
  }

  requestTokenPassword(email:string){
    return this.http.post<ForgotPasswordApiResponse >(`${this.baseUrl}/api/users/RequestTokenToResetPassword`,email).pipe(
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

  resetPassword(body: NewPasswordRequest){
    return this.http.post(`${this.baseUrl}/api/users/ResetPassword`,body)
  }

  changePassword(body: ChangePassword){
    return this.http.post(`${this.baseUrl}api/users/changePassword`,body);
  }

  getUsersByRoleAll(){
    return this.http.get(`${this.baseUrl}/api/users/GetUsersByRole`);
  }

  getUsersByRole(rol:string){
    return this.http.get(`${this.baseUrl}/api/users/GetUsersByRole?role=${rol}`);
  }

  getUsersByEmail(email:string){
    return this.http.get(`${this.baseUrl}/api/users/GetUserbyEmail?email=${email}`);
  }

  createRole(name:string){
    return this.http.post(`${this.baseUrl}/api/users/roles/create`,name);
  }

  deleteRole(name :string){
    return this.http.delete(`${this.baseUrl}/api/users/role/remove/:${name}`);
  }

  getRoles(){
    return this.http.get(`${this.baseUrl}/api/users/roles`);
  }

  grantRoleById(id:String, roleName:string){
    return this.http.post(`${this.baseUrl}/api/users/roles/grant/:${id}`,roleName);
  }

  grantRoleByEmail(email:string, roleName:string){
    return this.http.post(`${this.baseUrl}/api/users/roles/grantByEmail`,roleName)
  }

  rovokeRolesById(id:string){
    return this.http.post(`${this.baseUrl}/api/roles/revoke/`,id);
  }

  revokeRoleNameById(id:string, roleName:string){
    return this.http.post(`${this.baseUrl}/api/users/role/revoke`,id);
  }

}
