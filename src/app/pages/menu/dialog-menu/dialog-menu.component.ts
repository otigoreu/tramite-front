import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Menu } from 'src/app/model/menu';
import { MenuService } from 'src/app/service/menu.service';

@Component({
  selector: 'app-dialog-menu',
  standalone: true,
  imports: [],
  templateUrl: './dialog-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogMenuComponent {
  menuService = inject(MenuService);

  id: number;
  displayName: string;
  iconName: string;
  route: string;
  idAplicacion: number;
  parentMenuId: number;

  save() {
    const newMenu: Menu = {
      displayName: 'Menu Test',
      iconName: 'user',
      route: '/test',
      id: 0,
      idAplicacion: 0,
      parentMenuId: 0,
    };
    this.menuService.save(newMenu).subscribe((res) => {
      console.log('res', res);
    });
  }
}
