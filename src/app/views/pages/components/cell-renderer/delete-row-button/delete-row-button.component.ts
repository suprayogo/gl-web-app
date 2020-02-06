import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'kt-delete-row-button',
  templateUrl: './delete-row-button.component.html',
  styleUrls: ['./delete-row-button.component.scss']
})
export class DeleteRowButtonComponent implements ICellRendererAngularComp {

  public params: any;

  agInit(params: any): void {
      this.params = params;
  }

  public invokeParentMethod() {
      this.params.context.componentParent.deleteData(this.params.data)
  }

  refresh(): boolean {
      return false;
  }

}