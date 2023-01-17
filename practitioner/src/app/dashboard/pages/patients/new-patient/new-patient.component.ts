import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PatientService } from '@core/services/patient.service';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';
import { validDate } from '@shared/util/validators';

@Component({
  selector: 'app-new-patient',
  templateUrl: './new-patient.component.html',
  styleUrls: ['./new-patient.component.scss']
})
export class NewPatientComponent {
  loading = false;
  newPatientForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    birthDate: new FormControl('', { validators: [Validators.required, validDate] }),
    ssn: new FormControl('', [Validators.required]),
    addressLine1: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    phoneNumber: new FormControl('', [Validators.required]),
    details: new FormControl(''),
  })

  constructor(private patientService: PatientService, private router: Router) { }

  onboardPatient() {
    this.newPatientForm.markAllAsTouched()
    if (this.newPatientForm.invalid) {
      return
    }
    this.loading = true;
    this.patientService.onboardPatient(this.newPatientForm.getRawValue())
      .pipe(
        finalize(() => {
          this.loading = false
        })
      )
      .subscribe(() => {
        this.router.navigateByUrl('/dashboard/patients')
      })
  }

  get firstName() {
    return this.newPatientForm.get('firstName')
  }

  get lastName() {
    return this.newPatientForm.get('lastName')
  }

  get email() {
    return this.newPatientForm.get('email')
  }

  get phoneNumber() {
    return this.newPatientForm.get('phoneNumber')
  }

  get birthDate() {
    return this.newPatientForm.get('birthDate')
  }

  get ssn() {
    return this.newPatientForm.get('ssn')
  }

  get addressLine1() {
    return this.newPatientForm.get('addressLine1')
  }

  get addressLine2() {
    return this.newPatientForm.get('addressLine2')
  }

  get details() {
    return this.newPatientForm.get('details')
  }
}
