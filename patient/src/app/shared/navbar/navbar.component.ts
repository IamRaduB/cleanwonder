import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  slidingMenuHidden = true;

  constructor(private authService: AuthService, private router: Router) {
  }

  toggleSlidingMenu() {
    this.slidingMenuHidden = !this.slidingMenuHidden;
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl('auth/login');
  }
}
