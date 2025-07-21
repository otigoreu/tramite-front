import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appEnterKeyFocus]',
})
export class EnterKeyFocusDirective {
  @HostListener('keydown.enter', ['$event'])
  handleEnter(event: KeyboardEvent) {
    event.preventDefault();

    const formElements = Array.from(
      document.querySelectorAll(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      )
    ) as HTMLElement[];

    const index = formElements.findIndex((el) => el === event.target);

    for (let i = index + 1; i < formElements.length; i++) {
      const el = formElements[i];
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

  private isVisible(el: HTMLElement): boolean {
    return !!(el.offsetWidth || el.offsetHeight || el.getClientRects().length);
  }
}
