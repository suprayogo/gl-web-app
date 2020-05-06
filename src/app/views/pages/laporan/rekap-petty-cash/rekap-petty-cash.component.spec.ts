import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekapPettyCashComponent } from './rekap-petty-cash.component';

describe('RekapPettyCashComponent', () => {
  let component: RekapPettyCashComponent;
  let fixture: ComponentFixture<RekapPettyCashComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekapPettyCashComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekapPettyCashComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
