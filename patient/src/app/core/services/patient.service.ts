import { Injectable } from '@angular/core'
import { PatientProvider } from '@core/providers/patient.provider'
import { BehaviorSubject, map, mergeMap } from 'rxjs'
import { ImageKitService } from '@core/services/image-kit.service'
import { PatientDto } from '@core/models/patient'
import { Profile } from '@core/models/profile'

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  patientProfile: BehaviorSubject<Profile | null> = new BehaviorSubject<Profile | null>(null)

  constructor(private patientProvider: PatientProvider, private imageKitService: ImageKitService) {
  }

  uploadAvatar(file: File) {
    return this.patientProvider
      .getAvatarUploadUrl(file.type)
      .pipe(
        mergeMap(({ url }) => this.patientProvider.uploadAvatar(url, file)),
        map((gcloudUrl: string) => {
          return this.imageKitService.generateUrlFromGoogleStoragePath(gcloudUrl);
        }),
      );
  }

  confirmPatientSignup(data: PatientDto) {
    return this.patientProvider.updatePatientDetails(data);
  }

  get patient() {
    return this.patientProfile.asObservable();
  }
}
