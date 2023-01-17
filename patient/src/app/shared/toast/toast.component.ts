import { Component, Input, OnInit } from '@angular/core';
import { Toast, ToastTypes } from '@core/models/toast';
import { ToastService } from '@core/services/toast.service';

const DEFAULT_DISMISS_DELAY = 5 * 1000

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.scss']
})
export class ToastComponent implements OnInit {
  @Input()
  toast!: Toast;

  types = ToastTypes;

  constructor(private toastService: ToastService) { }

  ngOnInit(): void {
    if (!this.toast.dismissible) {
      setTimeout(() => {
        this.toastService.removeToast(this.toast);
      }, this.toast.delay || DEFAULT_DISMISS_DELAY)
    }
  }

  removeToast() {
    this.toastService.removeToast(this.toast);
  }

}
