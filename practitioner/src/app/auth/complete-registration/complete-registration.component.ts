import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { catchError, EMPTY, filter, finalize, mergeMap } from 'rxjs';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { isResponseCode } from '@shared/util/predicates/response';
import { ClinicService } from '@core/services/clinic.service';
import { TypeaheadClinic } from '@core/models/clinic';
import { ValidUploads } from '@shared/upload/upload.component';
import { PractitionerService } from '@core/services/practitioner.service';

enum CompleteRegistrationSteps {
  FORM,
  ALREADY_VALIDATED,
  EXPIRED,
  EMAIL_SENT,
}

@Component({
  selector: 'app-complete-registration',
  templateUrl: './complete-registration.component.html',
  styleUrls: ['./complete-registration.component.scss']
})
export class CompleteRegistrationComponent implements OnInit {
  loader = false;
  urlUploading = false;
  typeaheadResults: TypeaheadClinic[] | undefined;
  steps = CompleteRegistrationSteps;
  step: CompleteRegistrationSteps | null = CompleteRegistrationSteps.FORM;
  registrationForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    bio: new FormControl(''),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    avatarUrl: new FormControl(''),
    clinic: new FormGroup({
      vat: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      addressLine1: new FormControl('', [Validators.required]),
      addressLine2: new FormControl(''),
      description: new FormControl(''),
      logo: new FormControl(''),
    }),
    tc: new FormControl(false, [Validators.requiredTrue]),
    privacy: new FormControl(false, [Validators.requiredTrue])
  });
  validUploads = ValidUploads;

  constructor(private authService: AuthService, private route: ActivatedRoute, private router: Router, private clinicService: ClinicService, private practitionerService: PractitionerService) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(
        filter((params) => !!params['token']),
        mergeMap((params: Params) => {
          this.loader = true;
          return this.authService.validateEmail(params['token'])
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.step = CompleteRegistrationSteps.EXPIRED;
          } else if (err.status === 404) {
            // user not found
          } else if (err.status === 403) {
            this.step = CompleteRegistrationSteps.ALREADY_VALIDATED;
          }
          return EMPTY;
        }),
        finalize(() => {
          this.loader = false
        }),
      ).subscribe(() => {
      this.router.navigateByUrl(this.router.url.substring(0, this.router.url.indexOf('?')))
      this.loader = false
    });
  }

  searchClinic(query: string) {
    this.loader = true;
    this.clinicService.typeaheadClinicSearch(query)
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe((results) => {
        this.typeaheadResults = results
      })
  }

  prefillClinic(item: TypeaheadClinic | string) {
    if (typeof item === 'string') {
      return;
    }

    this.clinicName?.setValue(item.name);
    this.addressLine1?.setValue(item.addressLine1);
    this.addressLine2?.setValue(item.addressLine2);
    this.description?.setValue(item.description);
    this.logo?.setValue(item.logoUrl);
  }

  completeRegistration() {
    this.loader = true;
    this.authService.completeRegistration(this.registrationForm.value)
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe((result) => {
        if (!isResponseCode(result)) {
          this.router.navigate(['dashboard', 'profile'])
        }
      })
  }

  resendEmail() {
    this.loader = true;
    this.authService.resendEmail()
      .pipe(
        finalize(() => {
          this.loader = false;
        })
      )
      .subscribe(() => {
        this.step = CompleteRegistrationSteps.EMAIL_SENT;
      })
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
        this.logo?.setValue(result)
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
        this.practitionerAvatarUrl?.setValue(result)
      })
  }

  get clinicVat() {
    return this.registrationForm.get('clinic.vat')
  }

  get clinicName() {
    return this.registrationForm.get('clinic.name')
  }

  get addressLine1() {
    return this.registrationForm.get('clinic.addressLine1')
  }

  get addressLine2() {
    return this.registrationForm.get('clinic.addressLine2')
  }

  get description() {
    return this.registrationForm.get('clinic.description')
  }

  get logo() {
    return this.registrationForm.get('clinic.logo');
  }

  get logoValue() {
    return this.registrationForm.get('clinic.logo')?.value
  }

  get firstName() {
    return this.registrationForm.get('firstName')
  }

  get lastName() {
    return this.registrationForm.get('lastName')
  }

  get title() {
    return this.registrationForm.get('title')
  }

  get practitionerAvatarUrl() {
    return this.registrationForm.get('avatarUrl');
  }

  get practitionerAvatarUrlValue() {
    return this.registrationForm.get('avatarUrl')?.value;
  }
}
