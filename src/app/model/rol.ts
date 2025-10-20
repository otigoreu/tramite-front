export interface Rol {
  id?: string;
  name: string;
  normalizedName?: string;
  estado?: string;
  idEntidadAplicacion?:number;
}

export interface RolSignal{
  id: string;
  name: string;
}
export interface RolWithEntidadAplicacion {
  id: string;
  name: string;
  normalizedName?: string;
  estado?: string;
  idEntidadAplicacion:number;
}

export interface RolWithEntidadAplicacionCounter {
  id: string;
  name: string;
  normalizedName?: string;
  estado?: string;
  idEntidadAplicacion:number;
  cantidadMenus:number;
}
export interface RolSingleResponse {
  id: string;
  descripcionEntidad?: string;
  descripcionAplicacion?:string;
  descripcion:string,
  estado?:boolean
}

