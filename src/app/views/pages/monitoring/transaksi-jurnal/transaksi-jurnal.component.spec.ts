import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaksiJurnalComponent } from './transaksi-jurnal.component';

describe('TransaksiJurnalComponent', () => {
  let component: TransaksiJurnalComponent;
  let fixture: ComponentFixture<TransaksiJurnalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransaksiJurnalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaksiJurnalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
