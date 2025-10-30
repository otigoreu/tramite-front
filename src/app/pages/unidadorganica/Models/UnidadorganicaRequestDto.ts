export interface UnidadorganicaRequestDto {
  idEntidad: number;
  idDependencia?: number; // 👈 Opcional
  descripcion: string;
  abrev: string;
}
