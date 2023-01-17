import {Component} from '@angular/core';
import {AuthService} from "@core/services/auth.service";
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {finalize} from "rxjs";
import { sameAs } from '@shared/util/validators';
import { createPasswordStrengthValidator } from '@app/lib/validators';

enum Steps {
  FORM,
  COMPLETE,
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  step = Steps.FORM;
  steps = Steps;
  loader = false;
  signupForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.email]),
    password: new FormControl('', [Validators.minLength(6), Validators.required, createPasswordStrengthValidator()]),
  })

  constructor(private authService: AuthService) {
    this.signupForm.addControl('repeatPassword', new FormControl('', [Validators.required, sameAs(this.password)]))
  }

  submitSignup() {
    this.loader = true;
    const {email, password} = this.signupForm.value;
    this.authService.signup(email, password)
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(() => {
        this.step = Steps.COMPLETE;
      });
  }

  get email() {
    return this.signupForm.get('email')
  }

  get password() {
    return this.signupForm.get('password')
  }

  get repeatPassword() {
    return this.signupForm.get('repeatPassword')
  }
}
