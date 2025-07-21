import { ChangeDetectionStrategy, Component, Inject, inject, OnInit } from '@angular/core';
import { Usuario } from '../../../model/usuario';
import { Persona } from 'src/app/model/persona';
import { UserService } from 'src/app/service/user.service';
import { PersonaServiceService } from 'src/app/service/persona-service.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-user',
  standalone: true,
  imports: [],
  templateUrl: './dialog-user.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogUserComponent implements OnInit {


  usuario:Usuario;
  persona:Persona;

  usuarioService=inject(UserService);
  personaService=inject(PersonaServiceService);


constructor(@Inject(MAT_DIALOG_DATA) private data:Usuario){}



  ngOnInit(): void {
    this.usuario={...this.data}
    console.log('data',this.usuario);
  }




}
