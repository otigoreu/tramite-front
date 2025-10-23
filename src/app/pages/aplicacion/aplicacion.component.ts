import { CommonModule, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
} from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NotificationsService } from 'angular2-notifications';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { ConfirmationService } from 'src/app/service/confirmation.service';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { AplicacionEditComponent } from './aplicacion-edit/aplicacion-edit.component';
import { Aplicacion } from './Modals/Aplicacion';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-aplicacion',
  standalone: true,
  styleUrl: 'aplicacion.component.scss', // Estilo asociado
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    MatPaginatorModule,
    NgIf,
  ],
  templateUrl: './aplicacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AplicacionComponent {
  aplicacionService = inject(AplicacionService);

  displayedColumns: string[] = ['descripcion', 'estado', 'actions'];
  dataSource: MatTableDataSource<Aplicacion> =
  new MatTableDataSource<Aplicacion>();
  totalRecords: number = 0;
  authservice=inject(AuthService);

  searchTerm: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialog = inject(MatDialog);

  constructor(
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    //this.loadAplicaciones();
    this.loadAplicaciones2();

  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      const pageIndex = this.paginator.pageIndex + 1;
      const pageSize = this.paginator.pageSize;

      //this.loadAplicaciones(this.searchTerm, pageIndex, pageSize);
      this.loadAplicaciones2(pageIndex, pageSize);
    });
  }


  // loadAplicaciones(
  //   search: string = '',
  //   page: number = 1,
  //   pageSize: number = 10
  // ): void {
  //   this.aplicacionService
  //     .getPaginadoAplicacion(search, page, pageSize)
  //     .subscribe({
  //       next: (res) => {
  //         this.totalRecords = res.meta.total;
  //         this.dataSource.data = res.items;
  //       },
  //       error: (err) => {
  //         console.error('Error al obtener aplicaciones', err);
  //       },
  //     });
  // }
   loadAplicaciones2(
    //identidad: this,
    page: number = 1,
    pageSize: number = 10
  ): void {
    this.aplicacionService
      .getPaginadoAplicacion2(parseInt(this.authservice.idEntidad()), page, pageSize)
      .subscribe({
        next: (res) => {
          this.totalRecords = res.meta.total;
          this.dataSource.data = res.items;
        },
        error: (err) => {
          console.error('Error al obtener aplicaciones', err);
        },
      });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.trim();
    this.paginator.firstPage(); // Reinicia a la primera página
   //this.loadAplicaciones(this.searchTerm);
    this.loadAplicaciones2();
  }

  openDialog(aplicacionDialog?: Aplicacion) {
    this.dialog
      .open(AplicacionEditComponent, {
        data: aplicacionDialog,
      })
      .afterClosed()
      .subscribe(() => {
        this.loadAplicaciones2();
      });
  }

  eliminarAplicacion(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.aplicacionService.eliminarAplicacion(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(...NotificationMessages.success());
          this.loadAplicaciones2();
        }
      }
    );
  }

  deshabilitarAplicacion(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.aplicacionService.deshabilitarAplicacion(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Aplicacion Deshabilitada')
          );
          this.loadAplicaciones2();
        }
      }
    );
  }

  habilitarAplicacion(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.aplicacionService.habilitarAplicacion(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Aplicacion Habilitada')
          );
          this.loadAplicaciones2();
        }
      }
    );
  }
}
