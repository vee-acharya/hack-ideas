import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn: boolean = false;

  loginSuccessful = new Subject<boolean>();

  constructor(private http: HttpClient) {}

  isAuthenticated(): boolean {
    return this.loggedIn;
  }

  login(empId: number) {
    return this.http
      .get<number[]>(
        'https://hack-ideas-backend-default-rtdb.firebaseio.com/users.json'
      )
      .pipe(
        map((response: number[]) => {
          this.loggedIn = response.includes(empId);
          this.loginSuccessful.next(this.loggedIn);
          return this.loggedIn;
        })
      );
  }

  logout() {
    this.loggedIn = false;
    this.loginSuccessful.next(this.loggedIn);
  }
}
