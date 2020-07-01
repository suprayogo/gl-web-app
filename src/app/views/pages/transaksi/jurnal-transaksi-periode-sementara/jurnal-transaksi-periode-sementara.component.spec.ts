import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JurnalTransaksiPeriodeSementaraComponent } from './jurnal-transaksi-periode-sementara.component';

describe('JurnalTransaksiPeriodeSementaraComponent', () => {
  let component: JurnalTransaksiPeriodeSementaraComponent;
  let fixture: ComponentFixture<JurnalTransaksiPeriodeSementaraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JurnalTransaksiPeriodeSementaraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JurnalTransaksiPeriodeSementaraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
