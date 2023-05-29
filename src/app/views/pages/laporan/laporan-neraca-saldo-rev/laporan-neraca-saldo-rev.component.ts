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
  beforeCodeTitle: 'Laporan Neraca Saldo'
}

@Component({
  selector: 'kt-laporan-neraca-saldo-rev',
  templateUrl: './laporan-neraca-saldo-rev.component.html',
  styleUrls: ['./laporan-neraca-saldo-rev.component.scss', '../laporan.style.scss']
})
export class LaporanNeracaSaldoRevComponent implements OnInit, AfterViewInit {

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

  jenis_laporan = [
    {
      label: 'Semua Akun',
      value: '01'
    },
    {
      label: 'Hanya yang bernilai',
      value: '02'
    }
  ]

  // VARIABLES
  urlReportPdf: any;
  urlReportExcel: any;
  keyReportFormatExcel: any;
  nama_tombol: any;
  onSub: boolean = false;
  loading: boolean = true;
  loadingNS: boolean = false;
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
  lookupComp: any
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
  bulanNS: any = [];

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;
  nama_perusahaan: any;

  // Input Name
  formValueNS = {
    jenis_laporan: '01',
    format_laporan: 'xlsx',
    kode_cabang: '',
    nama_cabang: '',
    id_akun: '',
    kode_akun: '',
    nama_akun: '',
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
  inputLayoutNS = [
    {
      formWidth: 'col-5',
      label: 'Jenis Laporan',
      id: 'jenis-laporan',
      type: 'combobox',
      options: this.jenis_laporan,
      valueOf: 'jenis_laporan',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
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
      options: this.bulanNS,
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
      opt_options: this.bulanNS,
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
    this.gbl.need(true, false)
    this.madeRequest()
  }

  ngAfterViewInit(): void {
    this.kode_perusahaan = this.gbl.getKodePerusahaan()
    this.nama_perusahaan = this.gbl.getNamaPerusahaan()

    if (this.kode_perusahaan !== "") {
      this.madeRequest()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
  }

  //Form submit
  onSubmitNS(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      this.formValueNS = this.forminput.getData()
      this.loading = true
      this.ref.markForCheck()
      let rk = this.formValueNS['tahun'] + this.formValueNS['bulan'] + this.formValueNS['periode_berjarak'] + this.formValueNS['kode_cabang'] + this.formValueNS['kode_akun'] + this.formValueNS['format_laporan'] + this.formValueNS['jenis_laporan']
      if (this.checkKeyReport[rk] !== undefined) {
        if (this.formValueNS['format_laporan'] === 'pdf') {
          window.open(this.urlReportPdf + "?repId=" + this.checkKeyReport[rk], "_blank")
        } else {
          if (this.formValueNS['format_laporan'] === 'xlsx') {
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
        for (var i = 0; i < this.lookupComp.length; i++) {
          if (this.lookupComp[i]['kode_lookup'] === 'ALAMAT-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formValueNS['kode_cabang']) {
            this.info_company.alamat = this.formValueNS['kode_cabang'] !== "" ? this.lookupComp[i]['nilai1'] : ""
          }
          if (this.lookupComp[i]['kode_lookup'] === 'KOTA-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formValueNS['kode_cabang']) {
            this.info_company.kota = this.formValueNS['kode_cabang'] !== "" ? this.lookupComp[i]['nilai1'] : ""
          }
          if (this.lookupComp[i]['kode_lookup'] === 'TELEPON-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formValueNS['kode_cabang']) {
            this.info_company.telepon = this.formValueNS['kode_cabang'] !== "" ? this.lookupComp[i]['nilai1'] : ""
          }
        }
        p['jenis_laporan'] = this.formValueNS['jenis_laporan']
        p['format_laporan'] = this.formValueNS['format_laporan']
        p['kode_perusahaan'] = this.kode_perusahaan
        p['nama_perusahaan'] = this.nama_perusahaan
        p['periode_from'] = this.formValueNS.bulan.toString().padStart(2, "0")
        p['periode_to'] = this.formValueNS.periode_berjarak.toString().padStart(2, "0")
        p['tahun_periode'] = this.formValueNS['tahun'].toString()
        p['kode_cabang'] = this.formValueNS['kode_cabang'] === "" ? undefined : this.formValueNS['kode_cabang']
        p['nama_cabang'] = this.formValueNS['nama_cabang'] === "" ? undefined : this.formValueNS['nama_cabang']
        p['company_adress'] = this.info_company.alamat
        p['company_city'] = this.info_company.kota
        p['company_contact'] = this.info_company.telepon
        p['user_name'] = localStorage.getItem('user_name') === undefined ? '' : localStorage.getItem('user_name')
        this.request.apiData('report', 'g-data-neraca-saldo', p).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.sendGetReport(data['RESULT']['rep_url'], data['RESULT']['rep_id'], this.formValueNS['format_laporan'])
            } else {
              this.gbl.openSnackBar('Gagal mendapatkan data neraca saldo.', 'fail')
              this.distinctPeriode()
              this.ref.markForCheck()
            }
          }
        )
      }
    }
  }

  //Reset Value
  resetFormNS() {
    this.formValueNS = {
      jenis_laporan: '01',
      format_laporan: 'xlsx',
      kode_cabang: this.cabang_utama.kode_cabang,
      nama_cabang: this.cabang_utama.nama_cabang,
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'],
      periode_berjarak: this.activePeriod['bulan_to']
    }

    this.bulanNS = this.initBulan[this.formValueNS['tahun']]
    this.inputLayoutNS.splice(4, 4,
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanNS,
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
        opt_options: this.bulanNS,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }
    )

    this.loadingNS = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingNS = false
      this.ref.markForCheck()
    }, 1000)
  }

  onCancel() {
    this.resetFormNS()
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
        formValue: this.formValueNS
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
            this.lookupComp = data['RESULT']
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'success')
          }
        }
      )

      this.request.apiData('cabang', 'g-cabang-akses', { kode_perusahaan: this.kode_perusahaan }).subscribe(
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

      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputPeriodeData = data['RESULT']
            this.submitPeriodeData = Array.from(data['RESULT'])
            if (this.inputPeriodeData.length > 0) {
              // this.activePeriod = this.inputPeriodeData.filter(x => x.aktif === '1')[0] || {}
              this.activePeriod = {
                tahun_periode: this.getTahunTertinggi(),
                bulan_periode: this.getBulanTerendah(this.getTahunTertinggi()),
                bulan_to: this.getBulanTertinggi(this.getTahunTertinggi())
              }
            }
            this.distinctPeriode()
            this.ref.markForCheck()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.gbl.openSnackBar('Gagal mendapatkan periode. Mohon coba lagi nanti', 'fail')
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

  sendGetReport(urlReport, idReport, type) {
    if (type === 'pdf') {
      this.urlReportPdf = urlReport
      window.open(this.urlReportPdf + "?repId=" + idReport, "_blank");
    } else {
      this.urlReportExcel = urlReport
      if (type === 'xlsx') {
        this.keyReportFormatExcel = idReport + '.xlsx'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      } else {
        this.keyReportFormatExcel = idReport + '.xls'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      }
    }
    let rk = this.formValueNS['tahun'] + this.formValueNS['bulan'] + this.formValueNS['periode_berjarak'] + this.formValueNS['kode_cabang'] + this.formValueNS['kode_akun'] + this.formValueNS['format_laporan'] + this.formValueNS['jenis_laporan']
    this.checkKeyReport[rk] = idReport
    this.distinctPeriode()
    this.ref.markForCheck()
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

    this.formValueNS = {
      jenis_laporan: this.formValueNS.jenis_laporan,
      format_laporan: this.formValueNS.format_laporan,
      kode_cabang: this.cabang_utama.kode_cabang,
      nama_cabang: this.cabang_utama.nama_cabang,
      id_akun: this.formValueNS.id_akun,
      kode_akun: this.formValueNS.kode_akun,
      nama_akun: this.formValueNS.nama_akun,
      tahun: this.formValueNS.tahun === "" ? this.activePeriod['tahun_periode'] : this.formValueNS.tahun,
      bulan: this.formValueNS.bulan === "" ? this.activePeriod['bulan_periode'] : this.formValueNS.bulan,
      periode_berjarak: this.formValueNS.periode_berjarak === "" ? this.activePeriod['bulan_to'] : this.formValueNS.periode_berjarak
    }
    this.initBulan = tmp
    this.bulanNS = tmp[this.formValueNS.tahun]
    this.inputLayoutNS.splice(0, 5,
      {
        formWidth: 'col-5',
        label: 'Jenis Laporan',
        id: 'jenis-laporan',
        type: 'combobox',
        options: this.jenis_laporan,
        valueOf: 'jenis_laporan',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
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
        options: this.bulanNS,
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
        opt_options: this.bulanNS,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      },
    )
    if (this.loading === true) {
      //Check On Blur Data
      this.ref.markForCheck()
      this.gbl.updateInputdata(this.inputCabangData, 'kode_cabang', this.inputLayoutNS)
      // this.gbl.updateInputdata(this.inputAkunData, 'kode_akun', this.inputLayoutNS)

      this.loading = false
    }
  }

  getBulan(filterBulan, loopBulan) {
    this.formValueNS = {
      jenis_laporan: this.formValueNS['jenis_laporan'],
      format_laporan: this.formValueNS['format_laporan'],
      kode_cabang: this.formValueNS['kode_cabang'],
      nama_cabang: this.formValueNS['nama_cabang'],
      id_akun: this.formValueNS['id_akun'],
      kode_akun: this.formValueNS['kode_akun'],
      nama_akun: this.formValueNS['nama_akun'],
      tahun: filterBulan,
      bulan: "",
      periode_berjarak: ""
    }
    this.bulanNS = loopBulan[filterBulan]
    this.inputLayoutNS.splice(4, 4,
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanNS,
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
        opt_options: this.bulanNS,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }
    )
    setTimeout(() => {
      this.ref.markForCheck()
      // this.forminputNS.checkChanges()
    }, 1)
  }

  checkRangeFirstPeriod(data) {
    if (+data > +this.forminput.getData()['periode_berjarak']) {
      this.gbl.openSnackBar('Atur batas atas periode lebih besar dari batas bawah periode !', 'info')
      this.formValueNS.periode_berjarak = this.forminput.getData()['bulan']
      this.forminput.getData()['periode_berjarak'] = this.forminput.getData()['bulan']

      this.inputLayoutNS.splice(4, 4,
        {
          formWidth: 'col-5',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanNS,
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
          opt_options: this.bulanNS,
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
      this.formValueNS.periode_berjarak = this.forminput.getData()['bulan']
      this.forminput.getData()['periode_berjarak'] = this.forminput.getData()['bulan']

      this.inputLayoutNS.splice(4, 4,
        {
          formWidth: 'col-5',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanNS,
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
          opt_options: this.bulanNS,
          opt_valueOf: 'periode_berjarak',
          onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
        }
      )

      this.ref.markForCheck()
    }
  }

  getTahunTertinggi() {
    return Math.max.apply(Math, this.inputPeriodeData.map(function (o) { return parseInt(o['tahun_periode']) }))
  }

  getBulanTerendah(t) {
    let array = this.inputPeriodeData.filter(x => x['tahun_periode'] === t)
    return Math.min.apply(Math, array.map(function (o) { return parseInt(o['bulan_periode']) }))
  }

  getBulanTertinggi(t) {
    let array = this.inputPeriodeData.filter(x => x['tahun_periode'] === t)
    return Math.max.apply(Math, array.map(function (o) { return parseInt(o['bulan_periode']) }))
  }
}
