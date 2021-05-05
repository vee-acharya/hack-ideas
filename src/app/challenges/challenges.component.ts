import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css'],
})
export class ChallengesComponent implements OnInit {
  public challenges: string[] = ['Challenge 1', 'Challenge 2', 'Challenge 3'];

  constructor() {}

  ngOnInit(): void {}
}
