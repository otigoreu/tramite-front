import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Aplicacion} from '../model/aplicacion';

import { map } from 'rxjs';
interface GetAplicacion{
  data:Aplicacion[];
  success:string;
  errorMessage:string;
}

@Injectable({
  providedIn: 'root'
})
export class AplicacionService {

  baseUrl=environment.baseUrl;
  http=inject(HttpClient);


  constructor() { }

getData(){
  return this.http.get<GetAplicacion>(`${this.baseUrl}/api/aplicaciones`)
  .pipe(map((response)=>response.data))
}

save (aplicacion:Aplicacion){
  return this.http.post(`${this.baseUrl}/api/aplicaciones/`,aplicacion);
}

update(id:number,aplicacion:Aplicacion){
  return this.http.post(`${this.baseUrl}/api/aplicaciones/?id=${id}`,aplicacion);
}



}
