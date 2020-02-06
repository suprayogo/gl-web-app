import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatatableAgGridComponent } from './datatable-ag-grid.component';

describe('DatatableAgGridComponent', () => {
  let component: DatatableAgGridComponent;
  let fixture: ComponentFixture<DatatableAgGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatatableAgGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatatableAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
