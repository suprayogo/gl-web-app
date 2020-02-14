import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtoritasComponent } from './otoritas.component';

describe('OtoritasComponent', () => {
  let component: OtoritasComponent;
  let fixture: ComponentFixture<OtoritasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtoritasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtoritasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
