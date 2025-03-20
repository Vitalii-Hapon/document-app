import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DocumentActionsService, DocumentStatus, FileUploaderComponent, IDocument } from '@features/documents';

@Component({
  selector: 'app-document-creat',
  imports: [
    FileUploaderComponent,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatToolbarModule,
    ReactiveFormsModule,
  ],
  templateUrl: './document-creat.page.html',
  styleUrl: './document-creat.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentCreatPage {
  protected readonly DocumentStatus = DocumentStatus;
  private destroyRef: DestroyRef = inject(DestroyRef);
  private documentActions: DocumentActionsService = inject(DocumentActionsService);
  private router: Router = inject(Router);

  public nameControl = new FormControl('', Validators.required);
  public fileControl: FormControl<File[] | null> = new FormControl(null, Validators.required);
  public document: WritableSignal<IDocument | undefined> = signal(undefined);

  public get isFormValid(): boolean {
    return this.fileControl.valid && this.nameControl.valid;
  }

  public uploadFile(file: File[]): void {
    this.fileControl.setValue(file);
  }

  public generateFormData(file: File, name: string, status: DocumentStatus): FormData {
    const formData = new FormData();
    formData.set('file', file);
    formData.set('name', name);
    formData.set('status', status);
    return formData;
  }

  public save(status: DocumentStatus): void {
    const doc = this.generateFormData(
      this.fileControl.value![0],
      this.nameControl.value!,
      status
    );
    this.documentActions.save(doc)
      .pipe(takeUntilDestroyed(this.destroyRef), filter(doc => !!doc))
      .subscribe(doc => this.router.navigate(['../documents/document', doc.id]))
  }

  public back(): void {
    this.router.navigate(['/documents']);
  }
}
