import { Location } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  inject,
} from '@angular/core/testing';
import { Router, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { ChallengeEditComponent } from '../challenge-edit/challenge-edit.component';
import { ChallengesComponent } from '../challenges.component';
import { ChallengesService } from '../challenges.service';

import { ChallengeItemComponent } from './challenge-item.component';

describe('ChallengeItemComponent', () => {
  const routes: Routes = [
    { path: 'challenges', component: ChallengesComponent },
    { path: 'challenges/:id/edit', component: ChallengeEditComponent },
  ];
  let component: ChallengeItemComponent;
  let fixture: ComponentFixture<ChallengeItemComponent>;
  let location: Location;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ChallengeItemComponent,
        ChallengesComponent,
        ChallengeEditComponent,
      ],
      imports: [
        RouterTestingModule.withRoutes(routes),
        HttpClientTestingModule,
      ],
      providers: [AuthService, ChallengesService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show/hide challenge description and actions on clicking toggle button', fakeAsync(() => {
    fixture.detectChanges();
    const toggleBtn = fixture.nativeElement.querySelector('.title-btn');
    const descriptionDiv = fixture.nativeElement.querySelector(
      '.description-area'
    );
    const actionsDiv = fixture.nativeElement.querySelector('.action-area');
    expect(toggleBtn.classList).toContain('collapsed');

    toggleBtn.click();
    tick();
    expect(toggleBtn.classList).not.toContain('collapsed');
    expect(descriptionDiv.classList).toContain('show');
    expect(actionsDiv.classList).toContain('show');

    toggleBtn.click();
    tick();
    expect(toggleBtn.classList).toContain('collapsed');
    expect(descriptionDiv.classList).not.toContain('show');
    expect(actionsDiv.classList).not.toContain('show');
  }));

  it('should go to "/challenges/../edit when user clicks on Edit details button"', fakeAsync(() => {
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
    router.initialNavigation();
    component.challenge.id = '1';
    const editBtn = fixture.nativeElement.querySelector('.edit-challenge');
    editBtn.click();
    tick();
    expect(location.path()).toContain('edit');
  }));

  it('should call challenges service to upvote the challenge when user clicks on upvote button', fakeAsync(
    inject([ChallengesService], (challengesService: ChallengesService) => {
      const upvoteButton = fixture.nativeElement.querySelector('.fa-heart-o');
      const spy = spyOn(
        challengesService,
        'upvoteChallengeById'
      ).and.returnValue(new Observable(() => {}));
      upvoteButton.click();
      tick();
      expect(spy).toHaveBeenCalled();
    })
  ));

  it('should call challenges service to unvote the challenge when user clicks on unvote button', fakeAsync(
    inject([ChallengesService], (challengesService: ChallengesService) => {
      const spy = spyOn(
        challengesService,
        'downvoteChallengeById'
      ).and.returnValue(new Observable());
      component.downvote();
      tick();
      expect(spy).toHaveBeenCalled();
    })
  ));
});
