
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
import {   notify8, notify9 } from 'src/app/data/mensajes.data';
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
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  // get f() {
  //   return this.form.controls;
  // }

  // submit() {
  //   // console.log(this.form.value);
  //   this.router.navigate(['/dashboards/dashboard1']);
  // }

  onSubmit() {
    const body: ForgotPasswordRequestBody = {
      email: this.form.controls.email.value!,
    };

    this.authService.forgotPassword(body.email).subscribe((response) => {

      if (response.success) {
        this.notifications.set(notify8,true);
        this.router.navigate(['/reset-password']);
      } else {
        this.notifications.set(notify9,true);
      }
    });
  }
}
