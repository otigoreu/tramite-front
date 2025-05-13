import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { Aplicacion } from 'src/app/model/aplicacion';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { DialogAplicacionComponent } from './dialog-aplicacion/dialog-aplicacion.component';




@Component({
  selector: 'app-aplicacion',
  standalone: true,
  imports: [MaterialModule,
      TablerIconsModule,
      MatNativeDateModule,
      NgScrollbarModule,
      CommonModule, MatPaginatorModule],
  templateUrl: './aplicacion.component.html',

})
export class AplicacionComponent  {

  appService=inject(AplicacionService);


  displayedColumns: string[] = [
    'item',
    'descripcion',
    'status',
    'acciones'

  ];

  dataSource: MatTableDataSource<Aplicacion>;
    // @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
      Object.create(null);
    @ViewChild(MatSort) sort!: MatSort;

dialog = inject(MatDialog);

constructor(){
  const aplicaciones:Aplicacion[]=[];
  this.dataSource=new MatTableDataSource(aplicaciones);
}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(){
    this.appService.getDataIgnoreQuery().subscribe((response)=>{
      this.dataSource=new MatTableDataSource(response);
      this.dataSource.paginator=this.paginator;
    });
  }
  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

openDialog(aplicacion?:Aplicacion){
  this.dialog.open(DialogAplicacionComponent,{
    width:'400px',height:'260px',
    data:aplicacion
  }).afterClosed().subscribe(()=>{
    this.loadData();
  });
}
delete(id:number) {
  if(confirm('Eliminar')){
    this.appService.delete(id).subscribe((response)=>{
      if(response.success){
        alert('Aplicacion eliminada');
        this.loadData();
      }
    })
  }
  }
  finalized(id:number) {
    if (confirm('Desactivar?')) {
      this.appService.finalized(id).subscribe((response) => {
        if (response.success) {
          alert('Aplicacion desactivada');
          this.loadData();
        }
      });
    }
  }

  initialized(id:number) {
    if (confirm('Activar?')) {
      this.appService.initialized(id).subscribe((response) => {
        if (response.success) {
          alert('Aplicacion Activada');
          this.loadData();
        }
      });
    }
  }

}
