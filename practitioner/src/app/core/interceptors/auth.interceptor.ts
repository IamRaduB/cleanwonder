import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '@core/services/toast.service';
import { AuthService } from '@core/services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  whitelist = ['/auth/login', '/auth/signup'];
  skipAuth = ['storage.googleapis.com'];
  token: string | null = null;

  constructor(private router: Router, private authService: AuthService, private toastService: ToastService) {
    this.authService.token
      .subscribe((token) => {
        this.token = token;
      })
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.skipAuth.some((toSkip) => req.url.includes(toSkip))) {
      console.log('skipping auth header')
      return next.handle(req);
    }

    const clone = req.clone({
      withCredentials: true,
      headers: this.token ? req.headers.set('Authorization', `Bearer ${this.token}`) : req.headers,
    });
    return next.handle(clone)
      .pipe(
        catchError((err: unknown) => {
          if (err instanceof HttpErrorResponse) {
            if (!this.isInWhitelist(req.url) && err.status === 401) {
              this.toastService.addToast(ToastService.buildErrorToast('Authentication expired. Please log in'));
              this.router.navigate(['auth/login']);
            }
          }

          throw err;
        })
      )
  }

  isInWhitelist(url: string) {
    return this.whitelist.find((path) => url.includes(path))
  }
}
