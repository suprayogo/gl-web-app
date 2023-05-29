import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanLabaRugiRevComponent } from './laporan-laba-rugi-rev.component';

describe('LaporanLabaRugiRevComponent', () => {
  let component: LaporanLabaRugiRevComponent;
  let fixture: ComponentFixture<LaporanLabaRugiRevComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanLabaRugiRevComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanLabaRugiRevComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
