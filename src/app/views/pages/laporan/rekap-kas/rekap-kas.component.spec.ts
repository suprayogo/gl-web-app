import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekapKasComponent } from './rekap-kas.component';

describe('RekapKasComponent', () => {
  let component: RekapKasComponent;
  let fixture: ComponentFixture<RekapKasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekapKasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekapKasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
