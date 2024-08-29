import { inject, Injectable } from '@angular/core';
import { Persona, PersonaNew, Personas } from '../model/persona';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

interface GetPersonsApiResponse {
  data: Personas[];
  success: string;
  errorMessage: string;
}

interface GetPersonApiResponse {
  data: Persona;
  success: string;
  errorMessage: string;
}

interface DeletePersonResponse {
  success: string;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root',
})
export class PersonaServiceService {
  baseUrl = environment.baseUrl;

  http = inject(HttpClient);

  constructor() {}
  getData() {
    return this.http
      .get<GetPersonsApiResponse>(this.baseUrl + '/api/personas/nombre')
      .pipe(map((response) => response.data));
  }

  deletePerson(id: number) {
    return this.http.delete<DeletePersonResponse>(
      this.baseUrl + '/api/personas/' + id
    );
  }

  getPerson(id: number) {
    return this.http.get<GetPersonApiResponse>(
      this.baseUrl + '/api/personas/' + id
    );
  }

  edit(user: Personas) {
    return this.http.put(this.baseUrl + '/api/personas/' + user.id, {
      nombres: user.nombres,
      apellidos: user.apellidos,
      fechaNac: user.fechaNac,
      direccion: user.direccion,
      referencia: user.referencia,
      celular: user.celular,
      edad: user.edad,
      email: user.email,
      tipoDoc: user.tipoDoc,
      nroDoc: user.nroDoc,
    });
  }

  new(user: PersonaNew) {
    return this.http.post(this.baseUrl + '/api/personas/', {
      nombres: user.nombres,
      apellidos: user.apellidos,
      fechaNac: user.fechaNac,
      direccion: user.direccion,
      referencia: user.referencia,
      celular: user.celular,
      edad: user.edad,
      email: user.email,
      tipoDoc: user.tipoDoc,
      nroDoc: user.nroDoc,
    });
  }
}
