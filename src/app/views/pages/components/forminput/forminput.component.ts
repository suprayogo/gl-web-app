import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { NgbTimeAdapter, NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

import { TimeStringAdapter } from '../../time-adapter.module';

import { DetailinputAgGridComponent } from '../detailinput-ag-grid/detailinput-ag-grid.component';
import { DetailJurnalComponent } from '../detail-jurnal/detail-jurnal.component';
import { GlobalVariableService } from '../../../../service/global-variable.service';

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
  @Input() statusLayout: any;
  @Input() noButton: boolean;
  @Input() rightLayout: boolean;
  @Input() rightInputLayout: any;
  //Detail table variable
  @Input() tableColumn: any;
  @Input() tableData: any;
  @Input() tableRules: any;
  @Input() editable: any;
  @Input() containerHeight: any;
  //Detail loading variable
  @Input() detailLoad: boolean;
  // Enable detail input ag grid
  @Input() enableDetail: boolean;
  // Enable detail input custom GL
  @Input() detailJurnal: boolean;
  @Input() jurnalDataAkun: any;
  @Input() jurnalDataDivisi: any;
  @Input() jurnalData: any;
  @Input() jurnalOtomatis: boolean;
  @Input() templateTransaksi: boolean;
  @Input() noEditJurnal: boolean;
  @Input() jurnalDataSetting: any;
  @Input() tipeJurnal: any;
  //On parent form 'update' state
  @Input() onUpdate: any;
  //Show delete button on parent in 'update' state
  @Input() enableDelete: boolean;
  @Input() enableCancel: boolean;
  @Input() disableSubmit: boolean;
  @Input() disablePrintButton: boolean;
  @Input() disablePrintButton2: boolean;
  @Input() disableForm: boolean;
  @Input() noCancel: boolean;
  @Input() onSub: any;
  @Input() noSaveButton: any;
  @Input() onSubPrintDoc: any;

  @Input() onSubPrintDoc2: any;
  @Input() namaTombol: any;
  @Input() namaTombol2: any;
  @Input() namaTombolPrintDoc: any;
  @Input() namaTombolPrintDoc2: any;


  @Output() onSubmit = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() deleteData = new EventEmitter();
  @Output() cnlData = new EventEmitter();
  @Output() prntDoc = new EventEmitter();
  @Output() prntDoc2 = new EventEmitter();
  @Output() editAction = new EventEmitter();
  @Output() deleteAction = new EventEmitter();

  //Variable
  cFormValue: any; //Component Form Value, form value that is independent to the component
  button_name: any = 'Simpan';
  button_name2: any = 'Example';
  button_name_print_doc = 'Cetak Dokumen'
  button_name_print_doc2 = 'Cetak Dokumen'
  errorType: any;
  tmpFocus: any;

  //Range Datepicker
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(
    private ref: ChangeDetectorRef,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private gbl: GlobalVariableService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 0);
  }

  ngOnInit() {
    this.cFormValue = this.formValue === undefined ? {} : JSON.parse(JSON.stringify(this.formValue))
    this.button_name = this.namaTombol === undefined ? this.button_name : this.namaTombol
    this.button_name2 = this.namaTombol2 === undefined ? this.button_name2 : this.namaTombol2
    this.button_name_print_doc = this.namaTombolPrintDoc === undefined ? this.button_name_print_doc : this.namaTombolPrintDoc
    this.button_name_print_doc2 = this.namaTombolPrintDoc2 === undefined ? this.button_name_print_doc2 : this.namaTombolPrintDoc2
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

  focusFunction(x, type) {
    x.target.style.background = 'yellow'
    if(type === 'datepicker' || type === 'datepicker-range'){
      this.tmpFocus = x
    }
  }

  focusOutFunction(x?, type?) {
    if (type === 'datepicker' || type === 'datepicker-range') {
      this.tmpFocus.target.style.background = ''
    } else {
      x.target.style.background = ''
    }
  }

  //Selection event (Select Box)
  selection(data, type, func?) {
    this.cFormValue[type] = data.target.value
    if (func !== undefined) {
      func(data.target.value)
    }
  }

  onBlur(d, ind, data, vOf, onF) {
    let fres = [], v = d.target.value.toUpperCase()
    fres = data.filter(each => each[ind] === v)
    if (fres.length > 0 && fres.length < 2) {
      for (var i = 0; i < vOf.length; i++) {
        this.cFormValue[vOf[i]] = fres[0][vOf[i]]
      }
      if (onF !== undefined && onF != null) {
        onF()
      }
    } else {
      for (var i = 0; i < vOf.length; i++) {
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

  printDoc(form) {
    this.prntDoc.emit(form)
  }

  printDoc2(form) {
    this.prntDoc2.emit(form)
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
    setTimeout(() => {
      this.ref.markForCheck()
      this.detailjurnal === undefined ? null : this.detailjurnal.checkChanges()
    }, 1);
  }

  checkChangesDetailTemplate() {
    this.detailjurnal === undefined ? null : this.detailjurnal.checkChangesTemplate()
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

  onDateSelect(e, type, func?) {
    this.cFormValue[type] = `${this.convertTime(e)}`
    if (func !== undefined) {
      func(`${this.convertTime(e)}`)
    }
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
        day: (date.getMonth() + 1) == 2 ? this.gbl.leapYear(date.getFullYear()) == false ? 28 : 29 :
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
        day: parseInt(d['m']) == 2 ? this.gbl.leapYear(parseInt(d['y'])) == false ? 28 : 29 :
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

  getdisableCustomDate(d?: any) {
    let pdata = Date.now()
    let date = pdata == null ? null : new Date(pdata)

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

  // Range Date Picker
  onDateSelection(date: NgbDate, type) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date/*  && date.after(this.fromDate) */) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
    this.cFormValue[type] = [
      this.fromDate,
      this.toDate
    ]
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || (this.toDate && date.equals(this.toDate)) || this.isInside(date) || this.isHovered(date);
  }

  validateInput(currentValue: NgbDate | null, input: string): NgbDate | null {
    const parsed = this.formatter.parse(input);
    return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
  }

  isArray(obj) {
    return Array.isArray(obj)
  }

}
