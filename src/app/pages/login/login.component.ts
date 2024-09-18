import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import {
  navItems,
  navItemsAdmin,
  navItemsUser,
} from 'src/app/layouts/full/vertical/sidebar/sidebar-data';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/service/auth.service';
import { PersonaServiceService } from 'src/app/service/persona-service.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  authService = inject(AuthService);
  router = inject(Router);
  notifications = inject(NotificationsService);
  personaService = inject(PersonaServiceService);
  // get f() {
  //   return this.loginForm.controls;
  // }

  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboards/dashboard1']);
  }
  login() {
    const email = this.loginForm.controls.email.value!;
    const password = this.loginForm.controls.password.value!;
    this.authService.login(email, password).subscribe((response) => {
      console.log('response', response);
      if (response && response.success) {
        console.log('login successfull');
        console.log(response.data.roles);
        localStorage.setItem('token', response.data.token);

        this.authService.userEmail.set(email);
        this.authService.userRole.set(response.data.roles[0]);

        this.authService.loggedIn.set(true);
        this.notifications.success(
          'Login Exitoso',
          'Bienvenido a Tramite Goreu'
        );
        this.personaService.getDataByEmail(email).subscribe((data: any) => {
          this.authService.userName.set(data.nombres + ' ' + data.apellidos);
        });
        localStorage.setItem('userEmail', this.authService.userEmail());
        localStorage.setItem('UserRole', this.authService.userRole());
        localStorage.setItem('UserName', this.authService.userName());

        if (this.authService.userRole() === 'Administrator') {
          navItemsAdmin.forEach((item) => {
            navItems.push(item);
          });
        } else if (this.authService.userRole() === 'Customer') {
          navItemsUser.forEach((item) => {
            navItems.push(item);
          });
        }
        this.router.navigate(['/pages/persona']);
      } else {
        this.notifications.error('Login Fallido', 'Revisa tus credenciales');
        console.log('login falied');
      }
    });
  }
}
