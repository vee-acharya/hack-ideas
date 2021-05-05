import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { Challenge } from '../challenge.interface';

@Component({
  selector: 'app-challenge-edit',
  templateUrl: './challenge-edit.component.html',
  styleUrls: ['./challenge-edit.component.css'],
})
export class ChallengeEditComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  challengeId: number = -1;
  editMode: boolean = false;
  challengeToBeEdited: Challenge = {
    title: '',
    description: '',
    tags: [],
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.challengeId = +params.id + 1;
      this.editMode = this.challengeId ? true : false;
      // fetch challengeToBeEdited
    });
    this.initForm();
  }

  initForm() {
    let title = '';
    let description = '';
    let tags = new FormArray([]);

    if (this.editMode) {
      title = this.challengeToBeEdited.title;
      description = this.challengeToBeEdited.description;
      if (this.challengeToBeEdited.tags) {
        this.challengeToBeEdited.tags.forEach((tag: string) => {
          tags.push(new FormControl(tag, Validators.required));
        });
      }
    }

    this.form = new FormGroup({
      title: new FormControl(title, Validators.required),
      description: new FormControl(description, Validators.required),
      tags,
    });
  }

  getTags() {
    return (<FormArray>this.form.get('tags')).controls;
  }

  onSubmit() {
    console.log(this.form);
  }
}
