import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRowButtonComponent } from './edit-row-button.component';

describe('EditRowButtonComponent', () => {
  let component: EditRowButtonComponent;
  let fixture: ComponentFixture<EditRowButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRowButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditRowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
