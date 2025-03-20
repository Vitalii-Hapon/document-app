import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwt: string = '';

  public get token(): string {
    return this.jwt;
  }

  public set token(token: string) {
    this.jwt = token;
  }
}
