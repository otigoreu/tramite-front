import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { MaterialModule } from 'src/app/material.module';
import { ForgotPasswordRequestBody } from 'src/app/model/auth';
import { AuthService } from 'src/app/service/auth.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {

  options = this.settings.getOptions();

    constructor(private settings: CoreService) {}

    router = inject(Router);

    authService = inject(AuthService);
    notifications = inject(NotificationsService);

    form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });


    verifyPasswords(form: NgForm) {}


    resetPassword(formValue: any) {}
 onSubmit() {
    const body: ForgotPasswordRequestBody = {
      email: this.form.controls.email.value!,
    };

    this.authService.forgotPassword(body.email).subscribe((response) => {
      console.log('response', response);
      if (response.success) {
        console.log('Success');
        this.notifications.success(
          'Token enviado',
          'Revise cu correo Electronico por favor'
        );
        this.router.navigate(['/login']);
      } else {
        console.log('Fail');
        this.notifications.error(
          'envio Fallido',
          'Su correo no se encuentra Registrado'
        );
      }
    });
  }

}
