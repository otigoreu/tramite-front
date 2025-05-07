import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { BrandingComponent } from 'src/app/layouts/full/vertical/sidebar/branding.component';
import { NavItem } from 'src/app/layouts/full/vertical/sidebar/nav-item/nav-item';
import { navItems } from 'src/app/layouts/full/vertical/sidebar/sidebar-data';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/service/auth.service';
import { MenuService } from 'src/app/service/menu.service';
import { PersonaServiceService } from 'src/app/service/persona-service.service';
import { UserService } from 'src/app/service/user.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule, BrandingComponent],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {

  options = this.settings.getOptions();

  constructor(private settings: CoreService){}

  loginForm = new FormGroup({
    //email: new FormControl('', [Validators.required, Validators.email]),
    dni: new FormControl('', [Validators.required, Validators.minLength(8),Validators.maxLength(8)]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

authService = inject(AuthService);
  usuarioService=inject(UserService);
  router = inject(Router);
  notifications = inject(NotificationsService);
  personaService = inject(PersonaServiceService);
  menuService = inject(MenuService);

  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboards/dashboard1']);
  }

  login() {
      const dni = this.loginForm.controls.dni.value!;
      const password = this.loginForm.controls.password.value!;

     // this.usuarioService.loginUser(dni, password).subscribe((response) => {
      this.authService.login(dni, password).subscribe((response) => {
        console.log('response con data 1', response);
        if (response && response.success) {
          console.log('login successfull1');

          //para el localstorage
          localStorage.setItem('token', response.data.token);

          //cargar los siganals
          this.authService.nombreApellido.set(response.data.persona.nombres + ' ' + response.data.persona.apellidos);
          this.authService.userEmail.set(response.data.persona.email),this.authService.userName.set(dni);
          this.authService.userRole.set(response.data.roles[0]);
          this.authService.aplicacion.set(response.data.aplicaciones[0].descripcion);
          this.authService.sede.set(response.data.sede.descripcion);
          this.authService.idAplicacion.set((response.data.aplicaciones[0].id).toString());

          //agregar al localStorage userEmail y el userRole
          localStorage.setItem('userRole', this.authService.userRole());
          localStorage.setItem('Aplicacion', this.authService.aplicacion());

          localStorage.setItem('sede', this.authService.sede());
          localStorage.setItem('userEmail', this.authService.userEmail());
          localStorage.setItem(
            'nombreApellido',
            this.authService.nombreApellido()
          );
          localStorage.setItem('userName', this.authService.userName());

          //signals
          this.authService.loggedIn.set(true);
          this.notifications.success(
            'Login Exitoso',
            'Bienvenido a Tramite Goreu'
          );
          localStorage.setItem('idAplicacion',this.authService.idAplicacion());

          //tarer menu por aplicacion
          this.menuService
            .GetByAplicationAsync(response.data.aplicaciones[0].id)
            .subscribe((data: any[]) => {
              console.log('menu', data);
              data.forEach((nav) => {
                console.log('nav', nav);
                if (!nav.parentMenuId) {
                  const navItem: NavItem = {
                    id: nav.id,
                    displayName: nav.displayName,
                    iconName: nav.iconName,
                    route: nav.route,
                    children: [],
                  };
                  navItems.push(navItem);
                }
              });

              navItems.forEach((parentNav: NavItem) => {
                parentNav.children = data.filter(
                  (nav) => nav.parentMenuId === parentNav.id
                );
              });
            });

          this.router.navigate(['/pages/persona']);
        } else {
          this.notifications.error('Login Fallido', 'Revisa tus credenciales');
          console.log('login falied');
        }
      });
    }
 }
