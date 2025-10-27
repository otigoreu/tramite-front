// Importación de módulos comunes de Angular y Material
import { CommonModule, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';

// Importación de librerías externas
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { NotificationsService } from 'angular2-notifications';

// Importación de servicios
import { UnidadorganicaService } from 'src/app/service/unidadorganica.service';
import { EntidadService } from 'src/app/service/entidad.service';
import { ConfirmationService } from 'src/app/service/confirmation.service';

// Importación de modelos
import { Unidadorganica } from './Models/Unidadorganica';
import { UnidadorganicaPaginatedResponseDto } from './Models/UnidadorganicaPaginatedResponseDto';
import { Entidad } from '../entidad/Models/Entidad';

// Importación de componentes y utilidades
import { AppUnidadorganicaEditComponent } from './unidadorganica-edit/unidadorganica-edit.component';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { MaterialModule } from 'src/app/material.module';

// Formularios y RxJS
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  switchMap,
} from 'rxjs';
import { UnidadorganicaUsuarioComponent } from './unidadorganica-usuario/unidadorganica-usuario.component';
import { UnidadOrganicaResponseDto } from 'src/app/model/unidadOrganica';

@Component({
  selector: 'app-unidadorganica',
  standalone: true,
  styleUrl: 'unidadorganica.component.scss',
  templateUrl: './unidadorganica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    MatPaginatorModule,
    NgIf,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UnidadorganicaComponent implements OnInit {
  // Inyección de dependencias usando inject() y constructor
  unidadorganicaService = inject(UnidadorganicaService);
  entidadService = inject(EntidadService);
  dialog = inject(MatDialog);

  // DataSource de la tabla y total de registros
  dataSource: UnidadOrganicaResponseDto[] = [];
  search: string = '';

  pageIndex: number = 0; // MatPaginator usa base 0
  pageSize: number = 10;
  totalRecords: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = [
    'descripcion',
    'nombreEntidad',
    'nombreDependencia',
    'usuario',
    'estado',
    'actions',
  ];

  constructor(
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {}

  idEntidad: number;

  // Variables para paginación y ordenamiento

  // Autocomplete de Entidades (Formulario reactivo)
  firstControl = new FormControl('');
  firstoption: string[] = ['One', 'Two', 'Three']; // Ejemplo, probablemente puedas eliminar si no lo usas
  filteredOptions: Observable<Entidad[]>;

  ngAfterViewInit() {
    // 📌 Paginación
    this.paginator.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.load_UnidadOrganicas();
    });

    // 📌 Ordenamiento
    this.sort.sortChange.subscribe(() => {
      // cuando cambie el orden reiniciamos a la primera página
      this.pageIndex = 0;
      this.load_UnidadOrganicas();
    });
  }

  ngOnInit(): void {
    this.idEntidad = parseInt(localStorage.getItem('idEntidad')!);

    this.load_UnidadOrganicas();

    const userId = localStorage.getItem('userId')!;
    const rolId = localStorage.getItem('rolId')!;
  }

  /** Cargar datos de Unidad Orgánica paginados y filtrados */
  load_UnidadOrganicas(): void {
    this.unidadorganicaService
      .getPaginado(this.search, this.pageSize, this.pageIndex, this.idEntidad)
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
          console.error('Error al obtener unidadorganicaes', err);
        },
      });
  }

  /** Búsqueda por término */
  applyFilter(value: string) {
    this.search = value.trim().toLowerCase();
    this.pageIndex = 0;

    // 🔹 Reiniciar visualmente el paginator
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }

    this.load_UnidadOrganicas();
  }

  /** Abrir diálogo de edición o creación de Unidad Orgánica */
  openDialog(unidadorganicaDialog?: Unidadorganica) {
    this.dialog
      .open(AppUnidadorganicaEditComponent, {
        data: unidadorganicaDialog ?? null,
        width: '600px',
        disableClose: true,
      })
      .afterClosed()
      .subscribe((result) => {
        this.load_UnidadOrganicas();
      });
  }

  /** (Método comentado) Abrir diálogo de aplicación a Unidad Orgánica */
  openDialogUsuario(unidadorganicaDialog?: Unidadorganica) {
    // Puedes implementar este método si es necesario
    this.dialog
      .open(UnidadorganicaUsuarioComponent, {
        data: unidadorganicaDialog,
      })
      .afterClosed()
      .subscribe(() => {
        this.load_UnidadOrganicas();
      });
  }

  /** Eliminar una Unidad Orgánica con confirmación */
  eliminarUnidadorganica(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.unidadorganicaService.eliminarUnidadorganica(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(...NotificationMessages.success());
          this.load_UnidadOrganicas();
        }
      }
    );
  }

  /** Deshabilitar una Unidad Orgánica */
  deshabilitarUnidadorganica(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.unidadorganicaService.deshabilitarUnidadorganica(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Unidad Orgánica Deshabilitada')
          );
          this.load_UnidadOrganicas();
        }
      }
    );
  }

  /** Habilitar una Unidad Orgánica */
  habilitarUnidadorganica(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.unidadorganicaService.habilitarUnidadorganica(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Unidad Orgánica Habilitada')
          );
          this.load_UnidadOrganicas();
        }
      }
    );
  }
}
