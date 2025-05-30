

export interface Menu {
  id: number;
  displayName: string;
  iconName: string;
  route: string;
  idAplicacion:number;
  parentMenuId: number | null;
}

export interface MenuInfo {
  id: number;
  displayName: string;
  iconName: string;
  route: string;
  idAplicacion:number;
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

export interface menuFull{
  id?: number;
  displayName: string;
  iconName: string;
  route: string;
  idAplicacion: number;
  aplicacion?: string;
  roles?:string[];
  parentMenuId: number;
}
