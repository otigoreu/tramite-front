export interface UserRol {}

export interface UsuarioRol_UsuarioResponseDto {
  id: string; // Guid → string
  estado: boolean;

  userName: string;
  nombreCompleto: string;
  cantidadUnidadOrganica: number;
  cantidadRol: number;
  mustChangePassword: boolean;
}
