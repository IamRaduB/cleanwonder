import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CompleteRegistrationDto } from '@core/models/complete-registration.dto';
import { CustomResponse } from '@core/constants';
import { Profile } from '@core/models/profile';
import { ToastService } from '@core/services/toast.service';
import { User } from '@core/models/user';

@Injectable()
export class AuthData {
  baseUrl = `${environment.coreApiUrl}/auth`

  constructor(private httpClient: HttpClient, private toastService: ToastService) {
  }

  login(payload: { email: string, password: string }) {
    return this.httpClient.post<{ user: User, token: string } | CustomResponse>(`${this.baseUrl}/login`, payload, {
      withCredentials: true,
    })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  signup(payload: { email: string, password: string }): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}/signup`, payload)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  completeRegistration(payload: CompleteRegistrationDto) {
    return this.httpClient.post< { token: string, practitioner: Profile } | CustomResponse>(`${environment.coreApiUrl}/practitioner`, payload)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  validateEmailAddress(token: string) {
    return this.httpClient.post<{ token: string }>(`${this.baseUrl}/validate-email`, {token})
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  resendEmail() {
    return this.httpClient.get(`${this.baseUrl}/resend-email`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  forgotPassword(email: string) {
    return this.httpClient.post(`${this.baseUrl}/forgot-password`, { email })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  resetPassword(password: string) {
    return this.httpClient.post(`${this.baseUrl}/reset-password`, { password })
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  loadUserProfile() {
    return this.httpClient.get<Profile>(`${environment.coreApiUrl}/practitioner/profile`)
      .pipe(
        catchError(this.handleError.bind(this))
      );
  }

  private handleError(response: HttpErrorResponse) {
    console.log('Error', response)
    const beReg = /^5\d\d$/
    // in case of a BE 5XX response, show a toaster
    if (beReg.test(response.status.toString())) {
      this.toastService.addToast(ToastService.buildErrorToast(response.error.message))
    }
    return throwError(response);
  }
}
