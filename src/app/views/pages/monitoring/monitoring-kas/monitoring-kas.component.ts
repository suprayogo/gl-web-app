// Add Library
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from "@angular/core";
import { MatDialog } from "@angular/material";
// Add Service
import { RequestDataService } from "../../../../service/request-data.service";
import { GlobalVariableService } from "../../../../service/global-variable.service";
// Add Component
import { ForminputComponent } from "../../components/forminput/forminput.component";
import { DatatableAgGridComponent } from "../../components/datatable-ag-grid/datatable-ag-grid.component";
import { InputdialogComponent } from "../../components/inputdialog/inputdialog.component";
import { NgForm } from "@angular/forms";

@Component({
	selector: "kt-monitoring-kas",
	templateUrl: "./monitoring-kas.component.html",
	styleUrls: ["./monitoring-kas.component.scss", "../monitoring.style.scss"],
})
export class MonitoringKasComponent implements OnInit, AfterViewInit {
	// View Child
	@ViewChild(ForminputComponent, { static: false }) forminput;
	@ViewChild(DatatableAgGridComponent, { static: false }) datatable;

	// Global Service Variable
	subsCompany: any; // Subscription for Akses Perusahaan
	kodePerusahaan: any; // Contain Data Perusahaan Aktif
	pinnedBottom: any[] = [];

	// Load Variable
	menuload: boolean = true;
	tableLoad: boolean = false;

	// Contain Data Variable
	dataCompany: any; // Contain Data Company
	inputCabangData = [];
	inputPeriodeData = [];
	browseData = []; // Contain Data Result
	formValue = {
		kode_cabang: "",
		nama_cabang: "",
	};
	// Display Columns Table Variable
	inputCabangDisplayColumns = [
		// Display For Input Data Cabang
		{
			label: "Kode Cabang",
			value: "kode_cabang",
		},
		{
			label: "Nama Cabang",
			value: "nama_cabang",
		},
	];
	displayColumns = [
		{
			label: "Cabang",
			value: "kode_cabang",
		},
		{
			label: "COA",
			value: "nama_akun",
		},
		{
			label: "Kas",
			value: "saldo_kas",
			number: true,
			float: 2
		},
		{
			label: "Bank",
			value: "saldo_bank",
			number: true,
			float: 2
		},
	];

	// Display Layout Form Variable
	inputLayout = [
		{
			labelWidth: "col-3",
			formWidth: "col-9",
			label: "Cabang",
			id: "kode-cabang",
			type: "inputgroup",
			click: (type) => this.inputGroup(type),
			btnIcon: "flaticon-search",
			browseType: "cabang",
			valueOf: "kode_cabang",
			required: false,
			readOnly: true,
			inputInfo: {
				id: "nama-cabang",
				disabled: false,
				readOnly: true,
				required: false,
				valueOf: "nama_cabang",
			},
			disabled: false,
		},
	];

	// Columns Table Rules Variable
	browseDataRules = [];

	constructor(
		// Library
		private ref: ChangeDetectorRef,
		public dialog: MatDialog,
		// Service
		private request: RequestDataService,
		private gbl: GlobalVariableService
	) {}

	ngOnInit() {
		this.gbl.need(true, false); // Show-Hide Perusahaan & Periode
		this.getCompany(); // Subs Company Active
		this.reqData(); // Request Mandatory Data
	}

	ngAfterViewInit(): void {
		this.kodePerusahaan = this.gbl.getKodePerusahaan();

		if (this.kodePerusahaan !== "") {
			this.reqData(); // Request Mandatory Data
		}
	}

	ngOnDestroy(): void {
		this.subsCompany === undefined ? null : this.subsCompany.unsubscribe();
	}

	// Subs Company Active
	getCompany() {
		this.subsCompany = this.gbl.change.subscribe((value) => {
			this.kodePerusahaan = value;
			this.ref.markForCheck();

			if (this.kodePerusahaan !== "") {
				this.reqData();
			}
		});
	}

	// Request Mandatory Data
	reqData() {
		if (this.kodePerusahaan != undefined && this.kodePerusahaan != null && this.kodePerusahaan !== "") {
			this.request.apiData("cabang", "g-cabang-akses", { kode_perusahaan: this.kodePerusahaan }).subscribe((data) => {
				if (data["STATUS"] === "Y") {
					this.ref.markForCheck();
					this.inputCabangData = data["RESULT"];
					this.reqDataKas();
				} else {
					this.gbl.openSnackBar("Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.", "fail");
				}
			});
		}
	}

	reqDataKas(kdCabang?: String) {
		let reqParam = {
			kode_perusahaan: this.kodePerusahaan,
			kode_cabang: kdCabang != undefined || kdCabang != null ? kdCabang : "",
		};
		this.request.apiData("jenis-transaksi", "g-monitoring-kas", reqParam).subscribe((data) => {
			if (data["STATUS"] === "Y") {
				this.ref.markForCheck();
				this.browseData = data["RESULT"];
				this.pinnedBottom = this.createDataFooter(this.browseData);
				this.menuload = false;
				this.tableLoad = false;
			} else {
				this.gbl.openSnackBar("Gagal mendapatkan data kas. Mohon coba lagi nanti.", "fail");
			}
		});
	}

	onSubmit(inputForm: NgForm) {
		if (this.forminput !== undefined) {
			if (inputForm.valid) {
				if ((JSON.stringify(this.formValue) === JSON.stringify(this.forminput.getData())) == false) {
					this.tableLoad = true;
					this.reqDataKas(this.forminput.getData().kode_cabang); // Get Data Report
				} else {
					this.tableLoad = true;
					setTimeout(() => {
						this.ref.markForCheck();
						this.tableLoad = false;
					}, 750);
				}
			}
		}
	}

	selectRow(data) {
		let x = JSON.parse(JSON.stringify(data));
	}

	inputGroup(type?: any) {
		let data = [
				{
					type: type,
					title: "Data Cabang",
					columns: this.inputCabangDisplayColumns,
					contain: this.inputCabangData,
					rules: [],
					interface: {},
				},
			],
			setting = {
				width: "50vw",
				posTop: "30px",
			},
			input = this.gbl.openDialog(type, data, this.formValue, setting);
		input.afterClosed().subscribe((result) => {
			if (result) {
				if (type === "cabang") {
					this.forminput.updateFormValue("kode_cabang", result["kode_cabang"]);
					this.forminput.updateFormValue("nama_cabang", result["nama_cabang"]);
				}
			}
			this.ref.markForCheck();
		});
	}

	formInputCheckChanges() {
		setTimeout(() => {
			this.ref.markForCheck();
			this.forminput === undefined ? null : this.forminput.checkChanges();
		}, 1);
	}

	createDataFooter(data?: any[]) {
		let sumKas = 0, sumBank = 0
		for (let i = 0; i < data.length; i++) {
			sumKas = sumKas + parseFloat(JSON.stringify(data[i]['saldo_kas']))
			sumBank = sumBank + parseFloat(JSON.stringify(data[i]['saldo_bank']))
		}
		var result: any[] = [];
		result.push({
			kode_cabang: "",
			nama_akun: " GRAND TOTAL ",
			saldo_kas: sumKas,
			saldo_bank: sumBank
		});
		return result;
	}
}
