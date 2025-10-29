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

export interface UsuarioRol_RolConAsignacionDto {
  id: string; // Guid → string
  descripcion: string;
  asignado: boolean;
}

export interface UsuarioRol_RolConAsignacionRequestDto {
  idEntidad: number;
  idAplicacion: number;
  userId: string;
  rolId: string;
  selected: boolean;
}
