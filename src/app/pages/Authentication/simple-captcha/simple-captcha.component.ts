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
export class SimpleCaptchaComponent {
  number1: number = 0;
  number2: number = 0;
  operator = '+';
  resultControl: FormControl = new FormControl(null);
  errorMessage: string = '';
  @Output() verified = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.generateCaptcha();

    // Verificar automáticamente cuando cambia el valor del input
    this.resultControl.valueChanges.subscribe((value) => {
      this.checkAnswer(value);
    });
  }

  generateCaptcha() {
    this.number1 = Math.floor(Math.random() * 10);
    this.number2 = Math.floor(Math.random() * 10);
    const operators = ['+', '*'];
    this.operator = operators[Math.floor(Math.random() * operators.length)];
    this.resultControl.setValue('');
    this.errorMessage = '';
  }

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

  checkAnswer(value: any) {
    const answer = parseInt(value, 10);

    if (!isNaN(answer) && answer === this.getExpectedResult()) {
      this.errorMessage = '';
      this.verified.emit(true);
    } else {
      this.verified.emit(false);
    }
  }
}
