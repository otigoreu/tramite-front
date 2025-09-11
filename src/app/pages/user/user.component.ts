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
import { ConfirmationService } from 'src/app/service/confirmation.service';
import { NotificationsService } from 'angular2-notifications';
import { UsuarioPaginatedResponseDto } from './Models/UsuarioPaginatedResponseDto';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  styleUrl: 'user.component.scss',
  imports: [MaterialModule, NgIf, TablerIconsModule, RouterOutlet],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  userService = inject(UserService);
  confirmationService = inject(ConfirmationService);
  notificationsService = inject(NotificationsService);

  displayedColumns: string[] = [
    'item',
    'Entidad_Descripcion',
    'Aplicacion_Descripcion',
    'Usuario',
    'DescripcionPersona',
    'Rol',
    'Unidadorganica',
    'Estado',
    'actions',
  ];

  // DataSource de la tabla y total de registros
  dataSource: MatTableDataSource<UsuarioPaginatedResponseDto> =
    new MatTableDataSource<UsuarioPaginatedResponseDto>();
  totalRecords: number = 0;

  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort) sort!: MatSort;

  totalElements: number;
  dialog = inject(MatDialog);

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const rolId = localStorage.getItem('userIdRol')!;

    this.loadUsuarios(rolId!);
  }

  loadUsuarios(
    rolId: string = '',
    search: string = '',
    page: number = 1,
    pageSize: number = 10
  ): void {
    this.userService
      .getPaginadoUsuario(rolId, search, page, pageSize)
      .subscribe({
        next: (res) => {
          this.totalRecords = res.meta.total;
          this.dataSource.data = res.items;
        },
        error: (err) => {
          console.error('Error al obtener unidadorganicaes', err);
        },
      });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialog(userDialog?: Usuario) {
    this.dialog
      .open(DialogUserComponent, {
        width: '600px',
        height: '675px',
        data: userDialog,
      })
      .afterClosed()
      .subscribe(() => {
        const pageIndex = this.paginator.pageIndex + 1; // el paginador es 0-based
        const pageSize = this.paginator.pageSize;

        //this.loadEntidades(this.searchTerm, pageIndex, pageSize);
      });
  }

  /** (Método comentado) Abrir diálogo de aplicación a Unidad Orgánica */
  openDialog_UsuarioAsociadoUnidadorganica(
    userDialog?: UsuarioPaginatedResponseDto
  ) {
    console.log('openDialog_UsuarioAsociadoUnidadorganica');
    console.log(userDialog);

    // navegación absoluta
    this.router.navigate(['/pages/user/unidadorganica-user', userDialog?.id]);

    // o si quieres relativa:
    // this.router.navigate(['unidadorganica-user', userDialog.id], { relativeTo: this.route });
  }

  openDialogRol(usuarioDialog?: Usuario) {
    // Puedes implementar este método si es necesario
    // this.dialog
    //   .open(UnidadorganicaUsuarioComponent, {
    //     data: unidadorganicaDialog,
    //   })
    //   .afterClosed()
    //   .subscribe(() => {
    //     const pageIndex = this.paginator.pageIndex + 1; // el paginador es 0-based
    //     const pageSize = this.paginator.pageSize;
    //     this.loadUnidadorganicaes(this.searchTerm, pageIndex, pageSize);
    //   });
  }

  /** Deshabilitar una Usuario */
  deshabilitarUsuario(id: string) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.userService.deshabilitarUsuario(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Usuario Deshabilitado')
          );
          this.loadUsuarios();
        }
      }
    );
  }

  /** Habilitar una Usuario */
  habilitarUsuario(id: string) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.userService.habilitarUsuario(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Usuario Habilitado')
          );
          this.loadUsuarios();
        }
      }
    );
  }

  delete(id: number) {}
}
