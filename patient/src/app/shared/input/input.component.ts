import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class InputComponent implements ControlValueAccessor {
  @Input()
  type = 'text';
  @Input()
  label: string = '';
  @Input()
  hasError? = false;
  @Input()
  required = false
  @Input()
  name = ''
  @Input()
  autocomplete? = 'off'

  @Output()
  onfocusin = new EventEmitter()

  onChange = (_: any) => {};
  onTouched = () => {};

  touched = false;
  disabled = false;

  value = ''

  constructor() { }

  onInput(_: any) {
    this.onChange(this.value)
  }

  onFocus() {
    this.touched = true;
    this.onTouched();
  }

  onFocusIn() {
    this.onfocusin.emit()
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  writeValue(value: any): void {
    this.value = value
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
