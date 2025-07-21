import { Persona } from './../../../model/persona';
import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { PersonaServiceService } from '../../../service/persona-service.service';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from 'src/app/material/custom-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TipoDocumento } from 'src/app/model/tipoDocumento';
import { TipoDocumentoService } from 'src/app/service/tipo-documento.service';
import { mayorDeEdadValidator } from 'src/app/shared/validators/edad.validator';
import { ReniecService } from 'src/app/service/Pide/reniec.service';
import { NotificationsService } from 'angular2-notifications';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog-persona',
  standalone: true,
  imports: [MaterialModule, FormsModule,MatDatepickerModule,MatNativeDateModule,ReactiveFormsModule],
    providers: [
      provideNativeDateAdapter(),
      { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
      { provide: DateAdapter, useClass: CustomDateAdapter },
    ],
  templateUrl: './dialog-persona.component.html'
})
export class DialogPersonaComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  persona:Persona;
  tipoDocus:TipoDocumento[]=[];
  tipoDocService=inject(TipoDocumentoService);
  personaService=inject(PersonaServiceService);
  _dialogRef=inject(MatDialogRef);
  reniecService=inject(ReniecService);
  notificationsService=inject(NotificationsService);
_snackBar=inject(MatSnackBar);
  constructor(
    @Inject(MAT_DIALOG_DATA) private data:Persona
  ){}


  personaForm=new FormGroup({
            nombres:new FormControl('',[Validators.required]),
            apellidoPat:new FormControl('',[Validators.required]),
            apellidoMat:new FormControl('',[Validators.required]),
            fechaNac: new FormControl('', [Validators.required,mayorDeEdadValidator(18),]),
            edad: new FormControl({ value: '', disabled: true }),
            email:new FormControl('',[Validators.required,Validators.email]),
            idTipoDoc:new FormControl('',[Validators.required]),
            nroDoc:new FormControl('',[Validators.nullValidator, Validators.minLength(8)]),
          });


  ngOnInit():void{
    //this.persona= this.data;
    this.persona={...this.data};//spred operator
    console.log('data',this.persona);
    this.loadTipoDoc();
    this.personaForm.controls.fechaNac.valueChanges.subscribe((fechaNac) => {
      if (fechaNac) {
        const edad = this.calcularEdad(fechaNac);
        this.personaForm.controls.edad.setValue(edad.toString());
        this.persona.edad = edad; // si estás usando ngModel también
      }
    });

  }
  close(){
    this._dialogRef.close();
  }

  loadTipoDoc(){
    this.tipoDocService.getData().subscribe((response)=>{
      this.tipoDocus=response;
    });
  }
  operate(){
    if(this.persona !=null && this.persona.id>0){
      //update
      this.personaService.update(this.persona.id, this.persona)
      .subscribe(

       {
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
      }


    );
    }else{
      //add
      this.personaService.save(this.persona)
      .subscribe(
       {
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
      }

    );
    }
    //Angular MatDialog -> 22:46

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

  consultarReniec() {
    const nuDniUsuario = '42928945'; // Puedes obtenerlo de un input
    const nuDniConsulta = this.persona.nroDoc; // Puedes obtenerlo de otro input

    this.reniecService.consultarDni(nuDniUsuario, nuDniConsulta).subscribe({
      next: (data) => {
        console.log('Datos RENIEC:', data);

        this.persona.nombres = data.nombre;
        this.persona.apellidoMat = data.apematerno;
        this.persona.apellidoPat = data.apepaterno;
        // Puedes mostrarlos en pantalla o guardarlos en propiedades
      },
      error: (err) => {
        this.notificationsService.error(...NotificationMessages.error(err));

        console.error('Error al consultar RENIEC', err);
      },
    });
  }

}
