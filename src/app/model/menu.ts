

export interface Menu {
  id: number;
  displayName: string;
  iconName: string;
  route: string;
  idAplicacion: number;
  parentMenuId: number;
}

export interface MenuInfo {
  id: number;
  displayName: string;
  iconName: string;
  route: string;
  aplicacionId:number;
  aplicacion: string;
  parentMenuId: number;
}

export interface MenuWithRol {
  id: number;
  displayName: string;
  iconName: string;
  route: string;
  idAplicacion: number;
  roles:string[];
  parentMenuId: number;
}
