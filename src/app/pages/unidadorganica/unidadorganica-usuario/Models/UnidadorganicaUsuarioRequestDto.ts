export interface UnidadorganicaUsuarioRequestDto {
  idUnidadorganica: number;
  idUsuario: number;
  desde: Date;
  hasta: Date | null;
  estado: boolean;
}
