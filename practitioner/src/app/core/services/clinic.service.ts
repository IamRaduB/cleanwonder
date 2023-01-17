import { Injectable } from '@angular/core';
import { Clinic, TypeaheadClinic } from '@core/models/clinic';
import { ClinicProvider } from '@core/providers/clinic.provider';
import { from, map, mergeMap, Observable, tap, toArray } from 'rxjs';
import { AuthService } from '@core/services/auth.service';
import { ImageKitService } from '@core/services/image-kit.service';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  constructor(private clinicProvider: ClinicProvider, private authService: AuthService, private imageKitService: ImageKitService) { }

  uploadClinicAvatar(file: File) {
    return this.clinicProvider
      .getClinicAvatarUploadUrl(file.type)
      .pipe(
        mergeMap(({ url }) => this.clinicProvider.uploadClinicAvatar(url, file)),
        map((gcloudUrl: string) => {
          return this.imageKitService.generateUrlFromGoogleStoragePath(gcloudUrl);
        }),
      );
  }

  updateClinic(clinicId: number, clinicData: Clinic) {
    return this.clinicProvider.updateClinic(clinicId, clinicData)
      .pipe(
        tap((clinic: Clinic) => {
          this.authService.patchProfile({ clinic });
        })
      );
  }

  findClinics(query?: string) {
    return this.clinicProvider.findClinics(query);
  }

  typeaheadClinicSearch(query?: string): Observable<TypeaheadClinic[]> {
    return this.clinicProvider.findClinics(query)
      .pipe(
        mergeMap((clinics) => from(clinics)),
        map((clinic: Clinic) => {
          return {
            key: clinic.vatId,
            label: clinic.name,
            ...clinic
          }
        }),
        toArray(),
      )
  }
}
