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
import { ForgotPasswordRequestBody } from 'src/app/model/auth';
import { AuthService } from 'src/app/service/auth.service';
import { CoreService } from 'src/app/services/core.service';
import { notify8, notify9 } from 'src/app/data/mensajes.data';
import { finalize } from 'rxjs';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
})
export class ForgotPasswordComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}

  router = inject(Router);

  authService = inject(AuthService);
  notifications = inject(NotificationsService);

  form = new FormGroup({
    numeroDocumento: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^\d+$/), // solo números
    ]),
  });

  isLoading = false;
  // get f() {
  //   return this.form.controls;
  // }

  // submit() {
  //   // console.log(this.form.value);
  //   this.router.navigate(['/dashboards/dashboard1']);
  // }

  onSubmit() {
    this.isLoading = true;

    if (this.form.valid) {
      const body: ForgotPasswordRequestBody = {
        numeroDocumento: this.form.controls.numeroDocumento.value!,
      };

      this.authService
        .forgotPassword(body.numeroDocumento)
        .pipe(
          finalize(() => {
            this.isLoading = false; // siempre se ejecuta al terminar
          })
        )
        .subscribe((response) => {
          if (response.success) {
            this.notifications.success(
              ...NotificationMessages.success(
                `Token Enviado, Revise su correo electrónico ${response.data} por favor`
              )
            );

            // this.notifications.set(notify8, true);
            this.router.navigate(['/login']);
          } else {
            this.notifications.set(notify9, true);
          }
        });
    } else {
      this.isLoading = false;
    }
  }

  // onSubmit() {
  //   this.isLoading = true;

  //   if (this.form.valid) {
  //     console.log('PROCESAR');

  //     const body: ForgotPasswordRequestBody = {
  //       numeroDocumento: this.form.controls.numeroDocumento.value!,
  //     };

  //     this.authService
  //       .forgotPassword(body.numeroDocumento)
  //       .subscribe((response) => {
  //         if (response.success) {
  //           this.notifications.set(notify8, true);
  //           this.router.navigate(['/reset-password']);
  //         } else {
  //           this.notifications.set(notify9, true);
  //         }
  //       });
  //   }
  // }
}
