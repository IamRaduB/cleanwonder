import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';
import { Profile } from '@core/models/profile';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  $profile: Observable<Profile | null>;
  constructor(private authService: AuthService) {
    this.$profile = authService.user
  }

}
