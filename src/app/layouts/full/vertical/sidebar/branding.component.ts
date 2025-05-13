
import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  template: `
    <div class="branding">
      @if(options.theme === 'light') {

        <img
          src="./assets/images/logos/GRU_LOGO_HORI.svg"
          class="align-middle m-2"
          alt="logo"
          style="max-width: 80%"
        />

      } @if(options.theme === 'dark') {

        <img
          src="./assets/images/logos/GRU_LOGO_HORI.svg"
          class="align-middle m-2"
          alt="logo"
          style="max-width: 80%"
        />

      }
    </div>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}
