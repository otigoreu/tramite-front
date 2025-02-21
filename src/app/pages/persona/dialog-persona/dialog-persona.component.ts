import { Persona } from './../../../model/persona';
import { Component, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { PersonaServiceService } from '../../../service/persona-service.service';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { CustomDateAdapter } from 'src/app/material/custom-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-dialog-persona',
  standalone: true,
  imports: [MaterialModule, FormsModule,MatDatepickerModule,MatNativeDateModule,ReactiveFormsModule],
    providers: [
      provideNativeDateAdapter(),
      { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
      { provide: DateAdapter, useClass: CustomDateAdapter },
    ],
  templateUrl: './dialog-persona.component.html',
  styleUrl: './dialog-persona.component.scss'
})
export class DialogPersonaComponent {

  personaDialog:Persona;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data:Persona, private _dialogRef:MatDialogRef<DialogPersonaComponent>,
    private personaService:PersonaServiceService
  ){}

  ngOnInit():void{
    //this.personaDialog= this.data;
    this.personaDialog={...this.data};//spred operator

  }
  close(){
    this._dialogRef.close();
  }
  operate(){
    if(this.personaDialog !=null && this.personaDialog.id>0){
      //update
      this.personaService.update(this.personaDialog.id, this.personaDialog)
      .subscribe(()=>{
        this._dialogRef.close();
      });
    }else{
      //add
      this.personaService.save(this.personaDialog)
      .subscribe(()=>{

        this._dialogRef.close();
      });
    }

    this.close();
    //Angular MatDialog -> 22:46

  }
  operate2(){
    if(this.personaDialog !=null && this.personaDialog.id>0){
      //update
      this.personaService.updatePerson(this.personaDialog.id, this.personaDialog)
      .subscribe(()=>{
        this._dialogRef.close();
      });
    }else{
      //add
      this.personaService.newPerson(this.personaDialog)
      .subscribe(()=>{

        this._dialogRef.close();
      });
    }

    this.close();
    //Angular MatDialog -> 22:46

  }

}
