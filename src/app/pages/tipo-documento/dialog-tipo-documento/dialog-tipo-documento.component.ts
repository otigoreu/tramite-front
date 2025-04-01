import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { TipoDocumento } from 'src/app/model/tipoDocumento';
import { TipoDocumentoService } from '../../../service/tipo-documento.service';

@Component({
  selector: 'app-dialog-tipo-documento',
  standalone: true,
  imports: [MatDialogModule,MaterialModule,FormsModule, ReactiveFormsModule],
  templateUrl: './dialog-tipo-documento.component.html',
})
export class DialogTipoDocumentoComponent {

  tipoDocumento:TipoDocumento;

  constructor( @Inject(MAT_DIALOG_DATA) private data:TipoDocumento, private _dialogRef:MatDialogRef<DialogTipoDocumentoComponent>,
      private tipoDocumentoService:TipoDocumentoService )
  {

  }

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
