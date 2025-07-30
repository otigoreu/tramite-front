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

  constructor(
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {}

  // Columnas a mostrar en la tabla
  displayedColumns: string[] = [
    'descripcion',
    'nombreEntidad',
    'nombreDependencia',
    'usuario',
    'estado',
    'actions',
  ];

  // DataSource de la tabla y total de registros
  dataSource: MatTableDataSource<UnidadorganicaPaginatedResponseDto> =
    new MatTableDataSource<UnidadorganicaPaginatedResponseDto>();
  totalRecords: number = 0;

  // Variables para búsqueda y filtrado
  searchTerm: string = '';
  idEntidad: number;
  selectedEntidad: Entidad | null = null;

  // Variables para paginación y ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // Autocomplete de Entidades (Formulario reactivo)
  firstControl = new FormControl('');
  firstoption: string[] = ['One', 'Two', 'Three']; // Ejemplo, probablemente puedas eliminar si no lo usas
  filteredOptions: Observable<Entidad[]>;

  /** Método de inicialización */
  ngOnInit(): void {
    const idEntidad = parseInt(localStorage.getItem('idAEntidad')!);

    this.loadUnidadorganicaes();

    // Configuración del autocomplete con debounce y búsqueda
    this.filteredOptions = this.firstControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) =>
        this.entidadService.getPaginadoEntidad(idEntidad, value!, 1, 10).pipe(
          map((response) => response.items) // Retorna solo los items
        )
      )
    );
  }

  /** Suscripción al evento del paginador (después de renderizar) */
  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      const pageIndex = this.paginator.pageIndex + 1; // Angular Material es 0-based
      const pageSize = this.paginator.pageSize;
      this.loadUnidadorganicaes(this.searchTerm, pageIndex, pageSize);
    });
  }

  /** Cargar datos de Unidad Orgánica paginados y filtrados */
  loadUnidadorganicaes(
    search: string = '',
    page: number = 1,
    pageSize: number = 10,
    idEntidad?: number
  ): void {
    this.unidadorganicaService
      .getPaginadoUnidadorganica(search, page, pageSize, idEntidad)
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

  /** Búsqueda por término */
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.trim();
    this.paginator.firstPage(); // Reinicia a la primera página
    this.loadUnidadorganicaes(this.searchTerm);
  }

  /** Filtrar por entidad seleccionada */
  onEntidadSelected(entidadNombre: string): void {
    const idEntidad = parseInt(localStorage.getItem('idAEntidad')!);

    this.entidadService
      .getPaginadoEntidad(idEntidad, entidadNombre, 1, 10)
      .subscribe({
        next: (res) => {
          this.selectedEntidad =
            res.items.find((e) => e.descripcion === entidadNombre) ?? null;

          if (this.selectedEntidad) {
            this.loadUnidadorganicaes('', 1, 10, this.selectedEntidad.id);
          }
        },
      });
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
        if (result) {
          const pageIndex = this.paginator.pageIndex + 1;
          const pageSize = this.paginator.pageSize;
          this.loadUnidadorganicaes(this.searchTerm, pageIndex, pageSize);
        }
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
        const pageIndex = this.paginator.pageIndex + 1; // el paginador es 0-based
        const pageSize = this.paginator.pageSize;

        this.loadUnidadorganicaes(this.searchTerm, pageIndex, pageSize);
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
          this.loadUnidadorganicaes();
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
          this.loadUnidadorganicaes();
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
          this.loadUnidadorganicaes();
        }
      }
    );
  }
}
