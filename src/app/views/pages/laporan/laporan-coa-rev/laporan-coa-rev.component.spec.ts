import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanCoaRevComponent } from './laporan-coa-rev.component';

describe('LaporanCoaRevComponent', () => {
  let component: LaporanCoaRevComponent;
  let fixture: ComponentFixture<LaporanCoaRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanCoaRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanCoaRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
