import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { sameAs } from '@shared/util/validators';
import { filter, Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { createPasswordStrengthValidator } from '@app/lib/validators';

enum Steps {
  FORM,
  CONFIRMATION,
}

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  loading = false;
  step = Steps.FORM;
  steps = Steps;
  form: FormGroup = new FormGroup({
    password: new FormControl('', [Validators.minLength(6), createPasswordStrengthValidator()]),
  })
  sub: Subscription | null = null;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router) {
    this.form.addControl('repeatPassword', new FormControl('', [Validators.required, sameAs(this.password)]))
  }

  ngOnInit(): void {
    this.sub = this.route.queryParams
        .pipe(
          filter((params) => !!params['token']),
        )
      .subscribe((params) => {
        this.authService.storeTokenInStorage(params['token']);
        this.router.navigateByUrl(this.router.url.substring(0, this.router.url.indexOf('?')))
      })
    }

  submitForm() {
    this.loading = true;
    this.authService.resetPassword(this.password?.value)
      .subscribe(() => {
        this.loading = false;
        this.step = Steps.CONFIRMATION;
      });
  }

  logout() {
    this.authService.logout();
  }

  get password() {
    return this.form.get('password')
  }

  get repeatPassword() {
    return this.form.get('repeatPassword')
  }
}
