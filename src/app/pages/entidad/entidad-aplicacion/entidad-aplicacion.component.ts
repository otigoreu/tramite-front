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
import { MatListModule } from '@angular/material/list';
import { MaterialModule } from 'src/app/material.module';
import { Entidad } from '../Models/Entidad';
import { EntidadaplicacionService } from 'src/app/service/entidadaplicacion.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EntidadAplicacionResponseDto } from './Models/EntidadAplicacionResponseDto';

import { NotificationsService } from 'angular2-notifications';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatNativeDateModule } from '@angular/material/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { Aplicacion } from '../../aplicacion/Modals/Aplicacion';
import { Data } from '../../../model/auth1';

@Component({
  selector: 'app-entidad-aplicacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MaterialModule,
    MatNativeDateModule,
    SharedModule,
    TablerIconsModule,
  ],
  templateUrl: './entidad-aplicacion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EntidadAplicacionComponent implements OnInit {
  // 👉 Inyecciones usando inject()
  enaplicaService = inject(EntidadaplicacionService);
  notificationsService = inject(NotificationsService);
  dialogRef = inject(MatDialogRef);
  snackBar = inject(MatSnackBar);
  appService=inject(AplicacionService);

  // 👉 Variables relacionadas a la entidad
  entidadDescripcion = '';

  // 👉 Signal para manejar el listado de aplicaciones
  aplicaciones = signal<Aplicacion[]>([]);

  // 👉 Variables de paginación y búsqueda
  totalRecords: number = 0;
  searchTerm: string = '';
  currentPage = 1;
  currentPageSize = 10;

  // 👉 Control de carga
  isLoading = false;//

  // 👉 Paginador y ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // 👉 Constructor con inyección de datos del diálogo
  constructor(@Inject(MAT_DIALOG_DATA) private data: Aplicacion) {}

  ngOnInit(): void {
    this.entidadDescripcion = this.data?.descripcion;
    this.loadEntidadAplicaciones2(this.data?.id);
  }

  // 👉 Propiedad calculada: cantidad de aplicaciones seleccionadas
  get seleccionadas(): number {
    return this.aplicaciones().length;
  }

  /**
   * Carga las aplicaciones relacionadas a una entidad.
   * @param idEntidad - ID de la entidad
   * @param search - Término de búsqueda opcional
   * @param page - Página actual
   * @param pageSize - Tamaño de página
   */
  loadEntidadAplicaciones2(
    idEntidad: number,
    page: number = 0,
    pageSize: number = 10
  ): void {
    this.aplicaciones.set([]);
    this.isLoading = true;

    this.appService
      .getPaginadoAplicacion2(idEntidad, page, pageSize)
      .subscribe({
        next: (res) => {
          this.totalRecords = res.meta.total;
          this.aplicaciones.set(res.items)// ✅ Actualiza el signal
          setTimeout(() => {
            this.isLoading = false;
          }, 300); // ⚙️ Simulación de tiempo de carga
        },
        error: (err) => {
          console.error('Error al obtener aplicaciones', err);
          //this.isLoading = false; // ⚠️ No olvides apagar loading en error
        },
      });
  }

  /**
   * Realiza búsqueda por término.
   * @param searchTerm - Texto ingresado por el usuario
   */
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.trim();
    this.loadEntidadAplicaciones2(
      this.data?.id,
      this.currentPage,
      this.currentPageSize
    );
  }

  /**
   * Maneja el cambio de selección de una aplicación.
   * Si existe, actualiza; si no, crea.
   * @param row - La aplicación seleccionada
   * @param selected - Estado de selección
   */


  /**
   * Maneja el cambio de página del paginador.
   * @param event - Evento del paginador
   */
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; // Angular usa índice 0, tu API índice 1
    this.currentPageSize = event.pageSize;

    this.loadEntidadAplicaciones2(
      this.data?.id,
      this.currentPage,
      this.currentPageSize
    );
  }
}
