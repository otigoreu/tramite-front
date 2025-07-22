import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Sede } from '../model/sede';
import { map } from 'rxjs';



interface GetSede{
  data:Sede[];
  success:string;
  erroMessage:string;
}
interface DeleteSede{
  success:string;
  erroMessage:string;
}
interface InitSede{
  success:string;
  erroMessage:string;
}

@Injectable({
  providedIn: 'root'
})
export class SedeService {

  baseUrl=environment.baseUrl;
  http=inject(HttpClient);

  constructor() { }


  getData(){
    return this.http.get<GetSede>(`${this.baseUrl}/api/sedes`)
    .pipe(map((response)=>response.data))
  }
  getDataIgnoreQuery(){
    return this.http.get<GetSede>(`${this.baseUrl}/api/sedes/descripcion`)
    .pipe(map((response)=>response.data))
  }
  save(sede:Sede){
    return this.http.post(`${this.baseUrl}/api/sedes`,sede);
  }
  update(id:number, sede:Sede){
    return this.http.put(`${this.baseUrl}/api/sedes/?id=${id}`,sede)
  }
  delete(id:number){
    return this.http.delete<DeleteSede>(`${this.baseUrl}/api/sedes/${id}`)
  }
  initialized(id:number){
    return this.http.get<InitSede>(`${this.baseUrl}/api/sedes/initialized/${id}`);
  }
  finalized(id:number){
    return this.http.delete<DeleteSede>(`${this.baseUrl}/api/sedes/finalized/${id}`);
  }
}
