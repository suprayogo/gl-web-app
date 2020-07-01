import { Component, OnInit, ChangeDetectionStrategy, Inject, ChangeDetectorRef, ViewChild, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { NgbTimeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { TimeStringAdapter } from '../../time-adapter.module';
import { DatatableAgGridComponent } from '../datatable-ag-grid/datatable-ag-grid.component';
import { DetailinputAgGridComponent } from '../detailinput-ag-grid/detailinput-ag-grid.component';
import { DetailJurnalComponent } from '../detail-jurnal/detail-jurnal.component';

@Component({
  selector: 'kt-inputdialog',
  templateUrl: './inputdialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./inputdialog.component.scss', '../datatable-ag-grid/datatable-ag-grid.component.scss'],
  providers: [{provide: NgbTimeAdapter, useClass: TimeStringAdapter}]
})
export class InputdialogComponent implements OnInit {

  // @ViewChild(DatatableComponent) datatable;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;
  @ViewChild(DetailinputAgGridComponent, { static: false }) detailinput;
  @ViewChild(DetailJurnalComponent, { static: false }) detailjurnal;

  inputLayout: Object[] = [];
  buttonLayout: Object[] = [];
  formValue: Object = {};
  inputPipe: any;
  onBlur: any;
  openDialog: any;
  onSubmit: any;
  deleteData: any;
  rejectData: any;
  customBtn: string = "";
  listAvailable: boolean = false;
  listForm: Object = {}
  lowLoading: boolean = false;
  comparison: boolean = false;
  compareForm: string = "";
  comparedForm: string = "";
  compareLayout: Object[] = [];
  comparedLayout: Object[] = [];
  selectableDatatable: boolean = false;
  selectableDisplayColumns = [];
  selectableInterface = {};
  selectableData = [];
  selectableDataRules = [];
  selectIndicator: any;
  selected: Object[] = [];
  noButton: boolean = true;
  cWidth: any = null;
  uniqueId: any = null;
  uniqueForm: any = [];
  uniqueFunc: any = null;
  uniqueUnFunc: any = null;
  onUpdate: boolean = false;
  addable: boolean = false;
  detailButtonLayout: Object[] = [];
  isDetail: boolean = false;
  editable: boolean = false;
  buttonName: any;
  buttonName2: any;
  noButtonSave: boolean;
  button2: boolean;
  title = false;

  //Detail loading variable
  // @Input() enableDetail: boolean;
  detailLoad: boolean;
  detailJurnal: boolean; 
  jurnalDataAkun: any;
  jurnalData: any;
  noEditJurnal: boolean;
  
  constructor(
    public dialogRef: MatDialogRef<InputdialogComponent>,
    @Inject(MAT_DIALOG_DATA) public parameter: any,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.detailLoad = this.parameter.detailLoad
    this.detailJurnal = this.parameter.detailJurnal
    this.jurnalDataAkun = this.parameter.jurnalDataAkun
    this.jurnalData = this.parameter.jurnalData
    this.noEditJurnal = this.parameter.noEditJurnal
    this.buttonName = this.parameter.buttonName === undefined ? "Simpan" : this.parameter.buttonName
    this.buttonName2 = this.parameter.buttonName2 === undefined ? "Simpan" : this.parameter.buttonName2
    this.noButtonSave = this.parameter.noButtonSave
    this.button2 = this.parameter.button2
    this.formValue = this.parameter.formValue
    this.inputLayout = this.parameter.inputLayout
    this.buttonLayout = this.parameter.buttonLayout
    this.inputPipe = this.parameter.inputPipe
    this.onBlur = this.parameter.onBlur
    this.openDialog = this.parameter.openDialog
    this.onSubmit = this.parameter.onSubmit
    this.deleteData = () => this.onDelete()
    this.rejectData = () => this.rejectList()
    this.customBtn = this.parameter.customBtn
    this.listAvailable = this.parameter.listAvailable
    this.listForm = this.parameter.listForm
    this.lowLoading = this.parameter.lowLoader
    this.comparison = this.parameter.comparison
    this.selectableDatatable = this.parameter.selectableDatatable
    if(this.comparison){
      this.compareForm = this.parameter.compareForm
      this.comparedForm = this.parameter.comparedForm
      this.compareLayout = this.parameter.compareLayout
      this.comparedLayout = this.parameter.comparedLayout
    }else if(this.selectableDatatable){
      this.selectableDisplayColumns = this.parameter.selectableDisplayColumns
      this.selectableInterface = this.parameter.selectableInterface
      this.selectableData = this.parameter.selectableData
      this.selectableDataRules = this.parameter.selectableDataRules
      this.selectIndicator = this.parameter.selectIndicator
      this.selected = this.parameter.selected
      this.noButton = this.parameter.noButton

    }
    if(this.parameter.checkUponInit == true) this.initCheck()
    this.cWidth = this.parameter.width === undefined ? null : this.parameter.width
    this.uniqueId = this.parameter.uniqueId === undefined ? null : this.parameter.uniqueId
    this.uniqueForm = this.parameter.uniqueForm === undefined ? [] : this.parameter.uniqueForm
    this.uniqueFunc = this.parameter.uniqueFunc === undefined ? null : this.parameter.uniqueFunc
    this.uniqueUnFunc = this.parameter.uniqueUnFunc === undefined ? null : this.parameter.uniqueUnFunc
    this.onUpdate = this.parameter.onUpdate == null || this.parameter.onUpdate === undefined ? false : this.parameter.onUpdate
    this.addable = this.parameter.addable == null || this.parameter.addable === undefined ? false : this.parameter.addable
    this.detailButtonLayout = this.parameter.detailButtonLayout == null || this.parameter.detailButtonLayout === undefined ? [] : this.parameter.detailButtonLayout
    this.isDetail = this.parameter.isDetail == null || this.parameter.isDetail === undefined ? false : this.parameter.isDetail
    this.editable = this.parameter.editable == null || this.parameter.editable === undefined ? false : this.parameter.editable
  }

  onDelete() {
    this.parameter.deleteData()
  }

  rejectList() {
    this.parameter.rejectData()
  }

  closeDialog(t?){
    if(this.comparison == true){
      this.resetWholeCompare()
    }
    this.dialogRef.close({
      closeByButton: true
    })
    this.parameter.resetForm()
  }

  initCheck(){
    setTimeout(() => this.checkChanges(), 0)
  }

  checkChanges(){
    this.ref.markForCheck()
  }

  getValue(compareForm, index, valueOf){
    return this.formValue[compareForm][index][valueOf]
  }

  parseInteger(compareForm, index, valueOf){
    return parseInt(this.formValue[compareForm][index][valueOf])
  }

  lockCompare(data, index) {
    this.parameter.compareLock(data, index)
  }

  unlockCompare(data, index) {
    this.parameter.compareUnlock(data, index)
  }

  compareCancel(data, index) {
    this.parameter.compareCancel(data, index)
  }

  resetWholeCompare() {
    for(var i = 0; i< this.formValue[this.compareForm].length; i++){
      this.resetCompare(i)
    }
  }

  resetCompare(index) {
    this.parameter.compareReset(index)
  }

  onCompareChange(comparedForm, valueOf, index, data){

    this.parameter.compareChange(comparedForm, valueOf, index, data)

  }

  dialogRowSelect(data){
    this.dialogRef.close(data)
  }

  getSelected(){
    if(this.isDetail)
    return this.detailinput === undefined || this.detailinput == null ? null : this.detailinput.getSelected()
    else
    return this.datatable === undefined || this.datatable == null ? null : this.datatable.getSelected()
  }

  //Convert NG Date picker result
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
    this.formValue[type] = `${this.convertTime(e)}`
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

  reverseConvertTime(data) {
    let date = new Date(data)

    return JSON.stringify(date.getTime())
  }

  getDateNow() {
    let date = new Date(Date.now())

    return date.getFullYear() + '-' + date.getMonth() + 1 + '-' + String(date.getDate()).padStart(2,"0")
  }

  getTimeNow(offset?: number) {
    let pdata = Date.now()
    let date = pdata == null ? null : new Date(pdata)
    if(!offset)
    return date == null ? '' : `${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getHours() < 10 ? '0'+date.getMinutes() : date.getMinutes()}:00`
    else
    return date == null ? '' : `${date.getHours() + offset < 10 ? '0' + (date.getHours() + offset) : date.getHours() + offset}:${date.getHours() < 10 ? '0'+date.getMinutes() : date.getMinutes()}:00`
  }

  getMinToday(c_data?: any) {
    if(c_data !== undefined || c_data != null){
      let pdata = parseInt(this.formValue[c_data])
      let date = pdata == null ? null : new Date(pdata)
  
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    }else{
      let pdata = Date.now()
      let date = pdata == null ? null : new Date(pdata)
  
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    }
  }

  getSumOfData(value) {
    let t = 0
    for(var k in this.listForm){
      t = t + (parseInt(this.listForm[k][value]) > 0 ? parseInt(this.listForm[k][value]) : 0)
    }
    return t
  }

  formatMoney(amount, decimalCount = 0, decimal = ",", thousands = ".") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
  
      const negativeSign = amount < 0 ? "-" : "";
  
      let i: any = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;
  
      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {
      
    }
  }

  // UANG JALAN UNIQUE FUNCTION
  getTotalBayarTahap() {
    let t = 0
    if(Array.isArray(this.uniqueForm)){
      for(var i = 0; i < this.uniqueForm.length; i++){
        t = t + (parseInt(this.uniqueForm[i]['nilai_bayar']) > 0 ? parseInt(this.uniqueForm[i]['nilai_bayar']) : 0)
      }
    }
    return t
  }

  editDetailData(data) {
    this.parameter.editDetailData === undefined || this.parameter.editDetailData == null ? null : this.parameter.editDetailData(data)
  }

  deleteDetailData(data) {
    this.parameter.deleteDetailData(data)
  }

  resetValue(t, v) {
    this.formValue[t] = v
  }
}
