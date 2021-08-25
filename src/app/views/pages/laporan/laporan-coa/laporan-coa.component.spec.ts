import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanCoaComponent } from './laporan-coa.component';

describe('LaporanCoaComponent', () => {
  let component: LaporanCoaComponent;
  let fixture: ComponentFixture<LaporanCoaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanCoaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanCoaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
