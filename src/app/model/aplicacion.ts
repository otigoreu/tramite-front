import { Menu } from './menu';
import { SedeAplicaicon } from './sedeAplicaicon';
import { UsuarioAplicacion } from './usuarioAplicacion';

export interface AplicacionWithSede {
  id: number;
  descripcion: string;
  idSede: number;
  sede: string;
}
export interface AplicacionSede {
  id: number;
  descripcion: string;
  idSede: number;
}

export interface AplicacionWithSedes {
  descripcion: string;
  idSedes: number[];
}
export interface AplicacionFull {
  id: number;
  descripcion: string;
  menus: Menu[];
  sedeAplicaicones: SedeAplicaicon[];
  usuarioAplicaicones: UsuarioAplicacion[];
}
