import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutupHarianKasirComponent } from './tutup-harian-kasir.component';

describe('TutupHarianKasirComponent', () => {
  let component: TutupHarianKasirComponent;
  let fixture: ComponentFixture<TutupHarianKasirComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutupHarianKasirComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutupHarianKasirComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
