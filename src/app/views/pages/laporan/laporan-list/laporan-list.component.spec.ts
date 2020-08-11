import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LaporanListComponent } from './laporan-list.component';

describe('LaporanListComponent', () => {
  let component: LaporanListComponent;
  let fixture: ComponentFixture<LaporanListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LaporanListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LaporanListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
