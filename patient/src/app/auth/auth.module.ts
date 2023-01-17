import { NgModule } from '@angular/core';
import { ConfirmationComponent } from '@app/auth/confirmation/confirmation.component'
import { SharedModule } from '@shared/shared.module'
import { LoginComponent } from '@app/auth/login/login.component'
import { ForgotPasswordComponent } from '@app/auth/forgot-password/forgot-password.component'
import { ResetPasswordComponent } from '@app/auth/reset-password/reset-password.component'



@NgModule({
  declarations: [
    ConfirmationComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  imports: [
    SharedModule,
  ],
  exports: []
})
export class AuthModule { }
