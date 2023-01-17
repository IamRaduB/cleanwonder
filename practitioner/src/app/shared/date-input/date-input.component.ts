import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export enum DateFormats {
  DEFAULT = 'YYYY-MM-DD',
}

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateInputComponent),
      multi: true
    }
  ],
  changeDetection: ChangeDetectionStrategy.Default
})
export class DateInputComponent implements ControlValueAccessor {
  @Input()
  label: string = '';
  @Input()
  hasError? = false;
  @Input()
  required = false;
  @Input()
  format = DateFormats.DEFAULT;

  onChange = (_: any) => {};
  onTouched = () => {};

  touched = false;
  disabled = false;

  value = ''
  parsedValue = ''

  masks = new Map<DateFormats, string>()

  constructor() {
    this.masks.set(DateFormats.DEFAULT, '0000-00-00')
  }

  onInput() {
    this.onChange(this.value);
  }

  onBlur() {
    console.log('blurring', this.value)
    this.onChange(this.value);
  }

  parseValue() {
    const mask = this.masks.get(DateFormats.DEFAULT);
    const sep = this.getSeparator(mask);
    let newValue = '';
    if (this.value.charAt(this.value.length - 1).match(/[^\d\-]/g)) {
      console.log('inserted invalid char')
      setTimeout(() => {
        this.writeValue(this.value.substr(0, this.value.length - 1));
      })
      return
    }

    if (this.value.length > mask!.length) {
      console.log('greater value length than mask')
      setTimeout(() => {
        this.writeValue(this.value.substr(0, mask!.length));
        this.onInput()
      })

      return;
    }

    for (let i = 0; i < this.value.length; i++) {
      if (mask!.charAt(i) === sep && this.value.charAt(i) !== sep) {
        newValue = `${newValue}${sep}${this.value.charAt(i)}`;
      } else {
        newValue = `${newValue}${this.value.charAt(i)}`;
      }
    }
    // set new masked date
    this.writeValue(newValue);
    if (newValue.length === mask!.length) {
      this.onInput()
    }
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

  writeValue(value: string): void {
    this.value = value
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  getSeparator(value?: string) {
    if (!value) {
      return;
    }

    const match = value.match(new RegExp('\\D'))
    if (!match) {
      return;
    }
    return match[0];
  }
}
