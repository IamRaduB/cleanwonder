import { Injectable } from '@angular/core';
import { PatientProvider } from '@core/providers/patient.provider';
import { Patient, PatientDto } from '@core/models/patient';
import { BehaviorSubject, catchError, EMPTY, Observable, of, tap } from 'rxjs'
import { PractitionerProvider } from '@core/providers/practitioner.provider';
import { HttpErrorResponse } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  patients$: BehaviorSubject<Patient[]> = new BehaviorSubject<Patient[]>([])
  constructor(private patientData: PatientProvider, private practitionerData: PractitionerProvider) { }

  loadPatients() {
    return this.practitionerData.getPatients()
      .pipe(
        tap((patients) => {
          this.patients$.next(patients);
        })
      );
  }

  onboardPatient(patient: PatientDto) {
    return this.patientData.onboardPatient(patient)
      .pipe(
        tap((patient) => {
          this.patients$.next([
            ...this.patients$.value,
            patient,
          ])
        })
      );
  }

  loadPatientDetails(id: number): Observable<Patient | null> {
    return this.patientData.loadPatient(id)
      .pipe(
        catchError((response: HttpErrorResponse) => {
          if (response.status === 404) {
            return of(null);
          }
          return EMPTY;
        })
      );
  }

  get patients(): Observable<Patient[]> {
    return this.patients$.asObservable();
  }
}
