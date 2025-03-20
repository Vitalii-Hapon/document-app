import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DocumentSortData, DocumentStatus, IDocument } from '../../documents';
import { IAuthForm, ILoginResponse, IUser } from '../../user';
import { IPaginationData } from '../models';

const API_URL = 'https://legaltech-testing.coobrick.app'

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  constructor(
    private http: HttpClient,
  ) {
  }

  public login(form: IAuthForm): Observable<ILoginResponse> {
    return this.http.post<ILoginResponse>(`${API_URL}/api/v1/auth/login  `, form);
  }

  public getUser(): Observable<IUser> {
    return this.http.get<IUser>(`${API_URL}/api/v1/user`);
  }

  public getDocuments(sortData: DocumentSortData, paginationData: IPaginationData, filterData: [string, string]): Observable<any> {
    let params = new HttpParams()
      .set('page', +paginationData.pageIndex + 1)
      .set('size', paginationData.pageSize)
      .set('sort', sortData.join(','));
    if (filterData[0]) {
      params = params.set('status', filterData[0]);
    }
    if (filterData[1]) {
      params = params.set('creatorEmail', filterData[1]);
    }
    return this.http.get(`${API_URL}/api/v1/document`, {params});
  }

  public getDocument(docId: string): Observable<IDocument> {
    return this.http.get<IDocument>(`${API_URL}/api/v1/document/${docId}`)
  }

  public saveDocument(doc: FormData): Observable<any> {
    return this.http.post<IDocument>(`${API_URL}/api/v1/document`,
      doc);
  }

  public updateDocumentName(docId: string, name: string): Observable<any> {
    return this.http.patch(`${API_URL}/api/v1/document/${docId}`, {name});
  }

  public revokeDocument(docId: string): Observable<any> {
    return this.http.post(`${API_URL}/api/v1/document/${docId}/revoke-review`, {});
  }

  public sendToReviewDocument(docId: string): Observable<any> {
    return this.http.post(`${API_URL}/api/v1/document/${docId}/send-to-review`, {});
  }

  public deleteDocument(docId: string): Observable<any> {
    return this.http.delete(`${API_URL}/api/v1/document/${docId}`);
  }

  public changeDocumentStatus(docId: string, status: DocumentStatus): Observable<any> {
    return this.http.post(`${API_URL}/api/v1/document/${docId}/change-status`, {status});
  }
}
