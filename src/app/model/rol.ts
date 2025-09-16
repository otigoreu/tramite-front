export interface Rol {
  id: string;
  descripcion: string;
  normalizedName?: string;
  estado?: string;
}

export interface RolLogin {
  id: string;
  nivel: string;
  name: string;
}
