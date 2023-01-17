import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { catchError, EMPTY, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loader = false;
  resendConfirmation = false;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  incorrect = false;
  notFound = false;

  constructor(private authService: AuthService, private router: Router) {
  }

  submitLogin() {
    this.loader = true;
    this.resendConfirmation = false;
    this.loginForm.clearValidators();
    const { email, password } = this.loginForm.value
    this.authService.login(email, password)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.incorrect = true;
          } else if (err.status === 404) {
            this.notFound = true;
          } else if (err.status === 403) {
            this.resendConfirmation = true
          }
          return EMPTY;
        }),
        finalize(() => {
          this.loader = false
        })
      )
      .subscribe(async () => {
        this.loginForm.clearValidators()
        await this.router.navigateByUrl('/dashboard')
      })
  }

  get email() {
    return this.loginForm.get('email')
  }

  get password() {
    return this.loginForm.get('password')
  }
}
