import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';

import { AuthService } from '../auth.service';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [AuthService],
    }).compileComponents();
  });

  beforeEach(async () => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should log the user out of the application on clicking LOGOUT button', inject(
    [AuthService],
    (authService: AuthService) => {
      let spyLogin = spyOn(authService, 'login').and.returnValue(
        new Observable(observer => {
          observer.next(true);
        })
      );
      spyLogin(1).subscribe(response => {
        authService.loggedIn = response;
        authService.loginSuccessful.next(true);
      });
      fixture.detectChanges();
      expect(component.userAction).toBe('LOGOUT');
      let spyLogout = spyOn(authService, 'logout').and.callFake(() => {
        authService.loggedIn = false;
        authService.loginSuccessful.next(false);
      });
      spyLogout();
      fixture.detectChanges();
      expect(component.userAction).toBe('');
    }
  ));
});
