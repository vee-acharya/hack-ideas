import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  loggedIn = false;

  isAuthenticated() {
    const promise = new Promise((resolve, _) => {
      resolve(this.loggedIn);
    });
    return promise;
  }

  login() {
    this.loggedIn = true;
  }

  logout() {
    this.loggedIn = false;
  }
}
