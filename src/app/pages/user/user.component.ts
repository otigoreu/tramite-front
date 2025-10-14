import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../service/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { Usuario } from 'src/app/model/usuario';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { CommonModule, NgIf } from '@angular/common';
import { TablerIconsModule } from 'angular-tabler-icons';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { ConfirmationService } from 'src/app/service/confirmation.service';
import { NotificationsService } from 'angular2-notifications';
import { UsuarioPaginatedResponseDto } from './Models/UsuarioPaginatedResponseDto';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { RolService } from 'src/app/service/rol.service';
import { Rol, RolSingleResponse } from 'src/app/model/rol';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  standalone: true,
  styleUrl: 'user.component.scss',
  imports: [
    MaterialModule,
    NgIf,
    TablerIconsModule,
    RouterOutlet,
    FormsModule,
    CommonModule, // ✅ habilita *ngFor y *ngIf
    MatSelectModule, // ✅ habilita <mat-select>
    MatOptionModule, // ✅ habilita <mat-option>
  ],
  templateUrl: './user.component.html',
})
export class UserComponent implements OnInit {
  userService = inject(UserService);
  rolService = inject(RolService);
  confirmationService = inject(ConfirmationService);
  notificationsService = inject(NotificationsService);

  displayedColumns: string[] = [
    'item',
    'Usuario',
    'Rol',
    'DescripcionPersona',
    'Unidadorganica',
    'Estado',
    'actions',
  ];

  rols: RolSingleResponse[] = [];

  idEntidad: number;
  idAplicacion: number;
  rolId_select: string | null = null;

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

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const rolId = localStorage.getItem('userIdRol')!;

    this.idEntidad = Number(localStorage.getItem('idEntidad'));
    this.idAplicacion = Number(localStorage.getItem('idAplicacion'));

    this.cargarRols();

    //this.load_Usuarios();
  }

  cargarRols() {
    this.rolService.getPaginado(this.idEntidad, this.idAplicacion!).subscribe({
      next: (res) => {
        // 👇 transformamos DTO -> Rol[]

        console.log('cargar Rols', res);
        this.rols = res.data.map((dto) => ({
          id: dto.id,
          descripcion: dto.descripcion,
        }));

        console.log(this.rols);
      },
      error: (err) => console.error(err),
    });
  }

  load_Usuarios(
    search: string = '',
    page: number = 1,
    pageSize: number = 10
  ): void {
    this.userService
      .getPaginadoUsuario(
        this.idEntidad,
        this.idAplicacion,
        this.rolId_select, // 👈 transforma null → undefined
        search,
        page,
        pageSize
      )
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          // this.totalRecords = res.meta.total;
        },
        error: (err) => {
          console.error('Error al obtener unidadorganicaes', err);
        },
      });
  }

  applyFilter(filterValue: any) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onRolSelected(event: any): void {
    const selectedRolId = event.value;
    // console.log('Rol seleccionado:', selectedRolId);

    // 👇 aquí puedes llamar directamente a tu método de carga de usuarios
    this.load_Usuarios();
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

        this.load_Usuarios();
      });
  }

  /** (Método comentado) Abrir diálogo de aplicación a Unidad Orgánica */
  openDialog_UsuarioAsociadoUnidadorganica(
    userDialog?: UsuarioPaginatedResponseDto
  ) {
    console.log('openDialog_UsuarioAsociadoUnidadorganica');
    console.log(userDialog);

    // navegación absoluta
    this.router.navigate(['/pages/user/unidadorganica-user', userDialog?.id], {
      queryParams: {
        userName: userDialog?.userName,
        descripcionPersona: userDialog?.descripcionPersona,
      },
    });

    // this.router.navigate(['/pages/user/unidadorganica-user', userDialog?.id]);

    // o si quieres relativa:
    // this.router.navigate(['unidadorganica-user', userDialog.id], { relativeTo: this.route });
  }

  /** Deshabilitar una Usuario */
  deshabilitarUsuario(id: string) {
    this.confirmationService.confirmAndExecute(
      'El usuario será deshabilitado y no podrá acceder al sistema hasta que se habilite nuevamente. ¿Deseas continuar?',
      this.userService.deshabilitarUsuario(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Usuario Deshabilitado')
          );
          this.load_Usuarios();
        }
      },
      'El usuario fue deshabilitado correctamente.',
      'Confirmar deshabilitación de usuario'
    );
  }

  /** Habilitar una Usuario */
  habilitarUsuario(id: string) {
    this.confirmationService.confirmAndExecute(
      'El usuario será habilitado y podrá acceder nuevamente al sistema. ¿Deseas continuar?',
      this.userService.habilitarUsuario(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Usuario Habilitado')
          );
          this.load_Usuarios();
        }
      },
      'El usuario fue habilitado correctamente.',
      'Confirmar habilitación de usuario'
    );
  }

  onResetearPassword(id: string) {
    this.confirmationService.confirmAndExecute(
      '¡Se restablecerá la contraseña de este usuario a una contraseña por defecto. El usuario deberá cambiarla obligatoriamente en su próximo inicio de sesión!',
      this.userService.forcePasswordChange(id),
      (res) => {
        if (res.success) {
          this.load_Usuarios();
        } else {
        }
      },
      'La contraseña fue reiniciada correctamente.',
      'Confirmar reinicio de contraseña'
    );
  }
}
