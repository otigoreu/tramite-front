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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { UnidadorganicaUsuarioResponseDto } from './Models/UnidadorganicaUsuarioResponseDto';
import { Unidadorganica } from '../Models/Unidadorganica';
import { UnidadorganicausuarioService } from 'src/app/service/unidadorganicausuario.service';
import { UnidadorganicaUsuarioRequestDto } from './Models/UnidadorganicaUsuarioRequestDto';

@Component({
  selector: 'app-unidadorganica-usuario',
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
  templateUrl: './unidadorganica-usuario.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnidadorganicaUsuarioComponent {
  // 👉 Inyecciones usando inject()
  uousuarioService = inject(UnidadorganicausuarioService);
  notificationsService = inject(NotificationsService);
  dialogRef = inject(MatDialogRef);
  snackBar = inject(MatSnackBar);

  // 👉 Variables relacionadas a la unidadorganica
  unidadorganicaDescripcion = '';

  // 👉 Signal para manejar el listado de usuarios
  usuarios = signal<UnidadorganicaUsuarioResponseDto[]>([]);

  // 👉 Variables de paginación y búsqueda
  totalRecords: number = 0;
  searchTerm: string = '';
  currentPage = 1;
  currentPageSize = 10;

  // 👉 Control de carga
  isLoading = false;

  // 👉 Paginador y ordenamiento
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // 👉 Constructor con inyección de datos del diálogo
  constructor(@Inject(MAT_DIALOG_DATA) private data: Unidadorganica) {}

  ngOnInit(): void {
    this.unidadorganicaDescripcion = this.data?.descripcion;
    this.loadUnidadorganicaUsuarios(this.data?.id);
  }

  // 👉 Propiedad calculada: cantidad de aplicaciones seleccionadas
  get seleccionadas(): number {
    return this.usuarios().filter((app) => app.estado).length;
  }

  /**
   * Carga las aplicaciones relacionadas a una entidad.
   * @param idEntidad - ID de la entidad
   * @param search - Término de búsqueda opcional
   * @param page - Página actual
   * @param pageSize - Tamaño de página
   */
  loadUnidadorganicaUsuarios(
    idEntidad: number,
    search: string = '',
    page: number = 1,
    pageSize: number = 10
  ): void {
    this.usuarios.set([]);
    this.isLoading = true;

    this.uousuarioService
      .getPaginadoUnidadorgnicaUsuario(idEntidad, search, page, pageSize)
      .subscribe({
        next: (res) => {
          this.totalRecords = res.meta.total;
          this.usuarios.set(res.data); // ✅ Actualiza el signal
          setTimeout(() => {
            this.isLoading = false;
          }, 300); // ⚙️ Simulación de tiempo de carga
        },
        error: (err) => {
          console.error('Error al obtener aplicaciones', err);
          this.isLoading = false; // ⚠️ No olvides apagar loading en error
        },
      });
  }

  /**
   * Realiza búsqueda por término.
   * @param searchTerm - Texto ingresado por el usuario
   */
  onSearch(searchTerm: string): void {
    this.searchTerm = searchTerm.trim();
    this.loadUnidadorganicaUsuarios(
      this.data?.id,
      this.searchTerm,
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
  onSelectedChange(
    row: UnidadorganicaUsuarioResponseDto,
    selected: boolean
  ): void {
    if (this.isLoading) return; // ⚠️ Evita acciones mientras carga

    const dto: UnidadorganicaUsuarioRequestDto = {
      idUnidadorganica: this.data?.id,
      idUsuario: row.idUsuario,
      estado: selected,
    };

    // Verifica si ya existe una relación
    this.uousuarioService
      .getUnidadorganicaUsuario(dto.idUnidadorganica, dto.idUsuario)
      .subscribe({
        next: (res) => {
          const esEdicion = res.success && res.data?.id != null;

          // Decide si crear o actualizar
          const peticion: Observable<ApiResponse<any>> = esEdicion
            ? this.uousuarioService.actualizarUnidadorganicaUsuario(
                res.data.id,
                dto
              )
            : this.uousuarioService.agregarUnidadorganicaUsuario(dto);

          peticion.subscribe({
            next: (res) => {
              if (res.success) {
                const [titulo, mensajeTexto] = esEdicion
                  ? NotificationMessages.successActualizar('ENTIDAD-APLICACION')
                  : NotificationMessages.successCrear('ENTIDAD-APLICACION');

                // ✅ Actualiza el estado en el signal
                this.usuarios.update((apps) =>
                  apps.map((a) =>
                    a.idUsuario === row.idUsuario
                      ? { ...a, estado: selected }
                      : a
                  )
                );

                this.snackBar.open(mensajeTexto, 'Cerrar', { duration: 3000 });
              } else {
                this.snackBar.open(
                  res.errorMessage || 'Error desconocido',
                  'Cerrar',
                  { duration: 3000 }
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

  /**
   * Maneja el cambio de página del paginador.
   * @param event - Evento del paginador
   */
  onPageChange(event: any): void {
    this.currentPage = event.pageIndex + 1; // Angular usa índice 0, tu API índice 1
    this.currentPageSize = event.pageSize;

    this.loadUnidadorganicaUsuarios(
      this.data?.id,
      this.searchTerm,
      this.currentPage,
      this.currentPageSize
    );
  }
}
