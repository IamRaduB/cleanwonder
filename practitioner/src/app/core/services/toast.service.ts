import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast, ToastOptions, ToastTypes } from '@core/models/toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  static buildSuccessToast(message: string, options?: ToastOptions): Toast {
    return {
      type: ToastTypes.SUCCESS,
      message,
      ...options,
    }
  }

  static buildInfoToast(message: string, options?: ToastOptions): Toast {
    return {
      type: ToastTypes.INFO,
      message,
      ...options,
    }
  }

  static buildWarningToast(message: string, options?: ToastOptions): Toast {
    return {
      type: ToastTypes.WARN,
      message,
      ...options,
    }
  }

  static buildErrorToast(message: string, options?: ToastOptions): Toast {
    return {
      type: ToastTypes.ERROR,
      message,
      ...options,
    }
  }

  private toastSubject: BehaviorSubject<Toast[]> = new BehaviorSubject<Toast[]>([])
  constructor() { }

  addToast(toast: Toast) {
    this.toastSubject.next([
      ...this.toastSubject.value,
      toast,
    ])
  }

  removeToast(toast: Toast) {
    this.toastSubject.next(
      this.toastSubject.value.filter((t) => t.message !== toast.message)
    )
  }

  get toasts() {
    return this.toastSubject.asObservable()
  }
}
