import { Component, Input, OnInit } from '@angular/core'
import { animate, keyframes, style, transition, trigger } from '@angular/animations'
import { TimelineEvent } from '@core/models/timeline-event'

@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss'],
  animations: [
    trigger('popIn', [
      transition(':enter', [
        style({
          transform: 'scale(0)'
        }),
        animate('300ms ease-in', keyframes([
          style({ transform: 'scale(0)', offset: 0 }),
          style({ transform: 'scale(1.3)', offset: 0.7 }),
          style({ transform: 'scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms 300ms ease-in', style({ opacity: 1 })),
      ])
    ])
  ]
})
export class BubbleComponent implements OnInit {
  @Input()
  event!: TimelineEvent;
  @Input()
  position!: number;
  @Input()
  side = 0;

  constructor() { }

  ngOnInit(): void {
  }

}
