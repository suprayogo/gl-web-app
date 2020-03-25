import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PengaturanJurnalOtomatisComponent } from './pengaturan-jurnal-otomatis.component';

describe('PengaturanJurnalOtomatisComponent', () => {
  let component: PengaturanJurnalOtomatisComponent;
  let fixture: ComponentFixture<PengaturanJurnalOtomatisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PengaturanJurnalOtomatisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PengaturanJurnalOtomatisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
