import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanNeracaSaldoRevComponent } from './laporan-neraca-saldo-rev.component';

describe('LaporanNeracaSaldoRevComponent', () => {
  let component: LaporanNeracaSaldoRevComponent;
  let fixture: ComponentFixture<LaporanNeracaSaldoRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanNeracaSaldoRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanNeracaSaldoRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
