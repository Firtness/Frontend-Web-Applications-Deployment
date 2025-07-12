import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  tokenChanged: EventEmitter<string>;

  constructor() {
    this.tokenChanged = new EventEmitter();
  }

  public setToken(token: string): void {
    localStorage.setItem('auth_token', token);
    this.tokenChanged.emit(token);
  }

  public getToken(): string {
    return localStorage.getItem('auth_token')?.toString() || 'null';
  }
}
