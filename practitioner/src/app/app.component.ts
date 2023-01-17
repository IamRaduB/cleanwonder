import { Component, OnInit } from '@angular/core';
import { ToastService } from '@core/services/toast.service';
import { Observable } from 'rxjs';
import { Toast } from '@core/models/toast';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  toasts$: Observable<Toast[]>

  constructor(private toastService: ToastService) {
    this.toasts$ = toastService.toasts;
  }

  ngOnInit(): void {
    window.addEventListener('dragover', e => {
      e && e.preventDefault();
    }, false);
    window.addEventListener('drop', e => {
      e && e.preventDefault();
    }, false);
  }
}
