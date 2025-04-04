import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-dialog-menu',
  standalone: true,
  imports: [],
  templateUrl: './dialog-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogMenuComponent { }
