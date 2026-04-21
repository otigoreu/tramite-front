import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
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
import { notify1, notify14, notify6 } from 'src/app/data/mensajes.data';
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
import { Subject, takeUntil } from 'rxjs';

//EXTRAER LAS RUTAS DE FORMA JERÁRQUICA
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

//------------------------------------------------------------------------------///
//EXTRAER LAS RUTAS DE FORMA JERÁRQUICA DE LOS HIJOS DE PAGES
export function getPageChildRoutes(): Routes {
  return [...PagesRoutes];
}

export function getPageChildPathStrings(): string[] {
  return getPageChildRoutes().flatMap((route) => {
    const parentPath = `pages/${route.path}` || '';
    if (route.children) {
      return [
        parentPath,
        ...route.children.map((child) =>
          `${parentPath}/${child.path}`.replace(/\/\/+/g, '/'),
        ),
      ];
    }
    return [parentPath];
  });
}

const allPageChildPaths = getPageChildPathStrings();
//------------------------------------------------------------------------------///

const menuPaths = allPaths.concat(allPageChildPaths);

//------------------------------------------------------------------------------///

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
export class LoginComponent implements OnDestroy{
   private destroy$ = new Subject<void>();
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
  notificationsHEader = inject(NotificationsService);
  contadorfor = 0;
  contador = 0;

  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboards/dashboard1']);
  }

  login() {
    this.authService.menusPaths.set(menuPaths);
    // console.log('rutas',allPaths);
    // console.log('rutas menus',menuPaths );
    // console.log('menuspathsignal',this.authService.menusPaths());
    // console.log('entro allogin');
    const dni = this.loginForm.controls.dni.value!;
    const password = this.loginForm.controls.password.value!;

    this.authService.login(dni, password).subscribe((response) => {
      //console.log('entro a autentificarse');
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

        //console.log('rol',response.data.roles);

        this.authService.roles.set(response.data.roles);
        //----------------------------INICIO FOR EARCH--------------------------------------------------///

        response.data.roles.forEach((rol: Rol) => {
          this.contadorfor++;

          // console.log('entro al for');
          // console.log('idRol',rol.id );
          this.menuService
            .getDataAllByRol(rol.id!.toString())
            .subscribe((data: MenuInfo[]) => {
              // console.log('menus', data);
              // console.log('menusPaths', this.authService.menusPaths());

              //----inicio if para comparar menus del rol con menu del sistema---------------------------//

              if (
                data.some((item) =>
                  this.authService.menusPaths().includes(item.ruta),
                )
              ) {
                this.contador++;
                // console.log('menu valido');
                // console.log('idRol',rol.id);
                // console.log('namerol',rol.name);
                this.authService.userRole.set(rol.name);
                this.authService.userIdRol.set(rol.id!.toString());
                localStorage.setItem('userRole', this.authService.userRole());
                localStorage.setItem('userIdRol', this.authService.userIdRol());
                // console.log('rol name:', this.authService.userRole());
                // console.log('rol id:', this.authService.userIdRol());
                //------------------------------------------------------------------//

                this.appservice
                  .GetByAplicationPerRol(this.authService.userIdRol())
                  .subscribe((appRol) => {
                    //console.log('AppRol :', appRol);
                    this.authService.aplicacion.set(appRol.descripcion);
                    this.authService.idAplicacion.set(appRol.id.toString());
                    localStorage.setItem(
                      'Aplicacion',
                      this.authService.aplicacion(),
                    );
                    localStorage.setItem(
                      'idAplicacion',
                      this.authService.idAplicacion(),
                    );
                    //carga los menus por ID de aplicacion y rol
                    this.menuService.GetByAplicationWithIdRol(this.authService.userIdRol())
                    //this.menuService.GetByAplicationAsync(parseInt(this.authService.idAplicacion()),)
                    .pipe(takeUntil(this.destroy$))
                      .subscribe({
                        next: (data: any[]) => {
                          //console.log('entro a crear el menu ');
                          //console.log('menu', data);
                          navItems.length = 0;
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
                              // Limpiar el array antes de agregar nuevos elementos
                              navItems.push(navItem);
                              this.firstOptionMenu.set(navItems[0].route!);
                            }
                          });

                          (this.router.navigate([this.firstOptionMenu()]),
                            navItems.forEach((parentNav: NavItem) => {
                              parentNav.children = data.filter(
                                (nav) => nav.idMenuPadre === parentNav.id,
                              );
                              // console.log('PRIEMR MENU',this.firstOptionMenu());
                            }));
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

                // this.notifications.set(notify1, true);
                //----------------------------------------------------------------------//
                // this.authService.roles.update((arr) => []);

                //console.log('Array2 de Roles en login',this.authService.roles());
                this.entidadservice
                  .GetByEntidadPerRol(this.authService.userIdRol())
                  .subscribe((entidadRol: Entidad) => {
                    this.authService.entidad.set(entidadRol.descripcion);
                    this.authService.idEntidad.set(entidadRol.id.toString());
                    localStorage.setItem('entidad', entidadRol.descripcion);
                    localStorage.setItem('idEntidad', entidadRol.id.toString());
                  });

              }


              //----FIN IF -------------------------------------------------------------------------//
            });
          //-------------------------------FIN DE MENUS POR ROL------------------------------------------------
        });

        //----------------------------FIN FOR EARCH-------------------------------------------------///

        this.authService.unidadOrganicas.set(
          response.data.unidadOrganicas[0].descripcion,
        );
        //agregar al localStorage userEmail y el userRole
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
        localStorage.setItem('idUsuario', response.data.idUsuario);
        //signals
        this.authService.loggedIn.set(true);
        if(this.authService.loading()){
          this.notifications.set(notify1, true);
        }
      } else {
        this.notifications.set(notify6, true);
      }
      ///final de la función login
    });
  }

  onCaptchaVerified(isValid: boolean) {
    this.captchaValid = isValid;
  }

   ngOnDestroy(): void {
    //console.log('ingresando al ngDestroy login');
    this.destroy$.next();
    this.destroy$.complete();
  }
}
