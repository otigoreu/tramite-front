import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { NotificationsService } from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class FirmaService {

  private http= inject(HttpClient);
  private baseUrl=environment.baseUrlFirma;
  private NotificationsService= inject(NotificationsService);

  constructor() { }

  
}
