import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputdialogComponent } from './inputdialog.component';

describe('InputdialogComponent', () => {
  let component: InputdialogComponent;
  let fixture: ComponentFixture<InputdialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputdialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputdialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
