export interface UsuarioPaginatedResponseDto {
  id: string;
  email: string;
  userName: string;
  descripcionPersona: string;
  entidad_Descripcion: string;
  aplicacion_Descripcion: string;
  rol_Descripcion: string;
  cantidadUnidadOrganica: number;
  cantidadrols: number;
  mustChangePassword: boolean;
  estado: boolean;
}
