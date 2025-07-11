import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MaterialModule } from 'src/app/material.module';
import { Entidad } from '../Models/Entidad';
import { EntidadaplicacionService } from 'src/app/service/entidadaplicacion.service';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { EntidadAplicacionResponseDto } from './Models/EntidadAplicacionResponseDto';
import { EntidadAplicacionRequestDto } from './Models/EntidadAplicacionRequestDto';
import { Observable } from 'rxjs';
import { ApiResponse } from 'src/app/model/ApiResponse';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
import { NotificationsService } from 'angular2-notifications';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-entidad-aplicacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatListModule,
    MatCardModule,

    MaterialModule,
    FormsModule,
    MatNativeDateModule,
    SharedModule,
    TablerIconsModule,
  ],
  templateUrl: './entidad-aplicacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntidadAplicacionComponent implements OnInit {
  entidadDescripcion = '';
  enaplicaService = inject(EntidadaplicacionService);
  notificationsService = inject(NotificationsService);
  dialogRef = inject(MatDialogRef);
  snackBar = inject(MatSnackBar);

  // 👇 signal
  aplicaciones = signal<EntidadAplicacionResponseDto[]>([]);

  totalRecords: number = 0;
  searchTerm: string = '';
  currentPage = 1;
  currentPageSize = 10;

  isLoading = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(@Inject(MAT_DIALOG_DATA) private data: Entidad) {}

  ngOnInit(): void {
    this.entidadDescripcion = this.data?.descripcion;
    this.loadEntidadAplicaciones(this.data?.id);
  }

  get seleccionadas(): number {
    return this.aplicaciones().filter((app) => app.estado).length;
  }

  loadEntidadAplicaciones(
    idEntidad: number,
    search: string = '',
    page: number = 1,
    pageSize: number = 10
  ): void {
    console.log('======================> loadEntidadAplicaciones');
    console.log(
      `idEntidad: ${idEntidad}, search: ${search}, page:${page}, pageSize: ${pageSize}`
    );

    this.aplicaciones.set([]);
    this.isLoading = true;

    this.enaplicaService
      .getPaginadoEntidadAplicacion(idEntidad, search, page, pageSize)
      .subscribe({
        next: (res) => {
          console.log('ento al servicio de busqueda paginado');

          console.log('this.aplicaciones - clear', this.aplicaciones());
          this.totalRecords = res.meta.total;

          console.log(res.data);

          this.aplicaciones.set(res.data); // 👈 actualizar el signal

          setTimeout(() => {
            this.isLoading = false;
            console.log('this.isLoading (despues del timeout)', this.isLoading);
          }, 300);

          console.log('this.isLoading (despues)', this.isLoading);
        },
        error: (err) => {
          console.error('Error al obtener aplicaciones', err);
          this.isLoading = false; // ✅ asegúrate de apagar loading si hay error
        },
      });
  }

  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.trim();
    // this.paginator.firstPage(); // Reinicia a la primera página
    this.loadEntidadAplicaciones(
      this.data?.id,
      this.searchTerm,
      this.currentPage,
      this.currentPageSize
    );
  }

  // onSelectedChange(
  //   row: EntidadAplicacionResponseDto,
  //   event: MatSelectionListChange
  // ): void {
  //   const selected = event.source.selectedOptions.isSelected(row);

  onSelectedChange(row: EntidadAplicacionResponseDto, selected: boolean): void {
    console.log('======================> onSelectedChange');

    console.log('selected', selected);
    console.log('this.isLoading', this.isLoading);

    if (this.isLoading) return;

    const dto: EntidadAplicacionRequestDto = {
      idEntidad: this.data?.id,
      idAplicacion: row.idAplicacion,
      estado: selected,
    };
    console.log('dto', dto);

    this.enaplicaService
      .getEntidadAplicacion(dto.idEntidad, dto.idAplicacion)
      .subscribe({
        next: (res) => {
          const esEdicion = res.success && res.data?.id != null;
          const peticion: Observable<ApiResponse<any>> = esEdicion
            ? this.enaplicaService.actualizarEntidadAplicacion(res.data.id, dto)
            : this.enaplicaService.agregarEntidadAplicacion(dto);

          peticion.subscribe({
            next: (res) => {
              if (res.success) {
                const [titulo, mensajeTexto] = esEdicion
                  ? NotificationMessages.successActualizar('ENTIDAD-APLICACION')
                  : NotificationMessages.successCrear('ENTIDAD-APLICACION');

                this.aplicaciones.update((apps) =>
                  apps.map((a) =>
                    a.idAplicacion === row.idAplicacion
                      ? { ...a, estado: selected }
                      : a
                  )
                );

                this.snackBar.open(mensajeTexto, 'Cerrar', { duration: 3000 });
              } else {
                this.snackBar.open(
                  res.errorMessage || 'Error desconocido',
                  'Cerrar',
                  {
                    duration: 3000,
                  }
                );
              }
            },
            error: (err) => {
              this.snackBar.open('Error del servidor', 'Cerrar', {
                duration: 3000,
              });
              console.error(err);
            },
          });
        },
        error: (err) => {
          this.snackBar.open('Error al consultar aplicación', 'Cerrar', {
            duration: 3000,
          });
          console.error(err);
        },
      });
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; // Angular empieza en 0, tu backend espera desde 1
    this.currentPageSize = event.pageSize;

    this.loadEntidadAplicaciones(
      this.data?.id,
      this.searchTerm,

      this.currentPage,
      this.currentPageSize
    );
  }
}
