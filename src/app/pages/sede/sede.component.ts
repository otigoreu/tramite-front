import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
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
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sede',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    MatPaginatorModule,
  ],
  templateUrl: './sede.component.html',
})
export class SedeComponent {
  sedeService = inject(SedeService);

  displayedColumns: string[] = ['item', 'descripcion', 'status', 'acciones'];

  dataSource: MatTableDataSource<Sede>;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort) sort!: MatSort;

  dialog = inject(MatDialog);

  constructor() {
    const sedes: Sede[] = [];
    this.dataSource = new MatTableDataSource(sedes);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.sedeService.getDataIgnoreQuery().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
    });
  }

  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(sede?: Sede) {
    this.dialog
      .open(DialogSedeComponent, {
        width: '400px',
        height: '260px',
        data: sede,
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
        this.sedeService.delete(id).subscribe((response) => {
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
        this.sedeService.finalized(id).subscribe((response) => {
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
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Sí, Activar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // lógica de confirmación
        this.sedeService.initialized(id).subscribe((response) => {
          if (response.success) {
            this.loadData();
          }
        });
      }
    });
  }
}
