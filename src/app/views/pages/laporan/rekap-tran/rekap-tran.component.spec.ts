import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekapTranComponent } from './rekap-tran.component';

describe('RekapTranComponent', () => {
  let component: RekapTranComponent;
  let fixture: ComponentFixture<RekapTranComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekapTranComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekapTranComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
