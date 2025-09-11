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
import { Router, RouterModule } from '@angular/router';
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

  constructor(private settings: CoreService) {}

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
  router = inject(Router);
  notifications = inject(NotificationsService);
  personaService = inject(PersonaServiceService);
  menuService = inject(MenuService);
  menu1: string = '';
  firstOptionMenu = signal('');

  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboards/dashboard1']);
  }

  login() {
    const dni = this.loginForm.controls.dni.value!;
    const password = this.loginForm.controls.password.value!;

    // this.usuarioService.loginUser(dni, password).subscribe((response) => {
    this.authService.login(dni, password).subscribe((response) => {
      if (response && response.success) {
        console.log('llego');
        console.log(response);

        //para el localstorage
        localStorage.setItem('token', response.data.token);

        //cargar los siganals
        this.authService.nombresApellidos.set(
          response.data.persona.nombres +
            ' ' +
            response.data.persona.apellidoPat +
            ' ' +
            response.data.persona.apellidoMat
        );
        this.authService.userEmail.set(response.data.persona.email);
        this.authService.userName.set(dni);
        this.authService.userRole.set(response.data.roles[0].name);
        this.authService.userIdRol.set(response.data.roles[0].id);
        this.authService.nivelRol.set(response.data.roles[0].nivel);
        this.authService.entidad.set(response.data.entidad.descripcion);

        this.authService.aplicacion.set(
          response.data.aplicaciones[0].descripcion
        );
        this.authService.unidadOrganicas.set(
          response.data.unidadOrganicas[0].descripcion
        );
        this.authService.idAplicacion.set(
          response.data.aplicaciones[0].id.toString()
        );

        //agregar al localStorage userEmail y el userRole
        localStorage.setItem('userRole', this.authService.userRole());
        localStorage.setItem('userIdRol', this.authService.userIdRol());
        localStorage.setItem('nivelRol', this.authService.nivelRol());
        localStorage.setItem('Aplicacion', this.authService.aplicacion());
        localStorage.setItem('entidad', this.authService.entidad());

        localStorage.setItem(
          'unidadOrganica',
          this.authService.unidadOrganicas()
        );
        localStorage.setItem('userEmail', this.authService.userEmail());
        localStorage.setItem(
          'nombreApellido',
          this.authService.nombresApellidos()
        );
        localStorage.setItem('userName', this.authService.userName());

        //signals
        this.authService.loggedIn.set(true);

        localStorage.setItem('idAplicacion', this.authService.idAplicacion());
        localStorage.setItem('idEntidad', response.data.entidad.id.toString());
        localStorage.setItem('idUsuario', response.data.idUsuario);

        //tarer menu por aplicacion
        console.log('menuService');

        this.menuService
          .GetByAplicationAsync(response.data.aplicaciones[0].id)
          .subscribe({
            next: (data: any[]) => {
              console.log('menu', data);

              data.forEach((nav) => {
                // console.log('nav', nav);
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

              this.router.navigate([this.firstOptionMenu()]),
                navItems.forEach((parentNav: NavItem) => {
                  parentNav.children = data.filter(
                    (nav) => nav.idMenuPadre === parentNav.id
                  );
                });

              this.notifications.set(notify1, true);
            },
            error: (err) => {
              console.error('Error al obtener menú:', err);
              this.notifications.info(
                ...NotificationMessages.info(
                  'El usuario no tiene permisos asignados.'
                )
              );
            },
          });
      } else {
        this.notifications.set(notify6, true);
      }
    });
  }

  onCaptchaVerified(isValid: boolean) {
    this.captchaValid = isValid;
  }
}
