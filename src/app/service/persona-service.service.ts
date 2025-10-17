import { inject, Injectable } from '@angular/core';
import {
  Persona,
  PersonaNew,
  PersonaRequestDto,
  PersonaResponseDto,
  Personas,
} from '../model/persona';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Subject, finalize } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ApiResponse } from '../model/ApiResponse';
import { BaseResponseGeneric } from '../model/BaseResponse';

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
  baseUrl = environment.baseUrl + '/api/personas';

  http = inject(HttpClient);

  private personaChange: Subject<Persona[]> = new Subject<Persona[]>();

  constructor() {}

  getData() {
    return this.http
      .get<GetPersonsApiResponse>(this.baseUrl + '/nombre')
      .pipe(map((response) => response.data));
  }

  getDatafilter() {
    return this.http
      .get<GetPersonsApiResponse>(this.baseUrl)
      .pipe(map((response) => response.data));
  }

  getDataPageable(p: number, s: number) {
    return this.http
      .get<GetPersonsApiResponse>(
        `${this.baseUrl}/nombre?nombres=&Page=${p}&RecordsPerPage=${s}`
      )
      .pipe(map((response) => response.data));
  }

  getPaginado(search?: string, pageSize?: number, pageIndex?: number) {
    let params = new HttpParams();

    if (search) {
      params = params.set('search', search);
    }
    if (pageSize != null) {
      params = params.set('recordsPerPage', pageSize.toString());
    }
    if (pageIndex != null) {
      params = params.set('page', pageIndex.toString());
    }

    return this.http
      .get<BaseResponseGeneric<PersonaResponseDto[]>>(`${this.baseUrl}`, {
        params,
        observe: 'response',
      })
      .pipe(
        map((response) => {
          const data = response.body?.data ?? [];
          console.log('data', data);

          const total = parseInt(
            response.headers.get('totalrecordsquantity') ?? '0',
            10
          );

          return {
            data,
            meta: {
              total,
              pageIndex,
              pageSize,
            },
          };
        })
      );
  }

  getDataByEmail(email: string) {
    return this.http
      .get<GetPersonsApiResponse>(this.baseUrl + '/email?email=' + email)
      .pipe(map((response) => response.data));
  }

  getByNumDocumento(numDocumento: string) {
    const params = new HttpParams().set('numDocumento', numDocumento);

    return this.http
      .get<BaseResponseGeneric<PersonaResponseDto>>(
        `${this.baseUrl}/numDocumento`,
        {
          params,
        }
      )
      .pipe(map((response) => response));
  }

  // getByNumDocumento(numDocumento: string) {
  //   return this.http
  //     .get<GetPersonsApiResponse>(this.baseUrl + '/email?email=' + numDocumento)
  //     .pipe(map((response) => response.data));
  // }

  deletePerson(id: number) {
    return this.http.delete<DeletePersonResponse>(this.baseUrl + '/' + id);
  }

  getPerson(id: number) {
    return this.http.get<GetPersonApiResponse>(this.baseUrl + '/' + id);
  }

  //editar version 2
  update(id: number, persondialog: PersonaRequestDto) {
    return this.http.put(`${this.baseUrl}/${id}`, persondialog);
  }

  //nuevo version 2
  add(personadialog: PersonaRequestDto) {
    return this.http.post(`${this.baseUrl}/`, personadialog);
  }

  finalized(id: number) {
    return this.http.delete<DeletePersonResponse>(
      `${this.baseUrl}/finalized/${id}`
    );
  }
  initialized(id: number) {
    return this.http.get<DeletePersonResponse>(
      `${this.baseUrl}/initialized/${id}`
    );
  }

  //nuevo version 1
  new(user: PersonaNew) {
    return this.http.post(this.baseUrl + '/', {
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
    return this.http.put(this.baseUrl + '/' + user.id, {
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
