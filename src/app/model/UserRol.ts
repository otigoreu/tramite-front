export interface UserRol {}

export interface UsuarioRol_UsuarioResponseDto {
  id: string; // Guid → string
  estado: boolean;

  userId: string;
  userName: string;
  rol_Descripcion: string;
  nombreCompleto: string;
  cantidadUnidadOrganica: number;
  mustChangePassword: boolean;
}
