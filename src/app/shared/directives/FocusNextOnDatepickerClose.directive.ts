import { Directive, Input } from '@angular/core';

@Directive({
  selector: '[appFocusNextOnDatepickerClose]',
  exportAs: 'appFocusNextOnDatepickerClose',
})
export class FocusNextOnDatepickerCloseDirective {
  focusNextInput() {
    const formElements = Array.from(
      document.querySelectorAll(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const activeElement = document.activeElement as HTMLElement;
    const index = formElements.findIndex((el) => el === activeElement);

    console.log('activeElement', activeElement);

    for (let i = index + 1; i < formElements.length; i++) {
      const el = formElements[i];

      console.log('el', el);

      if (
        !el.hasAttribute('disabled') &&
        !el.hasAttribute('readonly') &&
        this.isVisible(el)
      ) {
        el.focus();
        break;
      }
    }
  }

  isVisible(elem: HTMLElement): boolean {
    return !!(
      elem.offsetWidth ||
      elem.offsetHeight ||
      elem.getClientRects().length
    );
  }
}
