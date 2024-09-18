import {
  AfterViewInit,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterOutlet } from '@angular/router';
import { Personas } from 'src/app/model/persona';
import { PersonaServiceService } from 'src/app/service/persona-service.service';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { NewDialogComponent } from './new-dialog/new-dialog.component';
import { MaterialModule } from 'src/app/material.module';
import { TablerIconsModule } from 'angular-tabler-icons';
import {
  DateAdapter,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { CommonModule, DatePipe } from '@angular/common';
import { CustomDateAdapter } from 'src/app/material/custom-adapter';

@Component({
  selector: 'app-persona',
  standalone: true,
  imports: [
    MaterialModule,
    TablerIconsModule,
    MatNativeDateModule,
    NgScrollbarModule,
    CommonModule,
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
    'id',
    'nombres',
    'status',
    'email',
    'fechaNac',
    'actions',
  ];
  dataSource: MatTableDataSource<Personas>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dialog = inject(MatDialog);

  constructor() {
    const users: Personas[] = [];
    this.dataSource = new MatTableDataSource(users);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.appService.getData().subscribe((response) => {
      this.dataSource = new MatTableDataSource(response);
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
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
          alert('Usuario eliminado');
          this.loadData();
        }
      });
    }
  }
  edit(id: number) {
    this.dialog
      .open(EditDialogComponent, {
        data: {
          personId: id,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.loadData();
      });
  }

  new() {
    this.dialog
      .open(NewDialogComponent)
      .afterClosed()
      .subscribe(() => {
        this.loadData();
      });
  }
}
