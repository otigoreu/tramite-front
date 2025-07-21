import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnterKeyFocusDirective } from './directives/EnterKeyFocus.directive';
import { FocusNextOnDatepickerCloseDirective } from './directives/FocusNextOnDatepickerClose.directive';
import { FocusNextOnSelectDirective } from './directives/FocusNextOnSelect.directive';

@NgModule({
  declarations: [
    EnterKeyFocusDirective,
    FocusNextOnDatepickerCloseDirective,
    FocusNextOnSelectDirective,
  ],
  imports: [CommonModule],
  exports: [
    // exportamos lo que queremos reutilizar
    EnterKeyFocusDirective,
    FocusNextOnDatepickerCloseDirective,
    FocusNextOnSelectDirective,
  ],
})
export class SharedModule {}
