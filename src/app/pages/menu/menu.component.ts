import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MenuRol, MenuWithRol } from 'src/app/model/menu';
import { MenuService } from 'src/app/service/menu.service';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { DialogMenuComponent } from './dialog-menu/dialog-menu.component';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MaterialModule,MatButtonModule,
        TablerIconsModule,
        MatNativeDateModule,
        NgScrollbarModule,
        CommonModule, MatPaginatorModule],
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {

  menuService=inject(MenuService)




  displayedColumns:string[]=[
    'item','descripcion','id','icono','ruta','Aplicacion','Rol','IdMenuPadre','estado','acciones'
  ];

  dataSource:MatTableDataSource<MenuWithRol>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =Object.create(null);
  @ViewChild(MatSort) sort!: MatSort;
  dialog = inject(MatDialog);

  constructor(){
    const menus:MenuWithRol[]=[];
    this.dataSource=new MatTableDataSource(menus);
  }

  ngOnInit():void{
    this.loadData();

  }

  loadData(){
    this.menuService.getDataWithRol().subscribe((response)=>{
      this.dataSource=new MatTableDataSource(response);

      // console.log(this.dataSource);
      this.dataSource.paginator=this.paginator;

    });
  }


  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openDialog(menu?:MenuRol){
    this.dialog.open(DialogMenuComponent,{
      width:'400px',height:'650px',
        data:menu
      }).afterClosed().subscribe(()=>{
        this.loadData();
      });

  }
  delete(id:number){
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
  initialized(id:number){
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
  finalized(id:number){
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
