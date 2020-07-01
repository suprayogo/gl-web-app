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
  beforeCodeTitle: 'Laporan Arus Kas'
}

@Component({
  selector: 'kt-laporan-arus-kas',
  templateUrl: './laporan-arus-kas.component.html',
  styleUrls: ['./laporan-arus-kas.component.scss', '../laporan.style.scss']
})
export class LaporanArusKasComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
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

  // VARIABLES
  keyReportFormatExcel: any;
  nama_tombol: any;
  onSub: boolean = false;
  loading: boolean = true;
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
  dialogRef: any;
  dialogType: string = null;

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
  submitPeriodeData = [];
  activePeriod = {};
  tahun: any = [];
  initBulan: any = [];
  bulanAK: any = [];

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // Input Name
  formValueAK = {
    format_laporan: 'pdf',
    kode_cabang: '',
    nama_cabang: '',
    tipe: 't',
    tahun: '',
    bulan: ''
  }

  inputCabangDisplayColumns = [
    {
      label: 'Kode Cabang',
      value: 'kode_cabang'
    },
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    }
  ]
  inputCabangInterface = {
    kode_cabang: 'string',
    nama_cabang: 'string'
  }
  inputCabangData = []
  inputCabangDataRules = []

  // Layout Form
  inputLayoutAK = [
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
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_cabang',
      valueOf: 'kode_cabang',
      required: true,
      readOnly: false,
      inputInfo: {
        id: 'nama-cabang',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_cabang'
      },
      blurOption: {
        ind: 'kode_cabang',
        data: [],
        valueOf: ['kode_cabang', 'nama_cabang'],
        onFound: () => null
      },
      update: {
        disabled: true
      }
    },
    {
      // labelWidth: 'col-4',
      formWidth: 'col-5',
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
      // labelWidth: 'col-4',
      formWidth: 'col-5',
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
      // labelWidth: 'col-4',
      formWidth: 'col-5',
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

  checkPeriodReport = ""
  checkKeyReport = ""

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

  onSubmitAK(inputForm: NgForm) {
    this.gbl.topPage()
    this.loading = true
    this.ref.markForCheck()
    if (this.forminputAK !== undefined) {
      this.formValueAK = this.forminputAK.getData()
      let p = {}
      for (var i = 0; i < this.submitPeriodeData.length; i++) {
        if (this.formValueAK.bulan === this.submitPeriodeData[i]['bulan_periode'] && this.formValueAK.tahun === this.submitPeriodeData[i]['tahun_periode']) {
          p = this.submitPeriodeData[i]
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
          p['kode_cabang'] = this.formValueAK['kode_cabang'] === "" ? undefined : this.formValueAK['kode_cabang']
          p['id_akun'] = this.formValueAK['id_akun'] === "" ? undefined : this.formValueAK['id_akun']
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
              rp['REPORT_FORMAT_CODE'] = this.formValueAK['format_laporan']
              rp['JASPER_FILE'] = 'rptArusKas.jasper'
              rp['REPORT_PARAMETERS'] = {
                USER_NAME: localStorage.getItem('user_name') === undefined ? "" : localStorage.getItem('user_name'),
                REPORT_COMPANY_ADDRESS: this.info_company.alamat,
                REPORT_COMPANY_CITY: this.info_company.kota,
                REPORT_COMPANY_TLPN: this.info_company.telepon,
                REPORT_PERIODE: "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode'],
                TOTAL_AKTIVITAS_KAS: this.format(totalAktivitasKas, 2, 3, ".", ","),
                SALDO_AWAL_KAS: this.format(saldoAwalKas, 2, 3, ".", ","),
                SALDO_AKHIR_KAS: this.format(saldoAwalKas + totalAktivitasKas, 2, 3, ".", ",")
              }
              rp['FIELD_TITLE'] = [
                "Tipe",
                "Nama Tipe",
                "Kode Akun",
                "Nama Akun",
                "Saldo",
                "Total Tipe Saldo"
              ]
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
              p['bulan_periode'] = +p['bulan_periode']

              this.sendGetReport(rp, this.formValueAK['format_laporan'])
            } else {
              this.openSnackBar('Gagal mendapatkan data arus kas.', 'fail')
              this.distinctPeriode()
              this.ref.markForCheck()
            }
          }
        )
      }
    }
  }

  //Reset Value
  resetFormAK() {
    this.formValueAK = {
      format_laporan: 'pdf',
      kode_cabang: '',
      nama_cabang: '',
      tipe: 't',
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode']
    }

    this.bulanAK = this.initBulan[this.formValueAK['tahun']]
    this.inputLayoutAK.splice(4, 3,
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
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
    this.resetFormAK()
  }

  openDialog(type) {
    this.dialogType = JSON.parse(JSON.stringify(type))
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      data: {
        type: type,
        tableInterface:
          type === "kode_cabang" ? this.inputCabangInterface :
            {},
        displayedColumns:
          type === "kode_cabang" ? this.inputCabangDisplayColumns :
            [],
        tableData:
          type === "kode_cabang" ? this.inputCabangData :
            [],
        tableRules:
          type === "kode_cabang" ? this.inputCabangDataRules :
            [],
        formValue: this.formValueAK
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_cabang") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
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

      this.request.apiData('cabang', 'g-cabang-akses').subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.ref.markForCheck()
          } else {
            this.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )

      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputPeriodeData = data['RESULT']
            this.submitPeriodeData = Array.from(data['RESULT'])
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
          if (type === 'pdf') {
            if (this.checkPeriodReport !== p['REPORT_PARAMETERS']['REPORT_PERIODE']) {
              window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + data['RESULT'], "_blank");
              this.checkPeriodReport = p['REPORT_PARAMETERS']['REPORT_PERIODE']
              this.checkKeyReport = data['RESULT']
            } else if (this.checkPeriodReport === p['REPORT_PARAMETERS']['REPORT_PERIODE']) {
              window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + this.checkKeyReport, "_blank");
              this.checkPeriodReport = p['REPORT_PARAMETERS']['REPORT_PERIODE']
              this.checkKeyReport = data['RESULT']
            }
          } else if (type === 'xlsx') {
            if (this.checkPeriodReport !== p['REPORT_PARAMETERS']['REPORT_PERIODE']) {
              this.keyReportFormatExcel = data['RESULT'] + '.xlsx'
              this.checkPeriodReport = p['REPORT_PARAMETERS']['REPORT_PERIODE']
              this.checkKeyReport = data['RESULT']
              setTimeout(() => {
                let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
                sbmBtn.click();
              }, 100)
            } else {
              this.keyReportFormatExcel = this.checkKeyReport + '.xlsx'
              this.checkPeriodReport = p['REPORT_PARAMETERS']['REPORT_PERIODE']
              this.checkKeyReport = data['RESULT']
              setTimeout(() => {
                let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
                sbmBtn.click();
              }, 100)
            }
          } else {
            if (this.checkPeriodReport !== p['REPORT_PARAMETERS']['REPORT_PERIODE']) {
              this.keyReportFormatExcel = data['RESULT'] + '.xls'
              this.checkPeriodReport = p['REPORT_PARAMETERS']['REPORT_PERIODE']
              this.checkKeyReport = data['RESULT']
              setTimeout(() => {
                let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
                sbmBtn.click();
              }, 100)
            } else {
              this.keyReportFormatExcel = this.checkKeyReport + '.xls'
              this.checkPeriodReport = p['REPORT_PARAMETERS']['REPORT_PERIODE']
              this.checkKeyReport = data['RESULT']
              setTimeout(() => {
                let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
                sbmBtn.click();
              }, 100)
            }
          }
          this.distinctPeriode()
          this.ref.markForCheck()
        } else {
          this.gbl.topPage()
          this.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail')
          this.distinctPeriode()
          this.ref.markForCheck()
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
    this.formValueAK = {
      format_laporan: 'pdf',
      kode_cabang: '',
      nama_cabang: '',
      tipe: this.formValueAK['tipe'],
      tahun: this.activePeriod['tahun_periode'] === undefined ? "" : this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'] === undefined ? "" : this.activePeriod['bulan_periode']
    }
    this.initBulan = tmp
    this.bulanAK = tmp[this.formValueAK.tahun]
    this.inputLayoutAK.splice(3, 4,
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
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
        // labelWidth: 'col-4',
        formWidth: 'col-5',
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
    if(this.loading === true){
      this.loading = false
    }
  }

  getBulan(filterBulan, loopBulan, type) {
    this.formValueAK = {
      format_laporan: this.formValueAK['format_laporan'],
      kode_cabang: this.formValueAK['kode_cabang'],
      nama_cabang: this.formValueAK['nama_cabang'],
      tipe: this.formValueAK['tipe'],
      tahun: filterBulan,
      bulan: ""
    }
    this.bulanAK = loopBulan[filterBulan]
    this.inputLayoutAK.splice(4, 3,
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
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
      this.ref.markForCheck()
      // this.forminputAK.checkChanges()
    }, 1)
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
