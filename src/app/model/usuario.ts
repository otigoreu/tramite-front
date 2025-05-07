import { Aplicacion } from "./aplicacion";
import { Persona, PersonaNew } from "./persona";
import { Sede } from "./sede";

export interface RegisterRequest{
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  idPersona: number
  idSede: number;
  password: string
  confirmPassword: string
}


export interface RegisterResponse{
  userId: string;
    token: string;
    expirationDate: string;
    roles: string[];
}


export interface Login{
  username:string;
  password:string;
}

export interface LoginResponse {
  token: string;
  expirationDate: string;
  roles: string[];
  persona: Persona;
  sede: Sede;
  aplicaciones: Aplicacion[];
}


export interface Usuario{

  id:number;
  firstName:string;
  lastNAme:string;
  userName:string;
  email:string;

}


export interface ChangePassword{
  oldPassword :string;
  newPassword:string;
}


export interface NewPasswordRequest{
  email:string;
  token:string;
  newPassword:string;
  confirmNewPassword:string;
}
