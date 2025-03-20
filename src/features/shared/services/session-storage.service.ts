import { Injectable } from '@angular/core';


@Injectable({providedIn: 'root'})
export class SessionStorageService {
  public constructor() {
  }

  public get(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  public set(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  public remove(key: string): void {
    sessionStorage.removeItem(key);
  }

  public clear(): void {
    sessionStorage.clear();
  }

  public getJson<T>(key: string): T | '' {
    if (sessionStorage.getItem(key)) {
      return JSON.parse(sessionStorage.getItem(key)!);
    }
    return '';
  }

  public setJson<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }
}
