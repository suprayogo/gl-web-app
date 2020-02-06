import { Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'kt-forminput',
  templateUrl: './forminput.component.html',
  styleUrls: ['./forminput.component.scss']
})
export class ForminputComponent implements OnInit {

  @Input() inputLayout: any;
  @Input() formValue: any;
  @Input() buttonLayout: any;
  @Input() tableColumn: any;
  @Input() tableData: any;
  @Input() tableRules: any;
  @Input() editable: any;
  @Input() detailLoad: boolean;
  @Input() enableDetail: boolean;
  @Input() onUpdate: any;
  @Input() enableDelete: boolean;
  
  @Output() onSubmit = new EventEmitter();
  @Output() onCancel = new EventEmitter();
  @Output() deleteData = new EventEmitter();
  @Output() editAction = new EventEmitter();
  @Output() deleteAction = new EventEmitter();

  //Variable
  cFormValue: any; //Component Form Value, form value that is independent to the component
  errorType: any;

  constructor(
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cFormValue = JSON.parse(JSON.stringify(this.formValue))
  }

  getData() {
    return this.cFormValue
  }
  
  formSubmit(form) {
    this.onSubmit.emit(form)
  }

  onReset(){
    this.onCancel.emit()
  }

  delData(){
    this.deleteData.emit()
  }

  editDetailData(data){
    this.editAction.emit(data)
  }

  delDetailData(data){
    this.deleteAction.emit(data)
  }

  checkChanges() {
    this.cFormValue = JSON.parse(JSON.stringify(this.formValue))
  }

}
