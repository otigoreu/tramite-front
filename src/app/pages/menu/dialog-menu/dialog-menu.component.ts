import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  Menu,
  MenuInfo,
  MenuRol,
  Menus,
  MenuWithRoles,
} from 'src/app/model/menu';
import { MenuService } from 'src/app/service/menu.service';
import { DialogSedeComponent } from '../../sede/dialog-sede/dialog-sede.component';
import { MaterialModule } from 'src/app/material.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { CommonModule } from '@angular/common';
import { Rol } from 'src/app/model/rol';
import { RolService } from 'src/app/service/rol.service';
import { Aplicacion } from '../../aplicacion/Modals/Aplicacion';
import { AuthService } from 'src/app/service/auth.service';
import { navItems } from 'src/app/layouts/full/vertical/sidebar/sidebar-data';
import { NavItem } from 'src/app/layouts/full/vertical/sidebar/nav-item/nav-item';

@Component({
  selector: 'app-dialog-menu',
  standalone: true,
  imports: [
    MatDialogModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './dialog-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogMenuComponent implements OnInit {
  disableSelect = new FormControl(false);
  menu: MenuInfo;
  aplicaciones: Aplicacion[] = [];
  menus: Menu[] = [];
  appService = inject(AplicacionService);
  menuService = inject(MenuService);
  rolService = inject(RolService);
  _dialogRef = inject(MatDialogRef);
  authservice = inject(AuthService);

  constructor(@Inject(MAT_DIALOG_DATA) private data: MenuInfo) {}

  appForm = new FormGroup({
    descripcion: new FormControl('', [Validators.required]),
    icono: new FormControl('', [Validators.required]),
    ruta: new FormControl('', [Validators.required]),
    idMenuPadre: new FormControl('', [Validators.nullValidator]),
  });
  ngOnInit(): void {
    this.menu = { ...this.data };

    console.log('menu obtenido', this.menu);
    this.loadApp();
    this.loadMenus();
    if (this.menu.id > 0) {
      this.disableSelect.setValue(true);
    }
  }

  loadApp() {
    this.appService.getDataIgnoreQuery().subscribe((response) => {
      this.aplicaciones = response;
    });
  }
  loadMenus() {
    this.menuService.getDataIgnoreQuery().subscribe((response) => {
      this.menus = response;
    });
  }

  close() {
    this._dialogRef.close();
  }
  operate() {
    const body: Menus = {
      descripcion: this.appForm.controls.descripcion.value!,
      icono: this.appForm.controls.icono.value!,
      ruta: this.appForm.controls.ruta.value!,
      idAplicacion: Number.parseInt(this.authservice.idAplicacion()),
      idMenuPadre:
        this.appForm.controls.idMenuPadre.value == undefined
          ? null
          : Number.parseInt(this.appForm.controls.idMenuPadre.value!),
    };

    if (this.menu != null && this.menu.id > 0) {
      this.menuService.update(this.menu.id, body).subscribe(() => {
        this.menuService
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
              navItems.forEach((parentNav: NavItem) => {
                parentNav.children = data.filter(
                  (nav) => nav.idMenuPadre === parentNav.id
                );
              });
            },
          });

        this._dialogRef.close();
      });
    } else {
      // console.log('menu new', body);

      this.menuService.save(body).subscribe(() => {
        this._dialogRef.close();
      });
    }
    this.close();
  }
}
