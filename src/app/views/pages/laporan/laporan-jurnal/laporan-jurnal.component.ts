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

const content = {
  beforeCodeTitle: 'Laporan Jurnal'
}

@Component({
  selector: 'kt-laporan-jurnal',
  templateUrl: './laporan-jurnal.component.html',
  styleUrls: ['./laporan-jurnal.component.scss', '../laporan.style.scss']
})
export class LaporanJurnalComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild('jl', { static: false }) forminputJL;

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

  format_laporan = [
    {
      label: 'PDF - Portable Document Format',
      value: 'pdf'
    },
    {
      label: 'XLSX - Microsoft Excel 2007/2010',
      value: 'xlsx'
    },
    {
      label: 'XLS - Microsoft Excel 97/2000/XP/2003',
      value: 'xls'
    }
  ]

  // Variables
  nama_tombol: any;
  onSub: boolean = false;
  loading: boolean = true;
  loadingJL: boolean = false;
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

  // INFO PERUSAHAAN
  info_company = {
    alamat: '',
    kota: '',
    telepon: ''
  }

  // PERIODE
  inputPeriodeData = [];
  activePeriod = {};
  tahun: any = [];
  initBulan: any = [];
  bulanJL: any = [];

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // Input Name
  formValueJL = {
    format_laporan: 'pdf',
    tahun: '',
    bulan: ''
  }

  // Layout Form
  inputLayoutJL = [
    {
      // labelWidth: 'col-4',
      formWidth: 'col-5',
      label: 'Format Laporan',
      id: 'format-laporan',
      type: 'combobox',
      options: this.format_laporan,
      valueOf: 'format_laporan',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      // labelWidth: 'col-4',
      formWidth: 'col-5',
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
      // labelWidth: 'col-4',
      formWidth: 'col-5',
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
      this.formValueJL = this.forminputJL.getData()
      let p = {}
      for (var i = 0; i < this.inputPeriodeData.length; i++) {
        if (this.formValueJL.bulan === this.inputPeriodeData[i]['bulan_periode'] && this.formValueJL.tahun === this.inputPeriodeData[i]['tahun_periode']) {
          p = this.inputPeriodeData[i]
          break
        }
      }

      if (p['id_periode'] !== undefined) {
        p['kode_perusahaan'] = this.kode_perusahaan
        p['bulan_periode'] = p['bulan_periode'].length > 1 ? p['bulan_periode'] : "0" + p['bulan_periode']
        this.request.apiData('report', 'g-data-jurnal', p).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              let d = data['RESULT'], res = []
              for (var i = 0; i < d.length; i++) {
                let t = [], no_tran = "", tgl_tran = d[i]['tgl_tran'].split("-")

                if (d[i]['kode_tran'] !== "SALDO-AWAL") {
                  t.push(d[i]['no_tran'])
                  t.push(new Date(d[i]['tgl_tran']).getTime())
                  t.push(d[i]['kode_akun'])
                  t.push(d[i]['nama_akun'])
                  t.push(parseFloat(d[i]['nilai_debit']))
                  t.push(parseFloat(d[i]['nilai_kredit']))
  
                  res.push(t) 
                }
              }

              let rp = JSON.parse(JSON.stringify(this.reportObj))
              rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
              rp['REPORT_CODE'] = 'RPT-JURNAL'
              rp['REPORT_NAME'] = 'Laporan Transaksi Jurnal'
              rp['REPORT_FORMAT_CODE'] = this.formValueJL['format_laporan']
              rp['JASPER_FILE'] = 'rptJurnal.jasper'
              rp['REPORT_PARAMETERS'] = {
                USER_NAME: "",
                REPORT_COMPANY_ADDRESS: this.info_company.alamat,
                REPORT_COMPANY_CITY: this.info_company.kota,
                REPORT_COMPANY_TLPN: this.info_company.telepon,
                REPORT_PERIODE: "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode']
              }
              rp['FIELD_NAME'] = [
                "noTran",
                "tglTran",
                "kodeAkun",
                "namaAkun",
                "nilaiDebit",
                "nilaiKredit"
              ]
              rp['FIELD_TYPE'] = [
                "string",
                "date",
                "string",
                "string",
                "bigdecimal",
                "bigdecimal"
              ]
              rp['FIELD_DATA'] = res

              // if (this.formValueJL['format_laporan'] === 'pdf') {
                this.sendGetReport(rp, 'jl')
              // } else {

              // }
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

  //Reset Value
  resetFormJL() {
    this.gbl.topPage()
    this.formValueJL = {
      format_laporan: 'pdf',
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode']
    }

    this.bulanJL = this.initBulan[this.formValueJL['tahun']]
    this.inputLayoutJL.splice(2, 2,
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
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

  onCancel(type) {
    this.resetFormJL()
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    if (this.kode_perusahaan !== '' && this.kode_perusahaan != null && this.kode_perusahaan !== undefined) {
      this.request.apiData('lookup', 'g-info-company', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            for(var i = 0; i < data['RESULT'].length; i++) {
              if (data['RESULT'][i]['kode_lookup'] === 'ALAMAT-PERUSAHAAN') {
                this.info_company.alamat = data['RESULT'][i]['nilai1']
              }
              if (data['RESULT'][i]['kode_lookup'] === 'KOTA-PERUSAHAAN') {
                this.info_company.kota = data['RESULT'][i]['nilai1']
              }
              if (data['RESULT'][i]['kode_lookup'] === 'TELEPON-PERUSAHAAN') {
                this.info_company.telepon = data['RESULT'][i]['nilai1']
              }
            }
          } else {
            this.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'success')
          }
        }
      )

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
          window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + data['RESULT'], "_blank");
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
      format_laporan: this.formValueJL['format_laporan'],
      tahun: this.activePeriod['tahun_periode'] === undefined ? "" : this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'] === undefined ? "" : this.activePeriod['bulan_periode']
    }
    this.initBulan = tmp
    this.bulanJL = tmp[this.formValueJL.tahun]
    this.inputLayoutJL.splice(0, 3,
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
        label: 'Format Laporan',
        id: 'format-laporan',
        type: 'combobox',
        options: this.format_laporan,
        valueOf: 'format_laporan',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
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
        // labelWidth: 'col-4',
        formWidth: 'col-5',
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
  }

  getBulan(filterBulan, loopBulan, type) {
    this.formValueJL = {
      format_laporan: this.formValueJL['format_laporan'],
      tahun: filterBulan,
      bulan: ""
    }
    this.bulanJL = loopBulan[filterBulan]
    this.inputLayoutJL.splice(2, 2,
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
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
  }
}
