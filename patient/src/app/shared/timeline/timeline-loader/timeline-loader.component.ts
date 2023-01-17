import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { TimelineLoaderStates } from '@core/models/timeline-loader'
import { animate, state, style, transition, trigger } from '@angular/animations'

@Component({
  selector: 'app-timeline-loader',
  templateUrl: './timeline-loader.component.html',
  styleUrls: ['./timeline-loader.component.scss'],
  animations: [
    trigger('draw', [
      transition(':enter', [
        style({
          width: '0px',
        }),
        animate('2s', style({
          width: '100%',
        }))
      ]),
    ])
  ],
})
export class TimelineLoaderComponent implements OnInit {
  @Input()
  state = TimelineLoaderStates.LOADED;

  @Output()
  stateChanged = new EventEmitter<TimelineLoaderStates>;

  States = TimelineLoaderStates;

  constructor() { }

  ngOnInit(): void {
  }

  lineDrawDone($event: any) {
    this.stateChanged.emit(TimelineLoaderStates.DONE);
  }

}
