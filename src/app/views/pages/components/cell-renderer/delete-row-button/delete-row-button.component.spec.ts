import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRowButtonComponent } from './delete-row-button.component';

describe('DeleteRowButtonComponent', () => {
  let component: DeleteRowButtonComponent;
  let fixture: ComponentFixture<DeleteRowButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteRowButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteRowButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
