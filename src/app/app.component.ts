import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Options, SimpleNotificationsModule } from 'angular2-notifications';
import { AuthService } from './service/auth.service';
import { NgxLoadingModule } from 'ngx-loading';
import {
  navItems,
  navItemsAdmin,
  navItemsUser,
} from './layouts/full/vertical/sidebar/sidebar-data';

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
  router = inject(Router);

  constructor() {
    const userEmail = localStorage.getItem('userEmail');
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    console.log('---------------------------------------');
    console.log('localStorage correo =' + userEmail);
    console.log('localStorage rol =' + userRole);
    console.log('localStorage Name =' + userName);
    console.log('---------------------------------------');
    if (userEmail && userRole && userName) {
      this.authService.userEmail.set(userEmail);
      this.authService.userRole.set(userRole);
      this.authService.userName.set(userName);
      console.log('signal correo =' + this.authService.userEmail());
      console.log('signal rol =' + this.authService.userRole());
      console.log('signal Name =' + this.authService.userName());
      console.log('---------------------------------------');

      console.log(
        'signal rol para el menu en el  appCoponent=' +
          this.authService.userRole()
      );
      if (this.authService.userRole() === 'Administrator') {
        navItemsAdmin.forEach((item) => {
          navItems.push(item);
        });
      } else if (this.authService.userRole() === 'Customer') {
        navItemsUser.forEach((item) => {
          navItems.push(item);
        });
      }
    } else {
      localStorage.clear();
      this.router.navigate(['/login']);
    }
  }
}
