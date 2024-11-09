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
    const userRole = localStorage.getItem('userRole');
    const userName = localStorage.getItem('userName');
    const sede = localStorage.getItem('sede');
    const aplicacion = localStorage.getItem('Aplicacion');
    const userEmail = localStorage.getItem('userEmail');
    const nombreApellido = localStorage.getItem('nombreApellido');
    console.log('---------------------------------------');

    console.log('localStorage rol =' + userRole);
    console.log('localStorage Name =' + userName);
    console.log('localStorage Sede =' + sede);
    console.log('localStorage Aplicacion =' + aplicacion);

    console.log('---------------------------------------');

    if (
      sede &&
      userRole &&
      userName &&
      aplicacion &&
      userEmail &&
      nombreApellido
    ) {
      this.authService.aplicacion.set(aplicacion);
      this.authService.sede.set(sede);
      this.authService.userRole.set(userRole);
      this.authService.userName.set(userName);
      this.authService.userEmail.set(userEmail);
      this.authService.nombreApellido.set(nombreApellido);

      console.log('signal rol =' + this.authService.userRole());
      console.log('signal Name =' + this.authService.userName());
      console.log('signal sede =' + this.authService.sede());
      console.log('signal Aplicacion =' + this.authService.aplicacion());
      console.log('---------------------------------------');

      console.log(
        'signal rol para el menu en el  appCoponent=' +
          this.authService.userRole()
      );
      if (this.authService.userRole() === 'Administrador') {
        navItemsAdmin.forEach((item) => {
          navItems.push(item);
        });
      } else if (this.authService.userRole() === 'Cliente') {
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
