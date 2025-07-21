import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Rol } from 'src/app/model/rol';
import { RolService } from 'src/app/service/rol.service';
import { DialogoRolComponent } from './dialogo-rol/dialogo-rol.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-rol',
  standalone: true,
  imports: [MaterialModule,TablerIconsModule,CommonModule,MatPaginatorModule],
  templateUrl: './rol.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolComponent implements OnInit{

rolService=inject(RolService);


displayedColumns:string[]=[
  'item',
  'descripcion',
  'estado',
  'acciones'
];

dataSource:MatTableDataSource<Rol>;

@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
      Object.create(null);
    @ViewChild(MatSort) sort!: MatSort;

    dialog=inject(MatDialog);

constructor(){
  const roles:Rol[]=[];
  this.dataSource=new MatTableDataSource(roles);
}
  ngOnInit(): void {
    this.loadData();

  }

loadData(){
    this.rolService.getData().subscribe((response)=>{
      this.dataSource=new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
    });
  }
  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delete(id:string){
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
                 this.rolService.delete(id).subscribe((response) => {
                   if (response.success) {
                       this.loadData();
                   }
                 });
               }
             });
  }

  openDialog(rol?:Rol){
    this.dialog.open(DialogoRolComponent,{data:rol}).afterClosed().subscribe(()=>{this.loadData();});

  }
  finalized(id: string) {
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
          this.rolService.finalized(id).subscribe((response) => {
            if (response.success) {
                this.loadData();
            }
          });
        }
      });
    }

    initialized(id: string) {
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
          this.rolService.initialized(id).subscribe((response) => {
            if (response.success) {
                this.loadData();
            }
          });
        }
      });
    }

}
