import { Component, OnInit } from '@angular/core';
import { filter, Observable, switchMap } from 'rxjs'
import { Patient } from '@core/models/patient'
import { PatientService } from '@core/services/patient.service'
import { ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.scss']
})
export class PatientComponent implements OnInit {
  loading = false;
  $patient: Observable<Patient | null>;
  constructor(private route: ActivatedRoute, private patientService: PatientService) {
    this.$patient = route.params
      .pipe(
        filter((params) => !!params['id']),
        switchMap((params) => {
          return this.patientService.loadPatientDetails(params['id'])
        })
      )
  }

  ngOnInit(): void {
  }

}
