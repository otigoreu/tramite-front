import { SedeAplicaicon } from "./sedeAplicaicon";
import { Usuario } from "./usuario";



export interface Sede{
  id :number;
  descripcion:string;
  status:string

}

export interface SedeFull{
  id: number;
  descripcion: string;
  usuarios:Usuario[];
  sedeAplicaciones:SedeAplicaicon[];

}
