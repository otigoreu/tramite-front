import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Aplicacion, AplicacionWithSede, AplicacionWithSedes} from '../model/aplicacion';

import { map } from 'rxjs';
interface GetAplicacion{
  data:Aplicacion[];
  success:string;
  errorMessage:string;
}
interface GetAplicacionWithSede{
  data:AplicacionWithSede[];
  success:string;
  errorMessage:string;
}

interface DeleteApp{
  success: string;
  errorMessage: string;
}
interface InitApp{
  success: string;
  errorMessage: string;
}

@Injectable({
  providedIn: 'root'
})
export class AplicacionService {

  baseUrl=environment.baseUrl;
  http=inject(HttpClient);


  constructor() { }

getDataWithSede(){
  return this.http.get<GetAplicacionWithSede>(`${this.baseUrl}/api/aplicaciones/descripcionWithSede`)
  .pipe(map((response)=>response.data))
}
getDataIgnoreQuery(){
      return this.http.get<GetAplicacion>(`${this.baseUrl}/api/aplicaciones/descripcion`)
      .pipe(map((response)=>response.data));

    }

save (aplicacion:Aplicacion){
  return this.http.post(`${this.baseUrl}/api/aplicaciones/single`,aplicacion);
}
saveWithSede (aplicacion:AplicacionWithSedes){
  return this.http.post(`${this.baseUrl}/api/aplicaciones`,aplicacion);
}

update(id:number,aplicacion:AplicacionWithSedes){
  return this.http.put(`${this.baseUrl}/api/aplicaciones/?id=${id}`,aplicacion);
}

delete(id:number){
  return this.http.delete<DeleteApp>(`${this.baseUrl}/api/aplicaciones/${id}`);
}

finalized(id:number){
  return this.http.delete<DeleteApp>(`${this.baseUrl}/api/aplicaciones/finalized/${id}`)
}

initialized(id:number){
  return this.http.get<InitApp>(`${this.baseUrl}/api/aplicaciones/initialized/${id}`);
}
}
