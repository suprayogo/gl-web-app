import { Component, OnInit, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'kt-reportdialog',
  templateUrl: './reportdialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./reportdialog.component.scss']
})
export class ReportdialogComponent implements OnInit {

  report_id: string = ""
  report_name: string = ""
  report_link: string = "http://deva.darkotech.id:8704/report/viewer.html?repId="

  constructor(
    public dialogRef: MatDialogRef<ReportdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit() {
    this.report_id = this.parameter.reportId
    this.report_name = this.parameter.reportName === undefined ? "" : this.parameter.reportName
  }

  getReportUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.report_link + this.report_id)
  }

  closeDialog(t?) {
    this.dialogRef.close()
  }

}