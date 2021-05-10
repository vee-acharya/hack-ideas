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
  error!: boolean;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.authService.logout();
    }
  }

  onLogin(loginForm: NgForm) {
    this.authService
      .login(+loginForm.value.empId)
      .subscribe((authenticated: boolean) => {
        if (authenticated) {
          this.router.navigate(['/challenges']);
        } else {
          this.error = true;
        }
      });
  }
}
