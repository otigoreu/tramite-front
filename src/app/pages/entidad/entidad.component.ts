import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { EntidadService } from 'src/app/service/entidad.service';
import { Entidad } from './Models/Entidad';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CommonModule, NgIf } from '@angular/common';
import { NotificationsService } from 'angular2-notifications';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { ConfirmationService } from 'src/app/service/confirmation.service';
import { EntidadEditComponent } from './entidad-edit/entidad-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { EntidadAplicacionComponent } from './entidad-aplicacion/entidad-aplicacion.component';

@Component({
  selector: 'app-entidad',
  standalone: true,
  styleUrl: 'entidad.component.scss', // Estilo asociado
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    MatPaginatorModule,
    NgIf,
  ],
  templateUrl: './entidad.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntidadComponent implements OnInit, AfterViewInit {
  entidadService = inject(EntidadService);

  displayedColumns: string[] = [
    'descripcion',
    'aplicacion',
    'estado',
    'actions',
  ];
  dataSource: MatTableDataSource<Entidad> = new MatTableDataSource<Entidad>();
  totalRecords: number = 0;

  searchTerm: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialog = inject(MatDialog);

  constructor(
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadEntidades();
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      const pageIndex = this.paginator.pageIndex + 1;
      const pageSize = this.paginator.pageSize;

      this.loadEntidades(this.searchTerm, pageIndex, pageSize);
    });
  }

  loadEntidades(
    search: string = '',
    page: number = 1,
    pageSize: number = 10
  ): void {
    const idEntidad = parseInt(localStorage.getItem('idAEntidad')!);

    this.entidadService
      .getPaginadoEntidad(idEntidad, search, page, pageSize)
      .subscribe({
        next: (res) => {
          this.totalRecords = res.meta.total;
          this.dataSource.data = res.items;
        },
        error: (err) => {
          console.error('Error al obtener entidades', err);
        },
      });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.trim();
    this.paginator.firstPage(); // Reinicia a la primera página
    this.loadEntidades(this.searchTerm);
  }

  openDialog(entidadDialog?: Entidad) {
    this.dialog
      .open(EntidadEditComponent, {
        data: entidadDialog,
      })
      .afterClosed()
      .subscribe(() => {
        const pageIndex = this.paginator.pageIndex + 1; // el paginador es 0-based
        const pageSize = this.paginator.pageSize;

        this.loadEntidades(this.searchTerm, pageIndex, pageSize);
      });
  }

  openDialogAplicacion(entidadDialog?: Entidad) {
    this.dialog
      .open(EntidadAplicacionComponent, {
        data: entidadDialog,
      })
      .afterClosed()
      .subscribe(() => {
        const pageIndex = this.paginator.pageIndex + 1; // el paginador es 0-based
        const pageSize = this.paginator.pageSize;

        this.loadEntidades(this.searchTerm, pageIndex, pageSize);
      });
  }

  eliminarEntidad(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.entidadService.eliminarEntidad(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(...NotificationMessages.success());
          this.loadEntidades();
        }
      }
    );
  }

  deshabilitarEntidad(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.entidadService.deshabilitarEntidad(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Entidad Deshabilitada')
          );
          this.loadEntidades();
        }
      }
    );
  }

  habilitarEntidad(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.entidadService.habilitarEntidad(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Entidad Habilitada')
          );
          this.loadEntidades();
        }
      }
    );
  }
}
