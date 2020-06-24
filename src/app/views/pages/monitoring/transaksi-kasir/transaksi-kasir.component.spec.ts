import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransaksiKasirComponent } from './transaksi-kasir.component';

describe('TransaksiKasirComponent', () => {
  let component: TransaksiKasirComponent;
  let fixture: ComponentFixture<TransaksiKasirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransaksiKasirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransaksiKasirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
