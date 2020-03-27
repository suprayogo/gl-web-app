import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';

import { TimeStringAdapter } from '../../time-adapter.module';

import { DetailinputAgGridComponent } from '../detailinput-ag-grid/detailinput-ag-grid.component';
import { DetailJurnalComponent } from '../detail-jurnal/detail-jurnal.component';

@Component({
  selector: 'kt-forminput',
  templateUrl: './forminput.component.html',
  styleUrls: ['./forminput.component.scss'],
  providers: [{ provide: NgbTimeAdapter, useClass: TimeStringAdapter }]
})
export class ForminputComponent implements OnInit {
  @ViewChild(DetailinputAgGridComponent, { static: false }) detailinput;
  @ViewChild(DetailJurnalComponent, { static: false }) detailjurnal;

  @Input() inputLayout: any;
  @Input() formValue: any;
  @Input() buttonLayout: any;
  //Detail table variable
  @Input() tableColumn: any;
  @Input() tableData: any;
  @Input() tableRules: any;
  @Input() editable: any;
  //Detail loading variable
  @Input() detailLoad: boolean;
  // Enable detail input ag grid
  @Input() enableDetail: boolean;
  // Enable detail input custom GL
  @Input() detailJurnal: boolean; 
  @Input() jurnalDataAkun: any;
  @Input() jurnalData: any;
  //On parent form 'update' state
  @Input() onUpdate: any;
  //Show delete button on parent in 'update' state
  @Input() enableDelete: boolean;
  @Input() enableCancel: boolean;
  @Input() disableSubmit: boolean;
  @Input() noCancel: boolean;
  @Input() onSub: any;
  @Input() onButton: any;
  @Input() nama_tombol: any;
  @Input() nama_tombol2: any;

  @Output() onSubmit = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() deleteData = new EventEmitter();
  @Output() cnlData = new EventEmitter();
  @Output() editAction = new EventEmitter();
  @Output() deleteAction = new EventEmitter();

  //Variable
  cFormValue: any; //Component Form Value, form value that is independent to the component
  button_name: any = 'Simpan';
  button_name2: any = 'Batal Simpan';
  errorType: any;

  constructor(
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cFormValue = JSON.parse(JSON.stringify(this.formValue))
    this.button_name = this.nama_tombol === undefined ? this.button_name : this.nama_tombol
    this.button_name2 = this.nama_tombol2 === undefined ? this.button_name2 : this.nama_tombol2
  }

  getData() {
    if (this.detailJurnal) {
      let res = this.cFormValue
      res['detail'] = this.detailjurnal === undefined ? null : this.detailjurnal.getData()
      return res
    } else {
      return this.cFormValue
    }
  }

  formSubmit(form) {
    this.onSubmit.emit(form)
  }

  inputPipe(valueOf, data) {
    this.cFormValue[valueOf] = data.toUpperCase()
  }

  //Selection event (Select Box)
  selection(data, type) {
    this.cFormValue[type] = data.target.value
  }

  onBlur(d, ind, data, vOf, onF) {
    let fres = [], v = d.target.value.toUpperCase()
    fres = data.filter(each => each[ind] === v)
    if (fres.length > 0 && fres.length < 2) {
      for(var i = 0; i < vOf.length; i++) {
        this.cFormValue[vOf[i]] = fres[0][vOf[i]]
      }
      if (onF !== undefined && onF != null) {
        onF()
      }
    } else {
      for(var i = 0; i < vOf.length; i++) {
        this.cFormValue[vOf[i]] = ""
      }
      if (onF !== undefined && onF != null) {
        onF()
      }
    }
  }

  onReset() {
    this.onCancel.emit()
  }

  delData() {
    this.deleteData.emit()
  }

  cancelData() { // Cancel Data
    this.cnlData.emit()
  }

  editDetailData(data) {
    this.editAction.emit(data)
  }

  delDetailData(data) {
    this.deleteAction.emit(data)
  }

  checkChanges() {
    this.cFormValue = JSON.parse(JSON.stringify(this.formValue))
  }

  updateFormValue(valueOf, data) {
    this.cFormValue[valueOf] = data
    this.ref.markForCheck()
  }

  checkChangesDetailInput() {
    this.detailinput === undefined ? null : this.detailinput.checkChanges()
  }

  checkChangesDetailJurnal() {
    this.detailjurnal === undefined ? null : this.detailjurnal.checkChanges()
  }

  //Date picker function
  getDateFormat(data) {
    let pdata = data === '' ? null : parseInt(data)
    let date = pdata == null ? null : new Date(pdata)
    return date == null ? null : {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    }
  }

  onDateSelect(e, type) {
    this.cFormValue[type] = `${this.convertTime(e)}`
  }

  convertTime(data) {
    let date = new Date(
      parseInt(`${data.year}`),
      parseInt(`${data.month}`) - 1,
      parseInt(`${data.day}`),
      0, 0, 0, 0
    )
    return `${date.getTime()}`
  }

  getDateNow() {
    let date = new Date(Date.now())

    return String(date.getDate()).padStart(2, "0") + '-' + (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) + '-' + date.getFullYear()
  }

  getTimeNow(offset?: number) {
    let pdata = Date.now()
    let date = pdata == null ? null : new Date(pdata)
    if (!offset)
      return date == null ? '' : `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getHours() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:00`
    else
      return date == null ? '' : `${date.getHours() + offset < 10 ? '0' + (date.getHours() + offset) : date.getHours() + offset}:${date.getHours() < 10 ? '0' + date.getMinutes() : date.getMinutes()}:00`
  }

  getMaxToday(d?: any) {
    let pdata = Date.now()
    let date = pdata == null ? null : new Date(pdata)

    if (d === undefined || d == null) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: (date.getMonth() + 1) == 2 ? 29 : 
              (
                (date.getMonth() + 1) == 1 ||
                (date.getMonth() + 1) == 3 ||
                (date.getMonth() + 1) == 5 ||
                (date.getMonth() + 1) == 7 ||
                (date.getMonth() + 1) == 8 ||
                (date.getMonth() + 1) == 10 ||
                (date.getMonth() + 1) == 12
              ) ? 31 : 30
      }
    } else {
      return {
        year: parseInt(d['y']),
        month: parseInt(d['m']),
        day: parseInt(d['m']) == 2 ? 29 : 
              (
                parseInt(d['m']) == 1 ||
                parseInt(d['m']) == 3 ||
                parseInt(d['m']) == 5 ||
                parseInt(d['m']) == 7 ||
                parseInt(d['m']) == 8 ||
                parseInt(d['m']) == 10 ||
                parseInt(d['m']) == 12
              ) ? 31 : 30
      }
    }
  }

  getMinToday(d?: any) {
    let pdata = Date.now()
    let date = pdata == null ? null : new Date(pdata)

    if (d === undefined || d == null) {
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: 1
      }
    } else {
      return {
        year: parseInt(d['y']),
        month: parseInt(d['m']),
        day: 1
      }
    }
    
  }

  //End of datepicker function

  disabledOn(cond: []) {
    if (cond == null || cond === undefined) {
      return false
    } else {
      let dis = false
      for (var i = 0; i < cond.length; i++) {
        if (this.cFormValue[cond[i]['key']] !== '') {
          dis = true
          break
        }
      }
      return dis
    }
  }

}
