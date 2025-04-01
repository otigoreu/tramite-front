import { Rol } from "./rol";

export interface Usuario{

  id:number;
  firstName:string;
  lastNAme:string;
  userName:string;
  email:string;

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
