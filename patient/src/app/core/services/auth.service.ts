import { Injectable } from '@angular/core';
import { AuthProvider } from '../providers/auth.provider';
import { BehaviorSubject, catchError, mergeMap, map, Observable, tap, of } from 'rxjs';
import { BackendErrorResponse } from '@core/models/response';
import { isResponseCode } from '@shared/util/predicates/response';
import { Profile } from '@core/models/profile';
import { HttpErrorResponse } from '@angular/common/http';
import { PatientProvider } from '@core/providers/patient.provider'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenData = new BehaviorSubject<string|null>(null);
  private userData = new BehaviorSubject<Profile | null>(null)

  constructor(private authProvider: AuthProvider, private patientProvider: PatientProvider) {
    this.loadTokenFromStorage();
  }

  loadTokenFromStorage() {
    this.tokenData.next(localStorage.getItem('token'))
  }

  storeTokenInStorage(token: string) {
    localStorage.setItem('token', token)
    this.tokenData.next(token ?? null);
  }

  removeTokenFromStorage() {
    localStorage.removeItem('token');
    this.tokenData.next(null);
  }

  login(email: string, password: string): Observable<any> {
    return this.authProvider.login({email, password})
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 403 && (err.error as BackendErrorResponse).token) {
            this.storeTokenInStorage(err.error.token);
          }
          throw err;
        }),
        tap((result) => {
          if (!isResponseCode(result)) {
            this.storeTokenInStorage(result.token)
          }
        })
      );
  }

  logout() {
    this.userData.next(null);
    this.removeTokenFromStorage();
  }

  validateEmail(token: string) {
    return this.authProvider.validateEmailAddress(token)
      .pipe(
        tap((result) => {
          this.storeTokenInStorage(result.token);
        })
      );
  }

  loadUserProfile() {
    return this.patientProvider.loadPatientProfile()
      .pipe(
        catchError(() => {
          return of(null);
        }),
        tap((payload: Profile | null) => {
          this.userData.next(payload)
        })
      );
  }

  forgotPassword(payload: { email: string }) {
    return this.authProvider.forgotPassword(payload.email);
  }

  resetPassword(password: string) {
    return this.authProvider.resetPassword(password);
  }

  resendEmail() {
    return this.authProvider.resendEmail()
      .pipe(
        tap(() => {
          this.removeTokenFromStorage();
        })
      )
  }

  get user(): Observable<Profile | null> {
    return this.userData.asObservable();
  }

  get token(): Observable<string | null> {
    return this.tokenData.asObservable();
  }

  getIsLoggedIn(loadIfNotExists = true) {
    if (this.userData.value) {
      return this.user
        .pipe(
          map((user) => {
            return !!user
          })
        )
    } else if (loadIfNotExists) {
      return this.loadUserProfile()
        .pipe(
          mergeMap(() => {
            return this.user
              .pipe(
                map((user) => {
                  return !!user
                })
              )
          })
        )
    } else {
      return of(false);
    }
  }
}
