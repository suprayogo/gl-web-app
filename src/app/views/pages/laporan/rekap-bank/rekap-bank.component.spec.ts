import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekapBankComponent } from './rekap-bank.component';

describe('RekapBankComponent', () => {
  let component: RekapBankComponent;
  let fixture: ComponentFixture<RekapBankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekapBankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekapBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
