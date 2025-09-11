export interface RegisterRequestDto {
  userName: string;
  email: string;
  idPersona: number;
  idUnidadOrganica: number;
  idRol: string;
  password: string;
  confirmPassword?: string;
}
