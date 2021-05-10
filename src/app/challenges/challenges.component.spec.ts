import { Location } from '@angular/common';
import { Router, Routes } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick,
} from '@angular/core/testing';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { Challenge } from './challenge.interface';

import { ChallengesComponent } from './challenges.component';
import { ChallengesService } from './challenges.service';
import { ChallengeEditComponent } from './challenge-edit/challenge-edit.component';
import { RouterTestingModule } from '@angular/router/testing';

describe('ChallengesComponent', () => {
  let component: ChallengesComponent;
  let fixture: ComponentFixture<ChallengesComponent>;

  beforeEach(async () => {
    const routes: Routes = [
      { path: 'challenges', component: ChallengesComponent },
      { path: 'challenges/new', component: ChallengeEditComponent },
    ];

    await TestBed.configureTestingModule({
      declarations: [ChallengesComponent, ChallengeEditComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [ChallengesService, AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch challenges', inject(
    [ChallengesService],
    (challengesService: ChallengesService) => {
      fixture = TestBed.createComponent(ChallengesComponent);
      const spyChallengeFetch = spyOn(
        challengesService,
        'fetchChallenges'
      ).and.returnValue(
        new Observable(observer => {
          observer.next([new Challenge()]);
        })
      );
      fixture.detectChanges();
      expect(spyChallengeFetch).toHaveBeenCalled();
    }
  ));

  it('sorts challenges by creation date', () => {
    fixture = TestBed.createComponent(ChallengesComponent);
    component.sortByDate();
    fixture.detectChanges();
    expect(component.dateSort.nativeElement.classList).toContain('active');
    expect(component.dateSort.nativeElement.classList).toContain('active-sort');
    expect(component.upvoteSort.nativeElement.classList).not.toContain(
      'active'
    );
    expect(component.upvoteSort.nativeElement.classList).not.toContain(
      'active-sort'
    );
  });

  it('sorts challenges by upvotes', () => {
    fixture = TestBed.createComponent(ChallengesComponent);
    component.sortByUpvotes();
    fixture.detectChanges();
    expect(component.dateSort.nativeElement.classList).not.toContain('active');
    expect(component.dateSort.nativeElement.classList).not.toContain(
      'active-sort'
    );
    expect(component.upvoteSort.nativeElement.classList).toContain('active');
    expect(component.upvoteSort.nativeElement.classList).toContain(
      'active-sort'
    );
  });

  it('should go to "/challenges/new" when user clicks on Add Challenge button', fakeAsync(() => {
    let location: Location = TestBed.inject(Location);
    let router: Router = TestBed.inject(Router);
    router.initialNavigation();
    const addChallengeBtn = fixture.nativeElement.querySelector(
      '.app-primary-btn'
    );
    addChallengeBtn.click();
    tick();
    expect(location.path()).toBe('/challenges/new');
  }));
});
