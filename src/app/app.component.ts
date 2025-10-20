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
    const publicRoutes = [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
      '/change-password',
    ];

    const currentUrl = window.location.pathname;

    // ✅ Si estás en una ruta pública, no redirijas
    if (publicRoutes.some((r) => currentUrl.startsWith(r))) {
      return;
    }

    const userRole = localStorage.getItem('userRole');
    const userIdRol = localStorage.getItem('userIdRol');
    const userName = localStorage.getItem('userName');
    const unidadOrganicas = localStorage.getItem('unidadOrganica');
    const aplicacion = localStorage.getItem('Aplicacion');
    const userEmail = localStorage.getItem('userEmail');
    const nombreApellido = localStorage.getItem('nombreApellido');
    const idAplicacion = localStorage.getItem('idAplicacion');
    const entidad = localStorage.getItem('entidad');
    const rolesString = localStorage.getItem('roles');
    const idEntidad=localStorage.getItem('idEntidad');
    // console.log('---------------------------------------');

    // console.log('localStorage Sede =' + unidadOrganicas);
    // console.log('localStorage rol =' + userRole);
    // console.log('localStorage userIdRole=' + userIdRol);
    // console.log('localStorage nivelRole=' + nivelRol);
    // console.log('localStorage Name =' + userName);
    // console.log('localStorage Aplicacion =' + aplicacion);
    // console.log('localStorage email=' + userEmail);
    // console.log('localStorage nombreApellido=' + nombreApellido);
    // console.log('localStorage idAplicacion =' + idAplicacion);

    // console.log('---------------------------------------');

    if (
      unidadOrganicas &&
      userRole &&
      userIdRol &&
      entidad &&
      rolesString &&
      userName &&
      aplicacion &&
      userEmail &&
      nombreApellido &&
      idAplicacion&&
      idEntidad
    ) {
      const roles = JSON.parse(rolesString);
      //console.log('roles=',roles);
      this.authService.aplicacion.set(aplicacion);
      this.authService.unidadOrganicas.set(unidadOrganicas);
      this.authService.userRole.set(userRole);
      this.authService.userIdRol.set(userIdRol);
      this.authService.userName.set(userName);
      this.authService.userEmail.set(userEmail);
      this.authService.nombresApellidos.set(nombreApellido);
      this.authService.idAplicacion.set(idAplicacion);
      this.authService.entidad.set(entidad);
      this.authService.idEntidad.set(idEntidad);
      this.authService.roles.update((rolArray) => [...rolArray, ...roles]);
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
      //console.log('idAplicacion: '+idAplicacion);
      this.menuService
        .GetByAplicationAsync(parseInt(idAplicacion))
        .subscribe((data: any[]) => {
          //console.log('menu', data);
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

  // constructor() {
  //   const userRole = localStorage.getItem('userRole');
  //   const userIdRol = localStorage.getItem('userIdRol');
  //   const nivelRol = localStorage.getItem('nivelRol');
  //   const userName = localStorage.getItem('userName');
  //   const unidadOrganicas = localStorage.getItem('unidadOrganica');
  //   const aplicacion = localStorage.getItem('Aplicacion');
  //   const userEmail = localStorage.getItem('userEmail');
  //   const nombreApellido = localStorage.getItem('nombreApellido');
  //   const idAplicacion = localStorage.getItem('idAplicacion');
  //   const entidad = localStorage.getItem('entidad');
  //   // console.log('---------------------------------------');

  //   // console.log('localStorage Sede =' + unidadOrganicas);
  //   // console.log('localStorage rol =' + userRole);
  //   // console.log('localStorage userIdRole=' + userIdRol);
  //   // console.log('localStorage nivelRole=' + nivelRol);
  //   // console.log('localStorage Name =' + userName);
  //   // console.log('localStorage Aplicacion =' + aplicacion);
  //   // console.log('localStorage email=' + userEmail);
  //   // console.log('localStorage nombreApellido=' + nombreApellido);
  //   // console.log('localStorage idAplicacion =' + idAplicacion);

  //   // console.log('---------------------------------------');

  //   if (
  //     unidadOrganicas &&
  //     userRole &&
  //     userIdRol&&
  //     nivelRol&&
  //     entidad &&
  //     userName &&
  //     aplicacion &&
  //     userEmail &&
  //     nombreApellido &&
  //     idAplicacion
  //   ) {
  //     this.authService.aplicacion.set(aplicacion);
  //     this.authService.unidadOrganicas.set(unidadOrganicas);
  //     this.authService.userRole.set(userRole);
  //     this.authService.userIdRol.set(userIdRol);
  //     this.authService.nivelRol.set(nivelRol);
  //     this.authService.userName.set(userName);
  //     this.authService.userEmail.set(userEmail);
  //     this.authService.nombresApellidos.set(nombreApellido);
  //     this.authService.idAplicacion.set(idAplicacion);
  //     this.authService.entidad.set(entidad);
  //     // console.log('signal rol =' + this.authService.userRole());
  //     // console.log('signal Name =' + this.authService.userName());
  //     // console.log('signal sede =' + this.authService.unidadOrganicas());
  //     // console.log('signal Aplicacion =' + this.authService.aplicacion());
  //     // console.log('signal rol para el menu en el  appCoponent='+this.authService.userRole());
  //     // console.log('---------------------------------------');

  //     // if (this.authService.userRole() === 'Administrador') {
  //     //   navItemsAdmin.forEach((item) => {
  //     //     navItems.push(item);
  //     //   });
  //     // } else if (this.authService.userRole() === 'Cliente') {
  //     //   navItemsUser.forEach((item) => {
  //     //     navItems.push(item);
  //     //   });
  //     // }
  //   } else {
  //     localStorage.clear();
  //     this.router.navigate(['/login']);
  //   }

  //   //traer menu por aplicacion
  //   if (idAplicacion) {
  //     console.log('idAplicacion: '+idAplicacion);
  //     this.menuService
  //       .GetByAplicationAsync(parseInt(idAplicacion))
  //       .subscribe((data: any[]) => {
  //         console.log('menu', data);
  //         data.forEach((nav) => {
  //           //  console.log('nav', nav);
  //           if (!nav.idMenuPadre) {
  //             const navItem: NavItem = {
  //               id: nav.id,
  //               displayName: nav.descripcion,
  //               iconName: nav.icono,
  //               route: nav.ruta,
  //               children: [],
  //             };
  //             navItems.push(navItem);
  //           }
  //         });

  //         navItems.forEach((parentNav: NavItem) => {
  //           parentNav.children = data.filter(
  //             (nav) => nav.idMenuPadre === parentNav.id
  //           );
  //         });
  //       });
  //   }
  // }
}
