import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartemenComponent } from './departemen.component';

describe('DepartemenComponent', () => {
  let component: DepartemenComponent;
  let fixture: ComponentFixture<DepartemenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartemenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartemenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
