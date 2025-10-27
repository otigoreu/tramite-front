export interface UnidadOrganica {
  id: number;
  descripcion: string;
  idEntidad: number;
  IdDependencia: number | null;
  estado: string;
}

export interface UnidadOrganicaResponseDto {
  id: number;
  descripcion: string;
  nombreEntidad?: string;
  nombreDependencia?: string;
  cantidadHijos: number;
  estado: boolean;
  cantidadUsuarios: number;

  idEntidad: number;
  idDependencia?: number;
}
