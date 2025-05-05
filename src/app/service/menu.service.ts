

import { HttpClient} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { Menu, MenuInfo, MenuWithRol } from '../model/menu';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment.development';

interface GetMenu{
  data:MenuInfo[];
  success:string;
  errorMessage:string;
}

interface DeleteMenu{
  success: string;
  errorMessage: string;
}
interface InitMenu{
  success: string;
  errorMessage: string;
}
@Injectable({
  providedIn: 'root',
})
export class MenuService {
  baseUrl = environment.baseUrl;
  http = inject(HttpClient);

  constructor() {}

  GetByAplicationAsync(idAplicacion: number) {
    return this.http.get<GetMenu>(this.baseUrl + '/api/menus/' + idAplicacion)
      .pipe(map((response) => response.data));
  }

  getDataIgnoreQuery(){
    return this.http.get<GetMenu>(`${this.baseUrl}/api/menus/displayName`)
    .pipe(map((response)=>response.data));
  }
  save(menu:Menu){
    return this.http.post(`${this.baseUrl}/api/menus/single`,menu);
  }
  saveWithRol(menu:MenuWithRol){
    return this.http.post(`${this.baseUrl}/api/menus`,menu);
  }
  update(id:number, menu:Menu){
    return this.http.put(`${this.baseUrl}/api/menus/single/?id=${id}`,menu)
  }
  updateWithRol(id:number, menu:Menu){
    return this.http.put(`${this.baseUrl}/api/menus/?id=${id}`,menu)
  }
  delete(id:number){
    return this.http.delete<DeleteMenu>(`${this.baseUrl}/api/menus/${id}`);
  }
  finalized(id:number){
    return this.http.delete<DeleteMenu>(`${this.baseUrl}/api/menus/finalized/${id}`);
  }
  initialized(id:number){
    return this.http.get<InitMenu>(`${this.baseUrl}/api/menus/initialized/${id}`);
  }

}
