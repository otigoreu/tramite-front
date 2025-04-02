import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { SedeService } from 'src/app/service/sede.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Sede } from 'src/app/model/sede';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-dialog-sede',
  standalone: true,
  imports: [MatDialogModule,MaterialModule,FormsModule, ReactiveFormsModule],
  templateUrl: './dialog-sede.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogSedeComponent {

  sede:Sede;
  sedeService=inject(SedeService);

  constructor(@Inject(MAT_DIALOG_DATA) private data:Sede,
        private _dialogRef:MatDialogRef<DialogSedeComponent>){

  }
  appForm=new FormGroup({
          descripcion:new FormControl('',[Validators.required])
        });

close(){
          this._dialogRef.close();
        }

ngOnInit():void{

          this.sede={...this.data}
        }
        operate(){
          if(this.sede!=null && this.sede.id>0){
            this.sedeService.update(this.sede.id, this.sede).subscribe(()=>{
              this._dialogRef.close();
            })
          }else {
            this.sedeService.save(this.sede).subscribe(()=>{
              this._dialogRef.close();
            });
          }
          this.close();

        }
}
