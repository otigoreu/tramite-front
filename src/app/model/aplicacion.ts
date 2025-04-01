import { Menu } from "./menu";
import { SedeAplicaicon } from "./sedeAplicaicon";
import { UsuarioAplicacion } from "./usuarioAplicacion";



export interface Aplicacion{
  id :number;
  descripcion:string;
  status:string

}
export interface AplicacionFull{
  id :number;
  descripcion:string;
  menus:Menu[];
  sedeAplicaicones:SedeAplicaicon[];
  usuarioAplicaicones:UsuarioAplicacion[];


}
