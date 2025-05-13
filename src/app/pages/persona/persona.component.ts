import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Persona, Personas } from 'src/app/model/persona';
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
registerLocaleData(localeES);

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule, MatPaginatorModule,DatePipe,NgIf
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

  appService = inject(PersonaServiceService);

  displayedColumns: string[] = [
    'item',
    'nombres',
    'status',
    'email',
    'fechaNac',
    'actions',
  ];
  dataSource: MatTableDataSource<Personas>;

 // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator =
    Object.create(null);
  @ViewChild(MatSort) sort!: MatSort;

  totalElements: number;

  dialog = inject(MatDialog);

  constructor() {
    const persona: Personas[] = [];
    this.dataSource = new MatTableDataSource(persona);
  }


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.loadDataFilter();
   //this.loadData();
  // this.loadDataPAgeable(1,5);
  }

  loadData() {
    this.appService.getData().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
    });
  }
  loadDataFilter() {
    this.appService.getDatafilter().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      this.dataSource.paginator = this.paginator;
    });
  }
  loadDataPAgeable(p:number, s:number) {
    this.appService.getDataPageable(p,s).subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
      //this.dataSource.paginator = this.paginator;
      this.totalElements= Object.keys(response).length;
    });
  }

  applyFilter2(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  applyFilter(filterValue: any): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  delete(id: number) {
    if (confirm('Eliminar?')) {
      this.appService.deletePerson(id).subscribe((response) => {
        if (response.success) {
          alert('Persona eliminada');
          this.loadData();
        }
      });
    }
  }

 openDialog(personaDialog?:Persona) {
    this.dialog.open(DialogPersonaComponent, {
      width:'600px',height:'600px',

      data:personaDialog
    }).afterClosed()
    .subscribe(() => {
      this.loadDataFilter();
    });

  }
showmore(e:any){
  this.appService.getDataPageable(e.pageIndex+1 , e.pageSize).subscribe((response) => {
    this.dataSource = new MatTableDataSource(response);
    this.totalElements= Object.keys(response).length;
  });

}
finalized(id:number) {
  if (confirm('Deshabilitar?')) {
    this.appService.finalized(id).subscribe((response) => {
      if (response.success) {
        alert('Persona Deshabilitada');
        this.loadDataFilter();
      }
    });
  }
}

initialized(id:number) {
  if (confirm('Habilitar?')) {
    this.appService.initialized(id).subscribe((response) => {
      if (response.success) {
        alert('Persona Habilitada');
        this.loadDataFilter();
      }
    });
  }
}

}
