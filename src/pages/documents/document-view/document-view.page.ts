import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  InputSignal,
  linkedSignal,
  OnInit,
  WritableSignal
} from '@angular/core';
import NutrientViewer from '@nutrient-sdk/viewer';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { catchError, map, of, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import {
  DocumentAction,
  DocumentActionsService,
  DocumentViewToolbarComponent,
  IDocument
} from '@features/documents';
import { UserService } from '@features/user';

@Component({
  selector: 'app-document-view',
  imports: [
    DocumentViewToolbarComponent,
  ],
  templateUrl: './document-view.page.html',
  styleUrl: './document-view.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentViewPage implements OnInit {
  private destroyRef: DestroyRef = inject(DestroyRef);
  private documentActions: DocumentActionsService = inject(DocumentActionsService);
  private router: Router = inject(Router);
  private title: Title = inject(Title);
  private userService: UserService = inject(UserService);

  public inputDocument: InputSignal<IDocument | undefined> = input<IDocument>(undefined, {alias: 'document'});
  public document: WritableSignal<IDocument | undefined> = linkedSignal(this.inputDocument);
  public documentNameControl = new FormControl('', Validators.required);

  public get isReviewer(): boolean {
    return this.userService.isReviewer;
  }

  public get isNameChanged(): boolean {
    return this.documentNameControl.value !== this.document()?.name;
  }

  public ngOnInit(): void {
    this.documentNameControl.setValue(this.document()?.name || '');
    this.title.setTitle('Document View -' + this.document()?.name || '')

    if (this.document()) {
      NutrientViewer.load({
        // Use the assets directory URL as a base URL. Nutrient will download its library assets from here.
        baseUrl: `${location.protocol}//${location.host}/assets/`,
        document: `${this.document()!.fileUrl}`,
        container: "#nutrient-container",
      }).then(instance => {
        // For the sake of this demo, store the Nutrient for Web instance
        // on the global object so that you can open the dev tools and
        // play with the Nutrient API.
        (window as any).instance = instance;
      });
    }
  }

  public revertNameChanges(): void {
    if (this.document()) {
      this.documentNameControl.setValue(this.document()!.name);
    }
  }

  public back(): void {
    this.router.navigate(['/documents']);
  }

  public isActionAllowed(action: DocumentAction): boolean {
    return this.documentActions.isAllowed(this.document()!.status, action);
  }

  public updateName() {
    this.documentActions.updateName(this.document()!, this.documentNameControl.value!)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError(err => of(null)),
        switchMap(_ => this.documentActions.getDoc(this.document()!.id)),
        map(document => {
          this.document.set(document);
          this.documentNameControl.setValue(document.name);
        }),
      )
      .subscribe();
  }

  public revoke(): void {
    this.documentActions.revoke(this.document()!).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(_ => this.documentActions.getDoc(this.document()!.id)),
      map(document => {
        this.document.set(document);
      }),
    ).subscribe();
  }

  public delete(): void {
    this.documentActions.delete(this.document()!).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(_ => {
        this.back();
        return of(null);
      }),
    ).subscribe();
  }

  public sendToReview(): void {
    this.documentActions.sendToReview(this.document()!).pipe(
      takeUntilDestroyed(this.destroyRef),
      switchMap(_ => this.documentActions.getDoc(this.document()!.id)),
      map(document => {
        this.document.set(document);
      }),
    ).subscribe();
  }

  public changeStatus(action: DocumentAction): void {
    this.documentActions.changeStatus(this.document()!, action).pipe(
      takeUntilDestroyed(this.destroyRef),
      catchError(err => of(null)),
      switchMap(_ => this.documentActions.getDoc(this.document()!.id)),
      map(document => {
        this.document.set(document);
      }),
    ).subscribe();
  }

}
