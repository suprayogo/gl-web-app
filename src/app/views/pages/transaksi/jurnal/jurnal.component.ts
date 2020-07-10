import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';

const content = {
  beforeCodeTitle: 'Jurnal Umum'
}

@Component({
  selector: 'kt-jurnal',
  templateUrl: './jurnal.component.html',
  styleUrls: ['./jurnal.component.scss', '../transaksi.style.scss']
})
export class JurnalComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  tipe_jurnal = [
    {
      label: 'Jurnal Umum',
      value: '0'
    },
    {
      label: 'Jurnal Penyesuaian',
      value: '1'
    }
  ]

  // VARIABLES
  keyReportFormatExcel: any;
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = true;
  selectedTab: number = 0;
  tableLoad: boolean = false;
  onUpdate: boolean = false;
  namaTombolPrintDoc: any;
  onSubPrintDoc: boolean = true;
  enableCancel: boolean = true;
  enableEdit: boolean = false;
  enableDelete: boolean = false;
  disableSubmit: boolean = false;
  disablePrintButton: boolean = true;
  browseNeedUpdate: boolean = true;
  subscription: any;
  subPeriode: any;
  subPeriodeAktif: any;
  kode_perusahaan: any;
  periode_akses: any = {
    id_periode: '',
    tahun_periode: '',
    bulan_periode: ''
  };
  periode_aktif: any = {
    id_periode: '',
    tahun_periode: '',
    bulan_periode: ''
  };
  requestMade: boolean = false;
  batal_alasan: any = "";
  dialogRef: any;
  dialogType: string = null;

  format_cetak = [
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

  // Input Name
  formValue = {
    id_tran: '',
    id_akses_periode: '',
    no_tran: '',
    tgl_tran: JSON.stringify(this.getDateNow()),
    kode_cabang: '',
    nama_cabang: '',
    keterangan: '',
    jenis_jurnal: '0'
  }

  detailData = [
    {
      seq: '',
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      kode_divisi: '',
      nama_divisi: '',
      kode_departemen: '',
      nama_departemen: '',
      keterangan_akun: '',
      keterangan_1: '',
      keterangan_2: '',
      saldo_debit: 0,
      saldo_kredit: 0
    },
    {
      seq: '',
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      kode_divisi: '',
      nama_divisi: '',
      kode_departemen: '',
      nama_departemen: '',
      keterangan_akun: '',
      keterangan_1: '',
      keterangan_2: '',
      saldo_debit: 0,
      saldo_kredit: 0
    }
  ]

  formDetail = {
   format_cetak: 'pdf'
  }

  detailInputLayout = [
    {
      
      formWidth: 'col-5',
      label: 'Format Cetak',
      id: 'format-cetak',
      type: 'combobox',
      options: this.format_cetak,
      valueOf: 'format_cetak',
      required: true,
      readOnly: false,
      disabled: false,
    }
  ]

  //Confirmation Variable
  c_buttonLayout = [
    {
      btnLabel: 'BATALKAN TRANSAKSI',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.cancelData()
      },
      btnCondition: () => {
        return true
      }
    },
    {
      btnLabel: 'Tutup',
      btnClass: 'btn btn-secondary',
      btnClick: () => this.dialog.closeAll(),
      btnCondition: () => {
        return true
      }
    }
  ]
  c_labelLayout = [
    {
      content: 'Yakin akan membatalkan transaksi?',
      style: {
        'color': 'red',
        'font-size': '20px',
        'font-weight': 'bold'
      }
    }
  ]

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'No. Jurnal',
      value: 'no_tran'
    },
    {
      label: 'Tgl. Jurnal',
      value: 'tgl_tran',
      date: true
    },
    {
      label: 'Cabang',
      value: 'nama_cabang'
    },
    {
      label: 'Divisi',
      value: 'nama_divisi'
    },
    {
      label: 'Departemen',
      value: 'nama_departemen'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Status',
      value: 'batal_status_sub'
    },
    {
      label: 'Diinput oleh',
      value: 'nama_input_by',
    },
    {
      label: 'Diinput tanggal',
      value: 'input_dt',
      date: true
    },
    {
      label: 'Diupdate oleh',
      value: 'nama_update_by'
    },
    {
      label: 'Diupdate tanggal',
      value: 'update_dt',
      date: true
    }
  ];
  browseInterface = {
    kode_bank: 'string',
    nama_bank: 'string',
    keterangan: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = [
    {
      target: 'batal_status',
      replacement: {
        't': 'Batal',
        'f': ''
      },
      redefined: 'batal_status_sub'
    }
  ]
  inputDepartemenDisplayColumns = [
    {
      label: 'Kode Departemen',
      value: 'kode_departemen'
    },
    {
      label: 'Nama Departemen',
      value: 'nama_departemen'
    },
    {
      label: 'Nama Induk Departemen',
      value: 'nama_induk_departemen'
    }
  ]
  inputDepartemenInterface = {
    kode_departemen: 'string',
    nama_departemen: 'string',
    induk_departemen: 'string',
    nama_induk_departemen: 'string'
  }
  inputDepartemenData = []
  inputDepartemenDataRules = []
  inputDivisiDisplayColumns = [
    {
      label: 'Kode Divisi',
      value: 'kode_divisi'
    },
    {
      label: 'Nama Divisi',
      value: 'nama_divisi'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    }
  ]
  inputDivisiInterface = {
    kode_divisi: 'string',
    nama_divisi: 'string',
    keterangan: 'string'
  }
  inputDivisiData = []
  inputDivisiDataRules = []
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
  inputAkunData = []

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
			label: 'Jenis Jurnal',
			id: 'jenis-jurnal',
			type: 'combobox',
			options: this.tipe_jurnal,
			valueOf: 'jenis_jurnal',
			required: true,
			readOnly: false,
      disabled: false,
      update: {
        disabled: true
      }
		},
    {
      formWidth: 'col-5',
      label: 'No. Jurnal',
      id: 'nomor-jurnal',
      type: 'input',
      valueOf: 'no_tran',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Tgl. Jurnal',
      id: 'tgl-jurnal',
      type: 'datepicker',
      valueOf: 'tgl_tran',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: true,
      enableMax: true,
      minMaxDate: () => {
        return {
          y: this.gbl.getTahunPeriode(),
          m: this.gbl.getBulanPeriode()
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
      required: false,
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
        disabled: false
      }
    },
    // {
    //   formWidth: 'col-5',
    //   label: 'Divisi',
    //   id: 'kode-divisi',
    //   type: 'inputgroup',
    //   click: (type) => this.openDialog(type),
    //   btnLabel: '',
    //   btnIcon: 'flaticon-search',
    //   browseType: 'kode_divisi',
    //   valueOf: 'kode_divisi',
    //   required: false,
    //   readOnly: false,
    //   inputInfo: {
    //     id: 'nama-divisi',
    //     disabled: false,
    //     readOnly: true,
    //     required: false,
    //     valueOf: 'nama_divisi'
    //   },
    //   blurOption: {
    //     ind: 'kode_divisi',
    //     data: [],
    //     valueOf: ['kode_divisi', 'nama_divisi'],
    //     onFound: () => /* {
    //       this.updateInputdata(this.inputDepartemenData.filter(x => x['kode_divisi'] === (this.forminput === undefined ? null : this.forminput.getData()['kode_divisi'])), 'kode_departemen')
    //     } */null
    //   },
    //   update: {
    //     disabled: false
    //   }
    // },
    // {
    //   formWidth: 'col-5',
    //   label: 'Departemen',
    //   id: 'kode-departemen',
    //   type: 'inputgroup',
    //   click: (type) => this.openDialog(type),
    //   btnLabel: '',
    //   btnIcon: 'flaticon-search',
    //   browseType: 'kode_departemen',
    //   valueOf: 'kode_departemen',
    //   required: false,
    //   readOnly: false,
    //   inputInfo: {
    //     id: 'nama-departemen',
    //     disabled: false,
    //     readOnly: true,
    //     required: false,
    //     valueOf: 'nama_departemen'
    //   },
    //   blurOption: {
    //     ind: 'kode_departemen',
    //     data: [],
    //     valueOf: ['kode_departemen', 'nama_departemen'],
    //     onFound: null
    //   },
    //   update: {
    //     disabled: false
    //   }
    // },
    {
      formWidth: 'col-5',
      label: 'Keterangan',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: false,
      update: {
        disabled: false
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
    // if (this.gbl.getPeriodeState() === "pk") {
    //   window.parent.postMessage({
    //     'type': 'UPDATE-PERIODE'
    //   }, "*")
    //   this.gbl.setPeriodeState("p")
    // }
    this.gbl.need(true, true)
    this.namaTombolPrintDoc = "Cetak Transaksi"
    // this.reqKodePerusahaan()
    // this.reqIdPeriode()
    // this.reqIdPeriodeAktif()
    this.reqActivePeriod()
    // this.madeRequest()
  }

  ngAfterViewInit(): void {
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    if (this.kode_perusahaan !== "") {

      this.reqActivePeriod()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
  }

  reqKodePerusahaan() {
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()
        this.madeRequest()

        if (this.selectedTab == 1 && this.browseNeedUpdate) {
          this.refreshBrowse('')
        }
      }
    )
  }

  reqActivePeriod() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.periode_aktif = data['RESULT'].filter(x => x.aktif === '1')[0] || {}
            this.formValue.id_akses_periode = this.periode_aktif['id_periode']
            // this.gbl.periodeAktif(this.periode_aktif['id_periode'], this.periode_aktif['tahun_periode'], this.periode_aktif['bulan_periode'])
            // this.gbl.getIdPeriodeAktif()
            // this.gbl.getTahunPeriodeAktif()
            // this.gbl.getBulanPeriodeAktif()
            // this.periode_aktif = this.gbl.getActive()
            // if (this.periode_akses.id_periode !== this.periode_aktif.id_periode) {
            //   this.disableSubmit = true
            // } else {
            //   this.disableSubmit = false
            // }
            this.inputLayout.splice(2, 1, {
              formWidth: 'col-5',
              label: 'Tgl. Jurnal',
              id: 'tgl-jurnal',
              type: 'datepicker',
              valueOf: 'tgl_tran',
              required: true,
              readOnly: false,
              update: {
                disabled: false
              },
              timepick: false,
              enableMin: true,
              enableMax: true,
              minMaxDate: () => {
                return {
                  y: this.periode_aktif['tahun_periode'],
                  m: this.periode_aktif['bulan_periode']
                }
              }
            })
            this.formValue.tgl_tran = JSON.stringify(new Date(this.periode_aktif['tahun_periode'] + "-" + this.periode_aktif['bulan_periode'] + "-01"))
            if (this.periode_aktif.aktif !== "1") {
              this.disableSubmit = true
            } else {
              this.disableSubmit = false
            }
            this.madeRequest()
            this.ref.markForCheck()
          } else {
            this.ref.markForCheck()
            this.openSnackBar('Data Periode tidak ditemukan.')
          }
        }
      )
    }
  }

  //Tab change event
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 1 && this.browseNeedUpdate) {
      this.refreshBrowse('')
    }

    if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    let t_tran = new Date(x['tgl_tran'])
    this.formValue = {
      id_tran: x['id_tran'],
      no_tran: x['no_tran'],
      id_akses_periode: x['id_periode'],
      tgl_tran: JSON.stringify(t_tran.getTime()),
      kode_cabang: x['kode_cabang'],
      nama_cabang: x['nama_cabang'],
      keterangan: x['keterangan'],
      jenis_jurnal: x['jurnal_penyesuaian']
    }
    this.onUpdate = true;
    if(this.onUpdate === true){
      this.disablePrintButton = false
    }
    this.enableCancel = x['boleh_batal'] === 'Y' ? true : false
    this.enableEdit = x['boleh_edit'] === 'Y' ? true : false
    this.getBackToInput();
  }

  getBackToInput() {
    this.selectedTab = 0;
    // this.sendRequestDepartemen(this.formValue.kode_divisi)
    this.getDetail()
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    this.gbl.topPage()
    if (this.forminput !== undefined) {
      if (inputForm.valid && this.validateSubmit()) {
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        this.formValue.id_tran = this.formValue.id_tran === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
          length: 8,
          numeric: true,
          letters: false,
          special: false
        }))}` : this.formValue.id_tran
        this.detailData = this.formValue['detail']['data']
        this.formValue['detail'] = this.detailData
        let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan, id_periode: this.formValue['id_akses_periode'] }, this.formValue)
        this.request.apiData('jurnal', this.onUpdate ? 'u-jurnal' : 'i-jurnal', endRes).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.resetForm()
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
            } else {
              this.loading = false;
              this.ref.markForCheck()
              this.openSnackBar(data['RESULT'], 'fail')
            }
          },
          error => {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar('GAGAL MELAKUKAN PROSES.', 'fail')
          }
        )
      } else {
        if (this.forminput.getData().kode_cabang === '') {
          this.openSnackBar('Cabang tidak valid.', 'info')
        } else if (this.forminput.getData().kode_divisi === '') {
          this.openSnackBar('Divisi tidak valid.', 'info')
        } else if (this.forminput.getData().kode_departemen === '') {
          this.openSnackBar('Departemen tidak valid.', 'info')
        } else {
          if (this.onUpdate && !this.enableEdit) {
            this.openSnackBar('Tidak dapat diedit lagi.', 'info')
          } else {
            this.openSnackBar('Ada akun yang tidak valid atau saldo debit dan kredit tidak seimbang.', 'info')
          }
        }
      }
    }
  }

  printDoc(v){
    this.loading = true
    this.ref.markForCheck()
    if (this.forminput !== undefined) {
      this.formValue = this.forminput.getData()
      let data = []

      for (var i = 0 ; i < this.detailData.length; i++) {
        let t = []
        t.push(this.formValue['no_tran'])
        t.push(new Date(parseInt(this.formValue['tgl_tran'])).getTime())
        t.push(this.formValue.keterangan)
        t.push(this.formValue.nama_cabang)
        t.push(this.detailData[i]['kode_akun'])
        t.push(this.detailData[i]['nama_akun'])
        t.push(this.detailData[i]['saldo_debit'])
        t.push(this.detailData[i]['saldo_kredit'])

        data.push(t)
      }

      let rp = JSON.parse(JSON.stringify(this.reportObj))
      rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
      rp['REPORT_CODE'] = 'DOK-TRAN-JURNAL'
      rp['REPORT_NAME'] = 'Dokumen Transaksi Jurnal Umum'
      rp['REPORT_FORMAT_CODE'] = v['format_cetak']
      rp['JASPER_FILE'] = 'dokTransaksiJurnal.jasper'
      rp['REPORT_PARAMETERS'] = {
        USER_NAME: localStorage.getItem('user_name') === undefined ? "" : localStorage.getItem('user_name'),
        REPORT_COMPANY_ADDRESS: this.info_company.alamat,
        REPORT_COMPANY_CITY: this.info_company.kota,
        REPORT_COMPANY_TLPN: this.info_company.telepon,
        REPORT_PERIODE: "Periode: " +
          this.gbl.getNamaBulan(this.periode_aktif['bulan_periode']) + " " +
          this.periode_aktif['tahun_periode']
      }

      rp['FIELD_TITLE'] = [
        "No. Transaksi",
        "Tgl. Transaksi",
        "Keterangan",
        "Nama Cabang",
        "Kode Akun",
        "Nama Akun",
        "Saldo Debit",
        "Saldo Kredit"
      ]
      rp['FIELD_NAME'] = [
        "noTran",
        "tglTran",
        "keterangan",
        "namaCabang",
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
        "string",
        "string",
        "bigdecimal",
        "bigdecimal"
      ]
      rp['FIELD_DATA'] = data
      
      this.sendGetPrintDoc(rp, v['format_cetak'])
    } else {
      this.loading = false
      this.ref.markForCheck()
      this.openSnackBar('Gagal memproses dokumen.', 'info')
    }
  }

  sendGetPrintDoc(p, type) {
    this.dialog.closeAll()
    this.request.apiData('report', 'g-report', p).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (type === 'pdf') {
            if (this.checkPeriodReport !== p['REPORT_PARAMETERS']['REPORT_PERIODE']) {
              window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + data['RESULT'], "_blank");
              this.checkPeriodReport = p['REPORT_PARAMETERS']['REPORT_PERIODE']
              this.checkKeyReport = data['RESULT']
            } else {
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

  validateSubmit() {
    let valid = true

    let data = this.forminput === undefined ? null : this.forminput.getData()

    if (data != null) {
      if (data['detail'] !== undefined || data['detail'] != null) {
        if (!data['detail']['valid']) {
          valid = false
        }
      }

      for (var i = 0; i < data['detail']['data'].length; i++) {
        if (data['detail']['data'][i]['id_akun'] === '') {
          valid = false
          break;
        }
      }

      if (data['nama_departemen'] === '') valid = false
      if (data['nama_divisi'] === '') valid = false
    }

    if (this.onUpdate) {
      if (!this.enableEdit) {
        valid = false
      }
    }

    return valid
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      id_tran: '',
      no_tran: '',
      tgl_tran: this.formValue['tgl_tran'],
      id_akses_periode: this.formValue['id_akses_periode'],
      kode_cabang: '',
      nama_cabang: '',
      keterangan: '',
      jenis_jurnal: '0'
    }
    this.inputLayout.splice(2, 1, {
      formWidth: 'col-5',
      label: 'Tgl. Jurnal',
      id: 'tgl-jurnal',
      type: 'datepicker',
      valueOf: 'tgl_tran',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: true,
      enableMax: true,
      minMaxDate: () => {
        return {
          y: this.periode_aktif['tahun_periode'],
          m: this.periode_aktif['bulan_periode']
        }
      }
    })
    this.detailData = [
      {
        seq: '',
        id_akun: '',
        kode_akun: '',
        nama_akun: '',
        keterangan_akun: '',
        kode_divisi: '',
        nama_divisi: '',
        kode_departemen: '',
        nama_departemen: '',
        keterangan_1: '',
        keterangan_2: '',
        saldo_debit: 0,
        saldo_kredit: 0
      },
      {
        seq: '',
        id_akun: '',
        kode_akun: '',
        nama_akun: '',
        keterangan_akun: '',
        kode_divisi: '',
        nama_divisi: '',
        kode_departemen: '',
        nama_departemen: '',
        keterangan_1: '',
        keterangan_2: '',
        saldo_debit: 0,
        saldo_kredit: 0
      }
    ]
    this.disablePrintButton = true
    this.formInputCheckChanges()
    this.formInputCheckChangesJurnal()
  }

  resetDetailForm() {
    this.formDetail = {
     format_cetak: 'pdf'
    }
  }

  onCancel() {
    if (!this.onUpdate) {
      this.resetForm()
    } else {
      this.onUpdate = false;
      this.resetForm()
      this.datatable == undefined ? null : this.datatable.reset()
    }
  }

  cancelData(val = null) {
    this.gbl.topPage()
    if (this.onUpdate) {
      this.loading = true;
      this.ref.markForCheck()
      let endRes = {
        kode_perusahaan: val ? val : this.kode_perusahaan,
        id_tran: this.formValue.id_tran,
        batal_alasan: this.batal_alasan
      }
      this.dialog.closeAll()
      this.request.apiData('jurnal', 'c-jurnal', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
            this.ref.markForCheck()
            this.browseNeedUpdate = true
            this.refreshBrowse('BERHASIL DIBATALKAN')
          } else {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar(data['RESULT'])
          }
        },
        error => {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('GAGAL MELAKUKAN PENGHAPUSAN.')
        }
      )
    }
  }

  // Dialog
  openDialog(type) {
    // if (type === 'kode_departemen') {
    //   if (this.forminput.getData()['kode_divisi'] === "" || this.forminput.getData()['nama_divisi'] === "") {
    //     this.openSnackBar('Pilih divisi dahulu.', 'info', () => {
    //       setTimeout(() => {
    //         this.openDialog('kode_divisi')
    //       }, 250)
    //     })
    //     return
    //   }
    // }
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
            type === "kode_divisi" ? this.inputDivisiInterface :
              type === "kode_departemen" ? this.inputDepartemenInterface :
                {},
        displayedColumns:
          type === "kode_cabang" ? this.inputCabangDisplayColumns :
            type === "kode_divisi" ? this.inputDivisiDisplayColumns :
              type === "kode_departemen" ? this.inputDepartemenDisplayColumns :
                [],
        tableData:
          type === "kode_cabang" ? this.inputCabangData :
            type === "kode_divisi" ? this.inputDivisiData :
              type === "kode_departemen" ? this.inputDepartemenData/* .filter(x => x['kode_divisi'] === (this.forminput === undefined ? null : this.forminput.getData()['kode_divisi'])) */ :
                [],
        tableRules:
          type === "kode_cabang" ? this.inputCabangDataRules :
            type === "kode_divisi" ? this.inputDivisiDataRules :
              type === "kode_departemen" ? this.inputDepartemenDataRules :
                [],
        formValue: this.formValue
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

  inputDialog() {
    this.gbl.topPage()
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '150px' },
      data: {
        formValue: this.formDetail,
        inputLayout: this.detailInputLayout,
        buttonLayout: [],
        buttonName: 'Cetak',
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => this.resetDetailForm(),
        onSubmit: (x: NgForm) => this.printDoc(this.formDetail),
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

  openCDialog() { // Confirmation Dialog
    this.gbl.topPage()
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '90px' },
      data: {
        buttonLayout: this.c_buttonLayout,
        labelLayout: this.c_labelLayout,
        inputLayout: [
          {
            label: 'Nomor Transaksi',
            id: 'nomor-transaksi',
            type: 'input',
            valueOf: this.formValue.no_tran,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          // {
          //   label: 'Tanggal Transaksi',
          //   id: 'tanggal-transaksi',
          //   type: 'input',
          //   valueOf: this.formValue.tgl_tran,
          //   changeOn: null,
          //   required: false,
          //   readOnly: true,
          //   disabled: true,
          // },
          {
            label: 'Alasan Batal',
            id: 'alasan-batal',
            type: 'input',
            valueOf: null,
            changeOn: (t) => this.batal_alasan = t.target.value,
            required: true,
            readOnly: false,
            disabled: false,
          }
        ]
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(
      result => {
        this.batal_alasan = ""
      },
      error => null
    )
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif !== undefined && this.periode_aktif.id_periode !== "") && !this.requestMade) {
      this.requestMade = true
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
            this.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'success')
          }
        }
      )

      this.request.apiData('cabang', 'g-cabang-akses').subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.updateInputdata(data['RESULT'], 'kode_cabang')
          } else {
            this.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )

      this.request.apiData('divisi', 'g-divisi', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputDivisiData = data['RESULT']
            this.updateInputdata(data['RESULT'], 'kode_divisi')
            this.sendRequestAkun()
          } else {
            this.openSnackBar('Gagal mendapatkan daftar divisi. Mohon coba lagi nanti.', 'fail')
            this.loading = false
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  sendRequestAkun() {
    this.request.apiData('akun', 'g-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputAkunData = data['RESULT']
          this.loading = false
          this.ref.markForCheck()
        } else {
          this.openSnackBar('Gagal mendapatkan daftar departemen. Mohon coba lagi nanti.', 'fail')
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  getDetail() {
    this.detailLoad = true
    this.ref.markForCheck()
    this.request.apiData('jurnal', 'g-jurnal-detail', { kode_perusahaan: this.kode_perusahaan, id_tran: this.formValue.id_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = [], resp = JSON.parse(JSON.stringify(data['RESULT']))
          for (var i = 0; i < resp.length; i++) {
            let t = {
              seq: resp[i]['seq'],
              id_akun: resp[i]['id_akun'],
              kode_akun: resp[i]['kode_akun'],
              nama_akun: resp[i]['nama_akun'],
              keterangan_akun: resp[i]['keterangan_akun'],
              kode_divisi: resp[i]['kode_divisi'],
              nama_divisi: resp[i]['nama_divisi'],
              kode_departemen: resp[i]['kode_departemen'],
              nama_departemen: resp[i]['nama_departemen'],
              keterangan_1: resp[i]['keterangan_1'],
              keterangan_2: resp[i]['keterangan_2'],
              saldo_debit: parseFloat(resp[i]['nilai_debit']),
              saldo_kredit: parseFloat(resp[i]['nilai_kredit'])
            }
            res.push(t)
          }
          this.detailData = res
          this.detailLoad = false
          this.ref.markForCheck()
          this.formInputCheckChangesJurnal()
        } else {
          this.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
          this.detailLoad = false
          this.ref.markForCheck()
        }
      }
    )
  }

  refreshBrowse(message) {
    this.tableLoad = true
    this.request.apiData('jurnal', 'g-jurnal', { kode_perusahaan: this.kode_perusahaan, id_periode: this.formValue.id_akses_periode }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (message !== '') {
            this.browseData = data['RESULT']
            this.loading = false
            this.tableLoad = false
            this.ref.markForCheck()
            this.openSnackBar(message, 'success')
            this.onUpdate = false
          } else {
            this.browseData = data['RESULT']
            this.loading = false
            this.tableLoad = false
            this.browseNeedUpdate = false
            this.ref.markForCheck()
          }
        } else {
          this.browseData = []
          this.loading = false
          this.tableLoad = false
          this.browseNeedUpdate = true
          this.ref.markForCheck()
        }
      }
    )
  }

  openSnackBar(message, type?: any, onCloseFunc?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '120px' },
      data: {
        type: type === undefined || type == null ? '' : type,
        message: message === undefined || message == null ? '' : message.charAt(0).toUpperCase() + message.substr(1).toLowerCase(),
        onCloseFunc: onCloseFunc === undefined || onCloseFunc == null ? null : () => onCloseFunc()
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

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

  updateInputdata(d, vOf) {
    let t = JSON.parse(JSON.stringify(d))
    for (var i = 0; i < this.inputLayout.length; i++) {
      if (this.inputLayout[i]['type'] === 'inputgroup' && this.inputLayout[i]['browseType'] === vOf) {
        this.inputLayout[i]['blurOption']['data'] = t
        break
      }
    }
  }

  //Date Functions
  getDateNow() {
    let d = this.gbl.getTahunPeriode() + "-" + this.gbl.getBulanPeriode() + "-01"
    let p = new Date(d).getTime()
    return p
  }

  reverseConvertTime(data) {
    let date = new Date(data)

    return JSON.stringify(date.getTime())
  }
}
