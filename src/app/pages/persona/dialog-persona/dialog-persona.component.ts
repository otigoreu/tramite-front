import { Persona } from './../../../model/persona';
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
import { MatDatepicker } from '@angular/material/datepicker';
import { TipoDocumento } from 'src/app/model/tipoDocumento';
import { TipoDocumentoService } from 'src/app/service/tipo-documento.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-dialog-persona',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    MatDatepicker,
    MatNativeDateModule,
    ReactiveFormsModule,
    SharedModule,
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

  persona: Persona;
  tipoDocus: TipoDocumento[] = [];
  tipoDocService = inject(TipoDocumentoService);
  personaService = inject(PersonaServiceService);
  _dialogRef = inject(MatDialogRef);
  constructor(@Inject(MAT_DIALOG_DATA) private data: Persona) {}

  personaForm = new FormGroup({
    nombres: new FormControl('', [Validators.required]),
    apellidoPat: new FormControl('', [Validators.required]),
    apellidoMat: new FormControl('', [Validators.required]),
    fechaNac: new FormControl('', [Validators.required]),
    edad: new FormControl({ value: '', disabled: true }),
    email: new FormControl('', [Validators.required, Validators.email]),
    idTipoDoc: new FormControl('', [Validators.required]),
    nroDoc: new FormControl('', [
      Validators.nullValidator,
      Validators.minLength(8),
    ]),
  });

  ngOnInit(): void {
    //this.persona= this.data;
    this.persona = { ...this.data }; //spred operator
    console.log('data', this.persona);
    this.loadTipoDoc();

    this.personaForm.controls.fechaNac.valueChanges.subscribe((fechaNac) => {
      if (fechaNac) {
        const edad = this.calcularEdad(fechaNac);
        this.personaForm.controls.edad.setValue(edad.toString());
        this.persona.edad = edad; // si estás usando ngModel también
      }
    });
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
    if (this.persona != null && this.persona.id > 0) {
      //update
      this.personaService
        .update(this.persona.id, this.persona)
        .subscribe(() => {
          this._dialogRef.close();
        });
    } else {
      //add
      this.personaService.save(this.persona).subscribe(() => {
        this._dialogRef.close();
      });
    }

    this._dialogRef.close(); // ✅ Este es el que deberías usar
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
}
