import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { Rol, RolSingleResponse } from 'src/app/model/rol';
import { UsuarioRol_UsuarioResponseDto } from 'src/app/model/UserRol';
import { AuthService } from 'src/app/service/auth.service';
import { MessageService } from 'src/app/service/Message.service';
import { RolService } from 'src/app/service/rol.service';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-rol-user',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    MatListModule,
    MatCardModule,
    MaterialModule,
    MatNativeDateModule,
    SharedModule,
    TablerIconsModule,
  ],
  templateUrl: './rol-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppRolUserComponent implements OnInit {
  rolService = inject(RolService);
  authservice = inject(AuthService);
  dialog = inject(MatDialog);

  dataSource = signal<RolSingleResponse[]>([]);

  idEntidad: number;
  idAplicacion: number;
  nombreCompleto: string;
  userName: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: UsuarioRol_UsuarioResponseDto,
    private fb: FormBuilder,
    private msg: MessageService
  ) {}

  ngOnInit(): void {
    this.idEntidad = Number(localStorage.getItem('idEntidad'));
    this.idAplicacion = Number(localStorage.getItem('idAplicacion'));
    this.nombreCompleto = this.data.nombreCompleto;
    this.userName = this.data.userName;

    this.rolService.getPaginado(this.idEntidad, this.idAplicacion).subscribe({
      next: (res) => {
        console.log('data (rolService - getPaginado)', res);

        this.dataSource.set(res.data);
      },
      error: (err) => {
        console.error('Error al obtener los usuarios', err);
      },
    });
  }

  get seleccionadas(): number {
    return this.dataSource().filter((app) => app.estado).length;
  }

  onSelectedChange(row: RolSingleResponse, selected: boolean): void {}
}
