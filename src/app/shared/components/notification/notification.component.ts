import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [MaterialModule, CommonModule, TablerIconsModule, DragDropModule],
  templateUrl: './notification.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: 'notification.component.scss',
})
export class NotificationComponent {
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() type: 'success' | 'error' | 'info' = 'info';

  @Output() closed = new EventEmitter<void>();

  // controla visibilidad interna opcional
  isVisible = true;

  // Método que dispara el evento al padre y oculta internamente si quieres
  close() {
    this.isVisible = false; // opcional si quieres animación
    this.closed.emit();
  }
}
