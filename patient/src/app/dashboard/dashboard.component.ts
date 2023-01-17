import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Observable } from 'rxjs';
import { Profile } from '@core/models/profile';
import { TimelineLoaderStates } from '@core/models/timeline-loader'
import { TimelineEvent } from '@core/models/timeline-event'
import { Treatment } from '@core/models/treatment'
import moment from 'moment'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  $profile: Observable<Profile | null>;
  States = TimelineLoaderStates;
  timelineLoaderState = TimelineLoaderStates.LOADED;
  now = moment();
  treatment: Treatment = {
    startDate: moment().subtract(3, 'days'),
    endDate: moment().add(9, 'days')
  };
  bubbles: TimelineEvent[] = [
    {
      when: moment(this.now.subtract(2, 'days')),
      type: 1,
      info: 'Consultation'
    },
    {
      when: moment(this.now.add(3, 'days')),
      type: 2,
      info: 'Surgery'
    },
    {
      when: moment(this.now.add(6, 'days')),
      type: 1,
      info: 'Post-Op Consultation'
    },
    {
      when: moment(this.now.add(8, 'days')),
      type: 1,
      info: 'Post-Op Consultation'
    },
  ]
  constructor(private authService: AuthService) {
    this.authService.loadUserProfile()
      .subscribe();
    this.$profile = authService.user;
  }

  setTimelineLoaderState(value: TimelineLoaderStates) {
    this.timelineLoaderState = value;
  }

  getPosition(bubble: TimelineEvent) {
    // normalize from [1, total treatment days] => [0%, 100%]
    const daysOfTreatment = (this.treatment.endDate.valueOf() - this.treatment.startDate.valueOf()) / 1000 * 60 * 60 * 24;
    const dayInTreatmentInterval = (this.treatment.startDate.valueOf() - bubble.when.valueOf()) / 1000 * 60 * 60 * 24;
    return ((1 - dayInTreatmentInterval)/(daysOfTreatment - 1)) * 100;
  }
}
