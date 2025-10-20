import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Inject, OnInit, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Menu, MenuInfo } from 'src/app/model/menu';
import { Rol } from 'src/app/model/rol';
import { AuthService } from 'src/app/service/auth.service';

import { MenuService } from 'src/app/service/menu.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenurolService } from '../../../service/menurol.service';
import { MenuRol } from 'src/app/model/menuRol';
import { Data } from '../../../model/usuario';
import { navItems } from 'src/app/layouts/full/vertical/sidebar/sidebar-data';
import { NavItem } from 'src/app/layouts/full/vertical/sidebar/nav-item/nav-item';
import { Router, RouterModule } from '@angular/router';

  interface GetMenuRol{
    data:MenuRol[];
    success:string;
    errorMensage:string;
  }

@Component({
  selector: 'app-dialog-menu',
  standalone: true,
  imports: [CommonModule,
    RouterModule,
      ReactiveFormsModule,
      FormsModule,
      MatListModule,
      MatCardModule,
      MaterialModule,
      MatNativeDateModule,
      SharedModule,
      TablerIconsModule,],
  templateUrl: './dialog-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogMenuComponent implements OnInit{

rol:Rol;
menus=signal<MenuInfo[]>([]);
menusRol=signal<MenuInfo[]>([]);
menusRolEstado=signal<MenuRol[]>([]);
menuservice=inject(MenuService);
authservice=inject(AuthService);
menusrolservice=inject(MenurolService);
firstOptionMenu = signal('');
router = inject(Router);
isLoading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Rol,
    private _dialogRef: MatDialogRef<DialogMenuComponent>
  ) {}

  ngOnInit(): void {
   this.rol={...this.data}
   this.loadMenuByRolEstado();
  }

get seleccionadas(): number {
    return this.menusRolEstado().filter((app) => app.estado).length;
  }



loadMenuByRolEstado(){
  const idRol=this.rol.id;
  this.menusrolservice.getData(parseInt(this.authservice.idEntidad()),parseInt(this.authservice.idAplicacion()),idRol!.toString()).subscribe((responseRolEstado)=>{
      //console.log('menu por Rol con Estado',responseRolEstado);
      this.menusRolEstado.set(responseRolEstado);

    });
}

onSelectedChange(row:MenuRol, selected:boolean):void{

  if(this.isLoading)return;

  const dto: MenuRol={
    idRol:this.rol?.id!,
    idMenu:row.idMenu,
    estado:selected,
  }
 // console.log('idRol',dto.idRol,'idMenu',dto.idMenu);
  this.menusrolservice.getDataByidRolandidMenu(dto.idRol,dto.idMenu).subscribe((res:MenuRol)=>{
    const esEdicion=res!=null;
   // console.log('esEdicion',esEdicion);
    if(esEdicion){
      this.menusrolservice.update(res.id!,dto ).subscribe({
        next:(res)=>{
          console.log('res',res);
          this.menuservice
                    .GetByAplicationAsync(parseInt(this.authservice.idAplicacion()))
                    .subscribe({
                      next: (data: any[]) => {
                        navItems.length = 0;
                        data.forEach((nav) => {
                          if (!nav.idMenuPadre) {
                            const navItem: NavItem = {
                              id: nav.id,
                              displayName: nav.descripcion,
                              iconName: nav.icono,
                              route: nav.ruta,
                              children: [],
                            };

                            navItems.push(navItem);
                          }
                        });

                      },
                    });
        },
        error:(err)=>{
          console.log('error',err);
        }
      });
    }
    else{
      this.menusrolservice.save(dto).subscribe({
        next:(res)=>{
          console.log('res',res);
          this.menuservice
                    .GetByAplicationAsync(parseInt(this.authservice.idAplicacion()))
                    .subscribe({
                      next: (data: any[]) => {
                        navItems.length = 0;
                        data.forEach((nav) => {
                          if (!nav.idMenuPadre) {
                            const navItem: NavItem = {
                              id: nav.id,
                              displayName: nav.descripcion,
                              iconName: nav.icono,
                              route: nav.ruta,
                              children: [],
                            };
                            navItems.push(navItem);
                          }
                        });
                      },
                    });
        },
        error:(err)=>{
          console.log('error',err);
        }
      });

    }
  });
}

}
