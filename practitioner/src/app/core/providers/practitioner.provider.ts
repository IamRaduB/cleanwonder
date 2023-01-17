import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '@core/services/toast.service';
import { catchError, map, throwError } from 'rxjs';
import { Practitioner } from '@core/models/practitioner';
import { Patient } from '@core/models/patient';

@Injectable({
  providedIn: 'root'
})
export class PractitionerProvider {
  baseUrl = `${environment.coreApiUrl}/practitioner`;
  constructor(private httpClient: HttpClient, private toastService: ToastService) { }

  updatePractitioner(practitionerId: number, practitionerData: Practitioner) {
    return this.httpClient.patch<Practitioner>(`${this.baseUrl}/${practitionerId}`, practitionerData)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  getPractitionerAvatarUploadUrl(mimeType: string) {
    return this.httpClient.get<{ url: string }>(`${this.baseUrl}/avatar-upload-url`, {
      params: new HttpParams({
        fromObject: {
          mime: mimeType,
        }
      })
    }).pipe(
      catchError(this.handleError.bind(this))
    )
  }

  uploadPractitionerAvatar(url: string, file: File) {
    return this.httpClient.put(url, file, {
      withCredentials: false,
      headers: new HttpHeaders({
        'Content-Type': file.type
      })
    })
      .pipe(
        map(() => url.substring(0, url.indexOf('?')))
      );
  }

  getPatients() {
    return this.httpClient.get<Patient[]>(`${this.baseUrl}/patients`)
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
