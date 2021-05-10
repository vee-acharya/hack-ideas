import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'src/app/auth.service';
import { ChallengesService } from '../challenges.service';

import { ChallengeEditComponent } from './challenge-edit.component';

describe('ChallengeEditComponent', () => {
  let component: ChallengeEditComponent;
  let fixture: ComponentFixture<ChallengeEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChallengeEditComponent],
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [ChallengesService, AuthService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengeEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call initForm function after component is initialized', () => {
    const fixture = TestBed.createComponent(ChallengeEditComponent);
    const component = fixture.componentInstance;
    expect(component.form).toBeUndefined();
    fixture.detectChanges();
    expect(component.form).toBeDefined();
  });

  it('should not be able to call onSubmit when form is invalid', () => {
    component.form.controls['title'].setValue('');
    component.form.controls['description'].setValue('');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.app-primary-btn').disabled
    ).toBeTruthy();

    component.form.controls['title'].setValue('Test title');
    component.form.controls['description'].setValue('');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.app-primary-btn').disabled
    ).toBeTruthy();

    component.form.controls['title'].setValue('');
    component.form.controls['description'].setValue('Test description');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.app-primary-btn').disabled
    ).toBeTruthy();
  });

  it('should be able to call onSubmit when form is valid', () => {
    component.form.controls['title'].setValue('Test title');
    component.form.controls['description'].setValue('Test description');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.app-primary-btn').disabled
    ).toBeFalsy();
  });
});
