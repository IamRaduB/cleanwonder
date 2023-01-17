import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyAuthenticatedGuard } from './guards/only-authenticated.guard';
import { OnlyGuestGuard } from './guards/only-guest.guard';
import { AuthService } from '@core/services/auth.service';
import { ClinicService } from '@core/services/clinic.service';
import { AuthData } from '@core/providers/auth.data';
import { ClinicProvider } from '@core/providers/clinic.provider';
import { PractitionerProvider } from '@core/providers/practitioner.provider';
import { PractitionerService } from '@core/services/practitioner.service';
import { ToastService } from '@core/services/toast.service';
import { ImageKitService } from '@core/services/image-kit.service';
import { PatientProvider } from '@core/providers/patient.provider';
import { PatientService } from '@core/services/patient.service';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    OnlyAuthenticatedGuard,
    OnlyGuestGuard,
    AuthService,
    AuthData,
    ClinicService,
    ClinicProvider,
    PractitionerService,
    PractitionerProvider,
    ToastService,
    ImageKitService,
    PatientProvider,
    PatientService,
  ],
})
export class CoreModule {
}
