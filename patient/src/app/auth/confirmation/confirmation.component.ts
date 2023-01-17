import { Component, OnInit } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { sameAs } from '@shared/util/validators'
import { ValidUploads } from '@shared/upload/upload.component'
import { ActivatedRoute, Params, Router } from '@angular/router'
import { catchError, EMPTY, filter, finalize, mergeMap, partition, switchMap } from 'rxjs'
import { AuthService } from '@core/services/auth.service'
import { HttpErrorResponse } from '@angular/common/http'
import { PatientService } from '@core/services/patient.service'
import { Profile } from '@core/models/profile'
import { isResponseCode } from '@shared/util/predicates/response'

enum CompleteRegistrationSteps {
  FORM,
  ALREADY_VALIDATED,
  EXPIRED,
  EMAIL_SENT,
}

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  validUploads = ValidUploads
  loading = false
  urlUploading = false
  step: CompleteRegistrationSteps | null = CompleteRegistrationSteps.FORM
  steps = CompleteRegistrationSteps
  accountGroup: FormGroup = new FormGroup({
    email: new FormControl({ value: '', disabled: true }, { validators: [ Validators.required ] }),
    password: new FormControl('', { validators: [Validators.required] }),
  })

  confirmationForm: FormGroup = new FormGroup({
    account: this.accountGroup,

    profile: new FormGroup({
      firstName: new FormControl('', {
        validators: [
          Validators.required,
        ],
      }),
      lastName: new FormControl('', { validators: [ Validators.required ] }),
      birthDate: new FormControl('', { validators: [ Validators.required ] }),
      ssn: new FormControl('', { validators: [ Validators.required ] }),
      phoneNumber: new FormControl('', { validators: [ Validators.required ] }),
      addressLine1: new FormControl('', { validators: [ Validators.required ] }),
      addressLine2: new FormControl(''),
      avatarUrl: new FormControl(''),
    }),
  })

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService, private patientService: PatientService) {
    this.accountGroup.addControl('repeatPassword', new FormControl('', [Validators.required, sameAs(this.password)]))
  }

  ngOnInit(): void {
    const [$tokenSource, $otherSource] = partition(this.route.queryParams, (params) => !!params['token']);

    $tokenSource
      .pipe(
        filter((params) => !!params['token']),
        mergeMap((params: Params) => {
          this.loading = true
          return this.authService.validateEmail(params['token'])
        }),
        mergeMap(() => {
          return this.authService.loadUserProfile()
        }),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.step = CompleteRegistrationSteps.EXPIRED
          } else if (err.status === 404) {
            // user not found
          } else if (err.status === 403) {
            this.step = CompleteRegistrationSteps.ALREADY_VALIDATED
          }
          return EMPTY
        }),
        finalize(() => {
          this.loading = false
        }),
      ).subscribe(() => {
        this.router.navigateByUrl(this.router.url.substring(0, this.router.url.indexOf('?')))
        this.loading = false
      });

    $otherSource
      .pipe(
        mergeMap(() => {
          this.loading = true
          return this.authService.loadUserProfile()
        }),
        switchMap(() => this.authService.user),

        catchError((err: HttpErrorResponse) => {
          if (err.status === 401) {
            this.step = CompleteRegistrationSteps.EXPIRED
          } else if (err.status === 404) {
            // user not found
          } else if (err.status === 403) {
            this.step = CompleteRegistrationSteps.ALREADY_VALIDATED
          }
          return EMPTY
        }),
        finalize(() => {
          this.loading = false
        }),
      )
      .subscribe((userData) => {
        this.loading = false
        if (!userData) {
          console.log('No user data')
          return
        }

        this.mapForm(userData)
      });
  }

  mapForm(userData: Profile) {
    this.email.setValue(userData.user.email);
    this.firstName.setValue(userData.firstName);
    this.lastName.setValue(userData.lastName);
    this.ssn.setValue(userData.ssn);
    this.birthDate.setValue(userData.birthDate);
    this.addressLine1.setValue(userData.addressLine1);
    this.addressLine2.setValue(userData.addressLine2);
    this.phoneNumber.setValue(userData.phoneNumber);
  }

  resendEmail() {
    this.loading = true
    this.authService.resendEmail()
      .pipe(
        finalize(() => {
          this.loading = false
        }),
      )
      .subscribe(() => {
        this.step = CompleteRegistrationSteps.EMAIL_SENT
      })
  }

  uploadPatientAvatar(file: File) {
    this.urlUploading = true;
    this.patientService.uploadAvatar(file)
      .pipe(
        finalize(() => {
          this.urlUploading = false;
        })
      )
      .subscribe((result) => {
        this.avatarUrl?.setValue(result)
      })
  }

  onboardPatient() {
    this.loading = true;
    this.patientService.confirmPatientSignup(this.confirmationForm.getRawValue())
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((result) => {
        if (!isResponseCode(result)) {
          this.router.navigate(['dashboard'])
        }
      })
  }

  get email() {
    return this.confirmationForm.get('account.email')!
  }

  get password() {
    return this.confirmationForm.get('account.password')!
  }

  get repeatPassword() {
    return this.confirmationForm.get('account.repeatPassword')!
  }

  get firstName() {
    return this.confirmationForm.get('profile.firstName')!
  }

  get lastName() {
    return this.confirmationForm.get('profile.lastName')!
  }

  get birthDate() {
    return this.confirmationForm.get('profile.birthDate')!
  }

  get ssn() {
    return this.confirmationForm.get('profile.ssn')!
  }

  get phoneNumber() {
    return this.confirmationForm.get('profile.phoneNumber')!
  }

  get addressLine1() {
    return this.confirmationForm.get('profile.addressLine1')!
  }

  get addressLine2() {
    return this.confirmationForm.get('profile.addressLine2')!
  }

  get avatarUrl() {
    return this.confirmationForm.get('profile.avatarUrl')!
  }
}
