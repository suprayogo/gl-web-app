import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'kt-edit-row-button',
  templateUrl: './edit-row-button.component.html',
  styleUrls: ['./edit-row-button.component.scss']
})
export class EditRowButtonComponent implements ICellRendererAngularComp {

  public params: any;

  agInit(params: any): void {
      this.params = params;
  }

  public invokeParentMethodEdit() {
      this.params.context.componentParent.editData(this.params.data)
  }

  public invokeParentMethodDelete() {
    this.params.context.componentParent.deleteData(this.params.data)
}

  refresh(): boolean {
      return false;
  }

}