import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http'
import { catchError, map, throwError } from 'rxjs'
import { environment } from '../../../environments/environment';
import { ToastService } from '@core/services/toast.service';
import { Profile } from '@core/models/profile'
import { PatientDto } from '@core/models/patient'

@Injectable({
  providedIn: 'root'
})
export class PatientProvider {
  baseUrl = `${environment.coreApiUrl}/patient`;
  constructor(private httpClient: HttpClient, private toastService: ToastService) {
  }

  loadPatientProfile() {
    return this.httpClient.get<Profile>(`${this.baseUrl}`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  getAvatarUploadUrl(mimeType: string) {
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

  uploadAvatar(url: string, file: File) {
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

  updatePatientDetails(data: PatientDto) {
    return this.httpClient.put(`${this.baseUrl}`, data)
      .pipe(
        catchError(this.handleError.bind(this))
      )
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
