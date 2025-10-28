import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Usuario } from '../../../model/usuario';
import { Persona, PersonaResponseDto } from 'src/app/model/persona';
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
import { Rol, RolSingleResponse } from 'src/app/model/rol';
import { EntidadaplicacionService } from 'src/app/service/entidadaplicacion.service';
import { Aplicacion } from '../../aplicacion/Modals/Aplicacion';
import { RegisterRequestDto } from '../Models/RegisterRequestDto';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { MessageService } from 'src/app/service/Message.service';
import { UnidadOrganicaResponseDto } from 'src/app/model/unidadOrganica';

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
  rols: RolSingleResponse[] = [];
  unidadorganicas: UnidadOrganicaResponseDto[] = [];
  aplicacions: Aplicacion[] = [];

  usuarioService = inject(UserService);
  personaService = inject(PersonaServiceService);
  entidadService = inject(EntidadService);
  unidadorganicaService = inject(UnidadorganicaService);
  entidadaplicacionService = inject(EntidadaplicacionService);
  rolService = inject(RolService);

  mostrarRol = false; // oculto al inicio

  usuarioForm = this.fb.group({
    idPersona: [null as number | null, Validators.required],

    username: [{ value: '', disabled: true }, Validators.required],
    password: [
      { value: '==> DNI INGRESADO <==', disabled: true },
      Validators.required,
    ],
    email: [{ value: '', disabled: false }, Validators.required],
    iniciales: [{ value: '', disabled: false }, Validators.required],

    idRol: [null as string | null],
  });

  titulo = '';
  esEdicion: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Usuario,
    private fb: FormBuilder,
    private msg: MessageService
  ) {}

  // Autocomplete de Personas (Formulario reactivo)
  //firstControl = new FormControl('');
  firstControl = new FormControl<Persona | null>(null);
  firstoption: string[] = ['One', 'Two', 'Three']; // Ejemplo, probablemente puedas eliminar si no lo usas
  filteredOptions: Observable<PersonaResponseDto[]>;

  ngOnInit(): void {
    this.esEdicion = !!this.data?.id;
    const idEntidad = Number(localStorage.getItem('idEntidad'));
    const idAplicacion = Number(localStorage.getItem('idAplicacion'));

    this.titulo = this.esEdicion
      ? 'Actualizar USUARIO'
      : 'Agregar nuevo USUARIO';

    this.cargar_Rols(idEntidad, idAplicacion);

    if (this.esEdicion) {
      this.setFormValues(this.data);
    }

    // Configuración del autocomplete con debounce y búsqueda
    this.filteredOptions = this.firstControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        // 👇 Si el usuario escribe, "value" es string
        // Si selecciona una persona del autocomplete, "value" es Persona
        const searchText =
          typeof value === 'string' ? value : value?.nombreCompleto || ''; // o cualquier campo que quieras usar para buscar

        return this.personaService
          .getPaginado(searchText)
          .pipe(map((response) => response.data || []));
      })
    );
  }

  cargar_Rols(idEntidad: number, idAplicacion: number) {
    this.rolService.getPaginado(idEntidad, idAplicacion!).subscribe({
      next: (res) => {
        // 👇 transformamos DTO -> Rol[]
        this.rols = res.data.map((dto) => ({
          id: dto.id,
          descripcion: dto.descripcion,
        }));
      },
      error: (err) => console.error(err),
    });
  }

  private setFormValues(usuario: Usuario): void {
    this.usuarioService.getById(usuario.id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.usuarioForm.patchValue({
            idPersona: res.data.idPersona,

            username: res.data.userName,
            email: res.data.email,
            iniciales: res.data.iniciales,
          });

          this.personaService.getPerson(res.data.idPersona).subscribe({
            next: (res) => {
              console.log('res (Persona)', res);
              if (res.success && res.data) {
                const persona: Persona = {
                  ...res.data,
                  nombreCompleto: `${res.data.apellidoPat} ${res.data.apellidoMat}, ${res.data.nombres}`,
                };

                this.firstControl.setValue(persona);
                this.firstControl.disable(); // 🔒 Deshabilita
              }
            },
            error: (err) => console.error(err),
          });
        } else {
          this.msg.info(res.errorMessage);
        }
      },
      error: (err) => {
        this.msg.error('Ocurrió un error al verificar el usuario.');
        console.error(err);
      },
    });
  }

  /** Filtrar por entidad seleccionada */
  onPersonaSelected(persona: any): void {
    // Setea el objeto completo en el form, útil para luego usar persona.id
    this.usuarioForm.patchValue({
      idPersona: persona.id, // 👈 guardamos el objeto persona completo (mejor para backend)
      username: persona.nroDoc,
      email: persona.email ?? '',
    });

    this.usuarioService.getByIdPersona(persona.id).subscribe({
      next: (res) => {
        if (res.success && res.data) {
          this.usuarioForm.patchValue({
            iniciales: res.data.iniciales,
          });

          this.msg.warning(
            'El usuario ya existe. Debe seleccionar un rol para continuar.'
          );

          this.mostrarRol = true;

          this.usuarioForm.get('email')?.disable(); // 🔒 Desactiva
          this.usuarioForm.get('iniciales')?.disable(); // 🔒 Desactiva
        } else {
          this.msg.info(res.errorMessage);
        }
      },
      error: (err) => {
        //this.msg.error('Ocurrió un error al verificar el usuario.');
        this.usuarioForm.get('email')?.enable();
        this.usuarioForm.get('email')?.reset(); // 🔹 Limpia su valor y estado (touched, dirty, etc.)

        this.usuarioForm.get('iniciales')?.enable();
        this.usuarioForm.get('iniciales')?.reset();

        this.mostrarRol = false;

        console.error(err);
      },
    });
  }

  onRolSelected(idRol: string): void {
    this.usuarioForm.get('idRol')?.setValue(idRol);
  }

  displayPersona = (persona: Persona): string =>
    persona
      ? `${persona.apellidoPat} ${persona.apellidoMat}, ${persona.nombres}`
      : '';

  onSubmit() {
    if (this.usuarioForm.valid) {
      const raw = this.usuarioForm.getRawValue();

      const password = raw.username! + 'Aa*';

      const dto: RegisterRequestDto = {
        esEdicion: this.esEdicion,

        userName: raw.username!,
        iniciales: raw.iniciales!,
        email: raw.email!,
        idPersona: raw.idPersona!,
        password,
        confirmPassword: password,
        rolId: raw.idRol ?? undefined, // ✅
      };

      const esEdicion = !!this.data?.id;

      const peticion: Observable<ApiResponse<any>> =
        this.usuarioService.registerUser(dto);

      peticion.subscribe({
        next: (res) => {
          if (res.success) {
            this.msg.success(res.errorMessage!);
            this.dialogRef.close(esEdicion ? true : res.data); // true si fue update, ID si fue create
          } else {
            this.msg.warning(res.errorMessage!);
          }
        },
        error: (err) => {
          const msg = err?.error?.errorMessage || 'Error al registrar usuario.';
          this.msg.error(msg);
        },
      });
    } else {
      this.usuarioForm.markAllAsTouched();
    }
  }
}
