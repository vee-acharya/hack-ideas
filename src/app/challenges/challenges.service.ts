import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth.service';
import { Challenge } from './challenge.interface';

interface FirebaseChallenge {
  title: string;
  description: string;
  tags: { label: string; id: string; value: boolean }[];
  creationDate: number;
  upvotes: number;
  upvotedBy: number[];
}

@Injectable({ providedIn: 'root' })
export class ChallengesService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  fetchChallenges() {
    return this.http
      .get<{ [key: string]: FirebaseChallenge }>(
        'https://hack-ideas-backend-default-rtdb.firebaseio.com/challenges.json'
      )
      .pipe(
        map(response => {
          const challenges: Challenge[] = [];
          Object.keys(response).forEach(key => {
            challenges.push({ ...response[key], id: key });
          });
          return challenges;
        })
      );
  }

  addChallenge(challenge: FirebaseChallenge) {
    return this.http.post(
      'https://hack-ideas-backend-default-rtdb.firebaseio.com/challenges.json',
      challenge
    );
  }

  fetchChallengeById(id: string) {
    return this.http.get<FirebaseChallenge>(
      `https://hack-ideas-backend-default-rtdb.firebaseio.com/challenges/${id}.json`
    );
  }

  updateChallenge(id: string, challenge: FirebaseChallenge) {
    return this.http.patch(
      `https://hack-ideas-backend-default-rtdb.firebaseio.com/challenges/${id}.json`,
      challenge
    );
  }

  upvoteChallengeById(id: string, challenge: Challenge) {
    const firebaseChallenge = challenge as FirebaseChallenge;
    if (firebaseChallenge.upvotedBy) {
      firebaseChallenge.upvotedBy.push(this.authService.employeeId);
    } else {
      firebaseChallenge.upvotedBy = [this.authService.employeeId];
    }
    firebaseChallenge.upvotes = firebaseChallenge.upvotedBy.length;
    return this.updateChallenge(id, firebaseChallenge);
  }

  downvoteChallengeById(id: string, challenge: Challenge) {
    const firebaseChallenge = challenge as FirebaseChallenge;
    if (firebaseChallenge.upvotedBy) {
      firebaseChallenge.upvotedBy = firebaseChallenge.upvotedBy.filter(
        empId => empId !== this.authService.employeeId
      );
    }
    firebaseChallenge.upvotes = firebaseChallenge.upvotedBy.length;
    return this.updateChallenge(id, firebaseChallenge);
  }
}
