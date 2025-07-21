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
import { Menu, MenuRol, MenuWithRoles } from 'src/app/model/menu';
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
import { Aplicacion } from 'src/app/model/aplicacion';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { CommonModule } from '@angular/common';
import { Rol } from 'src/app/model/rol';
import { RolService } from 'src/app/service/rol.service';

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
  menu: MenuRol;
  aplicaciones: Aplicacion[] = [];
  menus: Menu[] = [];
  roles: Rol[] = [];
  appService = inject(AplicacionService);
  menuService = inject(MenuService);
  rolService = inject(RolService);
  _dialogRef = inject(MatDialogRef);

  constructor(@Inject(MAT_DIALOG_DATA) private data: MenuRol) {}

  appForm = new FormGroup({
    descripcion: new FormControl('', [Validators.required]),
    icono: new FormControl('', [Validators.required]),
    ruta: new FormControl('', [Validators.required]),
    idAplicacion: new FormControl('', [Validators.required]),
    idRol: new FormControl('', [Validators.required]),
    idMenuPadre: new FormControl('', [Validators.nullValidator]),
  });
  ngOnInit(): void {
    this.menu = { ...this.data };

    console.log('menu obtenido',this.menu);
    this.loadApp();
    this.loadMenus();
    this.loadRoles();
    if(this.menu.id>0){
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
  loadRoles() {
    this.rolService.getData().subscribe((response) => {
      this.roles = response;
    });
  }

  close() {
    this._dialogRef.close();
  }
  operate() {

      const body: MenuWithRoles = {
      descripcion: this.appForm.controls.descripcion.value!,
      icono: this.appForm.controls.icono.value!,
      ruta: this.appForm.controls.ruta.value!,
      idAplicacion: Number.parseInt(this.appForm.controls.idAplicacion.value!),
      idRoles: [this.appForm.controls.idRol.value!],
      idMenuPadre: this.appForm.controls.idMenuPadre.value==undefined ?null :Number.parseInt(this.appForm.controls.idMenuPadre.value!),
    };


    if (this.menu != null && this.menu.id > 0) {

      this.menuService.updateWithRol(this.menu.id, body).subscribe(() => {
        this._dialogRef.close();
      });
    } else {
      // console.log('menu new', body);

      this.menuService.saveWithRol(body).subscribe(() => {
        this._dialogRef.close();
      });
    }
    this.close();
  }
}

