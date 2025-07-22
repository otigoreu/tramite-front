import { NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { TipoDocumento } from 'src/app/model/tipoDocumento';
import { TipoDocumentoService } from 'src/app/service/tipo-documento.service';
import { DialogTipoDocumentoComponent } from './dialog-tipo-documento/dialog-tipo-documento.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tipo-documento',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, NgIf],
  templateUrl: './tipo-documento.component.html',
})
export class TipoDocumentoComponent {
  appService = inject(TipoDocumentoService);

  displayedColumns: string[] = [
    'item',
    'descripcion',
    'abrev',
    'estado',
    'actions',
  ];
  dataSource: MatTableDataSource<TipoDocumento>;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort) sort!: MatSort;

  dialog = inject(MatDialog);

  constructor() {
    const tipoDocumento: TipoDocumento[] = [];
    this.dataSource = new MatTableDataSource(tipoDocumento);
  }
  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.appService.getDataIgnoreQuery().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
    });
  }
  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  openDialog(tipodocumento?: TipoDocumento) {
    this.dialog
      .open(DialogTipoDocumentoComponent, {
        width: '400px',
        height: '335px',
        data: tipodocumento,
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
        this.appService.deleteTipoDocu(id).subscribe((response) => {
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
        this.appService.finalized(id).subscribe((response) => {
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
        this.appService.initialized(id).subscribe((response) => {
          if (response.success) {
            this.loadData();
          }
        });
      }
    });
  }
}
