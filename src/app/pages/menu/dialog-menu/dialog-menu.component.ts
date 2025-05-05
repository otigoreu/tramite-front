import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Menu } from 'src/app/model/menu';
import { MenuService } from 'src/app/service/menu.service';
import { DialogSedeComponent } from '../../sede/dialog-sede/dialog-sede.component';
import { MaterialModule } from 'src/app/material.module';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Aplicacion } from 'src/app/model/aplicacion';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dialog-menu',
  standalone: true,
  imports: [MatDialogModule,MaterialModule,FormsModule, ReactiveFormsModule,CommonModule],
  templateUrl: './dialog-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogMenuComponent implements OnInit{

  menu:Menu;
  aplicacion:Aplicacion[]=[];
  menus:Menu[]=[];
  appService=inject(AplicacionService)
  menuService=inject(MenuService)

  constructor(@Inject(MAT_DIALOG_DATA) private data:Menu,
          private _dialogRef:MatDialogRef<DialogSedeComponent>){

    }

 appForm=new FormGroup({
          displayName:new FormControl('',[Validators.required]),
          iconName:new FormControl('',[Validators.required]),
          route:new FormControl('',[Validators.required]),
          idAplicacion:new FormControl('',[Validators.required]),
          parentMenuId:new FormControl('',[Validators.nullValidator])
        });
ngOnInit(): void {
    this.menu={...this.data}
    this.loadApp();
    this.loadMenus();

  }

loadApp(){

    this.appService.getDataIgnoreQuery().subscribe((response)=>{
      this.aplicacion=response;
    });

  }
  loadMenus(){

    this.menuService.getDataIgnoreQuery().subscribe((response)=>{
      this.menus=response;
    });

  }

close(){
      this._dialogRef.close();
    }
operate(){
  console.log('menu',this.menu);
          if(this.menu!=null && this.menu.id>0){
            console.log('menu edit',this.menu);
            this.menuService.update(this.menu.id, this.menu).subscribe(()=>{
              this._dialogRef.close();
            })
          }else {
            console.log('menu new',this.menu);
            this.menuService.save(this.menu).subscribe(()=>{
              this._dialogRef.close();
            });
          }
          this.close();

        }
}
