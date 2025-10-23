import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NotificationsService } from 'angular2-notifications';
import { MaterialModule } from 'src/app/material.module';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Aplicacion } from '../Modals/Aplicacion';
import { AplicacionRequestDto } from '../Modals/AplicacionRequestDto';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-aplicacion-edit',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    SharedModule,
    TablerIconsModule,
  ],
  templateUrl: './aplicacion-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AplicacionEditComponent {
  aplicacionForm = new FormGroup({
    descripcion: new FormControl('', Validators.required),
  });

  dialogRef = inject(MatDialogRef);
  aplicacionService = inject(AplicacionService);
  notificationsService = inject(NotificationsService);
  authService=inject(AuthService);

  titulo = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Aplicacion,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const esEdicion = !!this.data?.id;

    this.titulo = esEdicion
      ? 'Actualizar APLICACION'
      : 'Agregar nueva APLICACION';

    if (esEdicion) {
      const aplicacion = { ...this.data };
      this.aplicacionForm.patchValue({
        descripcion: aplicacion.descripcion.toUpperCase()
      });

    }
  }

  guardar(): void {
    if (this.aplicacionForm.invalid) return;

    const dto: AplicacionRequestDto = {
      descripcion: this.aplicacionForm.value.descripcion!.toUpperCase(),
    };

    const esEdicion = !!this.data?.id;

    const peticion: Observable<ApiResponse<any>> = esEdicion
      ? this.aplicacionService.actualizarAplicacion(this.data.id, dto)
      : this.aplicacionService.agregarAplicacion(parseInt(this.authService.idEntidad()), dto);

    peticion.subscribe({
      next: (res) => {
        if (res.success) {
          const mensaje = esEdicion
            ? NotificationMessages.successActualizar('ENTIDAD')
            : NotificationMessages.successCrear('ENTIDAD');

          this.notificationsService.success(...mensaje);
          this.dialogRef.close(esEdicion ? true : res.data); // true si fue update, ID si fue create
        } else {
          this._snackBar.open(
            res.errorMessage || 'Error desconocido',
            'Cerrar',
            { duration: 3000 }
          );
        }
      },
      error: (err) => {
        this._snackBar.open('Error del servidor', 'Cerrar', { duration: 3000 });
        console.error(err);
      },
    });
  }
}
