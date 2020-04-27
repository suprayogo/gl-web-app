import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanLabaRugiComponent } from './laporan-laba-rugi.component';

describe('LaporanLabaRugiComponent', () => {
  let component: LaporanLabaRugiComponent;
  let fixture: ComponentFixture<LaporanLabaRugiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanLabaRugiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanLabaRugiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
