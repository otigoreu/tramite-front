export interface UnidadorganicaPaginatedResponseDto {
  id: number;
  descripcion: string;
  nombreEntidad: string;
  nombreDependencia: string;
  cantidadHijos: number;
  estado: boolean;

  idEntidad: number;
  idDependencia?: number;
}
