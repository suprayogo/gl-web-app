import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddableDetailInputComponent } from './addable-detail-input.component';

describe('AddableDetailInputComponent', () => {
  let component: AddableDetailInputComponent;
  let fixture: ComponentFixture<AddableDetailInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddableDetailInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddableDetailInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
