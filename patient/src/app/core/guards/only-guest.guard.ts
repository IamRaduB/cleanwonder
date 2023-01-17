import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from '@core/services/auth.service';

@Injectable()
export class OnlyGuestGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.getIsLoggedIn(false)
      .pipe(
        map((loggedIn: boolean) => {
          if (!loggedIn) {
            return true
          } else {
            return this.router.parseUrl('/dashboard');
          }
        })
      )
  }
}
