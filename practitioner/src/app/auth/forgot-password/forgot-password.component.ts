import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { catchError, EMPTY, finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

export enum Steps {
  FORM = 'form',
  CONFIRMATION = 'confirmation',
}

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  loading = false;
  step = Steps.FORM;
  steps = Steps;
  form = new FormGroup({
    email: new FormControl('', { validators: [Validators.required, Validators.email], nonNullable: true})
  })
  constructor(private authService: AuthService) { }

  submitForm() {
    this.loading = true;
    this.authService.forgotPassword(this.form.getRawValue())
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 404) {
            this.form.get('email')?.setErrors({
              notFound: true
            })
          }
          return EMPTY
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(() => {
        this.loading = false;
        this.step = Steps.CONFIRMATION;
      })
  }

  get email() {
    return this.form.get('email');
  }
}
