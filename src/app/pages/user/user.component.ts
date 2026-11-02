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
import { UserrolService } from 'src/app/service/userrol.service';
import { UsuarioRol_UsuarioResponseDto } from 'src/app/model/UserRol';
import { AppRolUserComponent } from './rol-user/rol-user.component';

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
  userRolService = inject(UserrolService);
  rolService = inject(RolService);
  confirmationService = inject(ConfirmationService);
  notificationsService = inject(NotificationsService);

  rols: RolSingleResponse[] = [];

  idEntidad: number;
  idAplicacion: number;
  rolId: string | null = null;

  // DataSource de la tabla y total de registros
  dataSource: UsuarioRol_UsuarioResponseDto[] = [];
  search: string = '';

  pageIndex: number = 0; // MatPaginator usa base 0
  pageSize: number = 10;
  totalRecords: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'item',
    'Usuario',
    'DescripcionPersona',
    'Unidadorganica',
    'Rol',
    'Estado',
    'actions',
  ];

  totalElements: number;
  dialog = inject(MatDialog);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
  ) {}

  ngAfterViewInit() {
    // 📌 Paginación
    this.paginator.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.cargar_Usuarios();
    });

    // 📌 Ordenamiento
    this.sort.sortChange.subscribe(() => {
      // cuando cambie el orden reiniciamos a la primera página
      this.pageIndex = 0;
      this.cargar_Usuarios();
    });
  }

  ngOnInit(): void {
    const rolId = localStorage.getItem('userIdRol')!;

    this.idEntidad = Number(localStorage.getItem('idEntidad'));
    this.idAplicacion = Number(localStorage.getItem('idAplicacion'));

    this.cargar_Rols();

    this.cargar_Usuarios();
  }

  cargar_Rols() {
    this.rolService.getPaginado(this.idEntidad, this.idAplicacion!).subscribe({
      next: (res) => {
        this.rols = res.data.map((dto) => ({
          id: dto.id,
          descripcion: dto.descripcion,
        }));
      },
      error: (err) => console.error(err),
    });
  }

  cargar_Usuarios(): void {
    this.userRolService
      .getUsuariosPaginado(
        this.idEntidad,
        this.idAplicacion,
        this.rolId,
        this.search,
        this.pageIndex,
        this.pageSize,
      )
      .subscribe({
        next: (res) => {
          this.dataSource = res.data;
          this.totalRecords = res.meta.total;

          if (this.paginator) {
            // 🔹 Asegura que los valores del paginator se sincronicen
            this.paginator.length = this.totalRecords;
            this.paginator.pageIndex = this.pageIndex;
          }
        },
        error: (err) => {
          console.error('Error al obtener los usuarios', err);
        },
      });
  }

  applyFilter(value: string) {
    this.search = value.trim().toLowerCase();
    this.pageIndex = 0;

    // 🔹 Reiniciar visualmente el paginator
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    this.cargar_Usuarios();
  }

  onRolSelected(event: any): void {
    this.rolId = event.value;

    // 👇 aquí puedes llamar directamente a tu método de carga de usuarios
    this.cargar_Usuarios();
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
        this.cargar_Usuarios();
      });
  }

  /** (Método comentado) Abrir diálogo de aplicación a Unidad Orgánica */
  openDialog_UsuarioAsociadoUnidadorganica(
    userRolDialog?: UsuarioRol_UsuarioResponseDto,
  ) {
    // navegación absoluta
    this.router.navigate(
      ['/pages/user/unidadorganica-user', userRolDialog?.id],
      {
        queryParams: {
          userName: userRolDialog?.userName,
          descripcionPersona: userRolDialog?.nombreCompleto,
        },
      },
    );
  }

  openDialog_UsuarioAsociadoRol(user_Dialog?: UsuarioRol_UsuarioResponseDto) {
    this.dialog
      .open(AppRolUserComponent, {
        width: '600px',
        height: '675px',
        data: user_Dialog,
      })
      .afterClosed()
      .subscribe(() => {
        this.cargar_Usuarios();
      });
  }

  /** Deshabilitar una Usuario */
  deshabilitarUsuario(id: string) {
    this.confirmationService.confirmAndExecute(
      'El usuario será deshabilitado y no podrá acceder al sistema hasta que se habilite nuevamente. ¿Deseas continuar?',
      this.userRolService.deshabilitarUsuario(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Usuario Deshabilitado'),
          );
          this.cargar_Usuarios();
        }
      },
      'El usuario fue deshabilitado correctamente.',
      'Confirmar deshabilitación de usuario',
    );
  }

  /** Habilitar una Usuario */
  habilitarUsuario(id: string) {
    this.confirmationService.confirmAndExecute(
      'El usuario será habilitado y podrá acceder nuevamente al sistema. ¿Deseas continuar?',
      this.userRolService.habilitarUsuario(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Usuario Habilitado'),
          );
          this.cargar_Usuarios();
        }
      },
      'El usuario fue habilitado correctamente.',
      'Confirmar habilitación de usuario',
    );
  }

  onResetearPassword(id: string) {
    this.confirmationService.confirmAndExecute(
      '¡Se restablecerá la contraseña de este usuario a una contraseña por defecto. El usuario deberá cambiarla obligatoriamente en su próximo inicio de sesión!',
      this.userService.forcePasswordChange(id),
      (res) => {
        if (res.success) {
          this.cargar_Usuarios();
        } else {
        }
      },
      'La contraseña fue reiniciada correctamente.',
      'Confirmar reinicio de contraseña',
    );
  }
}
