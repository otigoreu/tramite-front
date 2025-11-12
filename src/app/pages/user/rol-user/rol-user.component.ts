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
import {
  UsuarioRol_RolConAsignacionDto,
  UsuarioRol_RolConAsignacionRequestDto,
  UsuarioRol_UsuarioResponseDto,
} from 'src/app/model/UserRol';
import { AuthService } from 'src/app/service/auth.service';
import { MessageService } from 'src/app/service/Message.service';
import { RolService } from 'src/app/service/rol.service';
import { UserrolService } from 'src/app/service/userrol.service';
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
  userRolService = inject(UserrolService);
  rolService = inject(RolService);
  authservice = inject(AuthService);
  dialog = inject(MatDialog);

  dataSource = signal<UsuarioRol_RolConAsignacionDto[]>([]);

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

    this.load_Asignaciones();
  }

  load_Asignaciones(): void {
    this.userRolService
      .getRolesConAsignacion(this.idEntidad, this.idAplicacion, this.data.id)
      .subscribe({
        next: (res) => {
          this.dataSource.set(res.data);
        },
        error: (err) => {
          console.error('Error al obtener los usuarios', err);
        },
      });
  }

  get seleccionadas(): number {
    return this.dataSource().filter((app) => app.asignado).length;
  }

  onSelectedChange(
    row: UsuarioRol_RolConAsignacionDto,
    selected: boolean
  ): void {
    const request: UsuarioRol_RolConAsignacionRequestDto = {
      idEntidad: this.idEntidad,
      idAplicacion: this.idAplicacion,
      userId: this.data.id,
      rolId: row.id,
      selected: selected, // true para asignar, false para quitar
    };

    this.userRolService.asignarRol(request).subscribe({
      next: (res) => {
        if (res.success) {
          this.load_Asignaciones();
        } else {
          this.msg.warning(res.errorMessage || 'No se pudo actualizar el rol');
        }
      },
      error: (err) => {
        this.msg.error(err.error.errorMessage);
        console.error(err);
      },
    });
  }
}
