import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

const content = {
  beforeCodeTitle: 'Laporan Buku Besar'
}

@Component({
  selector: 'kt-laporan-buku-besar',
  templateUrl: './laporan-buku-besar.component.html',
  styleUrls: ['./laporan-buku-besar.component.scss', '../laporan.style.scss']
})
export class LaporanBukuBesarComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
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
      label: 'XLSX - Microsoft Excel 2007/2010',
      value: 'xlsx'
    },
    {
      label: 'XLS - Microsoft Excel 97/2000/XP/2003',
      value: 'xls'
    },
    {
      label: 'PDF - Portable Document Format',
      value: 'pdf'
    },
  ]

  // VARIABLES
  keyReportFormatExcel: any;
  nama_tombol: any;
  onSub: boolean = false;
  loading: boolean = true;
  loadingBB: boolean = false;
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
  cabang_utama: any;

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
  bulanBB: any = [];

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // Input Name
  formValueBB = {
    // periode: JSON.stringify(this.getDateNow()),
    format_laporan: 'xlsx',
    id_akun: '',
    kode_akun: '',
    nama_akun: '',
    kode_cabang: '',
    nama_cabang: '',
    tahun: '',
    bulan: '',
    periode_berjarak: ''
  }

  // Set Field Data Cabang
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

  // Set Field Data Akun
  inputAkunDisplayColumns = [
    {
      label: 'Kode Akun',
      value: 'kode_akun'
    },
    {
      label: 'Nama Akun',
      value: 'nama_akun'
    }
  ]
  inputAkunInterface = {
    id_akun: 'string',
    kode_akun: 'string',
    nama_akun: 'string'
  }
  inputAkunData = []
  inputAkunDataRules = []

  // Layout Form
  inputLayoutBB = [
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
      formWidth: 'col-5',
      label: 'Akun',
      id: 'kode-akun',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_akun',
      valueOf: 'kode_akun',
      required: true,
      readOnly: false,
      inputInfo: {
        id: 'nama-akun',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_akun'
      },
      blurOption: {
        ind: 'kode_akun',
        data: [],
        valueOf: ['kode_akun', 'nama_akun'],
        onFound: () => null
      },
      update: {
        disabled: true
      }
    },
    {
      // labelWidth: 'col-4',
      formWidth: 'col-5',
      label: 'Tahun Periode',
      id: 'tahun-periode',
      type: 'combobox',
      options: this.tahun,
      onSelectFunc: (filterBulan) => this.getBulan(filterBulan, ''),
      valueOf: 'tahun',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      formWidth: 'col-5',
      label: 'Bulan Periode',
      id: 'bulan-periode',
      type: 'combobox',
      options: this.bulanBB,
      valueOf: 'bulan',
      required: true,
      readOnly: false,
      disabled: false,
      onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

      // Combobox Options
      opt_input: true,
      opt_label: 'Periode Berjarak',
      opt_id: 'periode-berjarak',
      opt_type: 'opt_combobox',
      opt_options: this.bulanBB,
      opt_valueOf: 'periode_berjarak',
      onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
    }
  ]

  checkKeyReport = {}

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
  onSubmitBB(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      this.formValueBB = this.forminput.getData()
      this.loading = true
      this.ref.markForCheck()
      let rk = this.formValueBB['tahun'] + this.formValueBB['bulan'] + this.formValueBB['periode_berjarak'] + this.formValueBB['kode_cabang'] + this.formValueBB['kode_akun'] + this.formValueBB['format_laporan']
      if (this.checkKeyReport[rk] !== undefined) {
        if (this.formValueBB['format_laporan'] === 'pdf') {
          window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + this.checkKeyReport[rk], "_blank")
        } else {
          if (this.formValueBB['format_laporan'] === 'xlsx') {
            this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xlsx'
            setTimeout(() => {
              let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
              sbmBtn.click();
            }, 100)
          } else {
            this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xls'
            setTimeout(() => {
              let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
              sbmBtn.click();
            }, 100)
          }
        }
        this.loading = false
        this.ref.markForCheck()
      } else {
        let p = {}
        for (var i = 0; i < this.submitPeriodeData.length; i++) {
          if (
            (typeof this.formValueBB.bulan === "number" ? JSON.stringify(this.formValueBB.bulan) : this.formValueBB.bulan) === JSON.stringify(this.submitPeriodeData[i]['bulan_periode']) &&
            (typeof this.formValueBB.tahun === "number" ? JSON.stringify(this.formValueBB.tahun) : this.formValueBB.tahun) === JSON.stringify(this.submitPeriodeData[i]['tahun_periode'])) {
            p = JSON.parse(JSON.stringify(this.submitPeriodeData[i]))
            break
          }
        }

        if (p['id_periode'] !== undefined) {
          p['kode_perusahaan'] = this.kode_perusahaan
          p['bulan_periode'] = p['bulan_periode'].length > 1 ? p['bulan_periode'] : "0" + p['bulan_periode']
          p['periode_berjarak'] = +this.formValueBB.periode_berjarak.length > 1 ? this.formValueBB.periode_berjarak : "0" + this.formValueBB.periode_berjarak
          p['tahun_periode'] = JSON.stringify(p['tahun_periode'])
          p['kode_cabang'] = this.formValueBB['kode_cabang'] === "" ? undefined : this.formValueBB['kode_cabang']
          p['id_akun'] = this.formValueBB['id_akun'] === "" ? undefined : this.formValueBB['id_akun']
          this.request.apiData('report', 'g-data-buku-besar', p).subscribe(
            data => {
              if (data['STATUS'] === 'Y') {
                let d = data['RESULT'], res = []
                for (var i = 0; i < d.length; i++) {
                  let t = [], no_tran = "", tgl_tran = d[i]['tgl_tran']

                  if (d[i]['kode_tran'] === "SALDO-AWAL") {
                    no_tran = d[i]['kode_tran']
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
                  t.push(d[i]['keterangan_1'])
                  t.push(parseFloat(d[i]['nilai_debit']))
                  t.push(parseFloat(d[i]['nilai_kredit']))
                  t.push(d[i]['nama_cabang'])

                  res.push(t)
                }


                // Check range or not
                let repPeriod;

                if (p['bulan_periode'] === p['periode_berjarak']) {
                  repPeriod = "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode']
                } else {
                  repPeriod = "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode'] + " - " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['periode_berjarak']))) + " " + p['tahun_periode']
                }

                // Set Report
                let rp = JSON.parse(JSON.stringify(this.reportObj))
                rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
                rp['REPORT_CODE'] = 'RPT-BUKU-BESAR'
                rp['REPORT_NAME'] = 'Laporan Buku Besar'
                rp['REPORT_FORMAT_CODE'] = this.formValueBB['format_laporan']
                rp['JASPER_FILE'] = 'rptGeneralLedger.jasper'
                rp['REPORT_PARAMETERS'] = {
                  USER_NAME: "",
                  REPORT_COMPANY_ADDRESS: this.info_company.alamat,
                  REPORT_COMPANY_CITY: this.info_company.kota,
                  REPORT_COMPANY_TLPN: this.info_company.telepon,
                  REPORT_PERIODE: repPeriod
                }
                rp['FIELD_TITLE'] = [
                  "Kode Akun",
                  "Nama Akun",
                  "No. Transaksi",
                  "Tgl. Transaksi",
                  "Keterangan",
                  "Nilai Debit",
                  "Nilai Kredit",
                  "Nama Cabang"
                ]
                rp['FIELD_NAME'] = [
                  "kodeAkun",
                  "namaAkun",
                  "noTran",
                  "tglTran",
                  "keterangan",
                  "nilaiDebit",
                  "nilaiKredit",
                  "namaCabang"
                ]
                rp['FIELD_TYPE'] = [
                  "string",
                  "string",
                  "string",
                  "date",
                  "string",
                  "bigdecimal",
                  "bigdecimal",
                  "string"
                ]
                rp['FIELD_DATA'] = res
                p['bulan_periode'] = +p['bulan_periode']
                p['periode_berjarak'] = +p['periode_berjarak']

                this.sendGetReport(rp, this.formValueBB['format_laporan'])
              } else {
                p['bulan_periode'] = +p['bulan_periode']
                p['periode_berjarak'] = +p['periode_berjarak']
                this.gbl.openSnackBar('Gagal mendapatkan data buku besar.', 'fail')
                this.distinctPeriode()
                this.ref.markForCheck()
              }
            }
          )
        }
      }
    }
  }

  //Reset Value
  resetFormBB() {
    this.gbl.topPage()
    this.formValueBB = {
      format_laporan: 'xlsx',
      kode_cabang: this.cabang_utama.kode_cabang,
      nama_cabang: this.cabang_utama.nama_cabang,
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'],
      periode_berjarak: this.activePeriod['bulan_periode']
    }

    this.bulanBB = this.initBulan[this.formValueBB['tahun']]
    this.inputLayoutBB.splice(4, 4,
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanBB,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

        // Combobox Options
        opt_input: true,
        opt_label: 'Periode Berjarak',
        opt_id: 'periode-berjarak',
        opt_type: 'opt_combobox',
        opt_options: this.bulanBB,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }
    )

    this.loadingBB = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingBB = false
      this.ref.markForCheck()
    }, 1000)
  }

  onCancel() {
    this.resetFormBB()
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
            type === "kode_akun" ? this.inputAkunInterface :
              {},
        displayedColumns:
          type === "kode_cabang" ? this.inputCabangDisplayColumns :
            type === "kode_akun" ? this.inputAkunDisplayColumns :
              [],
        tableData:
          type === "kode_cabang" ? this.inputCabangData :
            type === "kode_akun" ? this.inputAkunData :
              [],
        tableRules:
          type === "kode_cabang" ? this.inputCabangDataRules :
            type === "kode_akun" ? this.inputAkunDataRules :
              [],
        formValue: this.formValueBB
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_cabang") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
          }
        } else if (type === "kode_akun") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('id_akun', result.id_akun)
            this.forminput.updateFormValue('kode_akun', result.kode_akun)
            this.forminput.updateFormValue('nama_akun', result.nama_akun)
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
            for (var i = 0; i < data['RESULT'].length; i++) {
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
            this.gbl.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'success')
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
            }
            this.ref.markForCheck()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.gbl.openSnackBar('Gagal mendapatkan periode. Mohon coba lagi nanti', 'fail')
          }
        }
      )

      this.request.apiData('cabang', 'g-cabang-akses').subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.ref.markForCheck()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )

      this.request.apiData('akun', 'g-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputAkunData = data['RESULT']
            this.ref.markForCheck()
            this.distinctPeriode()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar akun. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  refreshBrowse(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.gbl.openSnackBar(message, 'success')
  }

  sendGetReport(p, type) {
    this.request.apiData('report', 'g-report', p).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (type === 'pdf') {
            window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + data['RESULT'], "_blank");
          } else {
            if (type === 'xlsx') {
              this.keyReportFormatExcel = data['RESULT'] + '.xlsx'
              setTimeout(() => {
                let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
                sbmBtn.click();
              }, 100)
            } else {
              this.keyReportFormatExcel = data['RESULT'] + '.xls'
              setTimeout(() => {
                let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
                sbmBtn.click();
              }, 100)
            }
          }
          let rk = this.formValueBB['tahun'] + this.formValueBB['bulan'] + this.formValueBB['periode_berjarak'] + this.formValueBB['kode_cabang'] + this.formValueBB['kode_akun'] + this.formValueBB['format_laporan']
          this.checkKeyReport[rk] = data['RESULT']
          this.distinctPeriode()
          this.ref.markForCheck()
        } else {
          this.gbl.topPage()
          this.gbl.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail')
          this.distinctPeriode()
          this.ref.markForCheck()
        }
      }
    )
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

    // Variable
    let akses_cabang = JSON.parse(JSON.stringify(this.inputCabangData)),
      x = [];

    // Cabang Utama User
    this.cabang_utama = akses_cabang.filter(x => x.cabang_utama_user === 'true')[0] || {}

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

    // Tahun Data
    this.tahun = outputTahun

    this.formValueBB = {
      format_laporan: this.formValueBB.format_laporan,
      kode_cabang: this.cabang_utama.kode_cabang,
      nama_cabang: this.cabang_utama.nama_cabang,
      id_akun: this.formValueBB.id_akun,
      kode_akun: this.formValueBB.kode_akun,
      nama_akun: this.formValueBB.nama_akun,
      tahun: this.formValueBB.tahun === "" ? this.activePeriod['tahun_periode'] : this.formValueBB.tahun,
      bulan: this.formValueBB.bulan === "" ? this.activePeriod['bulan_periode'] : this.formValueBB.bulan,
      periode_berjarak: this.formValueBB.periode_berjarak === "" ? this.activePeriod['bulan_periode'] : this.formValueBB.periode_berjarak
    }
    this.initBulan = tmp
    this.bulanBB = tmp[this.formValueBB.tahun]
    this.inputLayoutBB.splice(0, 5,
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
        formWidth: 'col-5',
        label: 'Akun',
        id: 'kode-akun',
        type: 'inputgroup',
        click: (type) => this.openDialog(type),
        btnLabel: '',
        btnIcon: 'flaticon-search',
        browseType: 'kode_akun',
        valueOf: 'kode_akun',
        required: true,
        readOnly: false,
        inputInfo: {
          id: 'nama-akun',
          disabled: false,
          readOnly: true,
          required: false,
          valueOf: 'nama_akun'
        },
        blurOption: {
          ind: 'kode_akun',
          data: [],
          valueOf: ['kode_akun', 'nama_akun'],
          onFound: () => null
        },
        update: {
          disabled: true
        }
      },
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.tahun,
        onSelectFunc: (filterBulan) => this.getBulan(filterBulan, tmp),
        valueOf: 'tahun',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanBB,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

        // Combobox Options
        opt_input: true,
        opt_label: 'Periode Berjarak',
        opt_id: 'periode-berjarak',
        opt_type: 'opt_combobox',
        opt_options: this.bulanBB,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      },
    )

    if (this.loading === true) {
      //Check On Blur Data
      this.ref.markForCheck()
      this.gbl.updateInputdata(this.inputCabangData, 'kode_cabang', this.inputLayoutBB)
      this.gbl.updateInputdata(this.inputAkunData, 'kode_akun', this.inputLayoutBB)

      this.loading = false
    }
  }

  getBulan(filterBulan, loopBulan) {
    this.formValueBB = {
      format_laporan: this.formValueBB['format_laporan'],
      kode_cabang: this.formValueBB['kode_cabang'],
      nama_cabang: this.formValueBB['nama_cabang'],
      id_akun: this.formValueBB['id_akun'],
      kode_akun: this.formValueBB['kode_akun'],
      nama_akun: this.formValueBB['nama_akun'],
      tahun: filterBulan,
      bulan: "",
      periode_berjarak: ""
    }
    this.bulanBB = loopBulan[filterBulan]
    this.inputLayoutBB.splice(4, 4,
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanBB,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

        // Combobox Options
        opt_input: true,
        opt_label: 'Periode Berjarak',
        opt_id: 'periode-berjarak',
        opt_type: 'opt_combobox',
        opt_options: this.bulanBB,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }
    )
    setTimeout(() => {
      this.ref.markForCheck()
      // this.forminputBB.checkChanges()
    }, 1)
  }

  checkRangeFirstPeriod(data) {
    if (+data > +this.forminput.getData()['periode_berjarak']) {
      this.gbl.openSnackBar('Atur batas atas periode lebih besar dari batas bawah periode !', 'info')
      this.formValueBB.periode_berjarak = this.forminput.getData()['bulan']
      this.forminput.getData()['periode_berjarak'] = this.forminput.getData()['bulan']

      this.inputLayoutBB.splice(4, 4,
        {
          formWidth: 'col-5',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanBB,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
          onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

          // Combobox Options
          opt_input: true,
          opt_label: 'Periode Berjarak',
          opt_id: 'periode-berjarak',
          opt_type: 'opt_combobox',
          opt_options: this.bulanBB,
          opt_valueOf: 'periode_berjarak',
          onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
        }
      )

      this.ref.markForCheck()
    }
  }

  checkRangeLastPeriod(data) {
    if (+data < +this.forminput.getData()['bulan']) {
      this.gbl.openSnackBar('Atur batas atas periode lebih besar dari batas bawah periode !', 'info')
      this.formValueBB.periode_berjarak = this.forminput.getData()['bulan']
      this.forminput.getData()['periode_berjarak'] = this.forminput.getData()['bulan']

      this.inputLayoutBB.splice(4, 4,
        {
          formWidth: 'col-5',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanBB,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
          onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

          // Checkbox
          opt_input: true,
          opt_label: 'Periode Berjarak',
          opt_id: 'periode-berjarak',
          opt_type: 'opt_combobox',
          opt_options: this.bulanBB,
          opt_valueOf: 'periode_berjarak',
          onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
        }
      )

      this.ref.markForCheck()
    }
  }
}
