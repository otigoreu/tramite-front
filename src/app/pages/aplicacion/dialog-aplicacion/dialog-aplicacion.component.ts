import {  Component, Inject} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA,MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { Aplicacion} from 'src/app/model/aplicacion';
import { AplicacionService } from 'src/app/service/aplicacion.service';

@Component({
  selector: 'app-dialog-aplicacion',
  standalone: true,
  imports: [MatDialogModule,MaterialModule,FormsModule, ReactiveFormsModule],
  templateUrl: './dialog-aplicacion.component.html',
})
export class DialogAplicacionComponent {

  aplicacion:Aplicacion;


  constructor(
      @Inject(MAT_DIALOG_DATA) private data:Aplicacion,
      private _dialogRef:MatDialogRef<DialogAplicacionComponent>,
      private appService:AplicacionService){

      }

      appForm=new FormGroup({
        descripcion:new FormControl('',[Validators.required])
      });

    ngOnInit():void{

      this.aplicacion={...this.data}

    }

    close(){
      this._dialogRef.close();
    }

    operate(){
      if(this.aplicacion!=null && this.aplicacion.id>0){
        this.appService.update(this.aplicacion.id, this.aplicacion).subscribe(()=>{
          this._dialogRef.close();
        })
      }else {
        this.appService.save(this.aplicacion).subscribe(()=>{
          this._dialogRef.close();
        });
      }
      this.close();

    }
 }
