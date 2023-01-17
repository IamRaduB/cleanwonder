import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Patient } from '@core/models/patient';
import { PatientService } from '@core/services/patient.service';
import { EmailStates } from '@core/models/user';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.scss']
})
export class PatientsComponent implements OnInit {
  patients$: Observable<Patient[]>;
  constructor(private router: Router, private patientService: PatientService) {
    this.patients$ = patientService.patients;
  }

  ngOnInit(): void {
    this.patientService.loadPatients()
      .subscribe()
  }

  toOnboard() {
    this.router.navigate(['dashboard', 'patients', 'new'])
  }

  patientState(emailState: EmailStates) {
    switch (emailState) {
      case EmailStates.PENDING:
      case EmailStates.VALID:
        return 'Pending';
      case EmailStates.COMPLETED:
        return 'Validated';
    }
  }

  goToPatient(patient: Patient) {
    this.router.navigate(['dashboard', 'patients', patient.id])
  }
}
