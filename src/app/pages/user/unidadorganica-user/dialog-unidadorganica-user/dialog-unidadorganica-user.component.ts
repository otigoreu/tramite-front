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
import { firstValueFrom, identity, Observable } from 'rxjs';
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

  uo_usuarioForm = this.fb.group<UsuarioUoForm>(
    {
      idUnidadOrganica: this.fb.control<number | null>(
        null,
        Validators.required
      ),
      desde: this.fb.control<Date>(new Date(), Validators.required),
      hasta: this.fb.control<Date | null>(null),
    },
    {
      validators: [this.validarRangoFechas()], // ⬅️ agregamos validación a nivel formulario
    }
  );

  unidadorganicas: UnidadOrganica[] = [];

  unidadorganicaService = inject(UnidadorganicaService);
  uo_usuarioService = inject(UnidadorganicausuarioService);

  //showNotificacion = signal(false);
  notificacion = signal<Notificacion | null>(null);

  titulo = '';

  private userId!: string;

  private validarRangoFechas(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const desde = control.get('desde')?.value as Date | null;
      const hasta = control.get('hasta')?.value as Date | null;

      if (desde && hasta && hasta < desde) {
        return { rangoInvalido: true }; // ❌ hasta menor que desde
      }
      return null; // ✅ válido
    };
  }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private data: { data: UnidadOrganicaUsuario; userId: string }, // UnidadOrganicaUsuario,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private msg: MessageService
  ) {}

  async ngOnInit(): Promise<void> {
    // Leer parámetro de la URL
    this.userId = this.data.userId;

    const esEdicion = !!this.data?.data;

    this.titulo = esEdicion
      ? 'Actualizar USUARIO - UNIDAD ORGANICA'
      : 'Agregar nuevo USUARIO - UNIDAD ORGANICA';

    const idEntidad = Number(localStorage.getItem('idEntidad'));

    // 🔹 ahora sí await
    await this.cargarUnidadOrganicas(idEntidad);

    // 🔹 Solo después de cargar combos hacemos el patch
    if (esEdicion && this.data) {
      this.prepararEdicion(this.data!.data);
    }
  }

  private prepararEdicion(data: UnidadOrganicaUsuario): void {
    console.log('data', data);
    this.uo_usuarioForm.patchValue({
      idUnidadOrganica: data.idUnidadOrganica,
      desde: data.desde,
      hasta: data.hasta,
    });
  }

  private async cargarUnidadOrganicas(idEntidad: number): Promise<void> {
    try {
      const res = await firstValueFrom(
        this.unidadorganicaService.getPaginadoUnidadorganica(
          '',
          1,
          100,
          idEntidad
        )
      );

      this.unidadorganicas = res.items.map((z) => ({
        id: z.id,
        descripcion: z.descripcion,
      }));
    } catch (err) {
      console.error('Error cargando unidades orgánicas', err);
    }
  }

  onSubmit(): void {
    if (this.uo_usuarioForm.invalid) return;

    const raw = this.uo_usuarioForm.getRawValue();
    const esEdicion = !!this.data?.data;

    const data: UsuarioUnidadOrganicaRequestDto = {
      idUsuario: this.userId,
      idUnidadOrganica: raw.idUnidadOrganica!,
      desde: raw.desde!,
      hasta: raw.hasta,
    };

    const request$ = esEdicion
      ? this.uo_usuarioService.actualizar(this.data.data.id, data)
      : this.uo_usuarioService.agregar(data);

    request$.subscribe({
      next: (res) => {
        if (res.success) {
          this.msg.success('Se asignó una unidad orgánica al usuario.');
          this.dialogRef.close(esEdicion ? true : res.data);
        } else {
          this.msg.warning(
            res.errorMessage || 'Ocurrió un error al procesar la acción.'
          );
        }
      },
      error: (err) => {
        const msg = err?.error?.errorMessage || 'Error al registrar usuario.';
        this.msg.error(msg);
      },
      complete: () => console.log('Petición completada'),
    });
  }

  // onSubmit() {
  //   if (this.uo_usuarioForm.valid) {
  //     const raw = this.uo_usuarioForm.getRawValue();

  //     const esEdicion = !!this.data?.data;

  //     const data: UsuarioUnidadOrganicaRequestDto = {
  //       idUsuario: this.userId,
  //       idUnidadOrganica: raw.idUnidadOrganica!,
  //       desde: raw.desde!,
  //       hasta: raw.hasta,
  //     };

  //     if (!esEdicion) {
  //       this.uo_usuarioService.agregar(data).subscribe({
  //         next: (res) => {
  //           if (res.success) {
  //             this.msg.success('Se asignó una unidad orgánica al usuario.');
  //             this.dialogRef.close(esEdicion ? true : res.data); // true si fue update, ID si fue create
  //           } else {
  //             this.msg.warning(res.errorMessage!);
  //           }
  //         },
  //         error: (err) => {
  //           const msg =
  //             err?.error?.errorMessage || 'Error al registrar usuario.';

  //           this.msg.error(msg);
  //         },
  //         complete: () => {
  //           console.log('Petición completada');
  //         },
  //       });
  //     } else {
  //       this.uo_usuarioService.actualizar(this.data.data.id, data).subscribe({
  //         next: (res) => {
  //           if (res.success) {
  //             this.msg.success('Se asignó una unidad orgánica al usuario.');
  //             this.dialogRef.close(esEdicion ? true : res.data); // true si fue update, ID si fue create
  //           } else {
  //             this.msg.warning(res.errorMessage!);
  //           }
  //         },
  //         error: (err) => {
  //           const msg =
  //             err?.error?.errorMessage || 'Error al registrar usuario.';

  //           this.msg.error(msg);
  //         },
  //         complete: () => {
  //           console.log('Petición completada');
  //         },
  //       });
  //     }
  //   }
  // }
}
