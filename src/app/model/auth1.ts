export interface LoginApiResponse1 {
  data: Data;
  success: boolean;
  errorMessage: null;
}

export interface Data {
  token: string;
  expirationDate: string;
  roles: string[];
  persona: Persona1;
  sede: Sede;
  aplicaciones: Aplicacion[];
}

export interface Sede {
  id: number;
  descripcion: string;
}

export interface Aplicacion {
  id: number;
  descripcion: string;
}

export interface Persona1 {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  fechaNac: string;
  direccion: string;
  referencia: string;
  celular: string;
  edad: string;
  email: string;
  tipoDoc: string;
  nroDoc: string;
}

export interface LoginRequestBody1 {
  username: string;
  password: string;
}

//REGISTER
export interface RegisterApiResponse1 {
  data: {
    userId: string;
    token: string;
    expirationDate: string;
    roles: string[];
  };
  success: boolean;
  errorMessage: string;
}
export interface RegisterRequestBody1 {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
  confirmPassword: string;
}

//FORGOT PASSWORD
export interface ForgotPasswordApiResponse1 {
  success: boolean;
  errorMessage: string;
}

export interface ForgotPasswordRequestBody1 {
  email: string;
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
