import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaComponent),
      multi: true
    }
  ],
})
export class TextareaComponent implements ControlValueAccessor {
  @Input()
  name = '';
  @Input()
  placeholder: string = '';
  @Input()
  required = false;
  @Input()
  hasError = false;

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
