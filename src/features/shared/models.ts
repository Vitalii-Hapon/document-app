import { FormControl, FormGroup } from '@angular/forms';
import { SortDirection } from '@angular/material/sort';

export type IForm<T> = {
  [P in keyof T]: T[P] extends 'object' ? FormGroup<IForm<T[P]>> : FormControl<T[P] | null>;
};

export type SortOrder = 'asc' | 'desc';

export type SortData<T> = [T, SortDirection];

export interface IPaginationData {
  pageIndex: number;
  pageSize: number;
}

export interface IColumnSettings {
  position: number;
  columnDef: string;
  name: string;
  hasSorting: boolean;
  isCustomCell: boolean;
  cell: (el: any) => string;
}

export interface ISelectOption {
  value: string;
  viewValue: string;
}
