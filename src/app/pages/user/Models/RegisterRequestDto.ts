export interface RegisterRequestDto {
  userName: string;
  email: string;
  idPersona: number;
  idUnidadOrganica: number;
  rol: string;
  password: string;
  confirmPassword?: string;
}
