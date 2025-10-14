import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { finalize } from 'rxjs';
import { notify4, notify7 } from 'src/app/data/mensajes.data';
import { MaterialModule } from 'src/app/material.module';
import { ResetPasswordRequestBody } from 'src/app/model/auth1';

import { AuthService } from 'src/app/service/auth.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  hide = true;
  alignhide = true;

  options = this.settings.getOptions();

  constructor(private settings: CoreService, private route: ActivatedRoute) {}

  router = inject(Router);
  authService = inject(AuthService);
  notifications = inject(NotificationsService);

  loginForm = new FormGroup({
    nombreCompleto: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    token: new FormControl('', [Validators.required]),
    newPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
    confirmNewPassword: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  token: string = '';
  correo: string = '';
  nombreCompleto: string = '';

  isLoading = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'];
      this.correo = params['correo'];
      this.nombreCompleto = params['nombreCompleto'];

      console.log('Token recibido:', this.token);
      console.log('Correo recibido:', this.correo);
      console.log('Nombre Completo recibido:', this.nombreCompleto);

      // 👇 Rellenar los inputs automáticamente
      this.loginForm.patchValue({
        email: this.correo,
        token: this.token,
        nombreCompleto: this.nombreCompleto,
      });

      this.loginForm.get('nombreCompleto')?.disable();
      this.loginForm.get('email')?.disable();
    });
  }

  changePassword() {
    this.isLoading = true;

    const body: ResetPasswordRequestBody = {
      email: this.loginForm.controls.email.value!,
      token: this.loginForm.controls.token.value!,
      newPassword: this.loginForm.controls.newPassword.value!,
      confirmNewPassword: this.loginForm.controls.confirmNewPassword.value!,
    };

    // console.log('datos:',body.email,body.token,body.newPassword,body.confirmNewPassword);

    this.authService
      .resetPassword(
        body.email,
        body.token,
        body.newPassword,
        body.confirmNewPassword
      )
      .pipe(
        finalize(() => {
          this.isLoading = false; // siempre se ejecuta al terminar
        })
      )
      .subscribe((response) => {
        if (response.success) {
          this.notifications.set(notify4, true);
          this.router.navigate(['/login']);
        } else {
          this.notifications.set(notify7, true);
        }
      });
  }
}
