import { inject, Injectable } from '@angular/core';
import { Persona, PersonaNew, Personas } from '../model/persona';
import { HttpClient } from '@angular/common/http';
import { map, Subject, finalize } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../model/ApiResponse';

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

  private personaChange: Subject<Persona[]> = new Subject<Persona[]>();

  constructor() {}
  getData() {
    return this.http
      .get<GetPersonsApiResponse>(this.baseUrl + '/api/personas/nombre')
      .pipe(map((response) => response.data));
  }
  getDatafilter() {
    return this.http
      .get<GetPersonsApiResponse>(this.baseUrl + '/api/personas/nombrefilter')
      .pipe(map((response) => response.data));
  }
  getDataPageable(p: number, s: number) {
    return this.http
      .get<GetPersonsApiResponse>(
        `${this.baseUrl}/api/personas/nombre?nombres=&Page=${p}&RecordsPerPage=${s}`
      )
      .pipe(map((response) => response.data));
  }

  getPaginadoPersona(search = '', page = 1, pageSize = 10) {
    const params = {
      search,
      Page: page,
      RecordsPerPage: pageSize,
    };

    console.log('(getPaginadoPersona) search', search);

    return this.http
      .get<ApiResponse<Personas[]>>(`${this.baseUrl}/api/personas/nombre`, {
        params,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const items = (response.body?.data ?? []).map((persona) => ({
            ...persona,
            nombreCompleto:
              `${persona.apellidoPat} ${persona.apellidoMat}, ${persona.nombres}`.trim(),
          }));

          const total = parseInt(
            response.headers.get('totalrecordsquantity') ?? '0',
            10
          );

          return {
            items,
            meta: {
              total,
              page,
              pageSize,
            },
          };
        })
      );
  }

  getDataByEmail(email: string) {
    return this.http
      .get<GetPersonsApiResponse>(
        this.baseUrl + '/api/personas/email?email=' + email
      )
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

  //editar version 2
  update(id: number, persondialog: Persona) {
    return this.http.put(`${this.baseUrl}/api/personas/${id}`, persondialog);
  }

  //nuevo version 2
  save(personadialog: Persona) {
    return this.http.post(`${this.baseUrl}/api/personas/`, personadialog);
  }
  //nuevo version 3
  newPerson(persondialog: Persona) {
    return this.http.post(
      'https://localhost:7179/api/personal/RegisterPerson',
      persondialog
    );
  }

  updatePerson(id: number, persondialog: Persona) {
    return this.http.put(
      `https://localhost:7179/api/personal/UpdatePerson/${id}`,
      persondialog
    );
  }

  finalized(id: number) {
    return this.http.delete<DeletePersonResponse>(
      `${this.baseUrl}/api/personas/finalized/${id}`
    );
  }
  initialized(id: number) {
    return this.http.get<DeletePersonResponse>(
      `${this.baseUrl}/api/personas/initialized/${id}`
    );
  }

  //nuevo version 1
  new(user: PersonaNew) {
    return this.http.post(this.baseUrl + '/api/personas/', {
      nombres: user.nombres,
      apellidoPat: user.apellidoPat,
      apellidoMat: user.apellidoMat,
      fechaNac: user.fechaNac,
      email: user.email,
      tipoDoc: user.idTipoDoc,
      nroDoc: user.nroDoc,
    });
  }
  //editar version 1
  edit(user: Personas) {
    return this.http.put(this.baseUrl + '/api/personas/' + user.id, {
      nombres: user.nombres,
      apellidoPat: user.apellidoPat,
      apellidoMat: user.apellidoMat,
      fechaNac: user.fechaNac,
      email: user.email,
      tipoDoc: user.idTipoDoc,
      nroDoc: user.nroDoc,
    });
  }
}
