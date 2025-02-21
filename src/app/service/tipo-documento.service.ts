import { inject, Injectable } from '@angular/core';
import { TipoDocumento } from '../model/tipoDocumento';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs';

interface GetTipoDocumentoApiResponse{
  data:TipoDocumento[];
  success:string;
  errorMessage:string;
}

interface DeleteTipoDocu {
  success: string;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  baseUrl=environment.baseUrl;
    http= inject(HttpClient);

  constructor() { }

  getData(){
      return this.http.get<GetTipoDocumentoApiResponse>(`${this.baseUrl}/api/tipodocumentos`)
      .pipe(map((response)=>response.data));
    }

    getDataIgnoreQuery(){
      return this.http.get<GetTipoDocumentoApiResponse>(`${this.baseUrl}/api/tipodocumentos/descripcion`)
      .pipe(map((response)=>response.data));
    }

    update(id:number,tipoducmento: TipoDocumento) {
      return this.http.put(`${this.baseUrl}/api/tipodocumentos/?id=${id}`,tipoducmento);
    }


    save(tipoducmento: TipoDocumento) {
      return this.http.post(`${this.baseUrl}/api/tipodocumentos/`,tipoducmento);
    }

    deleteTipoDocu(id: number){
      return this.http.delete<DeleteTipoDocu>(`${this.baseUrl}/api/tipodocumentos/${id}`);
    }

    finalized(id: number){
      return this.http.delete<DeleteTipoDocu>(`${this.baseUrl}/api/tipodocumentos/finalized/${id}`);
    }
    initialized(id: number){
      return this.http.get<DeleteTipoDocu>(`${this.baseUrl}/api/tipodocumentos/initialized/${id}`);

    }
}
