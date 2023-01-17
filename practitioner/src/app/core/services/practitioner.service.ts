import { Injectable } from '@angular/core';
import { PractitionerProvider } from '@core/providers/practitioner.provider';
import { Practitioner } from '@core/models/practitioner';
import { AuthService } from '@core/services/auth.service';
import { map, mergeMap, tap } from 'rxjs';
import { ImageKitService } from '@core/services/image-kit.service';

@Injectable({
  providedIn: 'root'
})
export class PractitionerService {
  constructor(private practitionerProvider: PractitionerProvider, private authService: AuthService, private imageKitService: ImageKitService) { }

  updatePractitioner(practitionerId: number, practitionerData: Practitioner) {
    return this.practitionerProvider.updatePractitioner(practitionerId, practitionerData)
      .pipe(
        tap((practitioner: Practitioner) => {
          this.authService.patchProfile(practitioner);
        })
      );
  }

  uploadPractitionerAvatar(file: File) {
    return this.practitionerProvider
      .getPractitionerAvatarUploadUrl(file.type)
      .pipe(
        mergeMap(({ url }) => this.practitionerProvider.uploadPractitionerAvatar(url, file)),
        map((gcloudUrl: string) => {
          return this.imageKitService.generateUrlFromGoogleStoragePath(gcloudUrl);
        }),
      );
  }
}
