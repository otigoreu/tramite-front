import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Entidad } from '../Models/Entidad';
import { CustomDateAdapter } from 'src/app/material/custom-adapter';
import { NotificationsService } from 'angular2-notifications';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { EntidadService } from 'src/app/service/entidad.service';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { EntidadRequestDto } from '../Models/EntidadRequestDto';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/ApiResponse';

@Component({
  selector: 'app-entidad-edit',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    SharedModule,
    TablerIconsModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
  templateUrl: './entidad-edit.component.html',
})
export class EntidadEditComponent implements OnInit {
  entidadForm = new FormGroup({
    descripcion: new FormControl('', Validators.required),
    ruc: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{1,11}$/), // Solo números, hasta 11 dígitos
    ]),
    sigla: new FormControl('', [
      Validators.required, // Solo números, hasta 11 dígitos
    ]),
  });

  dialogRef = inject(MatDialogRef);
  entidadService = inject(EntidadService);
  notificationsService = inject(NotificationsService);

  titulo = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Entidad,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const esEdicion = !!this.data?.id;

    this.titulo = esEdicion ? 'Actualizar ENTIDAD' : 'Agregar nueva ENTIDAD';

    if (esEdicion) {
      const entidad = { ...this.data };
      this.entidadForm.patchValue({
        descripcion: entidad.descripcion,
        ruc: entidad.ruc,
        sigla:entidad.sigla
      });
    }
  }

  onSubmit(): void {
    if (this.entidadForm.invalid) return;

    const dto: EntidadRequestDto = {
      descripcion: this.entidadForm.value.descripcion!,
      ruc: this.entidadForm.value.ruc!,
      sigla:this.entidadForm.value.sigla!

    };

    const esEdicion = !!this.data?.id;

    const peticion: Observable<ApiResponse<any>> = esEdicion
      ? this.entidadService.actualizarEntidad(this.data.id, dto)
      : this.entidadService.agregarEntidad(dto);

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
