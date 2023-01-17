import { Component, OnDestroy, OnInit } from '@angular/core';
import { finalize, Observable, Subscription } from 'rxjs';
import { Profile } from '@core/models/profile';
import { AuthService } from '@core/services/auth.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClinicService } from '@core/services/clinic.service';
import { PractitionerService } from '@core/services/practitioner.service';
import { ValidUploads } from '@shared/upload/upload.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('slideOpen1', [
      transition(':enter', [
        style({opacity: 0, height: 0, padding: '0 0.75rem'}),
        animate('300ms 200ms ease-in-out', style({opacity: 1, height: '100%', padding: '0.75rem 0.75rem'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({opacity: 0, height: 0, padding: '0 0.75rem'}))
      ])
    ]),
    trigger('slideOpen2', [
      transition(':enter', [
        style({opacity: 0, height: 0, padding: '0 0.75rem'}),
        animate('300ms 200ms ease-in-out', style({opacity: 1, height: '100%', padding: '0.75rem 0.75rem'}))
      ]),
      transition(':leave', [
        animate('200ms ease-in-out', style({opacity: 0, height: 0, padding: '0 0.75rem'}))
      ])
    ])
  ],
})
export class ProfileComponent implements OnInit, OnDestroy {
  loading = false;
  profile$: Observable<Profile | null>;

  clinicEdit = false;
  profileEdit = false;

  subscriptions: Subscription[];
  profileData: Profile | null = null;

  validUploads = ValidUploads;
  urlUploading = false;

  clinicForm = new FormGroup({
    id: new FormControl(0, {nonNullable: true}),
    vatId: new FormControl('', {nonNullable: true}),
    logoUrl: new FormControl('', {nonNullable: true}),
    name: new FormControl('', {validators: [Validators.required], nonNullable: true}),
    addressLine1: new FormControl('', {validators: [Validators.required], nonNullable: true}),
    addressLine2: new FormControl('', {nonNullable: true}),
    description: new FormControl('', {nonNullable: true}),
  })

  profileForm = new FormGroup({
    id: new FormControl(0, { nonNullable: true }),
    title: new FormControl('', {validators: [Validators.required], nonNullable: true}),
    bio: new FormControl('', {nonNullable: true}),
    firstName: new FormControl('', {validators: [Validators.required], nonNullable: true}),
    lastName: new FormControl('', {validators: [Validators.required], nonNullable: true}),
    avatarUrl: new FormControl('', { nonNullable: true })
  })

  constructor(private authService: AuthService, private clinicService: ClinicService, private practitionerService: PractitionerService) {
    this.profile$ = this.authService.user;
    this.subscriptions = []
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }

  ngOnInit(): void {
    this.subscriptions.push(this.profile$.subscribe((profile) => this.profileData = profile))
  }

  toggleProfileEdit() {
    this.profileEdit = !this.profileEdit;
    if (this.profileEdit) {
      this.title!.setValue(this.profileData!.title);
      this.firstName!.setValue(this.profileData!.firstName);
      this.lastName!.setValue(this.profileData!.lastName);
      this.bio!.setValue(this.profileData!.bio ?? '');
      this.avatarUrl!.setValue(this.profileData!.avatarUrl ?? '')
    }
  }

  toggleClinicEdit() {
    this.clinicEdit = !this.clinicEdit;
    if (this.clinicEdit) {
      this.clinicName!.setValue(this.profileData!.clinic.name);
      this.addressLine1!.setValue(this.profileData!.clinic.addressLine1);
      this.addressLine2!.setValue(this.profileData!.clinic.addressLine2 ?? '');
      this.description!.setValue(this.profileData!.clinic.description ?? '');
      this.clinicLogo!.setValue(this.profileData!.clinic.logoUrl ?? '')
    }
  }

  submitClinic() {
    if (!this.profileData) {
      return;
    }

    this.clinicService.updateClinic(this.profileData.clinic.id, {
      ...this.clinicForm.getRawValue(),
      vatId: this.profileData.clinic.vatId,
    })
      .subscribe(() => {
        this.toggleClinicEdit()
      });
  }

  submitPractitioner() {
    if (!this.profileData) {
      return;
    }

    this.practitionerService.updatePractitioner(this.profileData.id, this.profileForm.getRawValue())
      .subscribe(() => {
        this.toggleProfileEdit()
      });
  }

  get profileValuesChanged() {
    if (!this.profileData) {
      return false;
    }

    return this.title!.value !== this.profileData?.title ||
      this.firstName!.value !== this.profileData.firstName ||
      this.lastName!.value !== this.profileData.lastName ||
      this.bio!.value !== this.profileData.bio ||
      this.avatarUrl!.value !== this.profileData.avatarUrl
  }

  uploadClinicAvatar(file: File) {
    this.urlUploading = true;
    this.clinicService.uploadClinicAvatar(file)
      .pipe(
        finalize(() => {
          this.urlUploading = false;
        })
      )
      .subscribe((result) => {
        this.clinicLogo?.setValue(result)
      })
  }

  uploadPractitionerAvatar(file: File) {
    this.urlUploading = true;
    this.practitionerService.uploadPractitionerAvatar(file)
      .pipe(
        finalize(() => {
          this.urlUploading = false;
        })
      )
      .subscribe((result) => {
        this.avatarUrl?.setValue(result)
      })
  }

  get clinicValuesChanged() {
    if (!this.profileData) {
      return false;
    }

    return this.clinicName!.value !== this.profileData?.clinic.name ||
      this.addressLine1!.value !== this.profileData.clinic.addressLine1 ||
      this.addressLine2!.value !== this.profileData.clinic.addressLine2 ||
      this.description!.value !== this.profileData.clinic.description ||
      this.clinicLogo!.value !== this.profileData.clinic.logoUrl;
  }

  get clinicName() {
    return this.clinicForm.get('name');
  }

  get addressLine1() {
    return this.clinicForm.get('addressLine1');
  }

  get addressLine2() {
    return this.clinicForm.get('addressLine2');
  }

  get description() {
    return this.clinicForm.get('description');
  }

  get clinicLogo() {
    return this.clinicForm.get('logoUrl')
  }

  get title() {
    return this.profileForm.get('title');
  }

  get firstName() {
    return this.profileForm.get('firstName');
  }

  get lastName() {
    return this.profileForm.get('lastName');
  }

  get bio() {
    return this.profileForm.get('bio');
  }

  get avatarUrl() {
    return this.profileForm.get('avatarUrl');
  }
}
