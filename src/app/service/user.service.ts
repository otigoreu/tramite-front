import { ChangePassword, Login } from './../model/usuario';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { NewPasswordRequest, Usuario } from '../model/usuario';

@Injectable({
  providedIn: 'root'
})
export class UserService {

baseUrl=environment.baseUrl;
http=inject (HttpClient);

  constructor() { }



  registerUser(user:Usuario){
    return this.http.post(`${this.baseUrl}/api/users/Register`,user);
  }

  loginUser(login:Login){
    return this.http.post(`${this.baseUrl}/api/users/login`,login);
  }

  requestTokenPassword(email:string){
    return this.http.post(`${this.baseUrl}/api/users/RequestTokenResetPassword`,email);
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
