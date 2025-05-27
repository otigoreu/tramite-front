import { Persona } from './../../../model/persona';
import { Component, inject, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { PersonaServiceService } from '../../../service/persona-service.service';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from 'src/app/material/custom-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TipoDocumento } from 'src/app/model/tipoDocumento';
import { TipoDocumentoService } from 'src/app/service/tipo-documento.service';

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

  persona:Persona;
  tipoDocus:TipoDocumento[]=[];
  tipoDocService=inject(TipoDocumentoService);
  personaService=inject(PersonaServiceService);
  _dialogRef=inject(MatDialogRef)
  constructor(
    @Inject(MAT_DIALOG_DATA) private data:Persona
  ){}


  personaForm=new FormGroup({
            nombres:new FormControl('',[Validators.required]),
            apellidoPat:new FormControl('',[Validators.required]),
            apellidoMat:new FormControl('',[Validators.required]),
            fechaNac:new FormControl('',[Validators.required]),
            direccion:new FormControl('',[Validators.required]),
            referencia:new FormControl('',[Validators.nullValidator]),
            celular:new FormControl('',[Validators.required, Validators.minLength(8)]),
            edad:new FormControl('',[Validators.required]),
            email:new FormControl('',[Validators.required,Validators.email]),
            tipoDoc:new FormControl('',[Validators.required]),
            nroDoc:new FormControl('',[Validators.nullValidator, Validators.minLength(8)]),
          });


  ngOnInit():void{
    //this.persona= this.data;
    this.persona={...this.data};//spred operator
    console.log('data',this.persona);
    this.loadTipoDoc();

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
      .subscribe(()=>{
        this._dialogRef.close();
      });
    }else{
      //add
      this.personaService.save(this.persona)
      .subscribe(()=>{

        this._dialogRef.close();
      });
    }

    this.close();
    //Angular MatDialog -> 22:46

  }

}
