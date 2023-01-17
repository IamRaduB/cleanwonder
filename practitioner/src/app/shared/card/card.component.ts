import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input()
  loading = false;
  @Input()
  maxWidth = ''
  @Input()
  rounded = 'rounded-xl'
  @Input()
  padding = 'px-4 py-8'

  constructor() {
  }

}
