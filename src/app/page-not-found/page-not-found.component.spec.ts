import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Location } from '@angular/common';

import { PageNotFoundComponent } from './page-not-found.component';
import { Router, Routes } from '@angular/router';
import { LoginComponent } from '../login/login.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('PageNotFoundComponent', () => {
  const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
      path: 'not-found',
      component: PageNotFoundComponent,
    },
    {
      path: '**',
      redirectTo: '/not-found',
    },
  ];

  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PageNotFoundComponent, LoginComponent],
      imports: [RouterTestingModule.withRoutes(routes)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should take user back to login page', fakeAsync(() => {
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    router.initialNavigation();
    const redirectBtn = fixture.nativeElement.querySelector('.redirect-btn');
    redirectBtn.click();
    tick();
    expect(location.path()).toContain('login');
  }));
});
