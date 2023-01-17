import { Injectable } from '@angular/core';
import { AuthData } from '../providers/auth.data';
import { BehaviorSubject, catchError, mergeMap, map, Observable, tap, of } from 'rxjs';
import { CompleteRegistrationDto, CompleteRegistrationFormData } from '@core/models/complete-registration.dto';
import { BackendErrorResponse, ResponseCodePayload } from '@core/models/response';
import { isResponseCode } from '@shared/util/predicates/response';
import { Profile } from '@core/models/profile';
import { HttpErrorResponse } from '@angular/common/http';
import { Clinic } from '@core/models/clinic';
import { User } from '@core/models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenData = new BehaviorSubject<string|null>(null);
  private userData = new BehaviorSubject<Profile | null>(null)

  constructor(private authProvider: AuthData) {
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

  patchProfile(profileData: Partial<Profile>) {
    if (!this.userData.value) {
      console.warn('User profile not complete. Possible incomplete data');
      return;
    }

    const clinic: Clinic = {
      ...this.userData.value.clinic,
      ...profileData.clinic
    }

    const user: User = {
      ...this.userData.value.user,
      ...profileData.user,
    }

    this.userData.next({
      ...this.userData.value,
      ...profileData,
      clinic,
      user,
    })
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

  signup(email: string, password: string): Observable<any> {
    return this.authProvider.signup({email, password});
  }

  validateEmail(token: string) {
    return this.authProvider.validateEmailAddress(token)
      .pipe(
        tap((result) => {
          this.storeTokenInStorage(result.token);
        })
      );
  }

  completeRegistration(payload: CompleteRegistrationFormData) {
    const data: CompleteRegistrationDto = {
      ...payload,
      clinic: {
        ...payload.clinic,
        vatId: typeof payload.clinic.vat === 'string' ? payload.clinic.vat : payload.clinic.vat.key,
        logoUrl: payload.clinic.logo,
      }
    };
    return this.authProvider.completeRegistration(data)
      .pipe(tap((payload: { token: string, practitioner: Profile } | ResponseCodePayload) => {
        if (!isResponseCode(payload)) {
          this.userData.next(payload.practitioner);
          this.storeTokenInStorage(payload.token);
        }
      }));
  }

  loadUserProfile() {
    return this.authProvider.loadUserProfile()
      .pipe(
        catchError(() => {
          return of(null);
        }),
        tap((payload: Profile | null) => {
          this.userData.next(payload)
        })
      );
  }

  resendEmail() {
    return this.authProvider.resendEmail()
      .pipe(
        tap(() => {
          this.removeTokenFromStorage();
        })
      )
  }

  forgotPassword(payload: { email: string }) {
    return this.authProvider.forgotPassword(payload.email);
  }

  resetPassword(password: string) {
    return this.authProvider.resetPassword(password);
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
