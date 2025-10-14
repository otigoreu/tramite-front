import { Persona } from './persona';
import { Entidad } from './entidad';
import { UnidadOrganica } from './unidadOrganica';
import { Aplicacion } from '../pages/aplicacion/Modals/Aplicacion';
import { Rol, RolSignal } from './rol';


export interface LoginApiResponse {
  data: Data;
  success: boolean;
  errorMessage: null;
}

export interface Data {
  token: string;
  expirationDate: string;
  idUsuario: string;
  roles: RolSignal[];
  entidad: Entidad;
  persona: Persona;
  unidadOrganicas: UnidadOrganica[];
  aplicaciones: Aplicacion[];
  mustChangePassword: boolean;
}

export interface LoginRequestBody {
  username: string;
  password: string;
}

export interface RegisterRequestBody {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  confirmPassword: string;
}

export interface RegisterApiResponse {
  data: {
    userId: string;
    token: string;
    expirationDate: string;
    roles: string[];
  };
  success: boolean;
  errorMessage: string;
}

export interface ForgotPasswordApiResponse {
  success: boolean;
  errorMessage: string;
}

export interface ForgotPasswordRequestBody {
  numeroDocumento: string;
}

export interface ResetPasswordRequestBody {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordApiResponse {
  success: boolean;
  errorMessage: string;
}

export interface ChangePasswordApiResponse {
  success: boolean;
  errorMessage: string;
}

export interface ChangePasswordRequestBody {
  oldPassword: string;
  newPassword: string;
}

///--------------------------------------------------------

export interface Usuario {
  id: string;
  email: string;
  userName: string;
  idPersona: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
}
