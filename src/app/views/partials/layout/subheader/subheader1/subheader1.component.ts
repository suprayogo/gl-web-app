// Angular
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
// RxJS
import { Subscription } from 'rxjs';
// Layout
import { SubheaderService } from '../../../../../core/_base/layout';
import { Breadcrumb } from '../../../../../core/_base/layout/services/subheader.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../../../../../views/pages/components/dialog/dialog.component';
import { AlertdialogComponent } from '../../../../../views/pages/components/alertdialog/alertdialog.component';
import { RequestDataService } from '../../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../../service/global-variable.service';
import { InputdialogComponent } from '../../../../pages/components/inputdialog/inputdialog.component';
import { ConfirmationdialogComponent } from '../../../../pages/components/confirmationdialog/confirmationdialog.component';

@Component({
	selector: 'kt-subheader1',
	templateUrl: './subheader1.component.html',
	styleUrls: ['./subheader1.component.scss']
})
export class Subheader1Component implements OnInit, OnDestroy, AfterViewInit {

	@ViewChild(ConfirmationdialogComponent, { static: false }) confirm;

	// Public properties
	@Input() fluid: boolean;
	@Input() clear: boolean;

	tooltip: any = "Periode Aktif"

	subscription: any;
	kp_V1: any;
	kp_V2: any;

	// PERUSAHAAN
	today: number = Date.now();
	kode_perusahaan: string = ""
	nama_perusahaan: string = ""
	daftar_perusahaan = []

	// PERIODE
	id_periode: string = ""
	idPeriodeAktif: string = ""
	tahun_periode: string = ""
	tahunPeriodeAktif: string = ""
	bulan_periode: string = ""
	bulanPeriodeAktif: string = ""
	nama_bulan: string = ""
	nama_bulan_aktif: string = ""
	noActive: boolean;
	
	// title: string = '';
	// desc: string = '';
	// breadcrumbs: Breadcrumb[] = [];

	// Private properties
	// private subscriptions: Subscription[] = [];

	formD = {
		kode_perusahaan: ''
	}
	//Configuration
	tahun = [
		{
			label: '-',
			value: '-'
		}
	]

	bulan = [
		{
			label: '-',
			value: '-'
		}
	]

	// Input Name
	formValue = {
		tahun_periode: '',
		bulan_periode: ''
	}

	// PERUSAHAAN
	inputPerusahaanDisplayColumns = [
		{
			label: 'Kode Perusahaan',
			value: 'kode_perusahaan'
		},
		{
			label: 'Nama Perusahaan',
			value: 'nama_perusahaan'
		}
	];

	inputPerusahaanInterface = {
		user_id: 'string',
		kode_perusahaan: 'string',
		nama_perusahaan: 'string'
	}
	inputPerusahaanData = []
	inputPerusahaanDataRules = []

	// PERIODE
	inputPeriodeData = []
	changePeriodeData = []

	//Confirmation Variable
	c_buttonLayout = [
		{
			btnLabel: 'Ubah Periode',
			btnClass: 'btn btn-primary',
			btnClick: (set) => {
				this.setPeriod(set)
			},
			btnCondition: () => {
				return true
			}
		},
		{
			btnLabel: 'Tutup',
			btnClass: 'btn btn-secondary',
			btnClick: () => {
				this.dialog.closeAll()
			},
			btnCondition: () => {
				return true
			}
		}
	]
	c_labelLayout = [
		{
			content: '',
			style: {
				'color': 'red',
				'font-size': '20px',
				'font-weight': 'bold'
			}
		}
	]

	c_inputLayout = [
		{
			label: 'Tahun',
			id: 'tahun-periode',
			type: 'combobox',
			options: this.tahun,
			cekBulan: (filterBulan) => this.getBulan(filterBulan, ''),
			valueOf: this.formValue.tahun_periode,
			required: true,
			readOnly: false,
			disabled: false,
		},
		{
			label: 'Bulan',
			id: 'bulan-periode',
			type: 'combobox',
			options: this.bulan,
			valueOf: this.formValue.bulan_periode,
			required: true,
			readOnly: false,
			disabled: false,
		}
	]

	constructor(
		public subheaderService: SubheaderService,
		private ref: ChangeDetectorRef,
		private dialog: MatDialog,
		private request: RequestDataService,
		private gbl: GlobalVariableService
	) {
	}

	ngOnInit() {
		let u_id = localStorage.getItem('user_id')
		if (u_id !== undefined && u_id != null && u_id !== '') {

			//PERUSAHAAN
			// this.request.apiData('user', 'g-user-perusahaan', { user_id: u_id }).subscribe(
			// 	data => {
			// 		if (data['STATUS'] === 'Y') {
			// 			this.inputPerusahaanData = data['RESULT']
			// 			if (this.inputPerusahaanData.length > 0) {
			// 				this.gbl.setPerusahaan(this.inputPerusahaanData[0]['kode_perusahaan'], this.inputPerusahaanData[0]['nama_perusahaan'])
			// 				this.kode_perusahaan = this.gbl.getKodePerusahaan()
			// 				this.nama_perusahaan = this.gbl.getNamaPerusahaan()
			// 				this.ref.markForCheck()
			// 				for (var i = 0; i < this.inputPerusahaanData.length; i++) {
			// 					let t = {
			// 						label: this.inputPerusahaanData[i]['nama_perusahaan'],
			// 						value: this.inputPerusahaanData[i]['kode_perusahaan']
			// 					}
			// 					this.daftar_perusahaan.push(t)
			// 				}
			// 				this.formD.kode_perusahaan = this.kode_perusahaan
			// 			}
			// 		} else {
			// 			this.openSnackBar('Gagal mendapatkan daftar akses perusahaan.', 'fail', null)
			// 		}
			// 	}
			// )

			//GET PERUSAHAAN DAN PERIODE
			// this.reqKodePerusahaan()

		} else {
			// this.openSnackBar(
			// 	'Gagal mendapatkan ID User anda. Mohon melakukan login terlebih dahulu.',
			// 	'info',
			// 	() => {
			// 		localStorage.clear()
			// 		window.location.href = "/auth/login"
			// 	}
			// )
		}
	}

	ngAfterViewInit(): void {
		// this.subscriptions.push(this.subheaderService.title$.subscribe(bt => {
		// 	// breadcrumbs title sometimes can be undefined
		// 	if (bt) {
		// 		Promise.resolve(null).then(() => {
		// 			this.title = bt.title;
		// 			this.desc = bt.desc;
		// 			this.ref.markForCheck()
		// 		});
		// 	}
		// }));

		// this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe(bc => {
		// 	Promise.resolve(null).then(() => {
		// 		this.breadcrumbs = bc;
		// 	});
		// }));

		// this.kp_V2 = this.gbl.getKodePerusahaan()
		// if (this.kp_V2 !== "") {
		// 	this.madeRequest()
		// }
		// this.ref.markForCheck()
	}

	ngOnDestroy(): void {
		// this.subscriptions.forEach(sb => sb.unsubscribe());
		this.subscription === undefined ? null : this.subscription.unsubscribe()
	}

	reqKodePerusahaan() {
		this.subscription = this.gbl.change.subscribe(
			value => {
				this.kp_V1 = value

				// PERIODE
				if (this.kp_V1 !== "") {
					this.madeRequest()
				}
				this.ref.markForCheck()
			}
		)
	}

	madeRequest() {
		/* this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kp_V1 == undefined ? this.kp_V2 : this.kp_V1 }).subscribe(
			data => {
				if (data['STATUS'] === 'Y') {
					this.inputPeriodeData = data['RESULT']
					this.changePeriodeData = data['RESULT']
					if (this.inputPeriodeData.length > 0) {
						const activePeriod = this.inputPeriodeData.filter(x => x.aktif === '1')[0] || {}
						this.gbl.setPeriode(activePeriod['id_periode'], activePeriod['tahun_periode'], activePeriod['bulan_periode'])
						this.id_periode = this.gbl.getIdPeriode()
						this.tahun_periode = this.gbl.getTahunPeriode()
						this.bulan_periode = this.gbl.getBulanPeriode()
						this.nama_bulan = this.gbl.getNamaBulan(this.bulan_periode)

						this.gbl.periodeAktif(activePeriod['id_periode'], activePeriod['tahun_periode'], activePeriod['bulan_periode'], '')
						this.idPeriodeAktif = this.gbl.getIdPeriodeAktif()
						this.tahunPeriodeAktif = this.gbl.getTahunPeriodeAktif()
						this.bulanPeriodeAktif = this.gbl.getBulanPeriodeAktif()
						this.nama_bulan_aktif = this.gbl.getNamaBulanAktif(this.bulanPeriodeAktif)
						this.ref.markForCheck()
					}

					//   this.loading = false
					this.getActivePeriodDialog()
					this.ref.markForCheck()
				} else {
					//   this.loading = false
					this.inputPeriodeData = []
					this.changePeriodeData = []
					this.gbl.setPeriode('', '', '')
					this.id_periode = this.gbl.getIdPeriode()
					this.tahun_periode = this.gbl.getTahunPeriode()
					this.bulan_periode = this.gbl.getBulanPeriode()
					this.nama_bulan = ''
					this.gbl.periodeAktif('', '', '', '')
					this.idPeriodeAktif = this.gbl.getIdPeriodeAktif()
					this.tahunPeriodeAktif = this.gbl.getTahunPeriodeAktif()
					this.bulanPeriodeAktif = this.gbl.getBulanPeriodeAktif()
					this.ref.markForCheck()
					this.openSnackBar('Gagal mendapatkan data periode.', 'fail')
				}
			}
		) */
	}

	getActivePeriodDialog() {
		let x = []

		var flags = [],
			outputTahun = [];

		for (var i = 0; i < this.inputPeriodeData.length; i++) {
			if (flags[this.inputPeriodeData[i]['tahun_periode']]) continue;
			flags[this.inputPeriodeData[i]['tahun_periode']] = true;
			x.push(this.inputPeriodeData[i]['tahun_periode'])
			outputTahun.push({
				label: this.inputPeriodeData[i]['tahun_periode'],
				value: this.inputPeriodeData[i]['tahun_periode']
			});
		}

		let tmp = {}
		for (var i = 0; i < x.length; i++) {
			tmp[x[i]] = []
			for (var j = 0; j < this.inputPeriodeData.length; j++) {

				if (this.inputPeriodeData[j]['tahun_periode'] === x[i]) {
					flags[this.inputPeriodeData[j]['bulan_periode']] = true;
					tmp[x[i]].push({
						label: this.inputPeriodeData[j]['bulan_periode'],
						value: this.inputPeriodeData[j]['bulan_periode']
					})
				}
			}

		}

		this.tahun = outputTahun
		this.formValue = {
			tahun_periode: this.tahun_periode,
			bulan_periode: this.bulan_periode
		}
		this.bulan = tmp[this.tahun_periode]
		this.c_inputLayout.splice(0, 2,
			{
				label: 'Tahun',
				id: 'tahun-periode',
				type: 'combobox',
				options: this.tahun,
				cekBulan: (filterBulan) => this.getBulan(filterBulan, tmp),
				valueOf: 'tahun_periode',
				required: true,
				readOnly: false,
				disabled: false,
			},
			{
				label: 'Bulan',
				id: 'bulan-periode',
				type: 'combobox',
				options: this.bulan,
				valueOf: 'bulan_periode',
				required: true,
				readOnly: false,
				disabled: false,
			},
		)
	}

	getBulan(filterBulan, loopBulan) {

		this.bulan = loopBulan[filterBulan]
		this.c_inputLayout.splice(0, 2,
			{
				label: 'Tahun',
				id: 'tahun-periode',
				type: 'combobox',
				options: this.tahun,
				cekBulan: (filterBulan) => this.getBulan(filterBulan, loopBulan),
				valueOf: 'tahun_periode',
				required: true,
				readOnly: false,
				disabled: false,
			},
			{
				label: 'Bulan',
				id: 'bulan-periode',
				type: 'combobox',
				options: this.bulan,
				valueOf: 'bulan_periode',
				required: true,
				readOnly: false,
				disabled: false,
			},
		)
	}

	gantiPerusahaan() {
		// const dialogRef = this.dialog.open(DialogComponent, {
		// 	width: 'auto',
		// 	height: 'auto',
		// 	maxWidth: '95vw',
		// 	maxHeight: '95vh',
		// 	data: {
		// 		type: '',
		// 		title: 'Daftar Perusahaan',
		// 		tableInterface: this.inputPerusahaanInterface,
		// 		displayedColumns: this.inputPerusahaanDisplayColumns,
		// 		tableData: this.inputPerusahaanData,
		// 		tableRules: this.inputPerusahaanDataRules,
		// 		formValue: {},
		// 	}
		// });

		// dialogRef.afterClosed().subscribe(result => {
		// 	if (result) {
		// 		this.gbl.setPerusahaan(result.kode_perusahaan, result.nama_perusahaan)
		// 		this.kode_perusahaan = this.gbl.getKodePerusahaan()
		// 		this.nama_perusahaan = this.gbl.getNamaPerusahaan()
		// 		this.ref.markForCheck();
		// 	}
		// });
		let inpD = [
			{
				formWidth: 'col-5',
				label: 'Perusahaan',
				id: 'kode_perusahaan',
				type: 'combobox',
				options: this.daftar_perusahaan,
				valueOf: 'kode_perusahaan',
				change: (e) => {
					let v = e.target.value
					this.formD.kode_perusahaan = v
				},
				update: {
					disabled: false
				}
			}
		]
		const dialogRef = this.dialog.open(InputdialogComponent, {
			width: 'auto',
			height: 'auto',
			maxWidth: '95vw',
			maxHeight: '95vh',
			data: {
				formValue: this.formD,
				inputLayout: inpD,
				buttonLayout: [],
				inputPipe: (t, d) => null,
				onBlur: (t, v) => null,
				openDialog: (t) => null,
				resetForm: () => this.resetDetailForm(),
				onSubmit: () => this.submitDetailData(),
				deleteData: () => null,
			},
			disableClose: true
		});

		dialogRef.afterClosed().subscribe(
			result => {
			},
			error => null,
		);
	}

	submitDetailData() {
		let k = this.formD['kode_perusahaan'], n = ""
		for (var i = 0; i < this.inputPerusahaanData.length; i++) {
			if (this.inputPerusahaanData[i]['kode_perusahaan'] === k) {
				n = this.inputPerusahaanData[i]['nama_perusahaan']
				break;
			}
		}
		this.gbl.setPerusahaan(k, n)
		this.kode_perusahaan = this.gbl.getKodePerusahaan()
		this.nama_perusahaan = this.gbl.getNamaPerusahaan()
		this.dialog.closeAll()
		this.ref.markForCheck()
	}

	resetDetailForm() {
		this.formD.kode_perusahaan = this.kode_perusahaan
	}

	openCDialog() { // Confirmation Dialog
		this.getActivePeriodDialog()
		const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
			width: 'auto',
			height: 'auto',
			maxWidth: '95vw',
			maxHeight: '95vh',
			data: {
				buttonLayout: this.c_buttonLayout,
				labelLayout: this.c_labelLayout,
				inputLayout: this.c_inputLayout,
				formValue: this.formValue,
			},
			disableClose: true
		})
		dialogRef.afterClosed().subscribe(
			result => {
				// this.batal_alasan = ""
			},
			// error => null
		)
	}

	setPeriod(period) {
		this.dialog.closeAll()
		if (this.changePeriodeData.length > 0) {
			const accessPeriod = this.changePeriodeData.filter(x => x.tahun_periode === period.tahun_periode && x.bulan_periode === period.bulan_periode)[0] || {}
			if (accessPeriod['tahun_periode'] !== undefined && accessPeriod['bulan_periode'] !== undefined) {
				this.gbl.setPeriode(accessPeriod['id_periode'], accessPeriod['tahun_periode'], accessPeriod['bulan_periode'])
				this.id_periode = this.gbl.getIdPeriode()
				this.tahun_periode = this.gbl.getTahunPeriode()
				this.bulan_periode = this.gbl.getBulanPeriode()
				this.nama_bulan = this.gbl.getNamaBulan(this.bulan_periode)
				this.ref.markForCheck()
				if (accessPeriod['aktif'] === "1") {
					this.openSnackBar('Akses periode kembali ke periode aktif saat ini', 'success')
					this.noActive = false
					this.tooltip = "Periode Aktif"
				} else {
					this.openSnackBar('Akses periode diubah ke Bulan ' + this.nama_bulan + ', Tahun ' + this.tahun_periode, 'success')
					this.noActive = true
					this.tooltip = "Bukan Periode Aktif"
				}
			} else {
				this.ref.markForCheck()
				this.openSnackBar('Gagal ubah periode, Mohon isi Tahun dan Bulan dengan lengkap', 'fail', this.openCDialog())
			}
		}
	}

	openSnackBar(message, type?: any, onCloseFunc?: any) {
		const dialogRef = this.dialog.open(AlertdialogComponent, {
			width: 'auto',
			height: 'auto',
			maxWidth: '95vw',
			maxHeight: '95vh',
			data: {
				type: type === undefined || type == null ? '' : type,
				message: message === undefined || message == null ? '' : message,
				onCloseFunc: onCloseFunc === undefined || onCloseFunc == null ? null : () => onCloseFunc()
			},
			disableClose: true
		})

		dialogRef.afterClosed().subscribe(result => {
			// this.dialog.closeAll()
		})
	}

}
