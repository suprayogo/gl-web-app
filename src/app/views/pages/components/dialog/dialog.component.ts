import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-dialog',
  templateUrl: './dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  displayedColumnsTable: Object[];
  tableData: Object[];
  tableInterface: any;
  tableRules: Object[];
  selectable: boolean = false;
  selected: Object[];
  selectIndicator: any;
  loading: any = false;
  title: any;
  sizeCont: any;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any
  ) { }

  ngOnInit() {
    this.displayedColumnsTable = this.parameter.displayedColumns
    this.tableData = this.parameter.tableData
    this.tableInterface = this.parameter.tableInterface
    this.tableRules = this.parameter.tableRules
    this.selectable = this.parameter.selectable
    this.selected = this.parameter.selected
    this.selectIndicator = this.parameter.selectIndicator
    this.loading = this.parameter.loadingData
    this.title = this.parameter.title
    this.sizeCont = this.parameter.sizeCont
  }

  dialogRowSelect(data){
    this.dialogRef.close(data)
  }

  closeDialog(t?){
    this.dialogRef.close()
    if(this.parameter.closeDialogFunc !== undefined && this.parameter.closeDialogFunc != null){
      this.parameter.closeDialogFunc()
    }
  }

}