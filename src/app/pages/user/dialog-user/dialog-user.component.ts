import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import { Usuario } from '../../../model/usuario';
import { Persona } from 'src/app/model/persona';
import { UserService } from 'src/app/service/user.service';
import { PersonaServiceService } from 'src/app/service/persona-service.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import {
  FormBuilder,
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationsService } from 'angular2-notifications';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { EntidadService } from 'src/app/service/entidad.service';
import { UnidadorganicaService } from 'src/app/service/unidadorganica.service';
import { Entidad } from '../../entidad/Models/Entidad';
import { UnidadorganicaPaginatedResponseDto } from '../../unidadorganica/Models/UnidadorganicaPaginatedResponseDto';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { RegisterRequestDto } from '../Models/RegisterRequestDto';

@Component({
  selector: 'app-dialog-user',
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
  ],
  templateUrl: './dialog-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogUserComponent implements OnInit {
  notificationsService = inject(NotificationsService);
  dialogRef = inject(MatDialogRef);

  usuario: Usuario;
  persona: Persona;
  entidades: Entidad[] = [];
  unidadorganicas: UnidadorganicaPaginatedResponseDto[] = [];

  usuarioService = inject(UserService);
  personaService = inject(PersonaServiceService);
  entidadService = inject(EntidadService);
  unidadorganicaService = inject(UnidadorganicaService);

  usuarioForm = this.fb.group({
    idPersona: [null as number | null, Validators.required],
    idEntidad: [null as number | null, Validators.required],
    idDependencia: [null as number | null, Validators.required],

    username: [{ value: '', disabled: true }, Validators.required],
    password: [
      { value: '==> DNI INGRESADO <==', disabled: true },
      Validators.required,
    ],
    email: [{ value: '', disabled: true }, Validators.required],
  });

  titulo = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Usuario,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder
  ) {}

  // Autocomplete de Personas (Formulario reactivo)
  firstControl = new FormControl('');
  firstoption: string[] = ['One', 'Two', 'Three']; // Ejemplo, probablemente puedas eliminar si no lo usas
  filteredOptions: Observable<Persona[]>;

  ngOnInit(): void {
    const esEdicion = !!this.data?.id;

    this.titulo = esEdicion ? 'Actualizar USUARIO' : 'Agregar nuevo USUARIO';

    if (esEdicion) {
      this.setFormValues(this.data);
    }

    this.cargarEntidades();

    this.usuarioForm.get('idEntidad')?.valueChanges.subscribe((idEntidad) => {
      if (idEntidad) {
        this.cargarUnidadOrganica(idEntidad);
      } else {
        this.unidadorganicas = [];
        this.usuarioForm.get('idDependencia')?.setValue(null);
      }
    });

    // Configuración del autocomplete con debounce y búsqueda
    this.filteredOptions = this.firstControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) =>
        this.personaService.getPaginadoPersona(value!, 1, 10).pipe(
          map((response) => response.items) // Retorna solo los items
        )
      )
    );

    this.usuario = { ...this.data };
    console.log('data', this.usuario);
  }

  cargarEntidades() {
    this.entidadService.getPaginadoEntidad('', 1, 100).subscribe({
      next: (res) => {
        this.entidades = res.items;

        const valorActual = this.usuarioForm.get('idEntidad')?.value;

        if (!valorActual && this.entidades.length > 0) {
          // Solo seteas la primera entidad si es registro nuevo
          this.usuarioForm.get('idEntidad')?.setValue(this.entidades[0].id);
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
              this.usuarioForm
                .get('idDependencia')
                ?.setValue(dependenciaSeleccionada);
            } else {
              // No selecciona nada por defecto si no se especifica
              this.usuarioForm.get('idDependencia')?.setValue(null);
            }
          } else {
            this.usuarioForm.get('idDependencia')?.setValue(null);
          }
        },
        error: (err) => console.error(err),
      });
  }

  private setFormValues(usuario: Usuario): void {
    // this.uoForm.patchValue({
    //   idEntidad: uo.idEntidad,
    //   descripcion: uo.descripcion,
    //   idDependencia: uo.idDependencia,
    // });
    // if (uo.idDependencia) {
    //   this.cargarUnidadOrganica(uo.idEntidad, uo.idDependencia);
    // } else {
    //   this.unidadorganicas = [];
    //   this.uoForm.get('idDependencia')?.setValue(null);
    // }
  }

  /** Filtrar por entidad seleccionada */
  onPersonaSelected(persona: any): void {
    console.log('Seleccionado:', persona); // ahora puedes acceder a persona.id, persona.nombres, etc.

    // Setea el objeto completo en el form, útil para luego usar persona.id
    this.usuarioForm.patchValue({
      idPersona: persona.id, // 👈 guardamos el objeto persona completo (mejor para backend)
      username: persona.nroDoc,
      email: persona.email ?? '',
    });
  }

  displayPersona = (persona: Persona): string =>
    persona
      ? `${persona.apellidoPat} ${persona.apellidoMat}, ${persona.nombres}`
      : '';

  onSubmit() {
    if (this.usuarioForm.valid) {
      //   console.log('Formulario válido:', this.usuarioForm.value);
      //   const { idEntidad, idDependencia, descripcion } = this.uoForm.value;
      const raw = this.usuarioForm.getRawValue();

      const password = raw.username! + 'Aa*';

      const dto: RegisterRequestDto = {
        userName: raw.username!,
        email: raw.email!,
        idPersona: raw.idPersona!,
        idUnidadOrganica: raw.idDependencia!,
        password,
        confirmPassword: password,
      };

      console.log('dto', dto);

      const esEdicion = !!this.data?.id;
      //   console.log('esEdicion', esEdicion);
      //   console.log('dto', dto);
      // const peticion: Observable<ApiResponse<any>> = esEdicion
      //   ? this.usuarioService.actualizarUnidadorganica(this.data.id, dto)
      //   : this.usuarioService.registerUser(dto);

      const peticion: Observable<ApiResponse<any>> =
        this.usuarioService.registerUser(dto);

      peticion.subscribe({
        next: (res) => {
          if (res.success) {
            const mensaje = esEdicion
              ? NotificationMessages.successActualizar('USUARIO')
              : NotificationMessages.successCrear('USUARIO');
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
      this.usuarioForm.markAllAsTouched();
    }
  }
}
