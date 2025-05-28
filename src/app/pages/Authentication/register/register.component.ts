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
import { notify2, notify3 } from 'src/app/data/mensajes.data';
import { MaterialModule } from 'src/app/material.module';
import { RegisterRequestBody } from 'src/app/model/auth';
import { AuthService } from 'src/app/service/auth.service';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MaterialModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  options = this.settings.getOptions();
  constructor(private settings: CoreService) {}

  authService = inject(AuthService);
  router = inject(Router);
  notifications = inject(NotificationsService);

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  register() {
    const body: RegisterRequestBody = {
      firstName: this.registerForm.controls.firstName.value!,
      lastName: this.registerForm.controls.lastName.value!,
      password: this.registerForm.controls.password.value!,
      email: this.registerForm.controls.email.value!,
      confirmPassword: this.registerForm.controls.password.value!,
    };

    this.authService.register(body).subscribe((response) => {
      console.log('response', response);
      if (response && response.success) {
        // Redirect to the customer page
        console.log('Register successful');
        this.notifications.set(notify2,true)
        this.router.navigate(['/login']);
      } else {
        // Display an error notification
        console.log('Register failed');
        this.notifications.set(notify3,true)
      }
    });
  }
  submit() {
    // console.log(this.form.value);
    this.router.navigate(['/dashboards/dashboard1']);
  }
}
