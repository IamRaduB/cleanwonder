import { Injectable } from '@angular/core';
import { Clinic } from '@core/models/clinic';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { ToastService } from '@core/services/toast.service';
import { catchError, map, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClinicProvider {
  baseUrl = `${environment.coreApiUrl}/clinic`;

  constructor(private httpClient: HttpClient, private toastService: ToastService) {
  }

  updateClinic(clinicId: number, clinicData: Clinic) {
    return this.httpClient.patch<Clinic>(`${this.baseUrl}/${clinicId}`, clinicData)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  findClinics(query?: string) {
    return this.httpClient.get<Clinic[]>(`${this.baseUrl}`, {
      params: new HttpParams({
        fromObject: {
          vat: query ?? ''
        }
      })
    })
  }

  getClinicAvatarUploadUrl(mimeType: string) {
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

  uploadClinicAvatar(url: string, file: File) {
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

  private handleError(response: HttpErrorResponse) {
    const beReg = /^5\d\d$/
    // in case of a BE 5XX response, show a toaster
    if (beReg.test(response.status.toString())) {
      this.toastService.addToast(ToastService.buildErrorToast(response.error.message))
    }
    return throwError(response);
  }
}
