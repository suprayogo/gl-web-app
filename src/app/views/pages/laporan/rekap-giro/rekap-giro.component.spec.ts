import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RekapGiroComponent } from './rekap-giro.component';

describe('RekapGiroComponent', () => {
  let component: RekapGiroComponent;
  let fixture: ComponentFixture<RekapGiroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RekapGiroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RekapGiroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
