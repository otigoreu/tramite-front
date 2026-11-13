import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
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
  private fb = inject(FormBuilder);
  notificationsService = inject(NotificationsService);
  dialogRef = inject(MatDialogRef);
  entidadService = inject(EntidadService);
  unidadorganicaService = inject(UnidadorganicaService);
  private msg = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);

  entidades: Entidad[] = [];
  unidadesFiltradas$!: Observable<UnidadOrganicaResponseDto[]>;

  uoForm = this.fb.group({
    descripcion: ['', Validators.required],
    idDependencia: [null as UnidadOrganicaResponseDto | null],
    abrev: ['', Validators.required],
  });

  titulo = '';
  idEntidad!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Unidadorganica,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const esEdicion = !!this.data?.id;
    this.titulo = esEdicion
      ? 'Actualizar UNIDAD ORGÁNICA'
      : 'Agregar nueva UNIDAD ORGÁNICA';
    this.idEntidad = parseInt(localStorage.getItem('idEntidad')!);

    // Búsqueda reactiva directamente contra tu API
    this.unidadesFiltradas$ = this.uoForm
      .get('idDependencia')!
      .valueChanges.pipe(
        startWith(''),
        debounceTime(300), // Espera 300ms tras dejar de escribir para no saturar la API
        distinctUntilChanged(),
        switchMap((value) => {
          // Si el usuario seleccionó un objeto válido de la lista, no volvemos a consultar la API
          if (value && typeof value === 'object') {
            return of([value]);
          }

          const textoBusqueda = typeof value === 'string' ? value.trim() : '';

          // Consulta paginada a tu backend enviando el texto escrito
          return this.unidadorganicaService
            .getPaginado(textoBusqueda, 50, 0, this.idEntidad)
            .pipe(
              map((res) => this._aplanarUnidades(res.data || [])),
              catchError((err) => {
                console.error('Error buscando unidades orgánicas:', err);
                return of([]);
              }),
            );
        }),
      );

    // Si es edición, cargamos los datos del formulario y su dependencia inicial
    if (esEdicion) {
      this.setFormValues(this.data);
    }
  }

  private setFormValues(uo: Unidadorganica): void {
    this.uoForm.patchValue({
      descripcion: uo.descripcion,
      abrev: uo.abrev,
    });

    if (uo.idDependencia) {
      // Obtenemos el objeto de la dependencia para que el autocomplete muestre su descripción
      this.unidadorganicaService
        .getPaginado('', 10000, 0, this.idEntidad)
        .subscribe({
          next: (res) => {
            const unidadesAplanadas = this._aplanarUnidades(res.data || []);
            const unidadEncontrada = unidadesAplanadas.find(
              (u) => u.id === uo.idDependencia,
            );
            this.uoForm
              .get('idDependencia')
              ?.setValue(unidadEncontrada || null);
            this.cdr.markForCheck();
          },
          error: (err) => console.error(err),
        });
    } else {
      this.uoForm.get('idDependencia')?.setValue(null);
    }
  }

  // Transforma el árbol jerárquico en una lista plana
  private _aplanarUnidades(unidades: any[]): UnidadOrganicaResponseDto[] {
    let resultado: UnidadOrganicaResponseDto[] = [];
    for (const u of unidades) {
      resultado.push(u);
      if (u.hijos && u.hijos.length > 0) {
        resultado = resultado.concat(this._aplanarUnidades(u.hijos));
      }
    }
    return resultado;
  }

  // Muestra la descripción en el input cuando se selecciona un objeto
  mostrarDescripcion(unidad: UnidadOrganicaResponseDto | null): string {
    return unidad && unidad.descripcion ? unidad.descripcion : '';
  }

  onSubmit(): void {
    if (this.uoForm.valid) {
      const { idDependencia, descripcion, abrev } = this.uoForm.value;

      const idDependenciaNumerico =
        idDependencia && typeof idDependencia === 'object'
          ? (idDependencia as UnidadOrganicaResponseDto).id
          : null;

      const dto: UnidadorganicaRequestDto = {
        idEntidad: this.idEntidad!,
        ...(idDependenciaNumerico != null && {
          idDependencia: idDependenciaNumerico,
        }),
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
            this.msg.success(
              res.errorMessage || 'Operación realizada con éxito.',
            );
            this.dialogRef.close(true);
          } else {
            this.msg.warning(res.errorMessage!);
          }
        },
        error: (err) => {
          const msg =
            err?.error?.errorMessage || 'Error al guardar la unidad orgánica.';
          this.msg.error(msg);
        },
      });
    } else {
      this.uoForm.markAllAsTouched();
    }
  }
}
