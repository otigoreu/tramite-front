import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NotificationsService } from 'angular2-notifications';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  firstValueFrom,
  identity,
  map,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { MaterialModule } from 'src/app/material.module';
import { CustomDateAdapter } from 'src/app/material/custom-adapter';
import { UnidadOrganicaUsuario } from 'src/app/model/UnidadOrganicaUsuario';
import { UnidadorganicaService } from 'src/app/service/unidadorganica.service';
import {
  UnidadorganicausuarioService,
  UsuarioUnidadOrganicaRequestDto,
} from 'src/app/service/unidadorganicausuario.service';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { SharedModule } from 'src/app/shared/shared.module';
import { NotificationComponent } from 'src/app/shared/components/notification/notification.component';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Notificacion } from 'src/app/model/Notificacion';
import { MessageService } from 'src/app/service/Message.service';
import { UnidadOrganicaResponseDto } from 'src/app/model/unidadOrganica';

export interface UnidadOrganica {
  id: number;
  descripcion: string;
}

interface UsuarioUoForm {
  idUnidadOrganica: FormControl<number | null>;
  desde: FormControl<Date | null>; // ✅ siempre requerido
  hasta: FormControl<Date | null>; // ✅ opcional
}

@Component({
  selector: 'app-dialog-unidadorganica-user',
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
    NotificationComponent,

    DragDropModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
  templateUrl: './dialog-unidadorganica-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogUnidadorganicaUserComponent implements OnInit {
  notificationsService = inject(NotificationsService);
  dialogRef = inject(MatDialogRef);
  unidadorganicaService = inject(UnidadorganicaService);
  uo_usuarioService = inject(UnidadorganicausuarioService);

  // 1. El control ahora acepta el objeto UnidadOrganicaResponseDto (o string mientras escribe)
  uo_usuarioForm = this.fb.group(
    {
      idUnidadOrganica: this.fb.control<
        UnidadOrganicaResponseDto | string | null
      >(null, [Validators.required, this.validarObjetoSeleccionado()]),
      desde: this.fb.control<Date>(new Date(), Validators.required),
      hasta: this.fb.control<Date | null>(null),
    },
    {
      validators: [this.validarRangoFechas()],
    },
  );

  unidadesFiltradas$!: Observable<UnidadOrganicaResponseDto[]>;
  notificacion = signal<Notificacion | null>(null);
  titulo = '';
  private userId!: string;
  private idEntidad!: number;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { data: UnidadOrganicaUsuario; userId: string },
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private msg: MessageService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.userId = this.data.userId;
    this.idEntidad = Number(localStorage.getItem('idEntidad'));
    const esEdicion = !!this.data?.data;

    this.titulo = esEdicion
      ? 'Actualizar USUARIO - UNIDAD ORGANICA'
      : 'Agregar nuevo USUARIO - UNIDAD ORGANICA';

    // Búsqueda reactiva en la API
    this.unidadesFiltradas$ = this.uo_usuarioForm
      .get('idUnidadOrganica')!
      .valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          if (value && typeof value === 'object') {
            return of([value]);
          }

          const textoBusqueda = typeof value === 'string' ? value.trim() : '';

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

    if (esEdicion && this.data.data) {
      await this.prepararEdicion(this.data.data);
    }
  }

  // 2. Busca el objeto completo por ID para que [displayWith] pinte la descripción
  private async prepararEdicion(data: UnidadOrganicaUsuario): Promise<void> {
    this.uo_usuarioForm.patchValue({
      // Convertimos los strings del backend a objetos Date reales para el datepicker y el validador
      desde: data.desde ? new Date(data.desde) : null,
      hasta: data.hasta ? new Date(data.hasta) : null,
    });

    if (data.idUnidadOrganica) {
      try {
        const res = await firstValueFrom(
          this.unidadorganicaService.getById(data.idUnidadOrganica),
        );

        if (res.success && res.data) {
          this.uo_usuarioForm.patchValue({
            idUnidadOrganica: res.data,
          });
        }
      } catch (err) {
        console.error('Error al obtener la unidad orgánica por ID:', err);
      }
    }
  }

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

  mostrarDescripcion(unidad: UnidadOrganicaResponseDto | null): string {
    return unidad && unidad.descripcion ? unidad.descripcion : '';
  }

  // Validador para evitar que el usuario envíe texto escrito sin haber elegido una opción
  private validarObjetoSeleccionado(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (valor && typeof valor === 'string') {
        return { opcionNoSeleccionada: true };
      }
      return null;
    };
  }

  private validarRangoFechas(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const desdeVal = control.get('desde')?.value;
      const hastaVal = control.get('hasta')?.value;

      if (desdeVal && hastaVal) {
        const desdeTime = new Date(desdeVal).getTime();
        const hastaTime = new Date(hastaVal).getTime();

        if (hastaTime < desdeTime) {
          return { rangoInvalido: true };
        }
      }
      return null;
    };
  }

  onSubmit(): void {
    if (this.uo_usuarioForm.invalid) {
      this.uo_usuarioForm.markAllAsTouched();
      return;
    }

    const raw = this.uo_usuarioForm.getRawValue();
    const esEdicion = !!this.data?.data;

    // 3. Extraemos el ID numérico del objeto seleccionado
    const unidadSeleccionada =
      raw.idUnidadOrganica as UnidadOrganicaResponseDto;

    const payload: UsuarioUnidadOrganicaRequestDto = {
      idUsuario: this.userId,
      idUnidadOrganica: unidadSeleccionada.id,
      desde: new Date(raw.desde!),
      hasta: raw.hasta ? new Date(raw.hasta) : null,
    };

    const request$ = esEdicion
      ? this.uo_usuarioService.actualizar(this.data.data.id, payload)
      : this.uo_usuarioService.agregar(payload);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.msg.success('Se asignó una unidad orgánica al usuario.');
          this.dialogRef.close(esEdicion ? true : res.data);
        } else {
          this.msg.warning(
            res.errorMessage || 'Ocurrió un error al procesar la acción.',
          );
        }
      },
      error: (err) => {
        const msg = err?.error?.errorMessage || 'Error al registrar usuario.';
        this.msg.error(msg);
      },
    });
  }
}
