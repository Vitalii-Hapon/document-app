import { inject, Injectable } from '@angular/core';

import { DocumentStatus } from '../models';
import { ISelectOption } from '../../shared';
import { UserService } from '../../user';

@Injectable({
  providedIn: 'root'
})
export class DocumentStatusService {
  private userService: UserService = inject(UserService);
  private filteredStatusSelectOptions: ISelectOption[] | null = null;

  private _statusSelectOptions: ISelectOption[] = Object.values(DocumentStatus).map(el => ({
    value: el,
    viewValue: el.replaceAll('_', ' '),
  }));

  public get statusSelectOptions(): ISelectOption[] {
    if (this.filteredStatusSelectOptions) {
      return this.filteredStatusSelectOptions;
    }
    if (this.userService.isReviewer) {
      this.filteredStatusSelectOptions = this._statusSelectOptions.filter(el => el.viewValue !== DocumentStatus.Draft);
    } else {
      this.filteredStatusSelectOptions = this._statusSelectOptions;
    }
    return this.filteredStatusSelectOptions;
  }
}
