import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanRekapTransaksiRevComponent } from './laporan-rekap-transaksi-rev.component';

describe('LaporanRekapTransaksiRevComponent', () => {
  let component: LaporanRekapTransaksiRevComponent;
  let fixture: ComponentFixture<LaporanRekapTransaksiRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanRekapTransaksiRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanRekapTransaksiRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
