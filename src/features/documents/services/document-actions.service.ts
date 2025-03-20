import { Observable, of } from 'rxjs';
import { inject, Injectable } from '@angular/core';

import { DocumentAction, DocumentStatus, IDocument } from '../models';
import { RestApiService } from '../../shared';
import { UserService } from '../../user';
import { Form } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DocumentActionsService {
  private restApi: RestApiService = inject(RestApiService);
  private user: UserService = inject(UserService);

  private userActions = [
    DocumentAction.Save,
    DocumentAction.UpdateName,
    DocumentAction.Delete,
    DocumentAction.SendToReview,
    DocumentAction.Revoke
  ]

  private reviewerActions: DocumentAction[] = [
    DocumentAction.Review,
    DocumentAction.Decline,
    DocumentAction.Approve
  ]

  public isAllowed(status: DocumentStatus, action: DocumentAction): boolean {
    if (!this.isAllowedByUser(action)) {
      return false;
    }
    if (action === DocumentAction.Revoke) {
      return status === DocumentStatus.ReadyForReview;
    }
    if (action === DocumentAction.Delete) {
      return status === DocumentStatus.Draft || status === DocumentStatus.Revoke;
    }
    if (action === DocumentAction.SendToReview) {
      return status === DocumentStatus.Draft;
    }
    if (action === DocumentAction.Review) {
      return status === DocumentStatus.ReadyForReview;
    }
    if (action === DocumentAction.Decline || action === DocumentAction.Approve) {
      return status === DocumentStatus.UnderReview;
    }
    return true;
  }

  public isAllowedByUser(action: DocumentAction): boolean {
    if (this.user.isReviewer) {
      return this.reviewerActions.includes(action);
    }
    return this.userActions.includes(action);
  }

  public getDoc(docId: string): Observable<IDocument> {
    return this.restApi.getDocument(docId);
  }

  public save(doc: FormData): Observable<any> {
    return this.restApi.saveDocument(doc);
  }

  public updateName(doc: IDocument, newName: string): Observable<any> {
    if (this.isAllowed(doc.status, DocumentAction.UpdateName)) {
      return this.restApi.updateDocumentName(doc.id, newName);
    }
    return of(null);
  }

  public revoke(doc: IDocument): Observable<any> {
    if (this.isAllowed(doc.status, DocumentAction.Revoke)) {
      return this.restApi.revokeDocument(doc.id);
    }
    return of(null);
  }

  public delete(doc: IDocument): Observable<any>  {
    if (this.isAllowed(doc.status, DocumentAction.Delete)) {
      return this.restApi.deleteDocument(doc.id);
    }
    return of(null);
  }

  public sendToReview(doc: IDocument): Observable<any> {
    if (this.isAllowed(doc.status, DocumentAction.SendToReview)) {
      return this.restApi.sendToReviewDocument(doc.id);
    }
    return of(null);
  }

  public changeStatus(doc: IDocument, action: DocumentAction): Observable<any> {
    if (this.isAllowed(doc.status, action)) {
      const status = (): DocumentStatus => {
        if (action === DocumentAction.Review) {
          return DocumentStatus.UnderReview
        }
        if (action === DocumentAction.Decline) {
          return DocumentStatus.Declined
        }
        return DocumentStatus.Approved
      }
      return this.restApi.changeDocumentStatus(doc.id, status());
    }
    return of(null);
  }

}
