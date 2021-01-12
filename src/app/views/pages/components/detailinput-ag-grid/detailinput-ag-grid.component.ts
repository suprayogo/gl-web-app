import { Component, OnInit, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { DeleteRowButtonComponent } from '../cell-renderer/delete-row-button/delete-row-button.component';
import { EditRowButtonComponent } from '../cell-renderer/edit-row-button/edit-row-button.component';
import { formatDate } from '../../../../core/pipes/format-date';

@Component({
  selector: 'kt-detailinput-ag-grid',
  templateUrl: './detailinput-ag-grid.component.html',
  styleUrls: ['./detailinput-ag-grid.component.scss']
})
export class DetailinputAgGridComponent implements OnInit {

  @Input() tableColumn: Object[];
  @Input() tableData: Object[];
  @Input() tableRules: Object[];
  @Input() selectable: boolean;
  @Input() selected: Object[];
  @Input() selectIndicator: any;
  @Input() containerHeight: any;
  @Input() buttonLayout: Object[];
  @Input() statusLayout: Object[];
  @Input() buttonFuncParam: any;
  @Input() editable: boolean;
  @Input() pinnedBottomRowData: Object[] = [];
  @Output() selectRowEvent = new EventEmitter();
  @Output() editAction = new EventEmitter();
  @Output() deleteAction = new EventEmitter();

  @ViewChild('toMeasure',{static:false}) toMeasure: ElementRef

  //Ag grid variable
  containerStyle = {
    width: '100%',
    height: '0px'
  }

  title = 'app';

  columnDefs = [
    {headerName: 'Table Name', field: 'tableName', sortable: true, filter: true}
  ];

  rowData = [
  ];

  paginationPageSize = 25;
  multiSortKey = 'ctrl';

  frameworkComponents = {
    deleteButtonRenderer: DeleteRowButtonComponent,
    editButtonRenderer: EditRowButtonComponent
  }
  context = { componentParent: this }

  rowSelection = 'single';
  multiRowSelectWithClick = false;
  defaultColDef = { 
    resizable: true 
  };
  gridApi;
  gridColumnApi;
  rowClassRules;

  //Variables
  btnLayout: any;
  statLayout: any;

  constructor() { }

  ngOnInit() {

    if(this.containerHeight !== undefined){
      this.containerStyle.height = this.containerHeight + 'px'
    }else{
      this.containerStyle.height = 300 + 'px'
    }

    let colDef = [], colData =[]

    for(var i = 0; i < this.tableColumn.length; i++){
      let colIsDate = this.tableColumn[i]['date'] === undefined ? false : this.tableColumn[i]['date'],
          colIsNumber = this.tableColumn[i]['number'] === undefined ? false : this.tableColumn[i]['number'],
          absoluteNonNumber
      let colClass = ""
      if(colIsDate){
        colClass = colClass + " grid-date" 
      }else if(colIsNumber){
        colClass = colClass + " grid-number"
      }
      if(this.tableColumn[i]['number'] !== undefined){
        absoluteNonNumber = !this.tableColumn[i]['number']
      }
      let temp = {
        headerName: this.tableColumn[i]['label'],
        field: this.tableColumn[i]['value'],
        sortable: true,
        filter: true,
        headerCheckboxSelection: this.tableColumn[i]['selectable'] ? true : undefined,
        headerCheckboxSelectionFilteredOnly: this.tableColumn[i]['selectable'] ? true : undefined,
        checkboxSelection: this.tableColumn[i]['selectable'] ? true : undefined,
        cellClass: colClass !== "" ? colClass : (params) => {
          let temp
          try{
            temp = params.value.replace(".", "0")
          }catch(e){
            temp = params.value
          }
          return isNaN(temp) || absoluteNonNumber ? "" : "grid-number"
        },
        valueFormatter: colIsDate ? (params) => this.dateFormatter(params, this.getDateFormat(params.colDef.field)) : 
                          colIsNumber ? (params) => this.numberFormatter(params.value) :
                          undefined
      }

      colDef.push(temp)
    }

    if(this.selectable){
      this.rowSelection = 'multiple'
      this.multiRowSelectWithClick = true
    }

    colData = JSON.parse(JSON.stringify(this.tableData))

    if(this.tableRules.length > 0) {
      for(var i = 0; i < colData.length; i++){

        for(var j = 0; j < this.tableRules.length; j++){
          if(colData[i][this.tableRules[j]['target']] !== undefined && (this.tableRules[j]['redefined'] !== undefined || this.tableRules[j]['redefined'] != null)){
            if(typeof this.tableRules[j]['replacement'] === 'object'){
              colData[i][this.tableRules[j]['redefined']] = this.tableRules[j]['replacement'][colData[i][this.tableRules[j]['target']]] === undefined ? colData[i][this.tableRules[j]['target']] : this.tableRules[j]['replacement'][colData[i][this.tableRules[j]['target']]]
            }else{
              colData[i][this.tableRules[j]['redefined']] = this.tableRules[j]['replacement'](colData[i][this.tableRules[j]['target']])
            }
          }
        }

      }
    }

    if(!this.editable){
      colDef.splice(0, 0, {
        headerName: 'Action',
        field: 'action',
        cellRenderer: "deleteButtonRenderer"
      })
    }

    this.columnDefs = colDef
    this.rowData = colData

    this.btnLayout = this.buttonLayout
    this.statLayout = this.statusLayout

    this.rowClassRules = {
      'odd-row': function(params){
        return params.node.rowIndex % 2 !== 1 ? true : false
      }
    }
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    
    this.checkColumnFit()

    this.gridApi.setPinnedBottomRowData(this.pinnedBottomRowData)
  }

  checkColumnFit() {
    let containerWidth = this.toMeasure.nativeElement.offsetWidth
    let allCol = this.gridColumnApi.getAllColumns();

    var allColumnIds = [], totalColumnWidth = 0;
    allCol.forEach(function(column) {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds);
    allCol.forEach(function(column) {
      totalColumnWidth = totalColumnWidth + column.actualWidth
    })
    if(totalColumnWidth > containerWidth)
    this.gridColumnApi.autoSizeColumns(allColumnIds);
    else
    this.gridApi.sizeColumnsToFit();
  }

  onSelectionChanged(params) {
    if(this.selectRowEvent !== undefined && this.selectRowEvent != null){
      var selectedRows = this.gridApi.getSelectedRows();
      if(selectedRows.length > 0){
        this.selectRowEvent.emit(selectedRows[0]);
      }
    }
  }

  //Not used yet
  rowSelected(params) {
    if(this.selectRowEvent !== undefined && this.selectRowEvent != null){
      this.selectRowEvent.emit(params['data']);
    }
  }

  reset(){
    this.gridApi.deselectAll()
  }

  checkChanges(){
    if(this.statusLayout[0]['statLabel'] === ''){
      this.statLayout[0]['statLabel'] = ''
    }
    this.gridApi.setRowData(this.tableData)
  }

  editData(data){
    this.editAction.emit(data)
  }

  deleteData(data){
    this.deleteAction.emit(data)
  }

  //If Column header change
  columnChange(col) {
    let colDef = []
    for(var i = 0; i < col.length; i++){
      let temp = {
        headerName: col[i]['label'],
        field: col[i]['value'],
        sortable: true,
        filter: true,
        headerCheckboxSelection: col[i]['selectable'] ? true : undefined,
        headerCheckboxSelectionFilteredOnly: col[i]['selectable'] ? true : undefined,
        checkboxSelection: col[i]['selectable'] ? true : undefined
      }

      colDef.push(temp)
    }

    if(!this.editable){
      colDef.splice(0, 0, {
        headerName: 'Action',
        field: 'action',
        cellRenderer: "deleteButtonRenderer"
      })
    }

    this.columnDefs = colDef
  }

  getSelected(){
    return this.gridApi.getSelectedRows()
  }
  
  getDateFormat(val){
    for(var i = 0; i < this.tableColumn.length; i++){
      if(this.tableColumn[i]['value'] === val){
        
        return this.tableColumn[i]['dateFormat'] === undefined || this.tableColumn[i]['dateFormat'] == null ? null : this.tableColumn[i]['dateFormat'] 
      }
    }
  }

  dateFormatter(params, format){
    try{
      params.value.split("-")
      params.value.split(" ")
    }catch(e){
      return params.value
    }
    return formatDate(params.value, format == null ? undefined : format)
  }

  numberFormatter(amount, decimalCount = 0, decimal = ",", thousands = ".") {
    if(amount === '') return ''
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

  // BUTTON
  buttonClicked(x) {
    if (this.buttonFuncParam) {
      x.btnClick(this.buttonFuncParam)
    } else{
      x.btnClick()
    }
  }

}