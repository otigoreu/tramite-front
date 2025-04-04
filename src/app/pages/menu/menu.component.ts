import { ChangeDetectionStrategy, Component, inject, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Menu } from 'src/app/model/menu';
import { MenuService } from 'src/app/service/menu.service';
import { DialogMenuComponent } from './dialog-menu/dialog-menu.component';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CommonModule } from '@angular/common';
import { AplicacionService } from 'src/app/service/aplicacion.service';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [MaterialModule,
        TablerIconsModule,
        MatNativeDateModule,
        NgScrollbarModule,
        CommonModule, MatPaginatorModule],
  templateUrl: './menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MenuComponent {

  menuService=inject(MenuService)
  appService=inject(AplicacionService)

  displayedColumns:string[]=[
    'displayName','iconName','route','idAplicacion','ParentMenuId','status','acciones'
  ];

  dataSource:MatTableDataSource<Menu>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =Object.create(null);
  @ViewChild(MatSort) sort!: MatSort;
  dialog: any;

  constructor(){
    const menus:Menu[]=[];
    this.dataSource=new MatTableDataSource(menus);
  }
  ngOnInit():void{
    this.loadData();
  }

  loadData(){
    this.menuService.getDataIgnoreQuery().subscribe((response)=>{
      this.dataSource=new MatTableDataSource(response);

      // console.log(this.dataSource);
      this.dataSource.paginator=this.paginator;
    });
  }
  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openDialog(menu?:Menu){
    this.dialog.open(DialogMenuComponent,{
        data:menu
      }).afterClosed().subscribe(()=>{
        this.loadData();
      });
  }
  delete(id:number){
    if(confirm('Eliminar')){
      this.menuService.delete(id).subscribe((response)=>{
        if(response.success){
          alert('Aplicacion eliminada');
          this.loadData();
        }
      })
    }
  }
  initialized(id:number){
    if (confirm('Activar?')) {
      this.menuService.initialized(id).subscribe((response) => {
        if (response.success) {
          alert('Aplicacion Activada');
          this.loadData();
        }
      });
    }
  }
  finalized(id:number){
    if (confirm('Desactivar?')) {
      this.menuService.finalized(id).subscribe((response) => {
        if (response.success) {
          alert('Aplicacion desactivada');
          this.loadData();
        }
      });
    }
  }
}
