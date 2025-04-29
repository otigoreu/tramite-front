import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { Aplicacion } from 'src/app/model/aplicacion';

import { Menu, MenuInfo } from 'src/app/model/menu';
import { AplicacionService } from 'src/app/service/aplicacion.service';
import { MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-dialog-menu',
  standalone: true,
  imports: [],
  templateUrl: './dialog-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogMenuComponent implements OnInit {

  changeDetectorRef = inject(ChangeDetectorRef);

  menuService = inject(MenuService);
  applicacionService = inject(AplicacionService);

  aplicaciones: Aplicacion[] = [];

  menus: MenuInfo[] = [];

  id: number;
  displayName: string;
  iconName: string;
  route: string;
  idAplicacion: number;
  aplicacion:string;
  parentMenuId: number;

  ngOnInit(): void {
    this.getAplicaciones();
    this.getMenus();
  }

  getAplicaciones() {
    this.applicacionService.getDataIgnoreQuery().subscribe((res) => {
      this.aplicaciones = res;
      this.changeDetectorRef.markForCheck();
    });
  }
  getMenus() {
    this.menuService.getDataIgnoreQuery().subscribe((res) => {
      this.menus = res;
      this.changeDetectorRef.markForCheck();
    });
  }

  // save() {
  //   const displayName = (document.getElementById("displayName") as HTMLInputElement).value;
  //   const iconName= (document.getElementById("iconName") as HTMLInputElement).value;
  //   const route= (document.getElementById("ruta") as HTMLInputElement).value;
  //   const idAplicacion= Number.parseInt((document.getElementById("idAplicacion") as HTMLSelectElement).value);
  //   const parentMenuId = (document.getElementById("parentMenu") as HTMLSelectElement).value === null ? null : Number.parseInt((document.getElementById("parentMenu") as HTMLSelectElement).value) ;
  //   const newMenu: Menu = {
  //     displayName,
  //     iconName,
  //     route,
  //     idAplicacion,
  //     parentMenuId,
  //   };
  //   this.menuService.save(newMenu).subscribe((res) => {
  //     console.log('res', res);
  //     alert("Menu guardado!");
  //   });
  // }
}
