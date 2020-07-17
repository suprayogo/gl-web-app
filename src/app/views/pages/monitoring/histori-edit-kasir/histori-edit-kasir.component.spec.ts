import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriEditKasirComponent } from './histori-edit-kasir.component';

describe('HistoriEditKasirComponent', () => {
  let component: HistoriEditKasirComponent;
  let fixture: ComponentFixture<HistoriEditKasirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriEditKasirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriEditKasirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
