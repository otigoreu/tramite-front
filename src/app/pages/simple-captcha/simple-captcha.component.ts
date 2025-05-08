import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-simple-captcha',
  standalone: true,
  imports: [ReactiveFormsModule,
    CommonModule],
  templateUrl: './simple-captcha.component.html',
  styleUrls: ['./simple-captcha.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpleCaptchaComponent {  number1: number = 0;
  number2: number = 0;
  operator = '+';
  resultControl: FormControl = new FormControl(null); // Inicializa con null, ya que esperamos un valor numérico.
  errorMessage: string = '';
  @Output() verified = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.generateCaptcha();
  }

  // Genera un nuevo captcha con números y un operador aleatorio
  generateCaptcha() {
    this.number1 = Math.floor(Math.random() * 10);
    this.number2 = Math.floor(Math.random() * 10);
    const operators = ['+', '-', '*'];
    this.operator = operators[Math.floor(Math.random() * operators.length)];
    this.resultControl.setValue('');
    this.errorMessage = '';
  }

  // Devuelve el resultado esperado según el operador
  getExpectedResult(): number {
    switch (this.operator) {
      case '+':
        return this.number1 + this.number2;
      case '-':
        return this.number1 - this.number2;
      case '*':
        return this.number1 * this.number2;
      default:
        return 0;
    }
  }

  // Verifica si la respuesta del captcha es correcta
  verifyCaptcha() {
    const answer = parseInt(this.resultControl.value, 10);

    if (answer === this.getExpectedResult()) {
      this.verified.emit(true); // Si es correcto, emite true
    } else {
      this.errorMessage = 'Respuesta incorrecta. Inténtalo de nuevo.';
      this.verified.emit(false); // Si es incorrecto, emite false
      this.generateCaptcha(); // Regenera el CAPTCHA
    }
  }
}
