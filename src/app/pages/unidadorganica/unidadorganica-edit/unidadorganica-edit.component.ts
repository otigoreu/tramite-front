import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { Unidadorganica } from '../Models/Unidadorganica';
import { EntidadService } from 'src/app/service/entidad.service';
import { Entidad } from '../../entidad/Models/Entidad';
import { CommonModule } from '@angular/common';
import { UnidadorganicaService } from 'src/app/service/unidadorganica.service';
import { UnidadorganicaRequestDto } from '../Models/UnidadorganicaRequestDto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { NotificationsService } from 'angular2-notifications';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { UnidadOrganicaResponseDto } from 'src/app/model/unidadOrganica';
import { MessageService } from 'src/app/service/Message.service';

@Component({
  selector: 'app-unidadorganica-edit',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    SharedModule,
    TablerIconsModule,

    CommonModule,
  ],
  templateUrl: './unidadorganica-edit.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppUnidadorganicaEditComponent implements OnInit {
  notificationsService = inject(NotificationsService);
  dialogRef = inject(MatDialogRef);

  entidades: Entidad[] = [];
  unidadorganicas: UnidadOrganicaResponseDto[] = [];

  entidadService = inject(EntidadService);
  unidadorganicaService = inject(UnidadorganicaService);

  uoForm = this.fb.group({
    descripcion: ['', Validators.required],
    idDependencia: [null as number | null], // 👈 Opcional, sin validación requerida
    abrev: ['', Validators.required],
  });

  titulo = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Unidadorganica,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private msg: MessageService
  ) {}

  idEntidad: number;

  ngOnInit(): void {
    const esEdicion = !!this.data?.id;

    this.titulo = esEdicion
      ? 'Actualizar UNIDAD ORGÁNICA'
      : 'Agregar nueva UNIDAD ORGÁNICA';

    this.idEntidad = parseInt(localStorage.getItem('idEntidad')!);

    this.cargarUnidadOrganica();

    if (esEdicion) {
      this.setFormValues(this.data);
    }
  }

  private setFormValues(uo: Unidadorganica): void {
    this.uoForm.patchValue({
      descripcion: uo.descripcion,
      idDependencia: uo.idDependencia,
      abrev: uo.abrev,
    });
    if (uo.idDependencia) {
      this.cargarUnidadOrganica(uo.idDependencia);
    } else {
      this.unidadorganicas = [];
      this.uoForm.get('idDependencia')?.setValue(null);
    }
  }

  cargarUnidadOrganica(dependenciaSeleccionada?: number) {
    this.unidadorganicaService
      .getPaginado('', 100, 0, this.idEntidad)
      .subscribe({
        next: (res) => {
          this.unidadorganicas = res.data;

          if (this.unidadorganicas.length > 0) {
            if (dependenciaSeleccionada) {
              this.uoForm
                .get('idDependencia')
                ?.setValue(dependenciaSeleccionada);
            } else {
              // No selecciona nada por defecto si no se especifica
              this.uoForm.get('idDependencia')?.setValue(null);
            }
          } else {
            this.uoForm.get('idDependencia')?.setValue(null);
          }
        },
        error: (err) => console.error(err),
      });
  }

  onSubmit() {
    if (this.uoForm.valid) {
      const { idDependencia, descripcion, abrev } = this.uoForm.value;

      const dto: UnidadorganicaRequestDto = {
        idEntidad: this.idEntidad!,
        ...(idDependencia != null && { idDependencia }), // 👈 Solo lo agrega si no es null o undefined
        descripcion: descripcion!,
        abrev: abrev!,
      };

      const esEdicion = !!this.data?.id;

      const peticion: Observable<ApiResponse<any>> = esEdicion
        ? this.unidadorganicaService.actualizarUnidadorganica(this.data.id, dto)
        : this.unidadorganicaService.agregarUnidadorganica(dto);

      peticion.subscribe({
        next: (res) => {
          if (res.success) {
            const mensaje = esEdicion
              ? NotificationMessages.successActualizar('ENTIDAD')
              : NotificationMessages.successCrear('ENTIDAD');

            this.msg.success(res.errorMessage!);
            this.dialogRef.close();
          } else {
            this.msg.warning(res.errorMessage!);
          }
        },
        error: (err) => {
          const msg = err?.error?.errorMessage || 'Error al registrar usuario.';
          this.msg.error(msg);
        },
      });

      // Aquí puedes llamar al servicio para guardar o actualizar la unidad orgánica
    } else {
      console.log('Formulario inválido');
      this.uoForm.markAllAsTouched();
    }
  }
}
