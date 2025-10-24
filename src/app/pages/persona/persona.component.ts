import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Persona, PersonaResponseDto } from 'src/app/model/persona';
import { PersonaServiceService } from 'src/app/service/persona-service.service';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CommonModule, DatePipe, NgIf } from '@angular/common';
import { CustomDateAdapter } from 'src/app/material/custom-adapter';
import { Data } from '../../model/auth1';

import { DialogPersonaComponent } from './dialog-persona/dialog-persona.component';

//imports apra idioma español en fechas
import { registerLocaleData } from '@angular/common';
import localeES from '@angular/common/locales/es';
import Swal from 'sweetalert2';
import { ConfirmationService } from 'src/app/service/confirmation.service';
import { NotificationsService } from 'angular2-notifications';
import { NotificationMessages } from 'src/app/shared/notification-messages/notification-messages';
registerLocaleData(localeES);

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
    MatPaginatorModule,
    DatePipe,
    NgIf,
  ],
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
  ],

  templateUrl: './persona.component.html',
})
export class PersonaComponent implements OnInit, AfterViewInit {
  title = 'TramiteGoreu-FrontEnd';

  personaService = inject(PersonaServiceService);
  dialog = inject(MatDialog);
  confirmationService = inject(ConfirmationService);
  notificationsService = inject(NotificationsService);

  dataSource: PersonaResponseDto[] = [];
  search: string = '';

  pageIndex: number = 0; // MatPaginator usa base 0
  pageSize: number = 10;
  totalRecords: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort!: MatSort;

  displayedColumns: string[] = [
    'item',
    'nombres',
    'apellidos',
    'fechaNac',
    'estado',
    'actions',
  ];

  constructor() {}

  ngAfterViewInit() {
    // 📌 Paginación
    this.paginator.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.load_Personas();
    });

    // 📌 Ordenamiento
    this.sort.sortChange.subscribe(() => {
      // cuando cambie el orden reiniciamos a la primera página
      this.pageIndex = 0;
      this.load_Personas();
    });
  }

  ngOnInit(): void {
    this.load_Personas();
  }

  load_Personas(): void {
    this.personaService
      .getPaginado(this.search, this.pageSize, this.pageIndex)
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
          console.error('Error al obtener clientes', err);
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

    this.load_Personas();
  }

  openDialog(personaDialog?: Persona) {
    this.dialog
      .open(DialogPersonaComponent, {
        width: '600px',
        height: '675px',

        data: personaDialog,
      })
      .afterClosed()
      .subscribe(() => {
        this.load_Personas();
      });
  }

  delete(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        // lógica de confirmación
        this.personaService.deletePerson(id).subscribe((response) => {
          if (response.success) {
            //this.loadDataFilter();
          }
        });
      }
    });
  }

  finalized(id: number) {
    this.confirmationService.confirmAndExecute(
      'La Persona será deshabilitado. ¿Deseas continuar?',
      this.personaService.finalized(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Persona Deshabilitada')
          );
          this.load_Personas();
        }
      },
      'La persona fue deshabilitado correctamente.',
      'Confirmar deshabilitación de persona'
    );
  }

  initialized(id: number) {
    this.confirmationService.confirmAndExecute(
      'La persona será habilitado. ¿Deseas continuar?',
      this.personaService.initialized(id),
      (response) => {
        if (response.success) {
          this.notificationsService.success(
            ...NotificationMessages.success('Persona Habilitada')
          );
          this.load_Personas();
        }
      },
      'La persona fue habilitado correctamente.',
      'Confirmar habilitación de la persona'
    );
  }
}
