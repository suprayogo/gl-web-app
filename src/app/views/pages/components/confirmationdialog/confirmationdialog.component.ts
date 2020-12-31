import { Component, OnInit, ChangeDetectorRef, Inject, ChangeDetectionStrategy, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'kt-confirmationdialog',
  templateUrl: './confirmationdialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./confirmationdialog.component.scss']
})
export class ConfirmationdialogComponent implements OnInit {

  //Variables
  btnLayout: any;
  lblLayout: any;
  inpLayout: any;
  formValue: any;
  title: any;

  constructor(
    public dialogRef: MatDialogRef<ConfirmationdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.title = this.parameter.title
    this.formValue = this.parameter.formValue
    this.btnLayout = this.parameter.buttonLayout
    this.lblLayout = this.parameter.labelLayout
    this.inpLayout = this.parameter.inputLayout
  }

  getData(){
    return this.formValue
  }

  //Selection event
	selection(data, type, func?) {
    this.formValue[type] = data.target.value
    if (func !== undefined) func(this.formValue.tahun_periode, this.formValue.bulan_periode)
  }
  
  checkChanges() {
    this.formValue = this.parameter.formValue
  }

  closeDialog(t?){
    this.dialogRef.close()
    if(this.parameter.closeDialogFunc !== undefined && this.parameter.closeDialogFunc != null){
      this.parameter.closeDialogFunc()
    }
  }

}
