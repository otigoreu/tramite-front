import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnInit,
  signal,
} from '@angular/core';
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

interface GetMenuRol {
  data: MenuRol[];
  success: string;
  errorMensage: string;
}

@Component({
  selector: 'app-dialog-menu',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MaterialModule,
    MatNativeDateModule,
    SharedModule,
    TablerIconsModule,
  ],
  templateUrl: './dialog-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogMenuComponent implements OnInit {
  rol: Rol;
  menus = signal<MenuInfo[]>([]);
  menusRol = signal<MenuInfo[]>([]);
  menusRolEstado = signal<MenuRol[]>([]);
  menuservice = inject(MenuService);
  authservice = inject(AuthService);
  menusrolservice = inject(MenurolService);
  firstOptionMenu = signal('');
  router = inject(Router);
  isLoading = false;
  userIdRolGeneral: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Rol,
    private _dialogRef: MatDialogRef<DialogMenuComponent>
  ) {}

  ngOnInit(): void {
    this.rol = { ...this.data };

    this.loadMenuByRolEstado();
     this.userIdRolGeneral = localStorage.getItem('userIdRol');
      console.log('idRolGeneral', this.userIdRolGeneral);
      console.log('idrol traido', this.rol.id);

  }



  get seleccionadas(): number {
    return this.menusRolEstado().filter((app) => app.estado).length;
  }

  loadMenuByRolEstado() {
    const idRol = this.rol.id;
    this.menusrolservice
      .getData(
        parseInt(this.authservice.idEntidad()),
        parseInt(this.authservice.idAplicacion()),
        idRol!.toString()
      )
      .subscribe((responseRolEstado) => {
        //console.log('menu por Rol con Estado',responseRolEstado);
        this.menusRolEstado.set(responseRolEstado);
      });
  }

  onSelectedChange(row: MenuRol, selected: boolean): void {
    // 👇 si el valor nuevo es igual al que ya tenía, es el binding inicial, no un clic real
    if (row.estado === selected) {
      return;
    }
    console.log('se activo el select');
    if (this.isLoading) return;

    const dto: MenuRol = {
      idRol: this.rol?.id!,
      idMenu: row.idMenu,
      estado: selected,
    };
    // console.log('idRol',dto.idRol,'idMenu',dto.idMenu);
    this.menusrolservice
      .getDataByidRolandidMenu(dto.idRol, dto.idMenu)
      .subscribe((res: MenuRol) => {
        const esEdicion = res != null;
        // console.log('esEdicion',esEdicion);
        if (esEdicion) {
          this.menusrolservice.update(res.id!, dto).subscribe({
            next: (res) => {
             row.estado = selected; // 👈 actualiza el estado local tras confirmar el guardado

             if(this.userIdRolGeneral === this.rol.id){
              console.log('roles iguales');
              //actualizar menus por rol
              this.menuservice
                .GetByAplicationWithIdRol(dto.idRol)//GetByAplicationAsync(parseInt(this.authservice.idAplicacion()))
                .subscribe({

                  next: (data: any[]) => {
                    //console.log('menu', data);
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
                    navItems.forEach((parentNav: NavItem) => {
                      parentNav.children = data.filter(
                        (nav) => nav.idMenuPadre === parentNav.id
                      );
                    });
                  },
                });
                ///fin de actualizar menus por rol

             }

            },
            error: (err) => {
              //console.log('error', err);
            },
          });
        } else {
          this.menusrolservice.save(dto).subscribe({
            next: (res) => {
              row.estado = selected;// 👈 actualiza el estado local tras confirmar el guardado
               if(this.userIdRolGeneral === this.rol.id){
              console.log('roles iguales');
                //actualizar menu por rol
              this.menuservice
                .GetByAplicationWithIdRol(dto.idRol)//GetByAplicationAsync(parseInt(this.authservice.idAplicacion()))
                .subscribe({
                  next: (data: any[]) => {
                    //console.log('menu', data);
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
                //fin de actualizar menu por rol

             }

            },
            error: (err) => {
              console.log('error', err);
            },
          });
        }
      });
  }
}
