import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaksiJurnalOtomatisComponent } from './transaksi-jurnal-otomatis.component';

describe('TransaksiJurnalOtomatisComponent', () => {
  let component: TransaksiJurnalOtomatisComponent;
  let fixture: ComponentFixture<TransaksiJurnalOtomatisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransaksiJurnalOtomatisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaksiJurnalOtomatisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
