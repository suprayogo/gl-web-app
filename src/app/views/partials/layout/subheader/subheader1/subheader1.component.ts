// Angular
import { AfterViewInit, Component, Input, OnDestroy, OnInit, ChangeDetectorRef } from '@angular/core';
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

@Component({
	selector: 'kt-subheader1',
	templateUrl: './subheader1.component.html',
	styleUrls: ['./subheader1.component.scss']
})
export class Subheader1Component implements OnInit, OnDestroy, AfterViewInit {
	// Public properties
	@Input() fluid: boolean;
	@Input() clear: boolean;

	today: number = Date.now();
	kode_perusahaan: string = ""
	nama_perusahaan: string = ""
	daftar_perusahaan = []
	// title: string = '';
	// desc: string = '';
	// breadcrumbs: Breadcrumb[] = [];

	// Private properties
	// private subscriptions: Subscription[] = [];

	formD = {
		kode_perusahaan: ''
	}

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
			this.request.apiData('user', 'g-user-perusahaan', { user_id: u_id }).subscribe(
				data => {
					if (data['STATUS'] === 'Y') {
						this.inputPerusahaanData = data['RESULT']
						if (this.inputPerusahaanData.length > 0) {
							this.gbl.setPerusahaan(this.inputPerusahaanData[0]['kode_perusahaan'], this.inputPerusahaanData[0]['nama_perusahaan'])
							this.kode_perusahaan = this.gbl.getKodePerusahaan()
							this.nama_perusahaan = this.gbl.getNamaPerusahaan()
							this.ref.markForCheck()
							for (var i = 0; i < this.inputPerusahaanData.length; i++) {
								let t = {
									label: this.inputPerusahaanData[i]['nama_perusahaan'],
									value: this.inputPerusahaanData[i]['kode_perusahaan']
								}
								this.daftar_perusahaan.push(t)
							}
							this.formD.kode_perusahaan = this.kode_perusahaan
						}
					} else {
						this.openSnackBar('Gagal mendapatkan daftar akses perusahaan.', 'fail', null)
					}
				}
			)

		} else {
			this.openSnackBar(
				'Gagal mendapatkan ID User anda. Mohon melakukan login terlebih dahulu.',
				'info',
				() => {
					localStorage.clear()
					window.location.href = "/auth/login"
				}
			)
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
	}

	ngOnDestroy(): void {
		// this.subscriptions.forEach(sb => sb.unsubscribe());
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
			this.dialog.closeAll()
		})
	}
}
