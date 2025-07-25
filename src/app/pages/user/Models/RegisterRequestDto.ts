export interface RegisterRequestDto {
  userName: string;
  email: string;
  idPersona: number;
  idUnidadOrganica: number;
  password: string;
  confirmPassword?: string;
}
