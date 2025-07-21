import { UpperCasePipe } from '@angular/common';
import {  Component, inject, Inject} from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA,MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { Aplicacion, AplicacionSede, AplicacionWithSedes} from 'src/app/model/aplicacion';
import { Sede } from 'src/app/model/sede';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { SedeService } from 'src/app/service/sede.service';

@Component({
  selector: 'app-dialog-aplicacion',
  standalone: true,
  imports: [MatDialogModule,MaterialModule,FormsModule, ReactiveFormsModule,UpperCasePipe],
  templateUrl: './dialog-aplicacion.component.html',
})
export class DialogAplicacionComponent {

disableSelect = new FormControl(false);
  appService=inject(AplicacionService)
  sedeService=inject(SedeService);
  _dialogRef=inject(MatDialogRef);
  sedes:Sede[]=[];
  aplicacion:AplicacionSede;


  constructor(@Inject(MAT_DIALOG_DATA) private data:AplicacionSede){}

      appForm=new FormGroup({
        descripcion:new FormControl('',[Validators.required]),
        idSede:new  FormControl('',[Validators.required])
      });

    ngOnInit():void{

      this.aplicacion={...this.data}
      this.loadSedes();
      if(this.aplicacion.id>0){
      this.disableSelect.setValue(true);
    }

    }

    close(){
      this._dialogRef.close();
    }
    loadSedes(){

      this.sedeService.getData().subscribe((response)=>{
        this.sedes=response;
      })
    }

    operate(){

        const body:AplicacionWithSedes={

          descripcion:this.appForm.controls.descripcion.value!,
          idSedes:[Number.parseInt(this.appForm.controls.idSede.value!)]
        }


      if(this.aplicacion!=null && this.aplicacion.id>0){
         console.log('menu edit', body);
      console.log('id',this.aplicacion.id);
        this.appService.update(this.aplicacion.id, body).subscribe(()=>{
          this._dialogRef.close();
        })
      }else {
        this.appService.saveWithSede(body).subscribe(()=>{
          this._dialogRef.close();
        });
      }
      this.close();

    }
 }
