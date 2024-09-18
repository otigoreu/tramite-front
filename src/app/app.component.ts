import { Component, inject, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Options, SimpleNotificationsModule } from 'angular2-notifications';
import { AuthService } from './service/auth.service';
import { NgxLoadingModule } from 'ngx-loading';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SimpleNotificationsModule, NgxLoadingModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Modernize Angular Admin Tempplate';
  notificationsOptions: Options = {
    position: ['top', 'right'],
    timeOut: 3000,
  };

  authService = inject(AuthService);

  // constructor() {
  //   console.log(this.authService.userEmail());

  //   // localStorage.setItem('userEmail', this.authService.userEmail());
  //   //     localStorage.setItem('UserRole', this.authService.userRole());
  //   //     localStorage.setItem('UserName', this.authService.userName());
  // }
}
