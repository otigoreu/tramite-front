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
  FormGroup,
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
import { UnidadorganicaPaginatedResponseDto } from '../Models/UnidadorganicaPaginatedResponseDto';
import { UnidadorganicaRequestDto } from '../Models/UnidadorganicaRequestDto';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { NotificationsService } from 'angular2-notifications';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';

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
  unidadorganicas: UnidadorganicaPaginatedResponseDto[] = [];

  entidadService = inject(EntidadService);
  unidadorganicaService = inject(UnidadorganicaService);

  uoForm = this.fb.group({
    descripcion: ['', Validators.required],
    idEntidad: [null as number | null, Validators.required],
    idDependencia: [null as number | null], // 👈 Opcional, sin validación requerida
  });

  titulo = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Unidadorganica,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    const esEdicion = !!this.data?.id;

    this.titulo = esEdicion
      ? 'Actualizar UNIDAD ORGÁNICA'
      : 'Agregar nueva UNIDAD ORGÁNICA';

    this.cargarEntidades();

    this.uoForm.get('idEntidad')?.valueChanges.subscribe((idEntidad) => {
      console.log('idEntidad', idEntidad);

      if (idEntidad) {
        this.cargarUnidadOrganica(idEntidad);
      } else {
        this.unidadorganicas = [];
        this.uoForm.get('idDependencia')?.setValue(null);
      }
    });

    if (esEdicion) {
      this.setFormValues(this.data);
    }
  }

  private setFormValues(uo: Unidadorganica): void {
    this.uoForm.patchValue({
      idEntidad: uo.idEntidad,
      descripcion: uo.descripcion,
      idDependencia: uo.idDependencia,
    });

    if (uo.idDependencia) {
      this.cargarUnidadOrganica(uo.idEntidad, uo.idDependencia);
    } else {
      this.unidadorganicas = [];
      this.uoForm.get('idDependencia')?.setValue(null);
    }
  }

  cargarEntidades() {
    const idEntidad = parseInt(localStorage.getItem('idAEntidad')!);

    this.entidadService.getPaginadoEntidad(idEntidad, '', 1, 100).subscribe({
      next: (res) => {
        this.entidades = res.items;

        const valorActual = this.uoForm.get('idEntidad')?.value;

        if (!valorActual && this.entidades.length > 0) {
          // Solo seteas la primera entidad si es registro nuevo
          this.uoForm.get('idEntidad')?.setValue(this.entidades[0].id);
        }
      },
      error: (err) => console.error(err),
    });
  }

  cargarUnidadOrganica(idEntidad: number, dependenciaSeleccionada?: number) {
    this.unidadorganicaService
      .getPaginadoUnidadorganica('', 1, 100, idEntidad)
      .subscribe({
        next: (res) => {
          this.unidadorganicas = res.items;

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
      console.log('Formulario válido:', this.uoForm.value);

      const { idEntidad, idDependencia, descripcion } = this.uoForm.value;

      const dto: UnidadorganicaRequestDto = {
        idEntidad: idEntidad!,
        ...(idDependencia != null && { idDependencia }), // 👈 Solo lo agrega si no es null o undefined
        descripcion: descripcion!,
      };

      const esEdicion = !!this.data?.id;
      console.log('esEdicion', esEdicion);

      console.log('dto', dto);

      const peticion: Observable<ApiResponse<any>> = esEdicion
        ? this.unidadorganicaService.actualizarUnidadorganica(this.data.id, dto)
        : this.unidadorganicaService.agregarUnidadorganica(dto);

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
          this._snackBar.open('Error del servidor', 'Cerrar', {
            duration: 3000,
          });
          console.error(err);
        },
      });

      // Aquí puedes llamar al servicio para guardar o actualizar la unidad orgánica
    } else {
      console.log('Formulario inválido');
      this.uoForm.markAllAsTouched();
    }
  }
}
