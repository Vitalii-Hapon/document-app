import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  linkedSignal,
  OnDestroy,
  signal,
  WritableSignal
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { map, merge, Observable, skip, switchMap } from 'rxjs';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';

import {
  DocumentSortData,
  DocumentsTableComponent,
  DocumentsTableService,
  DocumentStatusService,
  IDocumentTableData
} from '@features/documents';
import {
  IColumnSettings,
  IPaginationData,
  ISelectOption,
  RestApiService,
  SessionStorageService
} from '@shared';
import { UserService } from '@features/user';

@Component({
  selector: 'app-documents-panel',
  imports: [
    DocumentsTableComponent,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './documents-panel.page.html',
  styleUrl: './documents-panel.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocumentsPanelPage implements AfterViewInit, OnDestroy {
  private destroyRef: DestroyRef = inject(DestroyRef);
  private restApi: RestApiService = inject(RestApiService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private statuses: DocumentStatusService = inject(DocumentStatusService);
  private storage: SessionStorageService = inject(SessionStorageService);
  private table: DocumentsTableService = inject(DocumentsTableService);
  private userService: UserService = inject(UserService);

  public statusControl: FormControl<string | null> = new FormControl(this.storage.getJson<[string, string]>('filterData')?.[0] || '');
  public creatorEmailControl: FormControl<string | null> = new FormControl(this.storage.getJson<[string, string]>('filterData')?.[1] || '');


  public filterData: WritableSignal<[string, string]> = signal(this.storage.getJson('filterData') || ['', '']);
  public sortData: WritableSignal<DocumentSortData> =
    signal(this.storage.getJson('sortData') || ['name', 'asc']);
  public paginationData: WritableSignal<IPaginationData> =
    signal(this.storage.getJson('paginationData') || {pageIndex: 0, pageSize: 10});

  public documentTableData: WritableSignal<IDocumentTableData> = linkedSignal(
    toSignal(this.getDocs(), {initialValue: {results: [], count: 0}}));

  private sortDataChange$ = toObservable(this.sortData);
  private paginationDataChange$ = toObservable(this.paginationData);
  private filterDataChange$ = toObservable(this.filterData);

  public get isReviewer(): boolean {
    return this.userService.isReviewer;
  }

  public get columns(): IColumnSettings[] {
    return this.table.columns;
  }

  public get displayedColumns(): string[] {
    return this.table.displayedColumns
  }

  public get statusOptions(): ISelectOption[] {
    return this.statuses.statusSelectOptions;
  }

  public applyFilter() {
    this.filterData.set([this.statusControl.value || '', this.isReviewer ? this.creatorEmailControl.value || '' : '']);
  }

  public openDoc(docId: string) {
    this.router.navigate(['../documents/document', docId])
  }

  public addDocument() {
    this.router.navigate(['../documents/document-creator'])
  }

  public clear($event: Event, control: FormControl<any>): void {
    $event.stopPropagation();
    control.reset();
  }

  public ngAfterViewInit() {
    merge(
      this.sortDataChange$.pipe(skip(1)),
      this.filterDataChange$.pipe(skip(1)),
    ).pipe(
      map(_ => this.paginationData.update(value => ({...value, pageIndex: 0}))),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();

    this.paginationDataChange$.pipe(
      skip(1),
      switchMap(value => this.getDocs()),
      map((data: IDocumentTableData) => this.documentTableData.set(data)),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe();

    if (!this.isReviewer) {
      this.statusControl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => this.applyFilter())
    }
  }

  public ngOnDestroy() {
    this.storage.setJson('paginationData', this.paginationData());
    this.storage.setJson('sortData', this.sortData());
    this.storage.setJson('filterData', this.filterData());
  }

  private getDocs(): Observable<IDocumentTableData> {
    return this.restApi.getDocuments(this.sortData(), this.paginationData(), this.filterData());
  }
}
