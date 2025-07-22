

export interface Menu {
  id: number;
  descripcion: string;
  icono: string;
  ruta: string;
  idAplicacion:number;
  idMenuPadre: number | null;
}
export interface MenuRol {
  id: number;
  descripcion: string;
  icono: string;
  ruta: string;
  idAplicacion:number;
  idRol:string;
  idMenuPadre: number | null;
}

export interface MenuInfo {
  id: number;
  descripcion: string;
  icono: string;
  ruta: string;
  idAplicacion:number;
  aplicacion: string;
  idMenuPadre: number| null;
}

export interface MenuWithRoles {
  descripcion: string;
  icono: string;
  ruta: string;
  idAplicacion: number;
  idRoles:string[];
  idMenuPadre: number |null;
}
export interface MenuWithRol {
  id: number;
  descripcion: string;
  icono: string;
  ruta: string;
  idAplicacion: number;
  aplicacion: string;
  idRol:string;
  rol: string;
  idMenuPadre: number| null;
}

export interface menuFull{
  id?: number;
  descripcion: string;
  icono: string;
  ruta: string;
  idAplicacion: number;
  aplicacion?: string;
  roles?:string[];
  idMenuPadre: number| null;

}
