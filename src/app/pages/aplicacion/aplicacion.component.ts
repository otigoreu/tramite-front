import { CommonModule, UpperCasePipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { Aplicacion, AplicacionSede, AplicacionWithSede } from 'src/app/model/aplicacion';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { DialogAplicacionComponent } from './dialog-aplicacion/dialog-aplicacion.component';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-aplicacion',
  standalone: true,
  imports: [MaterialModule,
      TablerIconsModule,
      MatNativeDateModule,
      NgScrollbarModule,
      CommonModule, MatPaginatorModule,UpperCasePipe],
  templateUrl: './aplicacion.component.html',

})
export class AplicacionComponent  {

  appService=inject(AplicacionService);


  displayedColumns: string[] = [
    'item',
    'descripcion',
    'sede',
    'status',
    'acciones'

  ];

  dataSource: MatTableDataSource<AplicacionWithSede>;
    // @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
      Object.create(null);
    @ViewChild(MatSort) sort!: MatSort;

dialog = inject(MatDialog);

constructor(){
  const aplicaciones:AplicacionWithSede[]=[];
  this.dataSource=new MatTableDataSource(aplicaciones);
}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.appService.getDataWithSede().subscribe((response)=>{
      this.dataSource=new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
    });
  }
  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

openDialog(aplicacion?:AplicacionSede){
  this.dialog.open(DialogAplicacionComponent,{
    width:'400px',height:'350px',
    data:aplicacion
  }).afterClosed().subscribe(()=>{
    this.loadData();
  });
}
delete(id:number) {
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
              this.appService.delete(id).subscribe((response) => {
                if (response.success) {
                    this.loadData();
                }
              });
            }
          });
  }
  finalized(id:number) {
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
           this.appService.finalized(id).subscribe((response) => {
             if (response.success) {
                this.loadData();
             }
           });
         }
       });
  }

  initialized(id:number) {
    Swal.fire({
         title: '¿Estás seguro?',
         // text: '¡No podrás revertir esto!',
         icon: 'success',
         showCancelButton: true,
         confirmButtonText: 'Sí, Activar',
         cancelButtonText: 'Cancelar',
       }).then((result) => {
         if (result.isConfirmed) {
           // lógica de confirmación
           this.appService.initialized(id).subscribe((response) => {
             if (response.success) {
                 this.loadData();
             }
           });
         }
       });
  }

}
