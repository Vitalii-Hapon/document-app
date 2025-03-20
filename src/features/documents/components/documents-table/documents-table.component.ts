import {
  Component,
  computed,
  Input,
  input,
  InputSignal,
  model, ModelSignal,
  output, Signal,
  ViewChild
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort, SortDirection } from '@angular/material/sort';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { DocumentSortColumns, DocumentSortData, IDocument } from '../../models';
import { IColumnSettings, IPaginationData } from '@shared';

@Component({
  selector: 'app-documents-table',
  templateUrl: './documents-table.component.html',
  styleUrl: './documents-table.component.scss',
  imports: [
    MatIconButton,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ]
})
export class DocumentsTableComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<IDocument>;

  @Input() public set documents(docs: IDocument[]) {
    if (this.table) {
      this.table.dataSource = docs;
    }
  }

  @Input() public columns: IColumnSettings[] = [];
  @Input() public displayedColumns: string[] = [];
  @Input() public pageSizeOption: number[] = [5, 10, 20];

  public previewClick = output<string>();

  public count: InputSignal<number> = input.required<number>();
  public sortData: ModelSignal<DocumentSortData> = model.required();
  public sortActive: Signal<DocumentSortColumns>  = computed(() => this.sortData()[0]);
  public sortDirection: Signal<SortDirection> = computed(() => this.sortData()[1]);
  public paginationData: ModelSignal<IPaginationData> = model.required();

  public pageChange(event: PageEvent) {
    this.paginationData.set({pageIndex: event.pageIndex, pageSize: event.pageSize});
  }

  public sortChange(event: Sort) {
    this.sortData.set([event.active as DocumentSortColumns, event.direction]);
  }

  public previewDocument(event: Event, docId: string): void {
    event.stopPropagation();
    this.previewClick.emit(docId);
  }
}
