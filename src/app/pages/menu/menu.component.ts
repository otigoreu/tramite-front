import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MenuInfo} from 'src/app/model/menu';
import { MenuService } from 'src/app/service/menu.service';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogMenuComponent } from './dialog-menu/dialog-menu.component';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { Aplicacion } from '../aplicacion/Modals/Aplicacion';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    MaterialModule,
    MatButtonModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatSelectModule, // ✅ habilita <mat-select>
    MatOptionModule, // ✅ habilita <mat-option>
  ],
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {
  menuService = inject(MenuService);
  aplicaciones: Aplicacion[] = [];
  appService = inject(AplicacionService);
  app:Aplicacion;
  appId_select: number | null = null;

  displayedColumns: string[] = [
    'item',
    'descripcion',
    'id',
    'icono',
    'ruta',
    'Aplicacion',
    'IdMenuPadre',
    'estado',
    'acciones',
  ];

  dataSource: MatTableDataSource<MenuInfo>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort) sort!: MatSort;
  dialog = inject(MatDialog);

  constructor() {
    const menus: MenuInfo[] = [];
    this.dataSource = new MatTableDataSource(menus);
  }

  ngOnInit(): void {
    this.loadData();
    this.loadApp();
  }

  onAppSelected(event: any): void {
    const selectedRolId = event.value;
    // console.log('Rol seleccionado:', selectedRolId);

    // 👇 aquí puedes llamar directamente a tu método de carga de usuarios
    if(this.appId_select!=null){
      this.loadMenus(this.appId_select!);
    }else{
      this.loadData();
    }

  }

  loadMenus(idAplicacion:number){

    this.menuService.GetByAplicationAsyncSingle(idAplicacion).subscribe((response)=>{
      console.log('data',response.toString);
      this.dataSource=new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
    });
  }

  loadData() {
    this.menuService.getDataIgnoreQuery().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);

      // console.log(this.dataSource);
      this.dataSource.paginator = this.paginator;
    });
  }
   loadApp() {
    this.appService.getDataIgnoreQuery().subscribe((response) => {
      this.aplicaciones = response;
    });
  }

  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openDialog(menu?: MenuInfo) {
    this.dialog
      .open(DialogMenuComponent, {
        width: '400px',
        height: '650px',
        data: menu,
      })
      .afterClosed()
      .subscribe(() => {
        this.loadData();
      });
  }
  delete(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Emilinar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // lógica de confirmación
        this.menuService.delete(id).subscribe((response) => {
          if (response.success) {
            this.loadData();
          }
        });
      }
    });
  }
  initialized(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      // text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // lógica de confirmación
        this.menuService.initialized(id).subscribe((response) => {
          if (response.success) {
            this.loadData();
          }
        });
      }
    });
  }
  finalized(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      // text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Desactivar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // lógica de confirmación
        this.menuService.finalized(id).subscribe((response) => {
          if (response.success) {
            this.loadData();
          }
        });
      }
    });
  }
}
