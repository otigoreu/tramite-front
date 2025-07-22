import { AbstractControl, ValidationErrors } from '@angular/forms';

export function mayorDeEdadValidator(minEdad = 18) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const fechaNac = new Date(control.value);
    const hoy = new Date();

    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad >= minEdad ? null : { menorDeEdad: true };
  };
}
