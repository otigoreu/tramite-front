import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NotificationsService } from 'angular2-notifications';
import { MaterialModule } from 'src/app/material.module';
import { UnidadOrganicaUsuario } from 'src/app/model/UnidadOrganicaUsuario';
import { ConfirmationService } from 'src/app/service/confirmation.service';
import { UnidadorganicausuarioService } from 'src/app/service/unidadorganicausuario.service';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { SharedModule } from 'src/app/shared/shared.module';

interface UsuarioUoForm {
  id: FormControl<number | null>;
  obserbacionAnulacion: FormControl<string | null>; // ✅ siempre requerido
}

@Component({
  selector: 'app-dialog-desabilitar-unidadorganica-user',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    SharedModule,
    TablerIconsModule,

    CommonModule,
    MatAutocompleteModule,

    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
  ],
  templateUrl: './dialogDesabilitar-unidadorganica-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogDesabilitarUnidadorganicaUserComponent implements OnInit {
  dialogRef = inject(MatDialogRef);

  titulo = '';

  uo_usuarioService = inject(UnidadorganicausuarioService);
  confirmationService = inject(ConfirmationService);
  notificationsService = inject(NotificationsService);

  uo_usuarioForm = this.fb.group<UsuarioUoForm>({
    id: this.fb.control<number | null>(null, Validators.required),
    obserbacionAnulacion: this.fb.control<string | null>(
      null,
      Validators.required
    ),
  });

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: number, // UnidadOrganicaUsuario,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    this.uo_usuarioForm.patchValue({
      id: this.data,
    });
  }

  onSubmit() {
    if (this.uo_usuarioForm.valid) {
      const raw = this.uo_usuarioForm.getRawValue();

      this.confirmationService.confirmAndExecute(
        '¡No podrás revertir esto!',
        this.uo_usuarioService.deshabilitar(raw.id!, raw.obserbacionAnulacion!),
        (response) => {
          if (response.success) {
            this.notificationsService.success(
              ...NotificationMessages.success(
                'UnidadOrganica-Usuario Deshabilitado'
              )
            );

            this.dialogRef.close(true);
          }
        }
      );
    }
  }
}
