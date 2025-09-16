import { CommonModule, UpperCasePipe } from '@angular/common';
import { Component, inject, Inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MaterialModule } from 'src/app/material.module';
import { Rol } from 'src/app/model/rol';
import { EntidadService } from 'src/app/service/entidad.service';
import { RolService } from 'src/app/service/rol.service';
import { Entidad } from '../../entidad/Models/Entidad';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { EntidadaplicacionService } from 'src/app/service/entidadaplicacion.service';
import { identity } from 'rxjs';
import { Aplicacion } from '../../aplicacion/Modals/Aplicacion';

interface Estado {
  valor: boolean;
  name: string;
}

@Component({
  selector: 'app-dialogo-rol',
  standalone: true,
  imports: [
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    CommonModule,
  ],
  templateUrl: './dialogo-rol.component.html',
})
export class DialogoRolComponent implements OnInit {
  estados: Estado[] = [
    { valor: true, name: 'Activo' },
    { valor: false, name: 'Inactivo' },
  ];

  rol: Rol;
  entidades: Entidad[] = [];
  aplicaciones: Aplicacion[] = [];

  rolService = inject(RolService);
  entidadService = inject(EntidadService);
  entidadaplicacionService = inject(EntidadaplicacionService);

  rolId: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Rol,
    private _dialogRef: MatDialogRef<DialogoRolComponent>
  ) {}

  rolForm = new FormGroup({
    idEntidad: new FormControl<number | null>(null, Validators.required),
    idAplicacion: new FormControl<number | null>(null, Validators.required),
    name: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.rol = { ...this.data };

    this.rolId = localStorage.getItem('userIdRol')!;

    this.cargarEntidades();
  }

  close() {
    this._dialogRef.close();
  }

  operate() {
    this.rol.normalizedName = this.rol.descripcion;

    if (this.rol?.id != null) {
      // Editar rol
      this.rolService
        .update(this.rol.id, this.rol)
        .subscribe(() => this.close());
    } else {
      // Nuevo rol
      this.rolService.save(this.rol).subscribe(() => this.close());
    }
  }

  cargarEntidades() {
    const userId = localStorage.getItem('idUsuario')!;

    this.entidadService.getEntidades(userId).subscribe({
      next: (res) => {
        this.entidades = res.items;

        if (
          !this.rolForm.get('idEntidad')?.value &&
          this.entidades.length > 0
        ) {
          const primeraEntidadId = this.entidades[0].id;
          this.rolForm.get('idEntidad')?.setValue(primeraEntidadId);
          this.cargarAplicaciones(primeraEntidadId);
        }
      },
      error: (err) => console.error(err),
    });
  }

  onEntidadChange(idEntidad: number) {
    if (idEntidad) {
      this.cargarAplicaciones(idEntidad);
    }
  }

  cargarAplicaciones(idEntidad: number) {
    this.entidadaplicacionService
      .getsAplicacion(idEntidad, this.rolId)
      .subscribe({
        next: (aplicaciones) => {
          // Ordenar por descripción
          this.aplicaciones = aplicaciones.sort((a, b) =>
            a.descripcion.localeCompare(b.descripcion)
          );
        },
        error: (err) => console.error(err),
      });
  }
}
