import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostingJurnalComponent } from './posting-jurnal.component';

describe('PostingJurnalComponent', () => {
  let component: PostingJurnalComponent;
  let fixture: ComponentFixture<PostingJurnalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostingJurnalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostingJurnalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
