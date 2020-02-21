import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengaturanSaldoAwalComponent } from './pengaturan-saldo-awal.component';

describe('PengaturanSaldoAwalComponent', () => {
  let component: PengaturanSaldoAwalComponent;
  let fixture: ComponentFixture<PengaturanSaldoAwalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengaturanSaldoAwalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengaturanSaldoAwalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
