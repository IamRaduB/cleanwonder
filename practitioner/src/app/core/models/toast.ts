export enum ToastTypes {
  SUCCESS = 'success',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

export interface ToastOptions {
  dismissible?: boolean
  delay?: number
}

export interface Toast extends ToastOptions{
  type: ToastTypes
  message: string
}
