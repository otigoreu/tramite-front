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
import { DialogComponent } from './dialog/dialog.component';

@Component({
  selector: 'app-tipo-documento',
  standalone: true,
  imports: [MaterialModule, TablerIconsModule, NgIf],
  templateUrl: './tipo-documento.component.html',

})
export class TipoDocumentoComponent {
  appService = inject(TipoDocumentoService);

  displayedColumns: string[] = [

    'descripcion',
    'abrev',
    'status',
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
    this.dialog.open(DialogTipoDocumentoComponent, {
          width:'600px',height:'335px',
          data:tipodocumento
        }).afterClosed()
        .subscribe(() => {
          this.loadData();
        });
  }
  openDialog2(tipodocumento?: TipoDocumento) {
    this.dialog.open(DialogComponent, {
          width:'500px',height:'335px',

          data:tipodocumento
        }).afterClosed()
        .subscribe(() => {
          this.loadData();
        });
  }


  delete(id: number) {
    if (confirm('Eliminar?')) {
      this.appService.deleteTipoDocu(id).subscribe((response) => {
        if (response.success) {
          alert('Tipo Documento eliminado');
          this.loadData();
        }
      });
    }
  }

  finalized(id:number) {
    if (confirm('Desactivar?')) {
      this.appService.finalized(id).subscribe((response) => {
        if (response.success) {
          alert('Tipo Documento desactivado');
          this.loadData();
        }
      });
    }
  }

  initialized(id:number) {
    if (confirm('Activar?')) {
      this.appService.initialized(id).subscribe((response) => {
        if (response.success) {
          alert('Tipo Documento Activado');
          this.loadData();
        }
      });
    }
  }
}
