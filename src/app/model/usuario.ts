import { Rol } from "./rol";

export interface Usuario{

  id:number;
  firstName:string;
  lastNAme:string;
  userName:string;
  email:string;

}

export interface Login{
  username:string;
  password:string;
}

export interface Usuariofull{

  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  idPersona: number
  idSede: number;
  password: string
  confirmPassword: string


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
