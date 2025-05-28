import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterModule } from '@angular/router';
import { NotificationsService } from 'angular2-notifications';
import { notify9 } from 'src/app/data/mensajes.data';
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



 authService = inject(AuthService);
notifications = inject(NotificationsService);
settings=inject(CoreService);
_dialogRef=inject(MatDialogRef)
options = this.settings.getOptions();



loginForm = new FormGroup({
      OldPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      NewPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8), Validators.pattern('^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[!@#$%^&*()_+{}\\[\\]:;<>,.?~\\|]).{8,}$')
      ])
    });

changePassword(){
// console.log('entro al metodo changePAssword');
  const oldPassword= this.loginForm.controls.OldPassword.value!;
      const newPassword= this.loginForm.controls.NewPassword.value!;
      console.log('datos :', oldPassword,"-",newPassword);
      this.authService.changePassword(oldPassword,newPassword)
      .subscribe((response) => {
        if (response.success) {
          this.notifications.set(notify9,true,);

          this._dialogRef.close();

        }
      });
this.close();

 }
 close(){
    this._dialogRef.close();
  }


}
