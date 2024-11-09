export interface Menu {
  data: Data[];
  success: boolean;
  errorMessage: null;
}

export interface Data {
  id: number;
  displayName: string;
  iconName: string;
  route: string;
  idAplicacion: number;
  parentMenuId: number;
}
