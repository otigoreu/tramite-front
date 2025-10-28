export interface RegisterRequestDto {
  esEdicion: boolean;

  userName: string;
  iniciales: string;
  email: string;
  idPersona: number;
  password: string;
  confirmPassword?: string;

  rolId?: string; // sin null
}
