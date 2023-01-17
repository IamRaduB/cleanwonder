import { Component, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { TypeaheadResult } from '@core/models/typeahead';
import { animate, style, transition, trigger } from '@angular/animations';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-typeahead',
  templateUrl: './typeahead.component.html',
  styleUrls: ['./typeahead.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TypeaheadComponent),
      multi: true
    }
  ],
  animations: [
    trigger('slideOpen', [
      transition(':enter', [
        style({opacity: 0, height: 0, padding: '0 0.75rem'}),
        animate('300ms 200ms ease-in-out', style({opacity: 1, height: '100%', padding: '0.75rem 0.75rem'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({opacity: 0, height: 0, padding: '0 0.75rem'}))
      ])
    ]),
  ]
})
export class TypeaheadComponent implements ControlValueAccessor {
  @Input()
  loading: boolean = false;

  @Input()
  results?: TypeaheadResult[];

  @Input()
  placeholder: string = '';

  @Input()
  required = false

  @Output()
  query: EventEmitter<string> = new EventEmitter<string>();

  onChange = (_: any) => {};
  onTouched = () => {};

  touched = false;
  disabled = false;

  selectedItem: TypeaheadResult | null = null;

  searchValue: FormControl = new FormControl('');
  canExpand = false;

  constructor() {
    this.searchValue.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
      )
      .subscribe((value: string) => {
        if (this.selectedItem && this.selectedItem.key === value) {
          return;
        }

        this.onInput(value)
      })
  }

  selectResult($event: null | any, item: TypeaheadResult) {
    if ($event) {
      $event.stopPropagation();
      $event.preventDefault();
    }
    this.selectedItem = item;
    this.canExpand = false
    this.searchValue.setValue(item.key);
    this.onChange(item);
  }

  onInput(value: string) {
    this.selectedItem = null;
    if (value) {
      this.canExpand = true;
      this.query.emit(value);
      this.onChange(value);
    } else {
      this.canExpand = false;
    }
  }

  onFocus() {
    this.onInput(this.searchValue.value);
  }

  onBlur() {
    this.touched = true;
    this.onTouched();
    setTimeout(() => {
      this.canExpand = false;
    }, 150)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  writeValue(value: string | TypeaheadResult): void {
    if (this.isTypeaheadResult(value)) {
      this.searchValue.setValue(value.key)
    } else {
      this.searchValue.setValue(value)
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }

  isTypeaheadResult(value: string | TypeaheadResult): value is TypeaheadResult {
    if (!value || typeof value === 'string') {
      return false;
    }

    return Boolean((value as TypeaheadResult).key);
  }
}
