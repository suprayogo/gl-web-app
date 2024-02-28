import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter, ChangeDetectorRef } from "@angular/core";
import { MatDialog } from "@angular/material";
import { formatDate } from "../../../../core/pipes/format-date";

@Component({
	selector: "kt-datatable-ag-grid",
	templateUrl: "./datatable-ag-grid.component.html",
	styleUrls: ["./datatable-ag-grid.component.scss"],
})
export class DatatableAgGridComponent implements OnInit {
	@Input() tableColumn: Object[];
	@Input() tableData: Object[];
	@Input() tableRules: Object[];
	@Input() selectable: boolean;
	@Input() selected: Object[];
	@Input() selectIndicator: any;
	@Input() buttonLayout: Object[];
	@Input() containerHeight: any;
	@Input() forceWithoutButton: boolean;
	@Input() filter: any;
	@Input() pagination: any;
	@Input() paginationPageSize: any;
	@Input() onDialog: boolean;
	@Output() selectRowEvent = new EventEmitter();
	@Output() onDialogClose = new EventEmitter();

	@ViewChild("toMeasure", { static: false }) toMeasure: ElementRef;

	//Ag grid variable
	containerStyle = {
		width: "100%",
		height: "0px",
	};

	title = "app";

	columnDefs = [{ headerName: "Table Name", field: "tableName", sortable: true, filter: true }];

	rowData = [{ tableName: "" }];

	filterStatus = true;
	pageStatus = true;
	pageSize = 25;

	multiSortKey = "ctrl";

	rowSelection = "single";
	multiRowSelectWithClick = false;
	defaultColDef = {
		resizable: true,
	};
	gridApi;
	gridColumnApi;
	rowClassRules;

	//Local variable
	btnLayout: Object[] = [];

	constructor(private dialog: MatDialog) // private ref: ChangeDetectorRef,
	{}

	ngOnInit() {
		this.filterStatus = this.filter == undefined || this.filter == null ? this.filterStatus : this.filter;
		this.pageStatus = this.pagination == undefined || this.pagination == null ? this.pageStatus : this.pagination;
		this.pageSize = this.paginationPageSize === undefined || this.paginationPageSize == null ? this.pageSize : this.paginationPageSize;
		if (this.containerHeight !== undefined) {
			this.containerStyle.height = this.containerHeight + "px";
		} else {
			let sHeight = document.documentElement.clientHeight;
			this.containerStyle.height = this.onDialog ? JSON.stringify(sHeight * 0.55 < 300 ? 300 : sHeight * 0.55) + "px" : JSON.stringify(sHeight * 1.5) + "px";
		}

		let colDef = [],
			colData = [];

		for (var i = 0; i < this.tableColumn.length; i++) {
			let colIsDate = this.tableColumn[i]["date"] === undefined ? false : this.tableColumn[i]["date"],
				colIsNumber = this.tableColumn[i]["number"] === undefined ? false : this.tableColumn[i]["number"];
			let colClass = "";
			if (colIsDate) {
				colClass = colClass + " grid-date";
			} else if (colIsNumber) {
				colClass = colClass + " grid-number";
			}

			let temp = {
				headerName: this.tableColumn[i]["label"],
				field: this.tableColumn[i]["value"],
				sortable: true,
				filter: true,
				headerCheckboxSelection: this.tableColumn[i]["selectable"] ? true : undefined,
				headerCheckboxSelectionFilteredOnly: this.tableColumn[i]["selectable"] ? true : undefined,
				checkboxSelection: this.tableColumn[i]["selectable"] ? true : undefined,
				cellClass: colClass,
				valueFormatter: colIsDate ? (params) => this.dateFormatter(params, this.getDateFormat(params.colDef.field)) : colIsNumber ? (params) => this.numberFormatter(params.value) : undefined,
			};
			colDef.push(temp);
		}

		if (this.selectable) {
			this.rowSelection = "multiple";
			this.multiRowSelectWithClick = true;
		}

		colData = JSON.parse(JSON.stringify(this.tableData));

		if (this.tableRules.length > 0) {
			for (var i = 0; i < colData.length; i++) {
				for (var j = 0; j < this.tableRules.length; j++) {
					if (colData[i][this.tableRules[j]["target"]] !== undefined && (this.tableRules[j]["redefined"] !== undefined || this.tableRules[j]["redefined"] != null)) {
						if (typeof this.tableRules[j]["replacement"] === "object") {
							colData[i][this.tableRules[j]["redefined"]] = this.tableRules[j]["replacement"][colData[i][this.tableRules[j]["target"]]] === undefined ? colData[i][this.tableRules[j]["target"]] : this.tableRules[j]["replacement"][colData[i][this.tableRules[j]["target"]]];
						} else {
							colData[i][this.tableRules[j]["redefined"]] = this.tableRules[j]["replacement"](colData[i][this.tableRules[j]["target"]]);
						}
					}
				}
			}
		}

		this.columnDefs = colDef;
		this.rowData = colData;

		this.btnLayout = this.buttonLayout;

		this.rowClassRules = {
			"odd-row": function (params) {
				return params.node.rowIndex % 2 !== 1 ? true : false;
			},
		};
	}

	onGridReady(params) {
		this.gridApi = params.api;
		this.gridColumnApi = params.columnApi;

		this.checkColumnFit();

		if (this.selectable) this.checkSelection();
	}

	checkColumnFit() {
		let containerWidth = this.toMeasure.nativeElement.offsetWidth;
		let allCol = this.gridColumnApi.getAllColumns();

		var allColumnIds = [],
			totalColumnWidth = 0;
		allCol.forEach(function (column) {
			allColumnIds.push(column.colId);
		});
		this.gridColumnApi.autoSizeColumns(allColumnIds);
		allCol.forEach(function (column) {
			totalColumnWidth = totalColumnWidth + column.actualWidth;
		});
		if (totalColumnWidth > containerWidth) this.gridColumnApi.autoSizeColumns(allColumnIds);
		else this.gridApi.sizeColumnsToFit();
	}

	onSelectionChanged(params) {
		if (this.selectRowEvent !== undefined && this.selectRowEvent != null) {
			var selectedRows = this.gridApi.getSelectedRows();
			if (selectedRows.length > 0) {
				if (!this.selectable) this.selectRowEvent.emit(selectedRows[0]);
			}
		}
	}

	checkSelection() {
		this.gridApi.forEachNode((node) => {
			for (var i = 0; i < this.selected.length; i++) {
				if (typeof this.selectIndicator === "string") {
					if (this.selected[i][this.selectIndicator] === node.data[this.selectIndicator]) {
						node.setSelected(true);
						break;
					}
				} else {
					break;
				}
			}
		});
	}

	//Not used yet
	rowSelected(params) {
		if (this.selectRowEvent !== undefined && this.selectRowEvent != null) {
			if (!this.selectable) this.selectRowEvent.emit(params["data"]);
		}
	}

	reset() {
		this.gridApi.deselectAll();
	}

	getSelected() {
		return this.gridApi.getSelectedRows();
	}

	submitSelection() {
		this.selectRowEvent.emit(this.gridApi.getSelectedRows());
	}

	cancelSelection() {
		this.dialog.closeAll();
		if (this.onDialogClose !== undefined && this.onDialogClose != null) {
			this.onDialogClose.emit();
		}
	}

	getDateFormat(val) {
		for (var i = 0; i < this.tableColumn.length; i++) {
			if (this.tableColumn[i]["value"] === val) {
				return this.tableColumn[i]["dateFormat"] === undefined || this.tableColumn[i]["dateFormat"] == null ? null : this.tableColumn[i]["dateFormat"];
			}
		}
	}

	dateFormatter(params, format) {
		return params.value === undefined || params.value == null ? "" : formatDate(params.value, format == null ? undefined : format);
	}

	numberFormatter(amount, decimalCount = 0, decimal = ",", thousands = ".") {
		try {
			decimalCount = Math.abs(decimalCount);
			decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

			const negativeSign = amount < 0 ? "-" : "";

			let i: any = parseInt((amount = Math.abs(Number(amount) || 0).toFixed(decimalCount))).toString();
			let j = i.length > 3 ? i.length % 3 : 0;

			return (
				negativeSign +
				(j ? i.substr(0, j) + thousands : "") +
				i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
				(decimalCount
					? decimal +
					  Math.abs(amount - i)
							.toFixed(decimalCount)
							.slice(2)
					: "")
			);
		} catch (e) {}
	}
}
