import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appFocusNextOnSelect]',
})
export class FocusNextOnSelectDirective {
  constructor(private el: ElementRef<HTMLElement>) {}

  // Se dispara cuando el usuario selecciona una opción
  @HostListener('selectionChange')
  onSelectionChange() {
    setTimeout(() => this.focusNextInput(), 100); // Delay para que el cierre de mat-select no interfiera
  }

  private focusNextInput() {
    const formElements = Array.from(
      document.querySelectorAll<HTMLElement>(
        'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
      )
    );

    const currentElement = this.getFocusableElement();

    const index = formElements.indexOf(currentElement);
    if (index >= 0) {
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
  }

  private getFocusableElement(): HTMLElement {
    const native = this.el.nativeElement;
    const matSelectTrigger = native.querySelector(
      '.mat-select-trigger'
    ) as HTMLElement | null;
    return matSelectTrigger ?? native;
  }

  private isVisible(elem: HTMLElement): boolean {
    return !!(
      elem.offsetWidth ||
      elem.offsetHeight ||
      elem.getClientRects().length
    );
  }
}
