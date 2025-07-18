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
import { MatTableDataSource } from '@angular/material/table';
import { TablerIconsModule } from 'angular-tabler-icons';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { MaterialModule } from 'src/app/material.module';
import { UnidadorganicaService } from 'src/app/service/unidadorganica.service';
import { Unidadorganica } from './Models/Unidadorganica';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { NotificationsService } from 'angular2-notifications';
import { ConfirmationService } from 'src/app/service/confirmation.service';
import { UnidadorganicaPaginatedResponseDto } from './Models/UnidadorganicaPaginatedResponseDto';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  Observable,
  startWith,
  switchMap,
} from 'rxjs';
import { EntidadService } from 'src/app/service/entidad.service';
import { Entidad } from '../entidad/Models/Entidad';
import { AppUnidadorganicaEditComponent } from './unidadorganica-edit/unidadorganica-edit.component';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';

@Component({
  selector: 'app-unidadorganica',
  standalone: true,
  styleUrl: 'unidadorganica.component.scss', // Estilo asociado
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
  templateUrl: './unidadorganica.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnidadorganicaComponent implements OnInit {
  unidadorganicaService = inject(UnidadorganicaService);
  entidadService = inject(EntidadService);

  displayedColumns: string[] = [
    'descripcion',
    'nombreEntidad',
    'nombreDependencia',
    'estado',
    'actions',
  ];
  dataSource: MatTableDataSource<UnidadorganicaPaginatedResponseDto> =
    new MatTableDataSource<UnidadorganicaPaginatedResponseDto>();
  totalRecords: number = 0;

  searchTerm: string = '';
  idEntidad: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialog = inject(MatDialog);

  // first option
  firstControl = new FormControl('');
  selectedEntidad: Entidad | null = null;
  firstoption: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<Entidad[]>;

  constructor(
    private notificationsService: NotificationsService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUnidadorganicaes();

    // first option
    this.filteredOptions = this.firstControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) =>
        this.entidadService.getPaginadoEntidad(value!, 1, 10).pipe(
          map((response) => response.items) // 👈 Solo retornas los items para el autocomplete
        )
      )
    );
  }

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(() => {
      const pageIndex = this.paginator.pageIndex + 1;
      const pageSize = this.paginator.pageSize;

      this.loadUnidadorganicaes(this.searchTerm, pageIndex, pageSize);
    });
  }

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

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.trim();
    this.paginator.firstPage(); // Reinicia a la primera página
    this.loadUnidadorganicaes(this.searchTerm);
  }

  onEntidadSelected(entidadNombre: string): void {
    this.entidadService.getPaginadoEntidad(entidadNombre, 1, 10).subscribe({
      next: (res) => {
        // Buscar el objeto entidad por nombre exacto
        this.selectedEntidad =
          res.items.find((e) => e.descripcion === entidadNombre) ?? null;

        // console.log('this.selectedEntidad', this.selectedEntidad);
        if (this.selectedEntidad) {
          this.loadUnidadorganicaes('', 1, 10, this.selectedEntidad.id);
        }
      },
    });
  }

  openDialog(unidadorganicaDialog?: Unidadorganica) {
    this.dialog
      .open(AppUnidadorganicaEditComponent, {
        data: unidadorganicaDialog ?? null, // 👈 Aseguras enviar null si no hay dato
        width: '600px', // Opcional: puedes definir tamaño si deseas
        disableClose: true, // Opcional: evita cerrar clickeando fuera
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          const pageIndex = this.paginator.pageIndex + 1; // El paginador es 0-based
          const pageSize = this.paginator.pageSize;
          this.loadUnidadorganicaes(this.searchTerm, pageIndex, pageSize);
        }
      });
  }

  openDialogAplicacion(unidadorganicaDialog?: Unidadorganica) {
    //   this.dialog
    //     .open(UnidadorganicaAplicacionComponent, {
    //       data: unidadorganicaDialog,
    //     })
    //     .afterClosed()
    //     .subscribe(() => {
    //       const pageIndex = this.paginator.pageIndex + 1; // el paginador es 0-based
    //       const pageSize = this.paginator.pageSize;
    //       this.loadUnidadorganicaes(this.searchTerm, pageIndex, pageSize);
    //     });
  }

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

  deshabilitarUnidadorganica(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.unidadorganicaService.deshabilitarUnidadorganica(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Unidadorganica Deshabilitada')
          );
          this.loadUnidadorganicaes();
        }
      }
    );
  }

  habilitarUnidadorganica(id: number) {
    this.confirmationService.confirmAndExecute(
      '¡No podrás revertir esto!',
      this.unidadorganicaService.habilitarUnidadorganica(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Unidadorganica Habilitada')
          );
          this.loadUnidadorganicaes();
        }
      }
    );
  }
}
