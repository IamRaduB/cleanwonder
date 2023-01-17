import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input()
  type = 'submit';

  @Input()
  disabled = false;

  @Input()
  rounded = 'rounded';

  @Output() btnClick = new EventEmitter<void>();

  constructor() { }
}
