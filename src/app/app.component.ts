import { Component, inject, OnDestroy } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Options, SimpleNotificationsModule } from 'angular2-notifications';
import { AuthService } from './service/auth.service';
import { NgxLoadingModule } from 'ngx-loading';
import { NavItem } from 'src/app/layouts/full/vertical/sidebar/nav-item/nav-item';
import {
  navItems,
  navItemsAdmin,
  navItemsUser,
} from './layouts/full/vertical/sidebar/sidebar-data';
import { MenuService } from './service/menu.service';

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
    // position: ['top', 'left'],
    timeOut: 3000,
  };

  authService = inject(AuthService);
  router = inject(Router);
  menuService = inject(MenuService);

  constructor() {
    const userRole = localStorage.getItem('userRole');
    const userIdRol = localStorage.getItem('userIdRol');
    const userName = localStorage.getItem('userName');
    const unidadOrganicas = localStorage.getItem('unidadOrganica');
    const aplicacion = localStorage.getItem('Aplicacion');
    const userEmail = localStorage.getItem('userEmail');
    const nombreApellido = localStorage.getItem('nombreApellido');
    const idAplicacion = localStorage.getItem('idAplicacion');
    // console.log('---------------------------------------');

    // console.log('localStorage rol =' + userRole);
    // console.log('localStorage Name =' + userName);
    // console.log('localStorage Sede =' + unidadOrganicas);
    // console.log('localStorage Aplicacion =' + aplicacion);
    // console.log('localStorage idAplicacion =' + idAplicacion);

    // console.log('---------------------------------------');

    if (
      unidadOrganicas &&
      userRole &&
      userIdRol&&
      userName &&
      aplicacion &&
      userEmail &&
      nombreApellido &&
      idAplicacion
    ) {
      this.authService.aplicacion.set(aplicacion);
      this.authService.unidadOrganicas.set(unidadOrganicas);
      this.authService.userRole.set(userRole);
      this.authService.userIdRol.set(userIdRol);
      this.authService.userName.set(userName);
      this.authService.userEmail.set(userEmail);
      this.authService.nombresApellidos.set(nombreApellido);
      this.authService.idAplicacion.set(idAplicacion);

      // console.log('signal rol =' + this.authService.userRole());
      // console.log('signal Name =' + this.authService.userName());
      // console.log('signal sede =' + this.authService.unidadOrganicas());
      // console.log('signal Aplicacion =' + this.authService.aplicacion());
      // console.log('signal rol para el menu en el  appCoponent='+this.authService.userRole());
      // console.log('---------------------------------------');

      // if (this.authService.userRole() === 'Administrador') {
      //   navItemsAdmin.forEach((item) => {
      //     navItems.push(item);
      //   });
      // } else if (this.authService.userRole() === 'Cliente') {
      //   navItemsUser.forEach((item) => {
      //     navItems.push(item);
      //   });
      // }
    } else {
      localStorage.clear();
      this.router.navigate(['/login']);
    }

    //traer menu por aplicacion
    if (idAplicacion) {
      // console.log('idAplicacion: '+idAplicacion);
      this.menuService
        .GetByAplicationAsync(parseInt(idAplicacion))
        .subscribe((data: any[]) => {
          // console.log('menu', data);
          data.forEach((nav) => {
            //  console.log('nav', nav);
            if (!nav.idMenuPadre) {
              const navItem: NavItem = {
                id: nav.id,
                displayName: nav.descripcion,
                iconName: nav.icono,
                route: nav.ruta,
                children: [],
              };
              navItems.push(navItem);
            }
          });

          navItems.forEach((parentNav: NavItem) => {
            parentNav.children = data.filter(
              (nav) => nav.idMenuPadre === parentNav.id
            );
          });
        });
    }
  }
}
