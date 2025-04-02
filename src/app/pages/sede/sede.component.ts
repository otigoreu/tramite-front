import { CommonModule } from '@angular/common';
import {  Component, inject, ViewChild } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { Sede } from 'src/app/model/sede';
import { SedeService } from 'src/app/service/sede.service';
import { DialogSedeComponent } from './dialog-sede/dialog-sede.component';

@Component({
  selector: 'app-sede',
  standalone: true,
  imports: [MaterialModule,
        TablerIconsModule,
        MatNativeDateModule,
        NgScrollbarModule,
        CommonModule, MatPaginatorModule],
  templateUrl: './sede.component.html'
})
export class SedeComponent {

sedeService= inject(SedeService);

displayedColumns:string[]=[
  'descripcion',
  'status',
  'acciones'
]

dataSource: MatTableDataSource<Sede>;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
      Object.create(null);
    @ViewChild(MatSort) sort!: MatSort;

dialog = inject(MatDialog);

constructor(){
  const sedes:Sede[]=[];
  this.dataSource=new MatTableDataSource(sedes);

}

ngOnInit():void{
  this.loadData();
}

loadData(){
  this.sedeService.getDataIgnoreQuery().subscribe((response)=>{
    this.dataSource=new MatTableDataSource(response);
    this.dataSource.paginator=this.paginator;
  });
}

applyFilter(filterValue: any): void {
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

openDialog(sede?:Sede){
  this.dialog.open(DialogSedeComponent,{
      data:sede
    }).afterClosed().subscribe(()=>{
      this.loadData();
    });
}

delete(id:number){
  if(confirm('Eliminar')){
    this.sedeService.delete(id).subscribe((response)=>{
      if(response.success){
        alert('Sede eliminada');
        this.loadData();
      }
    })
  }
}
finalized(id:number){
  if (confirm('Desactivar?')) {
    this.sedeService.finalized(id).subscribe((response) => {
      if (response.success) {
        alert('Aplicacion desactivada');
        this.loadData();
      }
    });
  }
}
initialized(id:number){
  if (confirm('Activar?')) {
    this.sedeService.initialized(id).subscribe((response) => {
      if (response.success) {
        alert('Aplicacion Activada');
        this.loadData();
      }
    });
  }
}

}
