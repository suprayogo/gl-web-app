import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JurnalTransaksiComponent } from './jurnal-transaksi.component';

describe('JurnalTransaksiComponent', () => {
  let component: JurnalTransaksiComponent;
  let fixture: ComponentFixture<JurnalTransaksiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JurnalTransaksiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JurnalTransaksiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
