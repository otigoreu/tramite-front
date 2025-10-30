export interface Entidad {
  id: number;
  descripcion: string;
  sigla:string;
  ruc: string;
  estado: boolean;
  cantidadAplicaciones: number;
}
export interface EntidadSingle{
  id:number;
  descripcion:string;
  sigla:string;
  ruc:string;
  estado:string
}
