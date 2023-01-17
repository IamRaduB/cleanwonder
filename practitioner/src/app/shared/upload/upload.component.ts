import { Component, EventEmitter, Input, Output } from '@angular/core';

export enum ValidUploads {
  IMAGES,
  DOCS,
  ANY,
}

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
  @Input()
  placeholder?: string;

  @Input()
  uploading = false;

  @Input()
  url?: string;

  @Input()
  validation: ValidUploads = ValidUploads.ANY

  @Output()
  clearImage: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  fileSelected: EventEmitter<File> = new EventEmitter<File>();

  dragHover = false;

  constructor() {
  }

  clear() {
    this.clearImage.emit();
  }

  validateImage(file: File) {
    const imgReg = /^image\//
    if (this.validation === ValidUploads.ANY) {
      return true;
    }

    const ext = file.type;
    if (this.validation === ValidUploads.IMAGES) {
      return imgReg.test(ext);
    }

    return false;
  }

  upload($event: Event | DragEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    if ($event instanceof DragEvent && $event.dataTransfer) {
      let source = $event.dataTransfer.files;
      if (this.validateImage(source[0])) {
        this.fileSelected.emit(source[0]);
      }
    } else if ($event.target) {
      // @ts-ignore
      let source = $event.target.files;
      if (this.validateImage(source[0])) {
        this.fileSelected.emit(source[0]);
      }
    } else {
      console.warn('attempted to upload file from unknown event', $event);
    }
    this.dragHover = false;
  }
}
