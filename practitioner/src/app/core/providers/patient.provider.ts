import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ToastService } from '@core/services/toast.service';
import { Patient, PatientDto } from '@core/models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientProvider {
  baseUrl = `${environment.coreApiUrl}/patient`;
  constructor(private httpClient: HttpClient, private toastService: ToastService) {
  }

  onboardPatient(patientData: PatientDto) {
    return this.httpClient.post<Patient>(`${this.baseUrl}`, patientData)
      .pipe(
        catchError(this.handleError.bind(this))
      )
  }

  loadPatient(id: number) {
    return this.httpClient.get<Patient>(`${this.baseUrl}/${id}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(response: HttpErrorResponse) {
    const beReg = /^5\d\d$/
    // in case of a BE 5XX response, show a toaster
    if (beReg.test(response.status.toString())) {
      this.toastService.addToast(ToastService.buildErrorToast(response.error.message))
    }
    return throwError(response);
  }
}
