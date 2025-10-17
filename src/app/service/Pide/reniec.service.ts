import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

export interface ReniecResponse {
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  direccion: string;
  estadoCivil: string;
  restriccion: string;
  ubigeo: string;
  foto: string;
}

@Injectable({
  providedIn: 'root',
})
export class ReniecService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  consultarDni(
    nuDniUsuario: string,
    nuDniConsulta: string
  ): Observable<ReniecResponse> {
    const params = new HttpParams()
      .set('nuDniUsuario', nuDniUsuario)
      .set('nuDniConsulta', nuDniConsulta);

    return this.http.get<ReniecResponse>(`${this.baseUrl}/api/reniec`, {
      params,
    });
  }
}
