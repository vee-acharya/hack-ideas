import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { Challenge } from '../challenge.interface';
import { ChallengesService } from '../challenges.service';

@Component({
  selector: 'app-challenge-item',
  templateUrl: './challenge-item.component.html',
  styleUrls: ['./challenge-item.component.css'],
})
export class ChallengeItemComponent implements OnInit {
  @Input() challenge: Challenge = new Challenge();

  constructor(
    private router: Router,
    private authService: AuthService,
    private challengesService: ChallengesService
  ) {}

  ngOnInit(): void {}

  editChallenge(id: string) {
    this.router.navigate(['/challenges', id, 'edit']);
  }

  getCreationDate() {
    return new Date(this.challenge.creationDate);
  }

  onToggle(
    buttonEl: HTMLButtonElement,
    textEl1: HTMLDivElement,
    textEl2: HTMLDivElement
  ) {
    const accordionButtons = document.querySelectorAll('.accordion-button');
    const descriptionAreas = document.querySelectorAll('.description-area');
    const actionAreas = document.querySelectorAll('.action-area');

    Array.from(accordionButtons)
      .filter(btn => btn !== buttonEl)
      .forEach(btn => btn.classList.add('collapsed'));
    Array.from(descriptionAreas)
      .filter(area => area !== textEl1)
      .forEach(area => area.classList.remove('show'));
    Array.from(actionAreas)
      .filter(area => area !== textEl2)
      .forEach(area => area.classList.remove('show'));

    if (Array.from(textEl1.classList).includes('show')) {
      textEl1.classList.remove('show');
      textEl2.classList.remove('show');
      buttonEl.classList.add('collapsed');
    } else {
      textEl1.classList.add('show');
      textEl2.classList.add('show');
      buttonEl.classList.remove('collapsed');
    }
  }

  isUpvoted() {
    return this.challenge.upvotedBy &&
      this.challenge.upvotedBy.includes(this.authService.employeeId)
      ? true
      : false;
  }

  upvote() {
    this.challengesService
      .upvoteChallengeById(this.challenge.id, this.challenge)
      .subscribe();
  }

  downvote() {
    this.challengesService
      .downvoteChallengeById(this.challenge.id, this.challenge)
      .subscribe();
  }

  tagsPresent() {
    let tagsPresent = false;
    this.challenge.tags.forEach(
      tag => (tagsPresent = tagsPresent || tag.value)
    );
    return tagsPresent;
  }
}
