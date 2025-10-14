import { CommonModule, DatePipe } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard, MatCardContent, MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';

import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  UnidadOrganicaUsuario_UsuarioAsociadoUOsPaginatedResponse,
  UnidadorganicausuarioService,
} from 'src/app/service/unidadorganicausuario.service';
import { DialogUnidadorganicaUserComponent } from './dialog-unidadorganica-user/dialog-unidadorganica-user.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationService } from 'src/app/service/confirmation.service';
import { NotificationsService } from 'angular2-notifications';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import Swal from 'sweetalert2';
import { DialogDesabilitarUnidadorganicaUserComponent } from './dialogDesabilitar-unidadorganica-user/dialogDesabilitar-unidadorganica-user.component';
import { MatOptionModule } from '@angular/material/core';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-unidadorganica-user',
  standalone: true,
  styleUrl: 'unidadorganica-user.component.scss',
  imports: [
    CommonModule, // 👈 Necesario para directivas básicas y pipes
    DatePipe, // 👈 Ahora puedes usar |date en tu HTML
    MatButtonModule, // 👈 Agregar este

    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCard,
    MatCardContent,
    TablerIconsModule,

    MatCardModule,

    MaterialModule,
    MatOptionModule, // ✅ habilita <mat-option>
  ],
  templateUrl: './unidadorganica-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnidadorganicaUserComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'item',
    'descripcion_UnidadOrganica',
    'desde',
    'hasta',
    'estado',
    'actions',
  ];
  dataSource =
    new MatTableDataSource<UnidadOrganicaUsuario_UsuarioAsociadoUOsPaginatedResponse>(
      []
    );

  search: string = '';
  pageIndex: number = 0; // MatPaginator usa base 0
  pageSize: number = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  uo_usuarioService = inject(UnidadorganicausuarioService);
  confirmationService = inject(ConfirmationService);
  notificationsService = inject(NotificationsService);

  isLoading = false;

  dialog = inject(MatDialog);

  // 👇 propiedad para guardar el userId
  private userId!: string;
  userName!: string;
  descripcionPersona!: string;

  private idEntidad!: number;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.idEntidad = Number(localStorage.getItem('idEntidad'));

    // this.userId = this.route.snapshot.paramMap.get('userId')!;

    // Leer parámetro de la URL
    this.route.queryParamMap.subscribe((params) => {
      this.userId = this.route.snapshot.paramMap.get('userId')!;
      this.userName = params.get('userName')!;
      this.descripcionPersona = params.get('descripcionPersona')!;
    });

    this.load_UsuarioAsociadoUOs();
  }

  ngAfterViewInit() {
    // 📌 Paginación
    this.paginator.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.load_UsuarioAsociadoUOs();
    });

    // 📌 Ordenamiento
    this.sort.sortChange.subscribe(() => {
      // cuando cambie el orden reiniciamos a la primera página
      this.pageIndex = 0;
      this.load_UsuarioAsociadoUOs();
    });
  }

  load_UsuarioAsociadoUOs(): void {
    this.isLoading = true;

    this.uo_usuarioService
      .getPaginado_UsuarioAsociadoUOs(
        this.idEntidad,
        this.search,
        this.pageIndex + 1, // API espera base 1
        this.pageSize,
        this.userId
      )
      .subscribe({
        next: (res) => {
          this.dataSource.data = res.data;
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error al obtener aplicaciones', err);
          //this.isLoading = false; // ⚠️ No olvides apagar loading en error
        },
      });
  }

  applyFilter(event: Event) {
    this.search = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.pageIndex = 0; // reiniciamos a la primera página
    this.load_UsuarioAsociadoUOs();
  }

  openDialog(id: number | null) {
    const open = (data: any) => {
      this.dialog
        .open(DialogUnidadorganicaUserComponent, {
          data: {
            data, // lo que ya traes (puede ser null o un objeto con id, etc.)
            userId: this.userId, // 👈 aquí agregas otro valor
          },
        })
        .afterClosed()
        .subscribe(() => {
          // refrescar si es necesario
          this.load_UsuarioAsociadoUOs();
        });
    };

    if (id === null) {
      // Crear → pasamos null o estructura base
      open(null);
    } else {
      // Editar → primero consultamos al backend
      this.uo_usuarioService.get(id).subscribe({
        next: (res) => open(res.data),
        error: (err) => console.error('Error obteniendo usuario UO', err),
      });
    }
  }

  openDialogDeshabilitar(id: number | null) {
    this.dialog
      .open(DialogDesabilitarUnidadorganicaUserComponent, {
        data: id,
      })
      .afterClosed()
      .subscribe(() => {
        this.load_UsuarioAsociadoUOs();
      });
  }

  openDialogHabilitar(id: number | null) {}

  volverAUsuarios() {
    this.router.navigate(['/pages/user']);
  }
}
