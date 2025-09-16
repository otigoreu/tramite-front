import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
  OnInit,
  AfterViewInit,
} from '@angular/core';
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
  styleUrl: 'rol.component.scss',
  imports: [
    MaterialModule,
    TablerIconsModule,
    CommonModule,
    MatPaginatorModule,
  ],
  templateUrl: './rol.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RolComponent implements OnInit, AfterViewInit {
  rolService = inject(RolService);

  displayedColumns: string[] = ['item', 'descripcion', 'estado', 'acciones'];

  dataSource: Rol[] = [];
  totalRecords: number = 0;

  search: string = '';
  pageIndex: number = 0; // MatPaginator usa base 0
  pageSize: number = 10;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort) sort!: MatSort;

  dialog = inject(MatDialog);

  constructor() {
    const roles: Rol[] = [];
    //this.dataSource = new MatTableDataSource(roles);
  }

  ngOnInit(): void {
    this.load_Rol();
  }

  ngAfterViewInit() {
    // 📌 Paginación desde el backend
    this.paginator.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.load_Rol();
    });

    // 📌 Ordenamiento (solo si tu API soporta ordenamiento)
    this.sort.sortChange.subscribe(() => {
      this.pageIndex = 0; // cuando cambie orden reiniciamos a la primera página
      this.load_Rol();
    });
  }

  load_Rol() {
    const idEntidad = Number(localStorage.getItem('idEntidad'));
    const idAplicacion = Number(localStorage.getItem('idAplicacion'));
    const rolId = localStorage.getItem('userIdRol')!;

    this.rolService
      .getPaginado(idEntidad, idAplicacion, this.search, {
        page: this.pageIndex + 1, // ⚠️ ojo: si tu backend espera base 1
        recordsPerPage: this.pageSize,
      })
      .subscribe({
        next: (response) => {
          // ✅ llenar el dataSource con los datos
          this.dataSource = response.data;

          // ✅ actualizar total para el paginator
          this.totalRecords = response.totalrecords;

          // 🔹 Actualizar MatPaginator explícitamente
          if (this.paginator) {
            this.paginator.length = this.totalRecords;
          }
        },
        error: (err) => {
          console.error('❌ Error al cargar roles:', err);
        },
      });
  }

  applyFilter(value: string) {
    this.search = value.trim().toLowerCase();
    this.pageIndex = 0;
    this.load_Rol();
  }

  // applyFilter(filterValue: any): void {
  //   this.dataSource.filter = filterValue.trim().toLowerCase();
  // }

  delete(id: string) {
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
            this.load_Rol();
          }
        });
      }
    });
  }

  openDialog(rol?: Rol) {
    this.dialog
      .open(DialogoRolComponent, { data: rol })
      .afterClosed()
      .subscribe(() => {
        this.load_Rol();
      });
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
            this.load_Rol();
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
            this.load_Rol();
          }
        });
      }
    });
  }
}
