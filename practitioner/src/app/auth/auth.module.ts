import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SharedModule } from '@shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { CompleteRegistrationComponent } from './complete-registration/complete-registration.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    CompleteRegistrationComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  imports: [
    SharedModule,
    HttpClientModule,
  ],
  providers: [
  ]
})
export class AuthModule {
}
