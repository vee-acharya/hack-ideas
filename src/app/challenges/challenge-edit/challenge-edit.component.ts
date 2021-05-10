import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Challenge } from '../challenge.interface';
import { ChallengesService } from '../challenges.service';

@Component({
  selector: 'app-challenge-edit',
  templateUrl: './challenge-edit.component.html',
  styleUrls: ['./challenge-edit.component.css'],
})
export class ChallengeEditComponent implements OnInit {
  form!: FormGroup;
  challengeId: string = '';
  editMode: boolean = false;
  challengeToBeEdited: Challenge = new Challenge();

  constructor(
    private route: ActivatedRoute,
    private challengesService: ChallengesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.challengeId = params.id;
      this.editMode = this.challengeId ? true : false;
      if (this.editMode) {
        this.challengesService
          .fetchChallengeById(this.challengeId)
          .subscribe(response => {
            const challenge = { ...response, id: this.challengeId };
            this.challengeToBeEdited = challenge as Challenge;
            this.initForm();
          });
      }
    });
    this.initForm();
  }

  initForm() {
    let title = '';
    let description = '';

    if (this.editMode) {
      title = this.challengeToBeEdited.title;
      description = this.challengeToBeEdited.description;
    }

    this.form = new FormGroup({
      title: new FormControl(title, Validators.required),
      description: new FormControl(description, Validators.required),
    });
  }

  onSubmit() {
    const challenge = {
      title: this.form.value.title,
      description: this.form.value.description,
      tags: this.challengeToBeEdited.tags,
      creationDate: 0,
      upvotes: this.challengeToBeEdited.upvotes,
      upvotedBy: this.challengeToBeEdited.upvotedBy,
    };
    if (this.editMode) {
      (challenge.creationDate = this.challengeToBeEdited.creationDate),
        this.challengesService
          .updateChallenge(this.challengeId, challenge)
          .subscribe(() => {
            this.router.navigate(['/challenges']);
          });
    } else {
      (challenge.creationDate = new Date().getTime()),
        this.challengesService.addChallenge(challenge).subscribe(() => {
          this.router.navigate(['/challenges']);
        });
    }
  }
}
