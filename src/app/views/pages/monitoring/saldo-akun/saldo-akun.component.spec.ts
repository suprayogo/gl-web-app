import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoAkunComponent } from './saldo-akun.component';

describe('SaldoAkunComponent', () => {
  let component: SaldoAkunComponent;
  let fixture: ComponentFixture<SaldoAkunComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaldoAkunComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaldoAkunComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
