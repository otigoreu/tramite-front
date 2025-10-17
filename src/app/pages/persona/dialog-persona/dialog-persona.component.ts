import { Persona, PersonaRequestDto } from './../../../model/persona';
import {
  Component,
  ElementRef,
  inject,
  Inject,
  ViewChild,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { PersonaServiceService } from '../../../service/persona-service.service';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { CustomDateAdapter } from 'src/app/material/custom-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TipoDocumento } from 'src/app/model/tipoDocumento';
import { TipoDocumentoService } from 'src/app/service/tipo-documento.service';
import { mayorDeEdadValidator } from 'src/app/shared/validators/edad.validator';
import { ReniecService } from 'src/app/service/Pide/reniec.service';
import { NotificationsService } from 'angular2-notifications';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, EMPTY, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-dialog-persona',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],
  templateUrl: './dialog-persona.component.html',
})
export class DialogPersonaComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  tipoDocus: TipoDocumento[] = [];

  tipoDocService = inject(TipoDocumentoService);
  personaService = inject(PersonaServiceService);
  reniecService = inject(ReniecService);
  notificationsService = inject(NotificationsService);
  _snackBar = inject(MatSnackBar);
  _dialogRef = inject(MatDialogRef);

  constructor(@Inject(MAT_DIALOG_DATA) private data: Persona) {}

  personaForm = new FormGroup({
    id: new FormControl<number | null>(null),

    nombres: new FormControl('', [Validators.required]),
    apellidoPat: new FormControl('', [Validators.required]),
    apellidoMat: new FormControl('', [Validators.required]),
    fechaNac: new FormControl('', [
      Validators.required,
      mayorDeEdadValidator(18),
    ]),
    edad: new FormControl({ value: '', disabled: true }),
    email: new FormControl('', [Validators.required, Validators.email]),
    idTipoDoc: new FormControl<number | null>(null, [Validators.required]),
    nroDoc: new FormControl('', [
      Validators.nullValidator,
      Validators.minLength(8),
    ]),
  });

  private setFormValues(persona: Persona): void {
    this.personaForm.patchValue({
      id: persona.id,
      nombres: persona.nombres,
      apellidoPat: persona.apellidoPat,
      apellidoMat: persona.apellidoMat,
      fechaNac: persona.fechaNac,
      email: persona.email,
      idTipoDoc: persona.idTipoDoc,
      nroDoc: persona.nroDoc,
    });
  }

  ngOnInit(): void {
    const esEdicion = !!this.data?.id;

    this.loadTipoDoc();

    this.personaForm.controls.fechaNac.valueChanges.subscribe((fechaNac) => {
      if (fechaNac) {
        const edad = this.calcularEdad(fechaNac);
        this.personaForm.controls.edad.setValue(edad.toString());
      }
    });

    if (esEdicion) {
      this.setFormValues(this.data);
    }
  }

  close() {
    this._dialogRef.close();
  }

  loadTipoDoc() {
    this.tipoDocService.getData().subscribe((response) => {
      this.tipoDocus = response;
    });
  }

  operate() {
    // ✅ 1. Construir el objeto Persona con valores reales
    const persona: PersonaRequestDto = {
      id: this.personaForm.controls.id.value ?? 0,
      nombres: this.personaForm.controls.nombres.value ?? '',
      apellidoPat: this.personaForm.controls.apellidoPat.value ?? '',
      apellidoMat: this.personaForm.controls.apellidoMat.value ?? '',
      fechaNac: this.personaForm.controls.fechaNac.value ?? '',
      email: this.personaForm.controls.email.value ?? '',
      idTipoDoc: this.personaForm.controls.idTipoDoc.value ?? 0,
      nroDoc: this.personaForm.controls.nroDoc.value ?? '',
    };

    // ✅ 2. Determinar si es edición o creación
    const esEdicion = persona.id > 0;

    // ✅ 3. Elegir la operación correspondiente
    if (esEdicion) {
      this.personaService.update(persona.id, persona).subscribe({
        next: () => {
          this.notificationsService.success(
            ...NotificationMessages.successUpdate('persona')
          );
          this._dialogRef.close();
        },
        error: (err) => {
          const msg =
            err?.error?.errorMessage || 'Error al actualizar persona.';
          this.notificationsService.error(...NotificationMessages.error(msg));
        },
      });
    } else {
      this.personaService.add(persona).subscribe({
        next: (res: any) => {
          if (res?.success === false && res?.errorMessage) {
            this.notificationsService.warn(
              ...NotificationMessages.warning(res.errorMessage)
            );
          } else {
            this.notificationsService.success(
              ...NotificationMessages.successCreate('persona')
            );
            this._dialogRef.close();
          }
        },
        error: (err) => {
          const msg = err?.error?.errorMessage || 'Error al registrar persona.';
          this.notificationsService.error(...NotificationMessages.error(msg));

          this._snackBar.open(msg, 'Cerrar', {
            duration: 3000,
            verticalPosition: 'top',
          });
        },
      });
    }
  }

  calcularEdad(fechaNac: string | Date): number {
    const hoy = new Date();
    const nacimiento = new Date(fechaNac);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }

    return edad;
  }

  onDatepickerClosed() {
    setTimeout(() => {
      this.emailInput?.nativeElement?.focus();
    }, 150); // Pequeño retraso para evitar conflicto con cierre del datepicker
  }

  onValidarCliente() {
    const nuDniUsuario = '42928945';
    const nuDniConsulta = this.personaForm.get('nroDoc')?.value;

    if (!nuDniConsulta) {
      console.log('Debe ingresar un número de documento');
      //this.notificationsService.warning('Debe ingresar un número de documento');
      return;
    }

    this.personaService
      .getByNumDocumento(nuDniConsulta)
      .pipe(
        tap((res) => {
          // ✅ Si el backend responde correctamente (200 OK)
          console.log('Datos BD:', res);

          // Si usas BaseResponseGeneric<T>
          if (res.success && res.data) {
            this.personaForm.patchValue({
              id: res.data.id,
              nombres: res.data.nombres,
              apellidoPat: res.data.apellidoPat,
              apellidoMat: res.data.apellidoMat,
              fechaNac: res.data.fechaNac,
              email: res.data.email,
              idTipoDoc: res.data.idTipoDoc,
              nroDoc: res.data.nroDoc,
            });
          }
        }),
        catchError((err) => {
          // ❌ Si la BD no tiene datos (404 / 400), consultamos RENIEC
          console.warn('No encontrado en BD, consultando RENIEC...', err);

          return this.reniecService
            .consultarDni(nuDniUsuario, nuDniConsulta)
            .pipe(
              tap((data) => {
                console.log('Datos RENIEC:', data);

                // this.data = data;

                this.personaForm.patchValue({
                  nombres: data.nombres,
                  apellidoPat: data.apellidoPaterno,
                  apellidoMat: data.apellidoMaterno,
                });
              }),
              catchError((reniecErr) => {
                // ⚠️ Si RENIEC también falla
                console.error('Error al consultar RENIEC:', reniecErr);
                this.notificationsService.error(
                  ...NotificationMessages.error(reniecErr)
                );
                return EMPTY;
              })
            );
        })
      )
      .subscribe();
  }
}
