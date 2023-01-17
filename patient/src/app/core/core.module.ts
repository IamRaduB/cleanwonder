import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyAuthenticatedGuard } from './guards/only-authenticated.guard'
import { OnlyGuestGuard } from './guards/only-guest.guard'
import { AuthInterceptor } from '@core/interceptors/auth.interceptor'
import { AuthProvider } from '@core/providers/auth.provider'
import { ClinicProvider } from '@core/providers/clinic.provider'
import { PatientProvider } from '@core/providers/patient.provider'
import { PractitionerProvider } from '@core/providers/practitioner.provider'
import { ToastService } from '@core/services/toast.service'
import { ImageKitService } from '@core/services/image-kit.service'
import { HttpClientModule } from '@angular/common/http'



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    OnlyAuthenticatedGuard,
    OnlyGuestGuard,
    AuthInterceptor,
    AuthProvider,
    ClinicProvider,
    PatientProvider,
    PractitionerProvider,
    ToastService,
    ImageKitService,
  ]
})
export class CoreModule { }
