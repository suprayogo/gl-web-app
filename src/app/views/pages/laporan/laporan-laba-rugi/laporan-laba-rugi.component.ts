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
  beforeCodeTitle: 'Laporan Laba Rugi'
}

@Component({
  selector: 'kt-laporan-laba-rugi',
  templateUrl: './laporan-laba-rugi.component.html',
  styleUrls: ['./laporan-laba-rugi.component.scss', '../laporan.style.scss']
})
export class LaporanLabaRugiComponent implements OnInit, AfterViewInit {

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
      label: 'Rekap',
      value: '0'
    },
    {
      label: 'Perincian Perpertual',
      value: '1'
    },
    {
      label: 'Perincian Periodik',
      value: '2'
    }
  ]

  // VARIABLES
  keyReportFormatExcel: any;
  nama_tombol: any;
  onSub: boolean = false;
  loading: boolean = true;
  loadingLR: boolean = false;
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
  bulanLR: any = [];

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;
  nama_perusahaan: any;

  // Input Name
  formValueLR = {
    format_laporan: 'xlsx',
    jenis_laporan: '0',
    kode_cabang: '',
    nama_cabang: '',
    tahun: '',
    bulan: '',
    periode_berjarak: ''
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
  inputLayoutLR = [
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
      label: 'Jenis Laporan',
      id: 'jenis-laporan',
      type: 'combobox',
      options: this.jenis_laporan,
      valueOf: 'jenis_laporan',
      required: true,
      readOnly: false,
      disabled: false,
      onSelectFunc: (data) => {
        if (data === '2') {
          this.format_laporan.splice(2, 1)
        } else {
          this.format_laporan.splice(0, 3,
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
            }
          )
        }
      }
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
      options: this.bulanLR,
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
      opt_options: this.bulanLR,
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
  onSubmitLR(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      this.formValueLR = this.forminput.getData()
      this.loading = true
      this.ref.markForCheck()
      let rk = this.formValueLR['tahun'] + this.formValueLR['bulan'] + this.formValueLR['periode_berjarak'] + this.formValueLR['kode_cabang'] + this.formValueLR['format_laporan'] + this.formValueLR['jenis_laporan']
      if (this.checkKeyReport[rk] !== undefined) {
        if (this.formValueLR['format_laporan'] === 'pdf') {
          window.open("http://deva.darkotech.id:8704/report/viewer.html?repId=" + this.checkKeyReport[rk], "_blank")
        } else {
          if (this.formValueLR['format_laporan'] === 'xlsx') {
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
        p['format_laporan'] = this.formValueLR['format_laporan']
        p['jenis_laporan'] = this.formValueLR['jenis_laporan']
        p['kode_perusahaan'] = this.kode_perusahaan
        p['nama_perusahaan'] = this.nama_perusahaan
        p['periode_from'] = this.formValueLR.bulan.toString().padStart(2, "0")
        p['periode_to'] = this.formValueLR.periode_berjarak.toString().padStart(2, "0")
        p['tahun_periode'] = this.formValueLR['tahun'].toString()
        p['kode_cabang'] = this.formValueLR['kode_cabang'] === "" ? undefined : this.formValueLR['kode_cabang']
        p['nama_cabang'] = this.formValueLR['nama_cabang'] === "" ? undefined : this.formValueLR['nama_cabang']
        p['company_adress'] = this.info_company.alamat
        p['company_city'] = this.info_company.kota
        p['company_contact'] = this.info_company.telepon
        p['user_name'] = localStorage.getItem('user_name') === undefined ? '' : localStorage.getItem('user_name')
        console.log(p['periode_from'])
        console.log(p['periode_to'])
        this.request.apiData('report', 'g-data-laba-rugi', p).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.sendGetReport(data['RESULT'], this.formValueLR['format_laporan'])
            } else {
              this.gbl.openSnackBar('Gagal mendapatkan data laba rugi.', 'fail')
              this.distinctPeriode()
              this.ref.markForCheck()
            }
          }
        )
      }

    }
  }

  //Reset Value
  resetFormLR() {
    this.formValueLR = {
      format_laporan: 'xlsx',
      jenis_laporan: '0',
      kode_cabang: this.cabang_utama.kode_cabang,
      nama_cabang: this.cabang_utama.nama_cabang,
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'],
      periode_berjarak: this.activePeriod['bulan_to']
    }

    this.bulanLR = this.initBulan[this.formValueLR['tahun']]
    this.inputLayoutLR.splice(4, 2,
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanLR,
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
        opt_options: this.bulanLR,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }
    )

    this.loadingLR = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingLR = false
      this.ref.markForCheck()
    }, 1000)
  }

  onCancel() {
    this.resetFormLR()
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
        formValue: this.formValueLR
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

  sendGetReport(p, type) {
    // this.request.apiData('report', 'g-report', p).subscribe(
    //   data => {
    //     if (data['STATUS'] === 'Y') {
    if (type === 'pdf') {
      window.open("http://deva.darkotech.id:8704/report/viewer.html?repId=" + p, "_blank");
    } else {
      if (type === 'xlsx') {
        this.keyReportFormatExcel = p + '.xlsx'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      } else {
        this.keyReportFormatExcel = p + '.xls'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      }
    }
    let rk = this.formValueLR['tahun'] + this.formValueLR['bulan'] + this.formValueLR['periode_berjarak'] + this.formValueLR['kode_cabang'] + this.formValueLR['format_laporan'] + this.formValueLR['jenis_laporan']
    this.checkKeyReport[rk] = p
    this.distinctPeriode()
    this.ref.markForCheck()
    //     } else {
    //       this.gbl.topPage()
    //       this.gbl.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail')
    //       this.distinctPeriode()
    //       this.ref.markForCheck()
    //     }
    //   }
    // )
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

    this.formValueLR = {
      format_laporan: this.formValueLR.format_laporan,
      jenis_laporan: this.formValueLR.jenis_laporan,
      kode_cabang: this.cabang_utama.kode_cabang,
      nama_cabang: this.cabang_utama.nama_cabang,
      tahun: this.formValueLR.tahun === "" ? this.activePeriod['tahun_periode'] : this.formValueLR.tahun,
      bulan: this.formValueLR.bulan === "" ? this.activePeriod['bulan_periode'] : this.formValueLR.bulan,
      periode_berjarak: this.formValueLR.periode_berjarak === "" ? this.activePeriod['bulan_to'] : this.formValueLR.periode_berjarak
    }
    this.initBulan = tmp
    this.bulanLR = tmp[this.formValueLR.tahun]
    this.inputLayoutLR.splice(0, 5,
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
        label: 'Jenis Laporan',
        id: 'jenis-laporan',
        type: 'combobox',
        options: this.jenis_laporan,
        valueOf: 'jenis_laporan',
        required: true,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => {
          if (data === '2') {
            this.format_laporan.splice(2, 1)
          } else {
            this.format_laporan.splice(0, 3,
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
              }
            )
          }
        }
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
        options: this.bulanLR,
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
        opt_options: this.bulanLR,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      },
    )
    if (this.loading === true) {
      //Check On Blur Data
      this.ref.markForCheck()
      this.gbl.updateInputdata(this.inputCabangData, 'kode_cabang', this.inputLayoutLR)
      // this.gbl.updateInputdata(this.inputAkunData, 'kode_akun', this.inputLayoutLR)

      this.loading = false
    }
  }

  getBulan(filterBulan, loopBulan) {
    this.formValueLR = {
      format_laporan: this.formValueLR['format_laporan'],
      jenis_laporan: this.formValueLR['jenis_laporan'],
      kode_cabang: this.formValueLR['kode_cabang'],
      nama_cabang: this.formValueLR['nama_cabang'],
      tahun: filterBulan,
      bulan: "",
      periode_berjarak: ""
    }
    this.bulanLR = loopBulan[filterBulan]
    this.inputLayoutLR.splice(4, 2,
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanLR,
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
        opt_options: this.bulanLR,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }
    )
    setTimeout(() => {
      this.ref.markForCheck()
      // this.forminputLR.checkChanges()
    }, 1)
  }

  checkRangeFirstPeriod(data) {
    if (+data > +this.forminput.getData()['periode_berjarak']) {
      this.gbl.openSnackBar('Atur batas atas periode lebih besar dari batas bawah periode !', 'info')
      this.formValueLR.periode_berjarak = this.forminput.getData()['bulan']
      this.forminput.getData()['periode_berjarak'] = this.forminput.getData()['bulan']

      this.inputLayoutLR.splice(4, 2,
        {
          formWidth: 'col-5',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanLR,
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
          opt_options: this.bulanLR,
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
      this.formValueLR.periode_berjarak = this.forminput.getData()['bulan']
      this.forminput.getData()['periode_berjarak'] = this.forminput.getData()['bulan']

      this.inputLayoutLR.splice(4, 2,
        {
          formWidth: 'col-5',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanLR,
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
          opt_options: this.bulanLR,
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
