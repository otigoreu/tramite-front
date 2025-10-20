import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

import { map } from 'rxjs';
import { MenuRol } from '../model/menuRol';


  interface GetMenusRoles{
    data:MenuRol[];
    success:string;
    errorMensage:string;
  }
  interface GetMenuRol{
    data:MenuRol;
    success:string;
    errorMensage:string;
  }

@Injectable({
  providedIn: 'root'
})
export class MenurolService {
 baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() { }


  getData(idEntidad:number,idAplicacion:number,idRol:string){
    return this.http.get<GetMenusRoles>(`${this.baseUrl}/api/menuroles/rolmenusestado?idEntidad=${idEntidad}&idAplicacion=${idAplicacion}&idRol=${idRol}`)
        .pipe(map((response)=>response.data));
  }

  getDataByidRolandidMenu(idRol:string,idMenu:number){
    return this.http.get<GetMenuRol>(`${this.baseUrl}/api/menuroles/byIdRolAndIdMenu?idRol=${idRol}&idMenu=${idMenu}`)
        .pipe(map((response)=>response.data));
  }

  update(id:number,menuRol:MenuRol){
    return this.http.put(`${this.baseUrl}/api/menuroles/${id}`,menuRol);
  }

  save(menuRol:MenuRol){
    return this.http.post(`${this.baseUrl}/api/menuroles`,menuRol);
  }
}
