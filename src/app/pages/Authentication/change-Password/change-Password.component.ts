import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { finalize } from 'rxjs';
import {
  notify10,
  notify11,
  notify4,
  notify9,
} from 'src/app/data/mensajes.data';
import { MaterialModule } from 'src/app/material.module';
import { AuthService } from 'src/app/service/auth.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [RouterModule, MaterialModule, FormsModule, ReactiveFormsModule],
  templateUrl: './change-Password.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent {
  hide = true;
  alignhide = true;

  authService = inject(AuthService);
  notifications = inject(NotificationsService);
  settings = inject(CoreService);
  _dialogRef = inject(MatDialogRef);
  options = this.settings.getOptions();

  isLoading = false;

  loginForm = new FormGroup(
    {
      OldPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      NewPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          '^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\|]).{8,}$'
        ),
      ]),
      ConfirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator } // 👈 validación a nivel formulario
  );

  // 👇 Validador personalizado
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPass = control.get('NewPassword')?.value;
    const confirmPass = control.get('ConfirmPassword')?.value;
    return newPass === confirmPass ? null : { passwordMismatch: true };
  }

  changePassword() {
    this.isLoading = true;

    if (this.loginForm.valid) {
      const oldPassword = this.loginForm.controls.OldPassword.value!;
      const newPassword = this.loginForm.controls.NewPassword.value!;

      this.authService
        .changePassword(oldPassword, newPassword)
        .pipe(
          finalize(() => {
            this.isLoading = false; // siempre se ejecuta al terminar
          })
        )
        .subscribe((response) => {
          if (response.success) {
            this.notifications.set(notify10, true);

            this._dialogRef.close();
          } else {
            this.notifications.set(notify11, true);
          }
        });
    } else {
      this.isLoading = false;
    }
  }

  close() {
    this._dialogRef.close();
  }
}
