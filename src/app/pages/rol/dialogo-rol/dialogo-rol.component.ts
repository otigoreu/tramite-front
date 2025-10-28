import { Rol } from './../../../model/rol';
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

import { EntidadService } from 'src/app/service/entidad.service';
import { RolService } from 'src/app/service/rol.service';
import { Entidad } from '../../entidad/Models/Entidad';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { EntidadaplicacionService } from 'src/app/service/entidadaplicacion.service';
import { identity } from 'rxjs';
import { Aplicacion } from '../../aplicacion/Modals/Aplicacion';
import { AuthService } from '../../../service/auth.service';

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
  authService = inject(AuthService);

  rolId: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: Rol,
    private _dialogRef: MatDialogRef<DialogoRolComponent>
  ) {}

  rolForm = new FormGroup({

    name: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.rol = { ...this.data };

  }

  close() {
    this._dialogRef.close();
  }

  operate() {
    this.rol.normalizedName = this.rol.name;

    if (this.rol?.id != null) {
      // Editar rol
      console.log('entro a actualizar');
      this.rolService
        .update(this.rol.id, this.rol)
        .subscribe(() => this.close());
    } else {
      // Nuevo rol
      console.log('entro a guardar');
      this.entidadaplicacionService.getEntidadAplicacion(
        parseInt(this.authService.idEntidad()),
        parseInt(this.authService.idAplicacion()))
        .subscribe((response)=>{

          const body:Rol={
            name:this.rolForm.controls.name.value!,
            normalizedName:this.rolForm.controls.name.value!,
            idEntidadAplicacion:response.data?.id!
          }

          this.rolService.save(body).subscribe(() => this.close());

        })
    }
  }


}
