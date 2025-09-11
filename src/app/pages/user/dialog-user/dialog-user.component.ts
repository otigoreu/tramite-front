import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
  signal,
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
import { RolService } from 'src/app/service/rol.service';
import { Rol } from 'src/app/model/rol';
import { EntidadaplicacionService } from 'src/app/service/entidadaplicacion.service';
import { Aplicacion } from '../../aplicacion/Modals/Aplicacion';
import { RegisterRequestDto } from '../Models/RegisterRequestDto';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';

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
  entidads: Entidad[] = [];
  rols: Rol[] = [];
  unidadorganicas: UnidadorganicaPaginatedResponseDto[] = [];
  aplicacions: Aplicacion[] = [];

  usuarioService = inject(UserService);
  personaService = inject(PersonaServiceService);
  entidadService = inject(EntidadService);
  unidadorganicaService = inject(UnidadorganicaService);
  entidadaplicacionService = inject(EntidadaplicacionService);
  rolService = inject(RolService);

  usuarioForm = this.fb.group({
    idPersona: [null as number | null, Validators.required],
    idEntidad: [null as number | null, Validators.required],
    idDependencia: [null as number | null, Validators.required],
    idAplicacion: [null as number | null, Validators.required],
    idRol: [null as string | null, Validators.required],

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
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) {}

  // Autocomplete de Personas (Formulario reactivo)
  firstControl = new FormControl('');
  firstoption: string[] = ['One', 'Two', 'Three']; // Ejemplo, probablemente puedas eliminar si no lo usas
  filteredOptions: Observable<Persona[]>;

  ngOnInit(): void {
    const esEdicion = !!this.data?.id;

    this.titulo = esEdicion ? 'Actualizar USUARIO' : 'Agregar nuevo USUARIO';

    this.cargarEntidades(esEdicion);

    if (esEdicion) {
      this.setFormValues(this.data);
    }

    // Configuración del autocomplete con debounce y búsqueda
    this.filteredOptions = this.firstControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) =>
        this.personaService.getPaginadoPersona(value!, 1, 10).pipe(
          map((response) => response.data) // Retorna solo los items
        )
      )
    );

    // this.usuario = { ...this.data };
    // console.log('data', this.usuario);
  }

  cargarEntidades(esEdicion: boolean) {
    const userId = localStorage.getItem('idUsuario')!;

    console.log('this.rolId', localStorage.getItem('userIdRol')!);

    this.entidadService
      .getPaginadoEntidad(userId, localStorage.getItem('userIdRol')!)
      .subscribe({
        next: (res) => {
          this.entidads = res.items;
        },
        error: (err) => console.error(err),
      });
  }

  cargarAplicacions(idEntidad: number) {
    this.entidadaplicacionService
      .getsAplicacion(idEntidad, localStorage.getItem('userIdRol')!)
      .subscribe({
        next: (data) => {
          this.aplicacions = data;
        },
        error: (err) => console.error(err),
      });
  }

  cargarRols(idEntidad: number, idAplicacion: number) {
    this.rolService
      .gets(idEntidad, idAplicacion, localStorage.getItem('userIdRol')!)
      .subscribe({
        next: (data) => {
          // 👇 transformamos DTO -> Rol[]
          this.rols = data.map((dto) => ({
            id: dto.id,
            name: dto.descripcion,
            normalizedName: dto.descripcion.toUpperCase(),
            estado: dto.estado ? 'Activo' : 'Inactivo',
          }));
        },
        error: (err) => console.error(err),
      });
  }

  cargarUnidadOrganicas(idEntidad: number, dependenciaSeleccionada?: number) {
    this.unidadorganicaService
      .getPaginadoUnidadorganica('', 1, 100, idEntidad)
      .subscribe({
        next: (res) => {
          this.unidadorganicas = res.items;
        },
        error: (err) => console.error(err),
      });
  }

  selectionChangeEntidad(idEntidad: number) {
    // Limpia dependientes
    this.aplicacions = [];
    this.usuarioForm.get('idAplicacion')?.reset();
    this.unidadorganicas = [];
    this.usuarioForm.get('idDependencia')?.reset();
    this.rols = [];
    this.usuarioForm.get('idRol')?.reset();

    this.usuarioForm.get('idEntidad')?.setValue(idEntidad);

    this.cargarAplicacions(idEntidad);
    this.cargarUnidadOrganicas(idEntidad);
  }

  selectionChangeAplicacion(idAplicacion: number) {
    // Limpia dependientes
    this.rols = [];
    this.usuarioForm.get('idRol')?.reset();

    this.usuarioForm.get('idAplicacion')?.setValue(idAplicacion);
    const idEntidad = Number(this.usuarioForm.get('idEntidad')?.value);

    this.cargarRols(idEntidad, idAplicacion);
  }

  selectionChangeRol(idRol: string) {
    this.usuarioForm.get('idRol')?.setValue(idRol);
  }

  private setFormValues(usuario: Usuario): void {
    // this.usuarioForm.patchValue({
    //   idEntidad: usuario.idEntidad,
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
        idRol: raw.idRol!,
        password,
        confirmPassword: password,
      };
      console.log('dto', dto);
      const esEdicion = !!this.data?.id;

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
