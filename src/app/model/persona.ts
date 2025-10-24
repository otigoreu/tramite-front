export interface Personas {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  fechaNac: string;
  edad: number;
  email: string;
  idTipoDoc: number;
  nroDoc: string;
  estado: string;

  nombreCompleto?: string; // opcional, lo calculamos en tiempo de ejecución
}

export interface Persona {
  id: number;
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  fechaNac: string;
  edad?: number;
  email: string;
  idTipoDoc: number;
  nroDoc: string;
  estado: string;

  nombreCompleto?: string; // opcional, lo calculamos en tiempo de ejecución
}
export interface PersonaNew {
  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  fechaNac: string;
  edad: number;
  email: string;
  idTipoDoc: number;
  nroDoc: string;
}

export interface PersonaResponseDto {
  id: number;
  estado: boolean;

  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  fechaNac: string;
  email: string;
  idTipoDoc: number;
  nroDoc: string;

  nombreCompleto: string;
}

export interface PersonaRequestDto {
  id: number;

  nombres: string;
  apellidoPat: string;
  apellidoMat: string;
  fechaNac: string;
  idTipoDoc: number;
  nroDoc: string;
}
