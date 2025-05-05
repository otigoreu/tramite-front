import { DatePipe } from '@angular/common';
import { Component, Inject, Optional } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';

import { TipoDocumento } from 'src/app/model/tipoDocumento';
import { TipoDocumentoService } from 'src/app/service/tipo-documento.service';
import { CoreService } from 'src/app/services/core.service';


@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [MatDialogModule, FormsModule, MaterialModule, ReactiveFormsModule],
  providers: [DatePipe],
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.scss'
})
export class DialogComponent {

  options = this.settings.getOptions();
  action: string;
  // tslint:disable-next-line - Disables all

  tipoDocumento:TipoDocumento;

  constructor(
      public datePipe: DatePipe,

      @Optional() @Inject(MAT_DIALOG_DATA) public data: TipoDocumento,
      private _dialogRef:MatDialogRef<DialogComponent>,
      private tipoDocumentoService:TipoDocumentoService,
      private settings: CoreService
    ) {}

    tipoDocuForm = new FormGroup({
        //email: new FormControl('', [Validators.required, Validators.email]),
        descripcion: new FormControl('', [
          Validators.required]),
        abrev: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
        ]),
      });

    ngOnInit():void{
      //this.personaDialog= this.data;
      this.tipoDocumento={...this.data};//spred operator

    }

    close(){
      this._dialogRef.close();
    }
    operate(){
      if(this.tipoDocumento !=null && this.tipoDocumento.id>0){
        //update
        this.tipoDocumentoService.update(this.tipoDocumento.id, this.tipoDocumento)
        .subscribe(()=>{
          this._dialogRef.close();
        });
      }else{
        //add
        this.tipoDocumentoService.save(this.tipoDocumento)
        .subscribe(()=>{

          this._dialogRef.close();
        });
      }

      this.close();
      //Angular MatDialog -> 22:46

    }

}
