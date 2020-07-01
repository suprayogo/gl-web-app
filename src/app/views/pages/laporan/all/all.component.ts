import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
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

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild('jl', { static: false }) forminputJL;
  @ViewChild('bb', { static: false }) forminputBB;
  @ViewChild('ns', { static: false }) forminputNS;
  @ViewChild('lr', { static: false }) forminputLR;
  @ViewChild('nr', { static: false }) forminputNR;
  @ViewChild('ak', { static: false }) forminputAK;

  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  tipe = [
    {
      label: 'Tahunan',
      value: 't'
    },
    {
      label: 'Bulanan',
      value: 'b'
    }
  ]

  // VARIABLES
  nama_tombol: any;
  onSub: boolean = false;
  loading: boolean = true;
  loadingJL: boolean = false;
  loadingBB: boolean = false;
  loadingNS: boolean = false;
  loadingLR: boolean = false;
  loadingNR: boolean = false;
  loadingAK: boolean = false;
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
  initBulan: any = [];
  bulanJL: any = [];
  bulanBB: any = [];
  bulanNS: any = [];
  bulanLR: any = [];
  bulanNR: any = [];
  bulanAK: any = [];

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
    tipe: 't',
    tahun: '',
    bulan: ''
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
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Tipe',
			id: 'tipe',
			type: 'combobox',
			options: this.tipe,
			valueOf: 'tipe',
			required: true,
			readOnly: false,
			disabled: false,
		},
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
			label: 'Tahun Periode',
			id: 'tahun-periode',
			type: 'combobox',
			options: this.tahun,
			onSelectFunc: (filterBulan) => this.getBulan(filterBulan, '', 'ak'),
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
			options: this.bulanAK,
			valueOf: 'bulan',
			required: true,
			readOnly: false,
      disabled: false,
      hiddenOn: {
        valueOf: 'tipe',
        matchValue: "t"
      }
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
    this.gbl.need(true, true)
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
      this.formValueJL = this.forminputJL.getData()
      let p = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (parseInt(this.formValueJL.bulan) == parseInt(this.inputPeriodeData[i]['bulan_periode']) && this.formValueJL.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          p = JSON.parse(JSON.stringify(this.inputPeriodeData[i]))
          break
        }
      }

      if (p['id_periode'] !== undefined) {
        p['kode_perusahaan'] = this.kode_perusahaan
        p['bulan_periode'] = p['bulan_periode'].length > 1 ? p['bulan_periode'] : "0" + p['bulan_periode']
        this.request.apiData('report', 'g-data-jurnal', p).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              console.clear()
              let d = data['RESULT'], res = []
              for (var i = 0; i < d.length; i++) {
                let t = [], no_tran = "", tgl_tran = d[i]['tgl_tran']

                if (d[i]['kode_tran'] === "SALDO-AWAL") {
                  no_tran = "Saldo Awal"
                  if (d[i]['tipe_akun'] == 0) {
                    d[i]['nilai_debit'] = d[i]['saldo_awal']
                  } else if (d[i]['tipe_akun'] == 1) {
                    d[i]['nilai_kredit'] = d[i]['saldo_awal']
                  }
                } else if (d[i]['kode_tran'] === "JURNAL") {
                  no_tran = d[i]['no_tran']
                }
                
                t.push(no_tran)
                t.push(new Date(tgl_tran).getTime())
                t.push(d[i]['nama_akun'])
                t.push(parseFloat(d[i]['nilai_debit']))
                t.push(parseFloat(d[i]['nilai_kredit']))

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
                REPORT_PERIODE: "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode']
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
                "date",
                "string",
                "bigdecimal",
                "bigdecimal"
              ]
              rp['FIELD_DATA'] = res

              this.sendGetReport(rp, 'jl')
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
      this.formValueBB = this.forminputBB.getData()
      let p = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (parseInt(this.formValueBB.bulan) == parseInt(this.inputPeriodeData[i]['bulan_periode']) && this.formValueBB.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          p = JSON.parse(JSON.stringify(this.inputPeriodeData[i]))
          break
        }
      }

      if (p['id_periode'] !== undefined) {
        p['kode_perusahaan'] = this.kode_perusahaan
        p['bulan_periode'] = p['bulan_periode'].length > 1 ? p['bulan_periode'] : "0" + p['bulan_periode']
        this.request.apiData('report', 'g-data-buku-besar', p).subscribe(
          data => {
            console.clear()
            if (data['STATUS'] === 'Y') {
              let d = data['RESULT'], res = []
              for (var i = 0; i < d.length; i++) {
                let t = [], no_tran = "", tgl_tran = d[i]['tgl_tran']

                if (d[i]['kode_tran'] === "SALDO-AWAL") {
                  no_tran = "Saldo Awal"
                  if (d[i]['tipe_akun'] == 0) {
                    d[i]['nilai_debit'] = d[i]['saldo_awal']
                  } else if (d[i]['tipe_akun'] == 1) {
                    d[i]['nilai_kredit'] = d[i]['saldo_awal']
                  }
                } else if (d[i]['kode_tran'] === "JURNAL") {
                  no_tran = d[i]['no_tran']
                }

                t.push(d[i]['kode_akun'])
                t.push(d[i]['nama_akun'])
                t.push(no_tran)
                t.push(new Date(tgl_tran).getTime())
                t.push(d[i]['keterangan'])
                t.push(parseFloat(d[i]['nilai_debit']))
                t.push(parseFloat(d[i]['nilai_kredit']))
                t.push(parseFloat(d[i]['saldo_akhir']))

                res.push(t)
              }
              let rp = JSON.parse(JSON.stringify(this.reportObj))
              rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
              rp['REPORT_CODE'] = 'RPT-BUKU-BESAR'
              rp['REPORT_NAME'] = 'Laporan Buku Besar'
              rp['REPORT_FORMAT_CODE'] = 'pdf'
              rp['JASPER_FILE'] = 'rptGeneralLedger.jasper'
              rp['REPORT_PARAMETERS'] = {
                USER_NAME: "",
                REPORT_COMPANY_ADDRESS: "",
                REPORT_COMPANY_CITY: "",
                REPORT_COMPANY_TLPN: "",
                REPORT_PERIODE: "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode']
              }
              rp['FIELD_NAME'] = [
                "kodeAkun",
                "namaAkun",
                "noTran",
                "tglTran",
                "keterangan",
                "nilaiDebit",
                "nilaiKredit",
                "nilaiSaldo"
              ]
              rp['FIELD_TYPE'] = [
                "string",
                "string",
                "string",
                "date",
                "string",
                "bigdecimal",
                "bigdecimal",
                "bigdecimal"
              ]
              rp['FIELD_DATA'] = res

              this.sendGetReport(rp, 'bb')
            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data buku besar.', 'fail')
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
    if (this.forminputNS !== undefined) {
      this.formValueNS = this.forminputNS.getData()
      let p = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (parseInt(this.formValueNS.bulan) == parseInt(this.inputPeriodeData[i]['bulan_periode']) && this.formValueNS.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          p = JSON.parse(JSON.stringify(this.inputPeriodeData[i]))
          break
        }
      }

      if (p['id_periode'] !== undefined) {
        p['kode_perusahaan'] = this.kode_perusahaan
        p['bulan_periode'] = p['bulan_periode'].length > 1 ? p['bulan_periode'] : "0" + p['bulan_periode']
        this.request.apiData('report', 'g-data-neraca-saldo', p).subscribe(
          data => {
            console.clear()
            if (data['STATUS'] === 'Y') {
              let d = data['RESULT'], res = []
              for (var i = 0; i < d.length; i++) {
                let t = []

                t.push(d[i]['kode_akun'])
                t.push(d[i]['nama_akun'])
                t.push(parseFloat(d[i]['debet']))
                t.push(parseFloat(d[i]['kredit']))

                res.push(t)
              }
              let rp = JSON.parse(JSON.stringify(this.reportObj))
              rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
              rp['REPORT_CODE'] = 'RPT-BUKU-BESAR'
              rp['REPORT_NAME'] = 'Laporan Neraca Saldo'
              rp['REPORT_FORMAT_CODE'] = 'pdf'
              rp['JASPER_FILE'] = 'rptNeracaSaldo.jasper'
              rp['REPORT_PARAMETERS'] = {
                USER_NAME: "",
                REPORT_COMPANY_ADDRESS: "",
                REPORT_COMPANY_CITY: "",
                REPORT_COMPANY_TLPN: "",
                REPORT_PERIODE: "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode']
              }
              rp['FIELD_NAME'] = [
                "kodeAkun",
                "namaAkun",
                "nilaiDebit",
                "nilaiKredit"
              ]
              rp['FIELD_TYPE'] = [
                "string",
                "string",
                "bigdecimal",
                "bigdecimal"
              ]
              rp['FIELD_DATA'] = res

              this.sendGetReport(rp, 'ns')
            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data neraca saldo.', 'fail')
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
    if (this.forminputLR !== undefined) {
      this.formValueLR = this.forminputLR.getData()
      let p = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (parseInt(this.formValueLR.bulan) == parseInt(this.inputPeriodeData[i]['bulan_periode']) && this.formValueLR.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          p = JSON.parse(JSON.stringify(this.inputPeriodeData[i]))
          break
        }
      }

      if (p['id_periode'] !== undefined) {
        p['kode_perusahaan'] = this.kode_perusahaan
        p['bulan_periode'] = p['bulan_periode'].length > 1 ? p['bulan_periode'] : "0" + p['bulan_periode']
        this.request.apiData('report', 'g-data-laba-rugi', p).subscribe(
          data => {
            console.clear()
            if (data['STATUS'] === 'Y') {
              let d = data['RESULT'], res = []
              for (var i = 0; i < d.length; i++) {
                let t = []

                t.push(d[i]['tipe_laporan'])
                t.push(d[i]['nama_tipe_laporan'])
                t.push(d[i]['kode_akun'])
                t.push(d[i]['nama_akun'])
                if (d[i]['tipe_laporan'] === 'b') {
                  t.push(d[i]['saldo'])
                  t.push(0)
                } else if (d[i]['tipe_laporan'] === 'p') {
                  t.push(0)
                  t.push(d[i]['saldo'])
                  // t.push(d[i]['tipe_akun'] === "1" ? JSON.stringify(parseFloat(d[i]['saldo']) * -1) : d[i]['saldo'])
                }

                res.push(t)
              }
              let rp = JSON.parse(JSON.stringify(this.reportObj))
              rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
              rp['REPORT_CODE'] = 'RPT-LABA-RUGI'
              rp['REPORT_NAME'] = 'Laporan Laba Rugi'
              rp['REPORT_FORMAT_CODE'] = 'pdf'
              rp['JASPER_FILE'] = 'rptLabaRugi.jasper'
              rp['REPORT_PARAMETERS'] = {
                USER_NAME: "",
                REPORT_COMPANY_ADDRESS: "",
                REPORT_COMPANY_CITY: "",
                REPORT_COMPANY_TLPN: "",
                REPORT_PERIODE: "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode']
              }
              rp['FIELD_NAME'] = [
                "tipe",
                "namaTipe",
                "kodeAkun",
                "namaAkun",
                "nilaiBeban",
                "nilaiPendapatan"
              ]
              rp['FIELD_TYPE'] = [
                "string",
                "string",
                "string",
                "string",
                "bigdecimal",
                "bigdecimal"
              ]
              rp['FIELD_DATA'] = res

              this.sendGetReport(rp, 'lr')
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
    if (this.forminputNR !== undefined) {
      this.formValueNR = this.forminputNR.getData()
      let p = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (parseInt(this.formValueNR.bulan) == parseInt(this.inputPeriodeData[i]['bulan_periode']) && this.formValueNR.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          p = JSON.parse(JSON.stringify(this.inputPeriodeData[i]))
          break
        }
      }

      if (p['id_periode'] !== undefined) {
        p['kode_perusahaan'] = this.kode_perusahaan
        p['bulan_periode'] = p['bulan_periode'].length > 1 ? p['bulan_periode'] : "0" + p['bulan_periode']
        this.request.apiData('report', 'g-data-neraca', p).subscribe(
          data => {
            console.clear()
            if (data['STATUS'] === 'Y') {
              let idata = data['RESULT'], d = [], res = [], totalTipe = {}, totalKategori = {}
              let nd = JSON.parse(idata['NR']), ld = JSON.parse(idata['LBRG']), saldo_lr = 0
              for (var i = 0; i < ld.length; i++) {
                if (ld[i]['tipe_laporan'] === 'p') {
                  saldo_lr = saldo_lr + parseFloat(ld[i]['saldo'])
                }

                if (ld[i]['tipe_laporan'] === 'b') {
                  saldo_lr = saldo_lr - parseFloat(ld[i]['saldo'])
                }
              }
              d.push({
                tahun: nd.length > 0 ? nd[0]['tahun'] : "",
                bulan: nd.length > 0 ? nd[0]['bulan'] : "",
                group_besar: "ke",
                nama_group_besar: "Kewajiban & Ekuitas",
                group: "EKUITAS",
                nama_group: "Ekuitas",
                id_akun: "",
                kode_akun: "LBRG",
                nama_akun: "Laba Rugi",
                tipe_akun: "0",
                id_kategori_akun: "lbrg",
                nama_kategori_akun: "Laba Rugi",
                saldo_akhir: JSON.stringify(saldo_lr)
              })
              d = d.concat(nd)
              for (var i = 0; i < d.length; i++) {
                if (totalTipe[d[i]['group']]) {
                  totalTipe[d[i]['group']] = totalTipe[d[i]['group']] + parseFloat(d[i]['saldo_akhir'])
                } else {
                  totalTipe[d[i]['group']] = parseFloat(d[i]['saldo_akhir'])
                }

                if (totalKategori[d[i]['id_kategori_akun'] + "-" + d[i]['group']]) {
                  totalKategori[d[i]['id_kategori_akun'] + "-" + d[i]['group']] = totalKategori[d[i]['id_kategori_akun'] + "-" + d[i]['group']] + parseFloat(d[i]['saldo_akhir'])
                } else {
                  totalKategori[d[i]['id_kategori_akun'] + "-" + d[i]['group']] = parseFloat(d[i]['saldo_akhir'])
                }

                if (d[i]['group'] === "AKTIVA-LANCAR" || d[i]['group'] === "AKTIVA-TETAP") {
                  if (d[i]['group'] === "AKTIVA-LANCAR") {
                    d[i]['nama_group'] = "Aktiva Lancar"
                  } else if (d[i]['group'] === "AKTIVA-TETAP") {
                    d[i]['nama_group'] = "Aktiva Tetap"
                  }
                  d[i]['group_besar'] = "ak"
                  d[i]['nama_group_besar'] = "Aktiva"
                }

                if (d[i]['group'] === "KEWAJIBAN" || d[i]['group'] === "EKUITAS") {
                  if (d[i]['group'] === "KEWAJIBAN") {
                    d[i]['nama_group'] = "Kewajiban"
                  } else if (d[i]['group'] === "EKUITAS") {
                    d[i]['nama_group'] = "Ekuitas"
                  }
                  d[i]['group_besar'] = "ke"
                  d[i]['nama_group_besar'] = "Kewajiban & Ekuitas"
                }
              }
              let totalAktiva = totalTipe['AKTIVA-LANCAR'] + totalTipe['AKTIVA-TETAP'],
                    totalKE = totalTipe['KEWAJIBAN'] + totalTipe['EKUITAS']

              for (var i = 0; i < d.length; i++) {
                let t = []

                t.push(d[i]['group_besar'])
                t.push(d[i]['nama_group_besar'])
                t.push(d[i]['group'])
                t.push(d[i]['nama_group'])
                t.push(d[i]['id_kategori_akun'])
                t.push(d[i]['nama_kategori_akun'])
                t.push(d[i]['kode_akun'])
                t.push(d[i]['nama_akun'])
                t.push(parseFloat(d[i]['saldo_akhir']))
                t.push(totalKategori[d[i]['id_kategori_akun'] + "-" + d[i]['group']])
                t.push(totalTipe[d[i]['group']])
                t.push(d[i]['group_besar'] === "ak" ? (totalAktiva == null || totalAktiva === undefined || isNaN(totalAktiva) ? 0 : totalAktiva) : (totalKE == null || totalKE === undefined || isNaN(totalKE) ? 0 : totalKE))

                res.push(t)
              }
              res.sort(function (a, b) {
                if (a[0] < b[0]) {
                  return -1;
                }

                if (a[0] > b[0]) {
                  return 1;
                }

                return 0;
              })
              
              let rp = JSON.parse(JSON.stringify(this.reportObj))
              rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
              rp['REPORT_CODE'] = 'RPT-NERACA'
              rp['REPORT_NAME'] = 'Laporan Neraca'
              rp['REPORT_FORMAT_CODE'] = 'pdf'
              rp['JASPER_FILE'] = 'rptNeraca.jasper'
              rp['REPORT_PARAMETERS'] = {
                USER_NAME: "",
                REPORT_COMPANY_ADDRESS: "",
                REPORT_COMPANY_CITY: "",
                REPORT_COMPANY_TLPN: "",
                REPORT_PERIODE: "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode']
              }
              rp['FIELD_NAME'] = [
                "tipeBesar",
                "namaTipeBesar",
                "tipe",
                "namaTipe",
                "kategoriAkun",
                "namaKategoriAkun",
                "kodeAkun",
                "namaAkun",
                "saldo",
                "totalKategori",
                "totalTipe",
                "totalTipeBesar"
              ]
              rp['FIELD_TYPE'] = [
                "string",
                "string",
                "string",
                "string",
                "string",
                "string",
                "string",
                "string",
                "bigdecimal",
                "bigdecimal",
                "bigdecimal",
                "bigdecimal"
              ]
              rp['FIELD_DATA'] = res

              this.sendGetReport(rp, 'nr')
            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data neraca.', 'fail')
            }
          }
        )
      }
    }
  }

  onSubmitAK(inputForm: NgForm) {
    this.gbl.topPage()
    this.loading = true
    this.ref.markForCheck()
    if (this.forminputAK !== undefined) {
      this.formValueAK = this.forminputAK.getData()
      let p = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (parseInt(this.formValueAK.tipe === 't' ? "12" : this.formValueAK.bulan) == parseInt(this.inputPeriodeData[i]['bulan_periode']) && this.formValueAK.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          p = JSON.parse(JSON.stringify(this.inputPeriodeData[i]))
          break
        }
      }

      if (p['id_periode'] !== undefined) {
        p['kode_perusahaan'] = this.kode_perusahaan
        if (this.formValueAK['tipe'] === "t") {
          if (this.getTahunTerendah() == parseInt(p['tahun_periode'])) {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Tahun periode merupakan tahun terakhir yang terdaftar.', 'info')
            return
          }
          p['tahun_periode_sebelum'] = JSON.stringify(parseInt(p['tahun_periode']) - 1)
          p['bulan_periode'] = "12"
          p['bulan_periode_sebelum'] = this.getBulanTertinggi(p['tahun_periode_sebelum'])
        } else if (this.formValueAK['tipe'] === "b") {
          if (p['bulan_periode'] === "1") {
            if (this.getTahunTerendah() == parseInt(p['tahun_periode'])) {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Tahun periode merupakan tahun terakhir yang terdaftar.', 'info')
              return
            }
            p['tahun_periode_sebelum'] = JSON.stringify(parseInt(p['tahun_periode']) - 1)
            p['bulan_periode_sebelum'] = JSON.stringify(this.getBulanTertinggi(p['tahun_periode_sebelum']))
          } else {
            if (this.getBulanTerendah(p['tahun_periode']) == parseInt(p['bulan_periode'])) {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Bulan periode merupakan bulan terakhir yang terdaftar.', 'info')
              return
            }
            p['bulan_periode_sebelum'] = JSON.stringify(parseInt(p['bulan_periode']) - 1)
            p['tahun_periode_sebelum'] = p['tahun_periode']
          }
        }
        p['bulan_periode'] = p['bulan_periode'].length > 1 ? p['bulan_periode'] : "0" + p['bulan_periode']
        p['bulan_periode_sebelum'] = p['bulan_periode_sebelum'].length > 1 ? p['bulan_periode_sebelum'] : "0" + p['bulan_periode_sebelum']
        this.request.apiData('report', 'g-data-arus-kas', p).subscribe(
          data => {
            console.clear()
            if (data['STATUS'] === 'Y') {
              let z = data['RESULT'], r = JSON.parse(z['res']), res = [], nRes = [], dLR = {}, totalTipe = {}, totalAktivitasKas = 0, saldoAwalKas = 0, saldoAkhirKas = 0
              saldoAwalKas = parseFloat(z['saldo_awal'])
              for (var x = 0; x < r.length; x++) {
                let d = r[x]['data']
                for (var i = 0; i < d.length; i++) {
                  for (var j = 0; j < d.length; j++) {
                    if (
                      (
                        (parseInt(d[i]['tahun']) > parseInt(d[j]['tahun'])) || 
                        (d[i]['tahun'] === d[i]['tahun'] && parseInt(d[i]['bulan']) > parseInt(d[j]['bulan']))
                      ) &&
                      d[i]['id_akun'] === d[j]['id_akun'] &&
                      d[i]['group'] === d[j]['group']
                    ) {
                      let t = JSON.parse(JSON.stringify(d[i]))
                      if (d[i]['group'] === 'AKTIVA-LANCAR' || d[i]['group'] === 'AKTIVA-TETAP') {
                        t['saldo_akhir'] = (t['saldo_akhir'] - d[j]['saldo_akhir']) * -1
                      } else {
                        t['saldo_akhir'] = t['saldo_akhir'] - d[j]['saldo_akhir']
                      }
                      t['class'] = r[x]['value']
                      t['className'] = r[x]['label']
                      nRes.push(t)
                    }
                  } 
  
                  if (d[i]['id_akun'] === 'LBRG') {
                    dLR = d[i]
                    dLR['class'] = r[x]['value']
                    dLR['className'] = r[x]['label']
                  }
                }
              }

              nRes.splice(0, 0, dLR)

              for (var i = 0; i < nRes.length; i++) {
                if (totalTipe[nRes[i]['class']]) {
                  totalTipe[nRes[i]['class']] = totalTipe[nRes[i]['class']] + parseFloat(nRes[i]['saldo_akhir'])
                } else {
                  totalTipe[nRes[i]['class']] = parseFloat(nRes[i]['saldo_akhir'])
                }
              }

              for (var prop in totalTipe) {
                if (totalTipe.hasOwnProperty(prop)) {
                  totalAktivitasKas = totalAktivitasKas + totalTipe[prop]
                }
              }

              for (var i = 0; i < nRes.length; i++) {
                let t = []

                t.push(nRes[i]['class'])
                t.push(nRes[i]['className'])
                t.push(nRes[i]['kode_akun'])
                t.push(nRes[i]['kode_akun'] === "LBRG" ? nRes[i]['nama_akun'] : nRes[i]['saldo_akhir'] > 0 ? "Kenaikkan " + nRes[i]['nama_akun'] : "Penurunan " + nRes[i]['nama_akun'])
                t.push(nRes[i]['saldo_akhir'])
                t.push(totalTipe[nRes[i]['class']])

                res.push(t)
              }

              let rp = JSON.parse(JSON.stringify(this.reportObj))
              rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
              rp['REPORT_CODE'] = 'RPT-ARUS-KAS'
              rp['REPORT_NAME'] = 'Laporan Arus Kas'
              rp['REPORT_FORMAT_CODE'] = 'pdf'
              rp['JASPER_FILE'] = 'rptArusKas.jasper'
              rp['REPORT_PARAMETERS'] = {
                USER_NAME: "",
                REPORT_COMPANY_ADDRESS: "",
                REPORT_COMPANY_CITY: "",
                REPORT_COMPANY_TLPN: "",
                REPORT_PERIODE: "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode'],
                TOTAL_AKTIVITAS_KAS: this.format(totalAktivitasKas, 2, 3, ".", ","),
                SALDO_AWAL_KAS: this.format(saldoAwalKas, 2, 3, ".", ","),
                SALDO_AKHIR_KAS: this.format(saldoAwalKas + totalAktivitasKas, 2, 3, ".", ",")
              }
              rp['FIELD_NAME'] = [
                "tipe",
                "namaTipe",
                "kodeAkun",
                "namaAkun",
                "saldo",
                "totalTipeSaldo"
              ]
              rp['FIELD_TYPE'] = [
                "string",
                "string",
                "string",
                "string",
                "bigdecimal",
                "bigdecimal"
              ]
              rp['FIELD_DATA'] = res

              this.sendGetReport(rp, 'ak')
            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data arus kas.', 'fail')
            }
          }
        )
      } else {
        this.loading = false
        this.ref.markForCheck()
        this.openSnackBar('Periode tidak didapatkan.', 'info')
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

    this.bulanJL = this.initBulan[this.formValueJL['tahun']]
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

    this.loadingJL = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingJL = false
      this.ref.markForCheck()
    }, 1000)
  }

  resetFormBB() {
    this.gbl.topPage()
    this.formValueBB = {
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode']
    }
    
    this.bulanBB = this.initBulan[this.formValueBB['tahun']]
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

    this.loadingBB = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingBB = false
      this.ref.markForCheck()
    }, 1000)
  }

  resetFormNS() {
    this.formValueNS = {
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode']
    }
    
    this.bulanNS = this.initBulan[this.formValueNS['tahun']]
    this.inputLayoutNS.splice(1, 1,
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

    this.loadingNS = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingNS = false
      this.ref.markForCheck()
    }, 1000)
  }

  resetFormLR() {
    this.formValueLR = {
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode']
    }
    
    this.bulanLR = this.initBulan[this.formValueLR['tahun']]
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

    this.loadingLR = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingLR = false
      this.ref.markForCheck()
    }, 1000)
  }

  resetFormNR() {
    this.formValueNR = {
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode']
    }
    
    this.bulanNR = this.initBulan[this.formValueNR['tahun']]
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

    this.loadingNR = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingNR = false
      this.ref.markForCheck()
    }, 1000)
  }

  resetFormAK() {
    this.formValueAK = {
      tipe: 't',
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode']
    }
    
    this.bulanAK = this.initBulan[this.formValueAK['tahun']]
    this.inputLayoutAK.splice(2, 1,
      {
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanAK,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        hiddenOn: {
          valueOf: 'tipe',
          matchValue: "t"
        }
      }
    )

    this.loadingAK = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingAK = false
      this.ref.markForCheck()
    }, 1000)
  }

  onCancel(type) {
    if (type === 'jl') {
      this.resetFormJL()
    } else if (type === 'bb') {
      this.resetFormBB()
    } else if (type === 'ns') {
      this.resetFormNS()
    } else if (type === 'lr') {
      this.resetFormLR()
    } else if (type === 'nr') {
      this.resetFormNR()
    } else if (type === 'ak') {
      this.resetFormAK()
    }
  }

  openRDialog(id, dialogName?: string) {
    const dialogRef = this.dialog.open(ReportdialogComponent, {
      width: '90vw',
      height: '700px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '50px' },
      data: {
        reportId: id,
        reportName: dialogName
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(
      result => {
        
      },
      error => null,
    );
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
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

  sendGetReport(p, type) {
    this.request.apiData('report', 'g-report', p).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let dn = ""
          if (type === 'jl') {
            dn = "Laporan Jurnal"
          } else if (type === 'bb') {
            dn = "Laporan Buku Besar"
          } else if (type === 'ns') {
            dn = "Laporan Neraca Saldo"
          } else if (type === 'lr') {
            dn = "Laporan Laba Rugi"
          } else if (type === 'nr') {
            dn = "Laporan Neraca"
          } else if (type === 'ak') {
            dn = "Laporan Arus Kas"
          }
          this.openRDialog(data['RESULT'], dn)
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
    this.formValueAK = {
      tipe: this.formValueAK['tipe'],
      tahun: this.activePeriod['tahun_periode'] === undefined ? "" : this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'] === undefined ? "" : this.activePeriod['bulan_periode']
    }
    this.initBulan = tmp
    this.bulanJL = tmp[this.formValueJL.tahun]
    this.bulanBB = tmp[this.formValueBB.tahun]
    this.bulanNS = tmp[this.formValueNS.tahun]
    this.bulanLR = tmp[this.formValueLR.tahun]
    this.bulanNR = tmp[this.formValueNR.tahun]
    this.bulanAK = tmp[this.formValueAK.tahun]
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
    this.inputLayoutAK.splice(1, 2,
			{
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.tahun,
        onSelectFunc: (filterBulan) => this.getBulan(filterBulan, tmp, 'ak'),
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
        options: this.bulanAK,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        hiddenOn: {
          valueOf: 'tipe',
          matchValue: "t"
        }
      },
    )
    console.log(this.bulanAK)
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
      this.bulanLR = loopBulan[filterBulan]
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
    } else if (type === "ak") {
      this.formValueAK = {
        tipe: this.forminputAK === undefined ? this.formValueAK['tipe'] : this.forminputAK.getData()['tipe'],
        tahun: filterBulan,
        bulan: ""
      }
      this.bulanAK = loopBulan[filterBulan]
      this.inputLayoutAK.splice(2, 1,
        {
          labelWidth: 'col-4',
          formWidth: 'col-7',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanAK,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
          hiddenOn: {
            valueOf: 'tipe',
            matchValue: "t"
          }
        }
      )
      setTimeout(() => {
        this.forminputAK.checkChanges()
      }, 1)
    }
  }

  getTahunTerendah() {
    return Math.min.apply(Math, this.inputPeriodeData.map(function(o) { return parseInt(o['tahun_periode']) }))
  }
  
  getBulanTertinggi(t) {
    let array = this.inputPeriodeData.filter(x => x['tahun_periode'] === t)
    return Math.max.apply(Math, array.map(function(o) { return parseInt(o['bulan_periode']) }))
  }

  getBulanTerendah(t) {
    let array = this.inputPeriodeData.filter(x => x['tahun_periode'] === t)
    return Math.min.apply(Math, array.map(function(o) { return parseInt(o['bulan_periode']) }))
  }

  format(v, n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
        num = v.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
  }
}
