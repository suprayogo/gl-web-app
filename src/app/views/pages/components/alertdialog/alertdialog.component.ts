import { Component, OnInit, ChangeDetectorRef, Inject, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-alertdialog',
  templateUrl: './alertdialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./alertdialog.component.scss']
})
export class AlertdialogComponent implements OnInit {

  //Variable
  message: any;
  type: any;
  title: any;

  constructor(
    public dialogRef: MatDialogRef<AlertdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.message = this.parameter.message === undefined || this.parameter.message == null ? '' : this.parameter.message
    this.type = this.parameter.type === undefined || this.parameter.type == null ? '' : this.parameter.type
    this.title = this.parameter.title === undefined || this.parameter.title == null ? '' : this.parameter.title
  }

  closeDialog(force?: boolean) {
    this.dialogRef.close()
    if (this.parameter.onCloseFunc !== undefined && this.parameter.onCloseFunc != null) {
      this.parameter.onCloseFunc()
    }
    if (force != true) {
      if (this.parameter.closeDialogFunc !== undefined && this.parameter.closeDialogFunc != null) {
        this.parameter.closeDialogFunc()
      }
    }
  }

}