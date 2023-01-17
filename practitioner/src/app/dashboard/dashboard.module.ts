import { NgModule } from '@angular/core';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from '@shared/shared.module';
import { NewPatientComponent } from './pages/patients/new-patient/new-patient.component';
import { PatientComponent } from './pages/patients/patient/patient.component';



@NgModule({
  declarations: [
    DashboardComponent,
    NewPatientComponent,
    PatientComponent,
  ],
  imports: [
    SharedModule,
  ]
})
export class DashboardModule { }
