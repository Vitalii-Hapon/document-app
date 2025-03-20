import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';


@Component({
  selector: 'file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgxFileDropModule,
  ],
})
export class FileUploaderComponent {
  @ViewChild('fileUpload', { static: false })
  private fileInput!: ElementRef<HTMLInputElement>;

  @Input() public acceptedTypes: string[] | null = null;
  @Input() public multiple: boolean = false;
  @Input() public text: string = 'Drag a document here or ';
  @Output() public onFile: EventEmitter<File[]> = new EventEmitter<File[]>();

  public onBrowse(): void {
    this.fileInput.nativeElement.click();
  }

  public onUploadFile(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (!!files && files.length > 0) {
      this.fileEmit(Array.from(files!));
    }
    this.fileInput.nativeElement.value = '';
  }

  public onDropFile(data: NgxFileDropEntry[]): void {
    const files: File[] = [];

    data?.forEach((fileEntry: NgxFileDropEntry) => {
      if (fileEntry.fileEntry.isFile) {
        const fileData = fileEntry.fileEntry as FileSystemFileEntry;
        fileData.file((file: File) => {
          files.push(file);

          if (files.length === data.length) {
            this.fileEmit(files);
          }
        });
      }
    });
  }

  public fileEmit(files?: File[]): void {
    this.onFile.emit(files);
  }
}
