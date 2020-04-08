import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// Request Data API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// Components
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';
import { ReportdialogComponent } from '../../components/reportdialog/reportdialog.component';

const content = {
  beforeCodeTitle: 'Daftar Laporan'
}

@Component({
  selector: 'kt-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss', '../laporan.style.scss']
})
export class AllComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild('jl', { static: false }) forminputJL;
  @ViewChild('bb', { static: false }) forminputBB;
  @ViewChild('ns', { static: false }) forminputNS;
  @ViewChild('lr', { static: false }) forminputLR;
  @ViewChild('nr', { static: false }) forminputNR;
  @ViewChild('ak', { static: false }) forminputAK;

  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  nama_tombol: any;
  onSub: boolean = false;
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  editable: boolean = false;
  selectedTab: number = 0;
  tableLoad: boolean = false;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  browseNeedUpdate: boolean = true;
  search: string;

  // REPORT
  reportObj = {
    REPORT_COMPANY: "",
    REPORT_CODE: "DOK-DELIVERY-ORDER",
    REPORT_NAME: "Delivery Order",
    REPORT_FORMAT_CODE: "pdf",
    JASPER_FILE: "rptDokDeliveryOrder.jasper",
    REPORT_PARAMETERS: {
    },
    FIELD_NAME: [
      "noTran",
      "tglTran",
      "kodePengirim",
      "namaPengirim",
      "alamatPengirim",
      "kotaPengirim",
      "teleponPengirim",
      "kodePenerima",
      "namaPenerima",
      "alamatPenerima",
      "kotaPenerima",
      "teleponPenerima",
      "noResi",
      "namaBarang",
      "jumlahBarang"
    ],
    FIELD_TYPE: [
      "string",
      "date",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "bigdecimal"
    ],
    FIELD_DATA: []
  }

  // PERIODE
  inputPeriodeData = [];
  activePeriod = {};
  tahun: any = [];
  bulanJL: any = [];
  bulanBB: any = [];
  bulanNS: any = [];
  bulanLR: any = [];
  bulanNR: any = [];

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // Input Name
  formValueJL = {
    tahun: '',
    bulan: ''
  }

  formValueBB = {
    // periode: JSON.stringify(this.getDateNow()),
    tahun: '',
    bulan: ''
  }

  formValueNS = {
    tahun: '',
    bulan: ''
  }

  formValueLR = {
    tahun: '',
    bulan: ''
  }

  formValueNR = {
    tahun: '',
    bulan: ''
  }

  formValueAK = {
    periode: JSON.stringify(this.getDateNow())
  }

  // Layout Form
  inputLayoutJL = [
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Tahun Periode',
			id: 'tahun-periode',
			type: 'combobox',
			options: this.tahun,
			onSelectFunc: (filterBulan) => this.getBulan(filterBulan, '', 'jl'),
			valueOf: 'tahun',
			required: true,
			readOnly: false,
			disabled: false,
		},
		{
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Bulan Periode',
			id: 'bulan-periode',
			type: 'combobox',
			options: this.bulanJL,
			valueOf: 'bulan',
			required: true,
			readOnly: false,
			disabled: false,
		}
  ]

  inputLayoutBB = [
    // {
    //   formWidth: 'col-9',
    //   label: 'Periode',
    //   id: 'periode',
    //   type: 'datepicker-range',
    //   valueOf: 'periode',
    //   required: true,
    //   readOnly: false,
    //   update: {
    //     disabled: false
    //   },
    //   timepick: false,
    //   enableMin: false,
    //   enableMax: false,
    // },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Tahun Periode',
			id: 'tahun-periode',
			type: 'combobox',
			options: this.tahun,
			onSelectFunc: (filterBulan) => this.getBulan(filterBulan, '', 'bb'),
			valueOf: 'tahun',
			required: true,
			readOnly: false,
			disabled: false,
		},
		{
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Bulan Periode',
			id: 'bulan-periode',
			type: 'combobox',
			options: this.bulanBB,
			valueOf: 'bulan',
			required: true,
			readOnly: false,
			disabled: false,
		}
  ]

  inputLayoutNS = [
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Tahun Periode',
			id: 'tahun-periode',
			type: 'combobox',
			options: this.tahun,
			onSelectFunc: (filterBulan) => this.getBulan(filterBulan, '', 'ns'),
			valueOf: 'tahun',
			required: true,
			readOnly: false,
			disabled: false,
		},
		{
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Bulan Periode',
			id: 'bulan-periode',
			type: 'combobox',
			options: this.bulanNS,
			valueOf: 'bulan',
			required: true,
			readOnly: false,
			disabled: false,
		}
  ]

  inputLayoutLR = [
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Tahun Periode',
			id: 'tahun-periode',
			type: 'combobox',
			options: this.tahun,
			onSelectFunc: (filterBulan) => this.getBulan(filterBulan, '', 'ns'),
			valueOf: 'tahun',
			required: true,
			readOnly: false,
			disabled: false,
		},
		{
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Bulan Periode',
			id: 'bulan-periode',
			type: 'combobox',
			options: this.bulanLR,
			valueOf: 'bulan',
			required: true,
			readOnly: false,
			disabled: false,
		}
  ]

  inputLayoutNR = [
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Tahun Periode',
			id: 'tahun-periode',
			type: 'combobox',
			options: this.tahun,
			onSelectFunc: (filterBulan) => this.getBulan(filterBulan, '', 'ns'),
			valueOf: 'tahun',
			required: true,
			readOnly: false,
			disabled: false,
		},
		{
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Bulan Periode',
			id: 'bulan-periode',
			type: 'combobox',
			options: this.bulanNR,
			valueOf: 'bulan',
			required: true,
			readOnly: false,
			disabled: false,
		}
  ]

  inputLayoutAK = [
    {
      formWidth: 'col-9',
      label: 'Periode',
      id: 'periode',
      type: 'datepicker-range',
      valueOf: 'periode',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: false,
      enableMax: false,
    }
  ]

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.nama_tombol = 'Lihat Laporan'
    this.gbl.need(true, false)
    this.madeRequest()
  }

  ngAfterViewInit(): void {
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    if (this.kode_perusahaan !== "") {
      this.madeRequest()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
  }

  //Form submit
  onSubmitJL(inputForm: NgForm) {
    this.loading = true
    this.ref.markForCheck()
    if (this.forminputJL !== undefined) {
      let res = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (this.formValueJL.bulan === this.inputPeriodeData[i]['bulan_periode'] && this.formValueJL.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          res = this.inputPeriodeData[i]
          break
        }
      }

      if (res['id_periode'] !== undefined) {
        res['kode_perusahaan'] = this.kode_perusahaan
        this.request.apiData('report', 'g-data-jurnal', res).subscribe(
          data => {
            console.clear()
            console.log(data)
            if (data['STATUS'] === 'Y') {
              let d = data['RESULT'], res = []
              for (var i = 0; i < d.length; i++) {
                let t = [], tgl_tran = d[i]['tgl_tran'].split("-")

                t.push(d[i]['no_tran'])
                t.push(new Date(d[i]['tgl_tran']).getTime())
                t.push(d[i]['nama_akun'])
                t.push(d[i]['nilai_debit'])
                t.push(d[i]['nilai_kredit'])

                res.push(t)
              }
              let rp = JSON.parse(JSON.stringify(this.reportObj))
              rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
              rp['REPORT_CODE'] = 'RPT-JURNAL'
              rp['REPORT_NAME'] = 'Laporan Transaksi Jurnal'
              rp['REPORT_FORMAT_CODE'] = 'pdf'
              rp['JASPER_FILE'] = 'rptJurnal.jasper'
              rp['REPORT_PARAMETERS'] = {
                USER_NAME: "",
                REPORT_COMPANY_ADDRESS: "",
                REPORT_COMPANY_CITY: "",
                REPORT_COMPANY_TLPN: "",
              }
              rp['FIELD_NAME'] = [
                "noTran",
                "tglTran",
                "namaAkun",
                "nilaiDebit",
                "nilaiKredit"
              ]
              rp['FIELD_TYPE'] = [
                "string",
                "string",
                "string",
                "bigdecimal",
                "bigdecimal"
              ]
              rp['FIELD_DATA'] = res

              this.sendGetReport(rp)
            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data transaksi jurnal.', 'fail')
            }
          }
        )
      }
    }
  }

  onSubmitBB(inputForm: NgForm) {
    this.loading = true
    this.ref.markForCheck()
    if (this.forminputBB !== undefined) {
      let res = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (this.formValueBB.bulan === this.inputPeriodeData[i]['bulan_periode'] && this.formValueBB.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          res = this.inputPeriodeData[i]
          break
        }
      }

      if (res['id_periode'] !== undefined) {
        res['kode_perusahaan'] = this.kode_perusahaan
        this.request.apiData('report', 'g-data-buku-besar', res).subscribe(
          data => {
            console.clear()
            console.log(data)
            if (data['STATUS'] === 'Y') {

            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data transaksi jurnal.', 'fail')
            }
          }
        )
      }
    }
  }

  onSubmitNS(inputForm: NgForm) {
    this.gbl.topPage()
    this.loading = true
    this.ref.markForCheck()
    if (this.forminputBB !== undefined) {
      let res = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (this.formValueBB.bulan === this.inputPeriodeData[i]['bulan_periode'] && this.formValueBB.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          res = this.inputPeriodeData[i]
          break
        }
      }

      if (res['id_periode'] !== undefined) {
        res['kode_perusahaan'] = this.kode_perusahaan
        this.request.apiData('report', 'g-data-neraca-saldo', res).subscribe(
          data => {
            console.clear()
            console.log(data)
            if (data['STATUS'] === 'Y') {

            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data transaksi jurnal.', 'fail')
            }
          }
        )
      }
    }
  }

  onSubmitLR(inputForm: NgForm) {
    this.gbl.topPage()
    this.loading = true
    this.ref.markForCheck()
    if (this.forminputBB !== undefined) {
      let res = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (this.formValueBB.bulan === this.inputPeriodeData[i]['bulan_periode'] && this.formValueBB.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          res = this.inputPeriodeData[i]
          break
        }
      }

      if (res['id_periode'] !== undefined) {
        res['kode_perusahaan'] = this.kode_perusahaan
        this.request.apiData('report', 'g-data-laba-rugi', res).subscribe(
          data => {
            console.clear()
            console.log(data)
            if (data['STATUS'] === 'Y') {

            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data laba rugi.', 'fail')
            }
          }
        )
      }
    }
  }

  onSubmitNR(inputForm: NgForm) {
    this.gbl.topPage()
    this.loading = true
    this.ref.markForCheck()
    if (this.forminputBB !== undefined) {
      let res = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (this.formValueBB.bulan === this.inputPeriodeData[i]['bulan_periode'] && this.formValueBB.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          res = this.inputPeriodeData[i]
          break
        }
      }

      if (res['id_periode'] !== undefined) {
        res['kode_perusahaan'] = this.kode_perusahaan
        this.request.apiData('report', 'g-data-neraca', res).subscribe(
          data => {
            console.clear()
            console.log(data)
            if (data['STATUS'] === 'Y') {
              this.loading = false
              this.ref.markForCheck()
            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data laba rugi.', 'fail')
            }
          }
        )
      }
    }
  }

  //Reset Value
  resetFormJL() {
    this.gbl.topPage()
    this.formValueJL = {
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode']
    }
    
    setTimeout(() => {
      this.forminputJL.checkChanges()
    }, 1)
  }

  resetFormBB() {
    this.gbl.topPage()
    this.formValueJL = {
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode']
    }
    setTimeout(() => {
      this.forminputBB.checkChanges()
    }, 1)
  }

  resetFormNS() {
    this.gbl.topPage()
    this.formValueNS = {
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode']
    }
    setTimeout(() => {
      this.forminputNS.checkChanges()
    }, 1)
  }

  onCancel(type) {
    if (type === 'jl') {
      this.resetFormJL()
    } else if (type === 'bb') {
      this.resetFormBB()
    } else if (type === 'ns') {
      this.resetFormNS()
    }
  }

  openRDialog(id, dialogName?: string) {
    const dialogRef = this.dialog.open(ReportdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        reportId: id,
        reportName: dialogName
      },
      disableClose: false,
      panelClass: 'normal-but-top-padding-dialog'
    });

    dialogRef.afterClosed().subscribe(
      result => {
        
      },
      error => null,
    );
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    if (this.kode_perusahaan !== '' && this.kode_perusahaan != null && this.kode_perusahaan !== undefined) {
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputPeriodeData = data['RESULT']
            if (this.inputPeriodeData.length > 0) {
              this.activePeriod = this.inputPeriodeData.filter(x => x.aktif === '1')[0] || {}
              this.distinctPeriode()
            }
            this.loading = false
            this.ref.markForCheck()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Gagal mendapatkan periode. Mohon coba lagi nanti', 'fail')
          }
        }
      )
    }
  }

  refreshBrowse(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.openSnackBar(message, 'success')
  }

  sendGetReport(p) {
    this.request.apiData('report', 'g-report', p).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.openRDialog(data['RESULT'], "Laporan Jurnal")
          this.loading = false
          this.ref.markForCheck()
        } else {
          this.loading = false
          this.ref.markForCheck()
          this.gbl.topPage()
          this.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail')
        }
      }
    )
  }

  openSnackBar(message, type?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '120px' },
      data: {
        type: type === undefined || type == null ? '' : type,
        message: message === undefined || message == null ? '' : message.charAt(0).toUpperCase() + message.substr(1).toLowerCase()
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      this.dialog.closeAll()
    })
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }

  //Date Functions
  getDateNow() {
    // let d = this.gbl.getTahunPeriode() + "-" + this.gbl.getBulanPeriode() + "-01"
    let p = new Date().getTime()
    return p
  }

  reverseConvertTime(data) {
    let date = new Date(data)

    return JSON.stringify(date.getTime())
  }

  distinctPeriode() {
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
		this.formValueJL = {
      tahun: this.activePeriod['tahun_periode'] === undefined ? "" : this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'] === undefined ? "" : this.activePeriod['bulan_periode']
    }
    this.formValueBB = {
      tahun: this.activePeriod['tahun_periode'] === undefined ? "" : this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'] === undefined ? "" : this.activePeriod['bulan_periode']
    }
    this.formValueNS = {
      tahun: this.activePeriod['tahun_periode'] === undefined ? "" : this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'] === undefined ? "" : this.activePeriod['bulan_periode']
    }
    this.formValueLR = {
      tahun: this.activePeriod['tahun_periode'] === undefined ? "" : this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'] === undefined ? "" : this.activePeriod['bulan_periode']
    }
    this.formValueNR = {
      tahun: this.activePeriod['tahun_periode'] === undefined ? "" : this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'] === undefined ? "" : this.activePeriod['bulan_periode']
    }
    this.bulanJL = tmp[this.formValueJL.tahun]
    this.bulanBB = tmp[this.formValueBB.tahun]
    this.bulanNS = tmp[this.formValueNS.tahun]
    this.bulanLR = tmp[this.formValueLR.tahun]
    this.bulanNR = tmp[this.formValueNR.tahun]
		this.inputLayoutJL.splice(0, 2,
			{
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.tahun,
        onSelectFunc: (filterBulan) => this.getBulan(filterBulan, tmp, "jl"),
        valueOf: 'tahun',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanJL,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
      },
    )
    this.inputLayoutBB.splice(0, 2,
			{
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.tahun,
        onSelectFunc: (filterBulan) => this.getBulan(filterBulan, tmp, 'bb'),
        valueOf: 'tahun',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanBB,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
      },
    )
    this.inputLayoutNS.splice(0, 2,
			{
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.tahun,
        onSelectFunc: (filterBulan) => this.getBulan(filterBulan, tmp, 'ns'),
        valueOf: 'tahun',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanNS,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
      },
    )
    this.inputLayoutLR.splice(0, 2,
			{
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.tahun,
        onSelectFunc: (filterBulan) => this.getBulan(filterBulan, tmp, 'lr'),
        valueOf: 'tahun',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanLR,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
      },
    )
    this.inputLayoutNR.splice(0, 2,
			{
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.tahun,
        onSelectFunc: (filterBulan) => this.getBulan(filterBulan, tmp, 'nr'),
        valueOf: 'tahun',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanNR,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
      },
		)
	}

  getBulan(filterBulan, loopBulan, type) {
    if (type === "jl") {
      this.formValueJL = {
        tahun: filterBulan,
        bulan: ""
      }
      this.bulanJL = loopBulan[filterBulan]
      this.inputLayoutJL.splice(1, 1,
        {
          labelWidth: 'col-4',
          formWidth: 'col-7',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanJL,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
        }
      )
      setTimeout(() => {
        this.forminputJL.checkChanges()
      }, 1)
    } else if (type === "bb") {
      this.formValueBB = {
        tahun: filterBulan,
        bulan: ""
      }
      this.bulanBB = loopBulan[filterBulan]
      this.inputLayoutBB.splice(1, 1,
        {
          labelWidth: 'col-4',
          formWidth: 'col-7',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanBB,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
        }
      )
      setTimeout(() => {
        this.forminputBB.checkChanges()
      }, 1)
    } else if (type === "ns") {
      this.formValueNS = {
        tahun: filterBulan,
        bulan: ""
      }
      this.bulanNS = loopBulan[filterBulan]
      this.inputLayoutBB.splice(1, 1,
        {
          labelWidth: 'col-4',
          formWidth: 'col-7',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanNS,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
        }
      )
      setTimeout(() => {
        this.forminputNS.checkChanges()
      }, 1)
    } else if (type === "lr") {
      this.formValueLR = {
        tahun: filterBulan,
        bulan: ""
      }
      this.bulanBB = loopBulan[filterBulan]
      this.inputLayoutLR.splice(1, 1,
        {
          labelWidth: 'col-4',
          formWidth: 'col-7',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanLR,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
        }
      )
      setTimeout(() => {
        this.forminputLR.checkChanges()
      }, 1)
    } else if (type === "nr") {
      this.formValueNR = {
        tahun: filterBulan,
        bulan: ""
      }
      this.bulanNR = loopBulan[filterBulan]
      this.inputLayoutNR.splice(1, 1,
        {
          labelWidth: 'col-4',
          formWidth: 'col-7',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanNR,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
        }
      )
      setTimeout(() => {
        this.forminputNR.checkChanges()
      }, 1)
    }
	}
}
