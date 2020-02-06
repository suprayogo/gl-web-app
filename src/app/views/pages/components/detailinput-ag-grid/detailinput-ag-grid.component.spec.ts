import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailinputAgGridComponent } from './detailinput-ag-grid.component';

describe('DetailinputAgGridComponent', () => {
  let component: DetailinputAgGridComponent;
  let fixture: ComponentFixture<DetailinputAgGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailinputAgGridComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailinputAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
