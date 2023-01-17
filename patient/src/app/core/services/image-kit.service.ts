import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageKitService {
  baseUrl = 'https://ik.imagekit.io/cleanwonder/';

  constructor() {
  }

  generateUrlFromGoogleStoragePath(gstorageUrl: string): string {
    // https://storage.googleapis.com/bucketname/folder/imagename.ext
    const url = gstorageUrl.substring(gstorageUrl.indexOf('//') + 2);
    const parts = url.split('/')

    const fileNameWithFolders = parts.filter((urlPart, index) => index > 1)
      .join('/')

    return `${this.baseUrl}${fileNameWithFolders}`
  }
}
