import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Challenge } from './challenge.interface';
import { ChallengesService } from './challenges.service';

const ITEMS_PER_PAGE = 5;

@Component({
  selector: 'app-challenges',
  templateUrl: './challenges.component.html',
  styleUrls: ['./challenges.component.css'],
})
export class ChallengesComponent implements OnInit {
  @ViewChild('dateSort') dateSort!: ElementRef;
  @ViewChild('upvoteSort') upvoteSort!: ElementRef;

  public challenges: Challenge[] = [];
  public fetchingChallenges!: boolean;

  public error!: boolean;
  public errorMessage!: string;

  public numberOfPages!: number;
  public paginatedChallenges!: Challenge[];
  private currentPage!: number;

  constructor(private challengesService: ChallengesService) {}

  ngOnInit(): void {
    this.fetchingChallenges = true;
    this.challengesService.fetchChallenges().subscribe(
      response => {
        this.fetchingChallenges = false;
        this.challenges = response;
        this.initPagination();
        this.listenForPagination();
      },
      error => {
        this.fetchingChallenges = false;
        this.error = true;
        this.errorMessage = 'Something went wrong. Please try again later.';
      }
    );
  }

  initPagination() {
    this.numberOfPages =
      this.challenges.length % ITEMS_PER_PAGE === 0
        ? this.challenges.length / ITEMS_PER_PAGE
        : Math.ceil(this.challenges.length / ITEMS_PER_PAGE);
    this.createPaginationHTML(this.numberOfPages);
    this.goToPage(1);
  }

  createPaginationHTML(numPages: number) {
    (<HTMLUListElement>document.querySelector('.pagination')).innerHTML = '';
    let pagesHtml = '';
    new Array(numPages).fill(1).forEach((_, index) => {
      pagesHtml =
        pagesHtml +
        `
        <li
        class="page-item"
        >
          <a
            class="page-link numbered-page numbered-page-${index + 1}"
            style="cursor: pointer;"
            >${index + 1}</a
          >
        </li>
    `;
    });
    let html = `
      <li class="page-item">
        <a style="cursor: pointer;" class="page-link page-back">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>
      ${pagesHtml}
      <li class="page-item">
        <a  style="cursor: pointer;" class="page-link page-forward">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>
    `;
    document
      .querySelector('.pagination')
      ?.insertAdjacentHTML('afterbegin', html);
  }

  goToPage(page: number) {
    this.currentPage = page;
    const pageBtns = document.querySelectorAll('.numbered-page');
    Array.from(pageBtns).forEach(btn =>
      btn?.closest('.page-item')?.classList.remove('active')
    );
    const pageBtn = Array.from(pageBtns).find(btn =>
      btn.classList.contains(`numbered-page-${page}`)
    );
    pageBtn?.closest('.page-item')?.classList.add('active');

    if (page === 1) {
      this.paginatedChallenges = this.challenges.slice(0, ITEMS_PER_PAGE);
      return;
    }
    if (page === this.numberOfPages) {
      this.paginatedChallenges = this.challenges.slice(
        (this.numberOfPages - 1) * ITEMS_PER_PAGE,
        this.challenges.length
      );
      return;
    }
    this.paginatedChallenges = this.challenges.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
  }

  listenForPagination() {
    new Array(this.numberOfPages).fill(1).forEach((_, i) => {
      const btn = document.querySelector(`.numbered-page-${i + 1}`);
      btn?.addEventListener('click', () => {
        this.goToPage(i + 1);
      });
    });

    const backBtn = document.querySelector('.page-back');
    backBtn?.addEventListener(
      'click',
      () => this.currentPage > 1 && this.goToPage(this.currentPage - 1)
    );

    const forwardBtn = document.querySelector('.page-forward');
    forwardBtn?.addEventListener(
      'click',
      () =>
        this.currentPage < this.numberOfPages &&
        this.goToPage(this.currentPage + 1)
    );
  }

  sortByDate() {
    (<HTMLButtonElement>this.dateSort.nativeElement).classList.add(
      'active',
      'active-sort'
    );
    (<HTMLButtonElement>this.upvoteSort.nativeElement).classList.remove(
      'active',
      'active-sort'
    );
    this.challenges = this.challenges.sort(
      (a, b) => b.creationDate - a.creationDate
    );
    this.initPagination();
    this.listenForPagination();
  }

  sortByUpvotes() {
    (<HTMLButtonElement>this.dateSort.nativeElement).classList.remove(
      'active',
      'active-sort'
    );
    (<HTMLButtonElement>this.upvoteSort.nativeElement).classList.add(
      'active',
      'active-sort'
    );
    this.challenges = this.challenges.sort((a, b) => b.upvotes - a.upvotes);
    this.initPagination();
    this.listenForPagination();
  }
}
