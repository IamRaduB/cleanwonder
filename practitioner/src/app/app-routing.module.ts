import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { CompleteRegistrationComponent } from './auth/complete-registration/complete-registration.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { DashboardComponent } from './dashboard/pages/dashboard/dashboard.component';
import { OnlyGuestGuard } from '@core/guards/only-guest.guard';
import { OnlyAuthenticatedGuard } from '@core/guards/only-authenticated.guard';
import { PatientsComponent } from '@app/dashboard/pages/patients/patients.component';
import { ProfileComponent } from '@app/dashboard/pages/profile/profile.component';
import { NotFoundComponent } from '@app/not-found/not-found.component';
import { ForgotPasswordComponent } from '@app/auth/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@app/auth/reset-password/reset-password.component';
import { NewPatientComponent } from '@app/dashboard/pages/patients/new-patient/new-patient.component';
import { PatientComponent } from '@app/dashboard/pages/patients/patient/patient.component'

const routes: Routes = [
  {
    path: 'auth/login',
    component: LoginComponent,
    canActivate: [OnlyGuestGuard],
  },
  {
    path: 'auth/signup',
    component: SignupComponent,
    canActivate: [OnlyGuestGuard],
  },
  {
    path: 'auth/forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [OnlyGuestGuard],
  },
  {
    path: 'auth/reset-password',
    component: ResetPasswordComponent,
    canActivate: [OnlyGuestGuard],
  },
  {
    path: 'auth/complete-registration',
    component: CompleteRegistrationComponent,
  },
  {
    path: 'terms-conditions',
    component: TermsComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [OnlyAuthenticatedGuard],
    children: [
      {
        path: 'patients',
        component: PatientsComponent,
      },
      {
        path: 'patients/new',
        component: NewPatientComponent
      },
      {
        path: 'patients/:id',
        component: PatientComponent
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
    ]
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/dashboard',
  },
  {
    path: '**',
    component: NotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
