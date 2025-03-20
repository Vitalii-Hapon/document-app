import { IUser } from '../user/models';
import { SortData } from '@shared';

export interface IDocument {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: DocumentStatus;
  creator?: IUser;
  fileUrl?: string;
}

export enum DocumentStatus {
  Draft = 'DRAFT',
  Revoke = 'REVOKE',
  ReadyForReview = 'READY_FOR_REVIEW',
  UnderReview = 'UNDER_REVIEW',
  Approved = 'APPROVED',
  Declined = 'DECLINED',
}

export interface IDocumentTableData {
  results: IDocument[];
  count: number;
}

export type DocumentSortColumns = keyof Pick<IDocument, 'name' | 'status' | 'updatedAt'>;
export type DocumentSortData = SortData<DocumentSortColumns>;

export enum DocumentAction {
  Delete,
  Save,
  UpdateName,
  Revoke,
  SendToReview,
  Review,
  Approve,
  Decline,
}
