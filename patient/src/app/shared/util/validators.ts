import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import moment from 'moment';

export function sameAs(field: AbstractControl | null): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!field) {
      return null;
    }
    const isSame = control.value === field.value
    return !isSame ? {sameAs: {value: control.value}} : null;
  };
}

export function validDate(control: AbstractControl): ValidationErrors | null {
  if (!control.value.length) {
    return null;
  }

  if (control.value.length < 10) {
    return { validDate: { value: control.value } };
  }

  const tentativeDate = moment(control.value)
  if (tentativeDate.isValid()) {
    return null;
  }

  return { validDate: { value: control.value } };
}

export function createPasswordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {

    const value = control.value;

    if (!value) {
      return null;
    }

    const hasUpperCase = /[A-Z]+/.test(value);

    const hasLowerCase = /[a-z]+/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase;

    return !passwordValid ? {passwordStrength: true} : null;
  }
}
