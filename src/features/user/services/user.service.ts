import { Injectable } from '@angular/core';
import { IUser, UserRole } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userData: IUser | null = null

  public get user(): IUser | null {
    return this.userData;
  }

  public set user(user: IUser) {
    this.userData = user;
  }

  public get isReviewer(): boolean {
    return this.user?.role === UserRole.Reviewer;
  }
}
