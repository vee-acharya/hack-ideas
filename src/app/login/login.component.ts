import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  error: boolean = false;
  loggedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
      this.loggedIn = false;
    }
  }

  onLogin(loginForm: NgForm) {
    this.authService
      .login(+loginForm.value.empId)
      .subscribe((authenticated: boolean) => {
        if (authenticated) {
          this.loggedIn = true;
          this.router.navigate(['/challenges']);
        } else {
          this.error = true;
          this.loggedIn = false;
        }
      });
  }
}
