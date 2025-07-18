export interface UnidadorganicaRequestDto {
  idEntidad: number;
  idDependencia?: number; // 👈 Opcional
  descripcion: string;
}
