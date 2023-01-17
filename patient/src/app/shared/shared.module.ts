import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { UploadComponent } from '@shared/upload/upload.component'
import { TypeaheadComponent } from '@shared/typeahead/typeahead.component'
import { ToastComponent } from '@shared/toast/toast.component'
import { TextareaComponent } from '@shared/textarea/textarea.component'
import { LoaderComponent } from '@shared/loader/loader.component'
import { InputComponent } from '@shared/input/input.component'
import { CheckboxComponent } from '@shared/checkbox/checkbox.component'
import { CardComponent } from '@shared/card/card.component'
import { ButtonComponent } from '@shared/button/button.component'
import { NavbarComponent } from '@shared/navbar/navbar.component'
import { NavbarLinkComponent } from '@shared/navbar-link/navbar-link.component';
import { TimelineLoaderComponent } from './timeline/timeline-loader/timeline-loader.component';
import { BubbleComponent } from './timeline/bubble/bubble.component'



@NgModule({
  declarations: [
    ButtonComponent,
    CardComponent,
    CheckboxComponent,
    InputComponent,
    LoaderComponent,
    NavbarComponent,
    NavbarLinkComponent,
    TextareaComponent,
    ToastComponent,
    TypeaheadComponent,
    UploadComponent,
    TimelineLoaderComponent,
    BubbleComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    CardComponent,
    CheckboxComponent,
    InputComponent,
    LoaderComponent,
    NavbarComponent,
    NavbarLinkComponent,
    TextareaComponent,
    ToastComponent,
    TypeaheadComponent,
    UploadComponent,
    TimelineLoaderComponent,
    BubbleComponent,
  ],
})
export class SharedModule { }
