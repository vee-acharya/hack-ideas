import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [RouterTestingModule, HttpClientTestingModule, FormsModule],
      providers: [AuthService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check if user is accessing login page while signed in and log them out', inject(
    [AuthService],
    (authService: AuthService) => {
      fixture = TestBed.createComponent(LoginComponent);
      const spy = spyOn(authService, 'isAuthenticated').and.returnValue(true);
      const spyLogout = spyOn(authService, 'logout').and.callFake(() => {
        authService.loggedIn = false;
      });
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
      expect(spyLogout).toHaveBeenCalled();
    }
  ));
});
