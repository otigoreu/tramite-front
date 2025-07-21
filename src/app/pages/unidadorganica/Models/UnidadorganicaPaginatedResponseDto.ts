export interface UnidadorganicaPaginatedResponseDto {
  id: number;
  descripcion: string;
  nombreEntidad: string;
  nombreDependencia: string;
  cantidadHijos: number;
  estado: boolean;
  cantidadUsuarios: number;

  idEntidad: number;
  idDependencia?: number;
}
