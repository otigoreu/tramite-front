import { UpperCasePipe } from '@angular/common';
import {  Component, inject, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { Rol } from 'src/app/model/rol';
import { RolService } from 'src/app/service/rol.service';


interface Estado {
  valor: boolean,
  name:string
}



@Component({
  selector: 'app-dialogo-rol',
  standalone: true,
  imports: [MaterialModule,FormsModule,ReactiveFormsModule, MatDialogModule,UpperCasePipe],
  templateUrl: './dialogo-rol.component.html',

})
export class DialogoRolComponent implements OnInit{

  estados:Estado[]=[
{
  valor:true,
  name:'Activo'
},
{
  valor:false,
  name:'Inactivo'
}
]


  rol:Rol;

  rolService=inject(RolService);

  constructor( @Inject(MAT_DIALOG_DATA) private data:Rol,
        private _dialogRef:MatDialogRef<DialogoRolComponent>){}


  rolForm=new FormGroup({
    name:new FormControl('',[Validators.required]),

  });

  ngOnInit(): void {
    this.rol={...this.data}
    console.log('data',this.data);
    console.log('name',this.data.name);
    console.log('normalizedName',this.data.normalizedName);
  }


  close(){
    this._dialogRef.close();
  }

  operate(){
    this.rol.normalizedName=this.rol.name;
    console.log('rol operara',this.rol);
    console.log('id',this.rol.id);

    if(this.rol!=null && this.rol.id!=undefined){
            console.log('rol edit',this.rol);
            this.rolService.update(this.rol.id, this.rol).subscribe(()=>{
              this._dialogRef.close();
            })
          }else {
            console.log('rol new',this.rol);
            this.rolService.save(this.rol).subscribe(()=>{
              this._dialogRef.close();
            });
          }
          this.close();
  }

}
