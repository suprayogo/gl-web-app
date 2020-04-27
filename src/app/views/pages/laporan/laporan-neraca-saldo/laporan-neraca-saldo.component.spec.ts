import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanNeracaSaldoComponent } from './laporan-neraca-saldo.component';

describe('LaporanNeracaSaldoComponent', () => {
  let component: LaporanNeracaSaldoComponent;
  let fixture: ComponentFixture<LaporanNeracaSaldoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanNeracaSaldoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanNeracaSaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
