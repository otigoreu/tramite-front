export interface Rol {
  id: string;
  descripcion: string;
  normalizedName?: string;
  estado?: string;
}

export interface RolSignal{
  id: string;
  name: string;
}

export interface RolSingleResponse {
  id: string;
  descripcion: string;
}
