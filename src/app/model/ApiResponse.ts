/**
 * Respuesta genérica de la API
 * @template T  Tipo del dato que devuelve el endpoint
 */
export interface ApiResponse<T> {
  /** Carga útil devuelta por la API */
  data: T;

  /** indica éxito (`true`) o fracaso (`false`) */
  success: boolean;

  /** Mensaje descriptivo solo presente cuando success === false */
  errorMessage?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}
