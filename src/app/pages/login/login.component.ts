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
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/service/auth.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
        localStorage.setItem('token', response.data.token);
        this.router.navigate(['/pages/persona']);
        this.notifications.success(
          'Login Exitoso',
          'Bienvenido a Tramite Goreu'
        );
      } else {
        this.notifications.error('Login Fallido', 'Revisa tus credenciales');
        console.log('login falied');
      }
    });
  }
}
