import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengaturanSaldoKasirComponent } from './pengaturan-saldo-kasir.component';

describe('PengaturanSaldoKasirComponent', () => {
  let component: PengaturanSaldoKasirComponent;
  let fixture: ComponentFixture<PengaturanSaldoKasirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengaturanSaldoKasirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengaturanSaldoKasirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
