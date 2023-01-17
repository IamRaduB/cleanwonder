import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from './input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from './card/card.component';
import { LoaderComponent } from './loader/loader.component';
import { ButtonComponent } from './button/button.component';
import { TextareaComponent } from './textarea/textarea.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { RouterModule } from '@angular/router';
import { ToastComponent } from './toast/toast.component';
import { NavbarComponent } from './navbar/navbar.component';
import { IconComponent } from './icon/icon.component';
import { NavbarLinkComponent } from './navbar-link/navbar-link.component';
import { TypeaheadComponent } from './typeahead/typeahead.component';
import { UploadComponent } from './upload/upload.component';
import { DateInputComponent } from '@shared/date-input/date-input.component';

@NgModule({
  declarations: [
    InputComponent,
    CardComponent,
    LoaderComponent,
    ButtonComponent,
    TextareaComponent,
    CheckboxComponent,
    ToastComponent,
    NavbarComponent,
    IconComponent,
    NavbarLinkComponent,
    TypeaheadComponent,
    UploadComponent,
    DateInputComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
  ],
  exports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
    InputComponent,
    LoaderComponent,
    ButtonComponent,
    TextareaComponent,
    CheckboxComponent,
    ToastComponent,
    NavbarComponent,
    IconComponent,
    TypeaheadComponent,
    UploadComponent,
    DateInputComponent,
  ]
})
export class SharedModule {
}
