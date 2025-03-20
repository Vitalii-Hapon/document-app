import { inject, Injectable } from '@angular/core';

import { IColumnSettings } from '../../shared';
import { IDocument } from '../models';
import { UserService } from '../../user';

@Injectable({
  providedIn: 'root'
})
export class DocumentsTableService {
  private userService: UserService = inject(UserService);

  private get isReviewer(): boolean {
    return this.userService.isReviewer;
  }
  private _displayedColumns: string[] | null = null;

  private columnsSettings: IColumnSettings[] = [
    {position: 1, columnDef: 'name', name: 'Name', hasSorting: true, isCustomCell: false, cell: (el: IDocument) => el.name},
    {position: 2, columnDef: 'status', name: 'Status', hasSorting: true, isCustomCell: false, cell: (el: IDocument) => el.status.toString().replaceAll('_', ' ')},
    {position: 3, columnDef: 'creator', name: 'Creator', hasSorting: false, isCustomCell: false, cell: (el: IDocument) => el.creator ? `${el.creator.fullName} - ${el.creator.email}` : ''},
    {position: 4, columnDef: 'updatedAt', name: 'Last Updated', hasSorting: true, isCustomCell: false, cell: (el: IDocument) => new Date(el.updatedAt).toLocaleString()},
    {position: 5, columnDef: 'preview', name: '', hasSorting: false, isCustomCell: true, cell: (el: IDocument) => ''},
  ];

  public get columns(): IColumnSettings[] {
    return this.columnsSettings?.filter(col => !col.isCustomCell) || [];
  }

  public set displayedColumns(columns: string[]) {
    this._displayedColumns = columns;
  }

  public get displayedColumns(): string[] {
    if (this._displayedColumns) {
      return this._displayedColumns;
    }
    if (this.isReviewer) {
      this.displayedColumns = this.columnsSettings.map(col => col.columnDef);
    } else {
      this.displayedColumns = this.columnsSettings.filter(col => col.columnDef !== 'creator').map(col => col.columnDef);
    }
    return this._displayedColumns!;
  }
}
