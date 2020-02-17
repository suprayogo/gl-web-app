import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserOtoritasComponent } from './user-otoritas.component';

describe('UserOtoritasComponent', () => {
  let component: UserOtoritasComponent;
  let fixture: ComponentFixture<UserOtoritasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserOtoritasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserOtoritasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
