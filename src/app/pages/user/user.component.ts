import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../service/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/model/usuario';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { NgIf } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DialogUserComponent } from './dialog-user/dialog-user.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [MaterialModule,NgIf, TablerIconsModule],
  templateUrl: './user.component.html',

})
export class UserComponent implements OnInit {

  userService = inject(UserService);

  displayedColumns:string[]=[
    'item',
    'Usuario',
    'Email',
    'Nombres',
    'Apellidos',
    'actions',
  ]

  dataSource:MatTableDataSource<Usuario>
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
      Object.create(null);
    @ViewChild(MatSort) sort!: MatSort;

  totalElements: number;
  dialog = inject(MatDialog);

  constructor() {
      const usuario: Usuario[] = [];
      this.dataSource = new MatTableDataSource(usuario);
    }

  ngOnInit(): void {
    this.loadData();
  }

 loadData(){
  this.userService.getAll().subscribe((response)=>{
    this.dataSource=new MatTableDataSource(response);
    this.dataSource.paginator=this.paginator
    console.log('data',response);
  });
 }

 applyFilter(filterValue: any){
  this.dataSource.filter = filterValue.trim().toLowerCase();
 }
 openDialog(userDialog?:Usuario){
  this.dialog.open(DialogUserComponent,{
    width: '600px',
        height: '675px',data:userDialog
  });
 }
 finalized(id:number){}
 initialized(id:number){}
 delete(id:number){}

}
