export interface RegisterRequestDto {
  userName: string;
  email: string;
  idPersona: number;
  rolId: string;
  password: string;
  confirmPassword?: string;
}
