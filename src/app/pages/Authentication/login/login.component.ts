import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule, Routes } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';

import { NavItem } from 'src/app/layouts/full/vertical/sidebar/nav-item/nav-item';
import { navItems } from 'src/app/layouts/full/vertical/sidebar/sidebar-data';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/service/auth.service';
import { MenuService } from 'src/app/service/menu.service';
import { PersonaServiceService } from 'src/app/service/persona-service.service';
import { UserService } from 'src/app/service/user.service';
import { CoreService } from 'src/app/services/core.service';
import { SimpleCaptchaComponent } from '../simple-captcha/simple-captcha.component';
import { notify1, notify6 } from 'src/app/data/mensajes.data';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { ChangePasswordComponent } from '../change-Password/change-Password.component';
import { MatDialog } from '@angular/material/dialog';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { EntidadService } from 'src/app/service/entidad.service';
import { PagesRoutes } from '../../pages.routes';
import { routes } from 'src/app/app.routes';
import { Menu, MenuInfo, Menus } from 'src/app/model/menu';
import { Entidad } from 'src/app/model/entidad';
import { Rol } from 'src/app/model/rol';

//METODO DOS PARA EXTRAER LAS RUTAS DE FORMA JERÁRQUICA
export function extractRoutePaths(routes: Routes): string[] {
  const paths: string[] = [];

  function collectPaths(routeList: Routes, parentPath: string = '') {
    routeList.forEach((route) => {
      const fullPath = parentPath + '' + (route.path || '');
      if (route.path) {
        paths.push(fullPath.replace('//', '/'));
      }
      if (route.children) {
        collectPaths(route.children, fullPath);
      }
    });
  }

  collectPaths(routes);
  return paths;
}
const allPaths = extractRoutePaths(routes);
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SimpleCaptchaComponent,
  ],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  hide = true;
  options = this.settings.getOptions();

  constructor(
    private settings: CoreService,
    public dialog: MatDialog,
  ) {}

  captchaValid = false;

  loginForm = new FormGroup({
    //email: new FormControl('', [Validators.required, Validators.email]),
    dni: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(8),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  authService = inject(AuthService);
  usuarioService = inject(UserService);
  appservice = inject(AplicacionService);
  entidadservice = inject(EntidadService);
  router = inject(Router);
  notifications = inject(NotificationsService);
  personaService = inject(PersonaServiceService);
  menuService = inject(MenuService);
  menu1: string = '';
  firstOptionMenu = signal('');
  tope = signal('no');

  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboards/dashboard1']);
  }

  login() {
    const dni = this.loginForm.controls.dni.value!;
    const password = this.loginForm.controls.password.value!;

    this.authService.login(dni, password).subscribe((response) => {
      if (response && response.success) {
        //para el localstorage
        localStorage.setItem('token', response.data.token);

        //cargar los siganals
        this.authService.nombresApellidos.set(
          response.data.persona.nombres +
            ' ' +
            response.data.persona.apellidoPat +
            ' ' +
            response.data.persona.apellidoMat,
        );
        this.authService.userEmail.set(response.data.persona.email);
        this.authService.userName.set(dni);

        //------------------------------------------------------------------------------///

        response.data.roles.forEach((rol:Rol)=>{
          this.menuService.getDataAllByRol(rol.id!.toString()).subscribe((data:MenuInfo[])=>{
            if(data.some(item=> allPaths.includes(item.ruta))){
              this.authService.userRole.set(rol.name);
              this.authService.userIdRol.set(rol.id!.toString());
              console.log('rol name:', this.authService.userRole());
              console.log('rol id:', this.authService.userIdRol());
            }
            });
        });

        // this.authService.userRole.set(response.data.roles[0].name);
        // this.authService.userIdRol.set(response.data.roles[0].id);


        //------------------------------------------------------------------------------///
        this.appservice
          .GetByAplicationPerRol(this.authService.userIdRol())
          .subscribe((appRol) => {
            //console.log('AppRol :',appRol);
            this.authService.aplicacion.set(appRol.descripcion);
            this.authService.idAplicacion.set(appRol.id.toString());
            localStorage.setItem('Aplicacion', this.authService.aplicacion());
            localStorage.setItem(
              'idAplicacion',
              this.authService.idAplicacion(),
            );

            this.menuService
              .GetByAplicationAsync(parseInt(this.authService.idAplicacion()))
              .subscribe({
                next: (data: any[]) => {
                  //console.log('menu', data);

                  data.forEach((nav) => {
                     //console.log('nav', nav);
                    if (!nav.idMenuPadre) {
                      const navItem: NavItem = {
                        id: nav.id,
                        displayName: nav.descripcion,
                        iconName: nav.icono,
                        route: nav.ruta,
                        children: [],
                      };
                      navItems.push(navItem);
                      this.firstOptionMenu.set(navItems[0].route!);
                    }
                  });

                  (this.router.navigate([this.firstOptionMenu()]),
                    navItems.forEach((parentNav: NavItem) => {
                      parentNav.children = data.filter(
                        (nav) => nav.idMenuPadre === parentNav.id,
                      );
                    }));

                  this.notifications.set(notify1, true);
                },
                error: (err) => {
                  console.error('Error al obtener menú:', err);
                  this.notifications.info(
                    ...NotificationMessages.info(
                      'El usuario no tiene permisos asignados.',
                    ),
                  );
                },
              });
          });

//------------------------------------------------------------------------------///
        this.authService.roles.update((arr) => []);
        this.authService.roles.update((rolArray) => [
          ...rolArray,
          ...response.data.roles,
        ]);
        //console.log('Array2 de Roles en login',this.authService.roles());
        this.entidadservice
          .GetByEntidadPerRol(this.authService.userIdRol())
          .subscribe((entidadRol:Entidad) => {
            this.authService.entidad.set(entidadRol.descripcion);
            this.authService.idEntidad.set(entidadRol.id.toString());
            localStorage.setItem('entidad', entidadRol.descripcion);
            localStorage.setItem('idEntidad', entidadRol.id.toString());

          });

        this.authService.unidadOrganicas.set(
          response.data.unidadOrganicas[0].descripcion,
        );

        //agregar al localStorage userEmail y el userRole
        localStorage.setItem('userRole', this.authService.userRole());
        localStorage.setItem('userIdRol', this.authService.userIdRol());
        localStorage.setItem('roles', JSON.stringify(this.authService.roles()));

        localStorage.setItem(
          'unidadOrganica',
          this.authService.unidadOrganicas(),
        );
        localStorage.setItem('userEmail', this.authService.userEmail());
        localStorage.setItem(
          'nombreApellido',
          this.authService.nombresApellidos(),
        );
        localStorage.setItem('userName', this.authService.userName());

        //signals
        this.authService.loggedIn.set(true);




        localStorage.setItem('idUsuario', response.data.idUsuario);

        //tarer menu por aplicacion
        //console.log('menuService');
      } else {
        this.notifications.set(notify6, true);
      }
      ///final de la función login
    });
  }

  onCaptchaVerified(isValid: boolean) {
    this.captchaValid = isValid;
  }



}
