import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';

const content = {
  beforeCodeTitle: 'Jurnal Batch'
}

@Component({
  selector: 'kt-jurnal-batch-rev',
  templateUrl: './jurnal-batch-rev.component.html',
  styleUrls: ['./jurnal-batch-rev.component.scss', '../transaksi.style.scss']
})
export class JurnalBatchRevComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // OTHERS VARIABLE
  content: any; // <-- TITLE NAME MENU
  loading: boolean = true; // <-- LOADING PAGE MENU
  detailLoad: boolean = false; // < -- LOADING DETAIL INPUT
  tableLoad: boolean = false; // <-- LOADING PAGE TAB MENU BROWSE
  // ---------------
  enableDetail: boolean = true;
  selectedTab: number = 0;
  onUpdate: boolean = false;
  enableCancel: boolean = false;
  enableStatus: boolean = false;
  enableEdit: boolean = true;
  enableDelete: boolean = false;
  disableSubmit: boolean = true;
  browseNeedUpdate: boolean = true;
  // -----------------
  dialogRef: any;
  dialogType: string = null;
  // -----------------
  requestMade: boolean = false;
  statSubmit: boolean = false;
  batal_alasan: any = "";
  // -----------------
  id_kasir: any = "";
  dayLimit: any = 0;
  // ----------------
  cabang_utama: any;
  // ----------------
  id_periode = "";
  daftar_periode_kasir: any = [];
  // ----------------
  checkPeriod: any;
  periodeTS: any;  // <-- TS = TUTUP SEMENTARA
  periode_akses: any;
  // ---------------
  namaStatus: any = '';
  styleStatus: any = {};

  // CONFIRMATION DIALOG VARIABLE
  c_buttonLayout = [
    {
      btnLabel: 'Konfirmasi Batal',
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

  // INFO COMPANY
  lookupComp: any
  info_company = {
    alamat: '',
    kota: '',
    telepon: ''
  }

  // PERUSAHAAN
  subscription: any; // <-- PERUSAHAAN SUBSCRIPTION
  kode_perusahaan: any;

  // PERIODE SUBSCRIPTION
  subPeriode: any;
  subPeriodeAktif: any;

  // PERIODE AKTIF
  periode_aktif: any = {
    id_periode: '',
    tahun_periode: '',
    bulan_periode: ''
  };

  periode_kasir: any = {
    id_periode: '',
    tgl_periode: ''
  };

  // CETAKAN DOKUMEN VARIABLE
  namaTombolPrintDoc: any; // <-- NAMA TOMBOL CETAKAN DOKUMEN
  onSubPrintDoc: boolean = true; // <-- TOMBOL CETAKAN MUNCUL/TIDAK
  disablePrintButton: boolean = false; // <-- TOMBOL CETAKAN DISABLE/TIDAK
  namaTombolPrintDoc2: any; // <-- NAMA TOMBOL CETAKAN DOKUMEN
  onSubPrintDoc2: boolean = false; // <-- TOMBOL CETAKAN MUNCUL/TIDAK
  disablePrintButton2: boolean = false; // <-- TOMBOL CETAKAN DISABLE/TIDAK
  keyReportFormatExcel: any; // <-- SET KEY UNTUK CETAKAN KE EXCEL
  checkKeyReport = {} // <-- SET KEY UNTUK REQUEST YANG SAMA
  formReport = {} // <-- DATA HEADER CETAKAN 
  reportDetail = [] // <-- DATA DETAIL CETAKAN 
  periodeCabang: any

  // FORMAT CETAKAN DOKUMEN
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

  // --------------------------------------------||----------------------------------------------------

  // CHECKBOX VARIABLE
  // TIPE JURNAL
  tipe_jurnal = [
    {
      label: 'Jurnal Umum',
      value: '0'
    },
    {
      label: 'Jurnal Penyesuaian',
      value: '1'
    },
    {
      label: 'Kasir',
      value: '2'
    }
  ]

  // TIPE PERIODE JURNAL BERDASARKAN WAKTU
  tipe_periode = [
    {
      label: 'Berjalan',
      value: '0'
    }
  ]

  // JURNAL UMUM : LIST PERIODE TUTUP SEMENTARA
  daftar_periode = [
    {
      label: '',
      value: ''
    }
  ]

  // JURNAL TRANSAKSI : LIST JENIS TRANSAKSI
  jenis_transaksi = [];
  // JURNAL TRANSAKSI : LIST BANK
  bank = [];
  // JURNAL TRANSAKSI : TIPE TRANSAKSI
  tipe_transaksi = [
    {
      label: 'Masuk',
      value: '0'
    },
    {
      label: 'Keluar',
      value: '1'
    }
  ];

  // --------------------------------------------||----------------------------------------------------

  // L.O.V VARIABLE
  // LIST CABANG
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

  // LIST TANGGAL JURNAL TRANSAKSI BUKA KEMBALI
  inputTanggalDisplayColumns = [
    {
      label: 'Tgl Periode',
      value: 'tgl_periode',
      date: true
    },
    {
      label: 'Status Buka Kembali',
      value: 'buka_kembali_sub'
    }
  ]
  inputTanggalInterface = {
    tgl_periode: 'string',
    buka_kembali: 'string'
  }
  inputTanggalData = []
  inputTanggalDataRules = [
    {
      target: 'buka_kembali',
      replacement: {
        '1': 'Aktif',
        '0': 'Nonaktif'
      },
      redefined: 'buka_kembali_sub'
    }
  ]

  // OTHERS LIST
  inputDivisiData = [] // <-- DETAIL JURNAL
  inputDepartemenData = [] // <-- DETAIL JURNAL
  inputAkunData = [] // <-- DETAIL JURNAL
  inputJenisTransaksiData = [] // <-- JURNAL TRANSAKSI
  inputRekeningPerusahaanData = [] // <-- JURNAL TRANSAKSI

  // --------------------------------------------||----------------------------------------------------

  // INPUT NORMAL
  // FORM INPUT NAME HEADER
  formValue = {
    id_tran: '',
    id_akses_periode: '',
    no_tran: '',
    no_jurnal: '',
    tgl_tran: '',
    kode_cabang: '',
    nama_cabang: '',
    keterangan: '',

    jenis_jurnal: '0',

    // JURNAL TRANSAKSI
    id_tran_jt: '',
    id_jenis_transaksi: '',
    kode_jenis_transaksi: '',
    nilai_jenis_transaksi: '',
    lembar_giro: 0,
    tipe_transaksi: '0',
    saldo_transaksi: 0,
    tipe_laporan: '',
    kode_template: '',

    // TIPE PERIODE
    periode: '0'
  }

  // FORM INPUT NAME DETAIL
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
      saldo_kredit: 0,
      lembar_giro: 1
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
      saldo_kredit: 0,
      lembar_giro: 1
    }
  ]

  // --------------------------------------------||----------------------------------------------------

  // FORM LAYOUT HEADER
  inputLayout = [
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
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
      },
      onSelectFunc: (value) => {
        this.forminput.getData()['periode'] = "0"
        this.setValPeriodType(value)
        if (value === "2") {
          this.resetForm()
          this.displayedColumnsTable = this.displayedColumnsTableKasir
          this.onSubPrintDoc = false
          this.onSubPrintDoc2 = true
          this.forminput.getData()['tgl_tran'] = ""
          this.formValue.tgl_tran = ""
          this.tanggalJurnalKasir('')
          this.browseNeedUpdate = true
        } else {
          this.detailData.splice(1, 1,
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
              saldo_kredit: 0,
              lembar_giro: 1
            }
          )
          this.onSubPrintDoc = true
          this.onSubPrintDoc2 = false
          this.displayedColumnsTable = this.displayedColumnsTableUmum
          this.forminput.getData()['tgl_tran'] = ""
          this.formValue.tgl_tran = ""
          this.forminput.getData()['id_jenis_transaksi'] = ""
          this.formValue.id_jenis_transaksi = ""
          this.forminput.getData()['tipe_laporan'] = ""
          this.formValue.tipe_laporan = ""
          this.insertAt(this.inputLayout, 5, 1, this.setFormLayout('umum'))
          this.browseNeedUpdate = true
        }
        this.formValue.jenis_jurnal = value
        this.formInputCheckChangesJurnal()
        this.ref.markForCheck()
      }
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Periode',
      id: 'periode',
      type: 'combobox',
      options: this.tipe_periode,
      valueOf: 'periode',
      required: true,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
      },
      onSelectFunc: (value) => {
        this.forminput.getData()['tgl_tran'] = ""
        this.formValue.tgl_tran = ""
        if (value === "0") {
          if (this.forminput.getData()['jenis_jurnal'] === "2") {
            this.tanggalJurnalKasir('')
            this.browseNeedUpdate = true
          } else {
            let val = this.setFormLayout('umum')
            this.insertAt(this.inputLayout, 5, 1, val)
            this.browseNeedUpdate = true
          }
        } else if (value === "1") {
          this.reqPeriodTutupSementara()
          this.browseNeedUpdate = true
        } else if (value === "2") {
          this.tanggalBukaKembali()
          this.browseNeedUpdate = true
        }
      },
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_cabang',
      valueOf: 'kode_cabang',
      required: false,
      readOnly: true,
      inputInfo: {
        id: 'nama-cabang',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_cabang'
      },
      update: {
        disabled: true
      }
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Periode Akses',
      id: 'periode-akses',
      type: 'combobox',
      options: this.daftar_periode,
      valueOf: 'id_akses_periode',
      onSelectFunc: (v) => {
        this.setPeriode(v)
      },
      required: false,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
      },
      hiddenOn: {
        valueOf: 'periode',
        matchValue: ["0", "2", ""]
      }
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'No. Transaksi',
      id: 'no_tran',
      type: 'input',
      valueOf: 'no_tran',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: true
      },
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Tgl. Transaksi',
      id: 'tgl-tran',
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
      },
      onSelectFunc: (value) => {
      }
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
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

  // FORM LAYOUT HEADER : RIGHT SIDE
  rightInputLayout = [
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Jenis Transaksi',
      id: 'jenis-transaksi',
      type: 'combobox',
      options: [],
      valueOf: 'id_jenis_transaksi',
      onSelectFunc: (v) => {
        this.formInputCheckChangesJurnal()
      },
      required: true,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
      },
      hiddenOn: {
        valueOf: 'jenis_jurnal',
        matchValue: ["0", "1", ""]
      }
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Rekening',
      id: 'rekening-perusahaan',
      type: 'combobox',
      options: [],
      valueOf: 'nilai_jenis_transaksi',
      required: true,
      readOnly: false,
      disabled: false,
      hiddenOn: {
        valueOf: 'tipe_laporan',
        matchValue: ["k", "p", ""]
      },
      update: {
        disabled: true
      }
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Tipe Transaksi',
      id: 'tipe-transaksi',
      type: 'combobox',
      options: this.tipe_transaksi,
      valueOf: 'tipe_transaksi',
      required: true,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
      },
      hiddenOn: {
        valueOf: 'jenis_jurnal',
        matchValue: ["0", "1", ""]
      },
      onSelectFunc: (v) => {
        // this.resetForm()
        this.formInputChangeTipeTran()
        this.formValue.tipe_transaksi = v
        this.formInputCheckChangesJurnal()
      }
    }
  ]

  // --------------------------------------------||----------------------------------------------------

  // TAB MENU BROWSE
  displayedColumnsTable = [];
  displayedColumnsTableUmum = [
    {
      label: 'Cetak',
      value: 'cetak_jurnal_check'
    },
    {
      label: 'No. Transaksi',
      value: 'no_tran'
    },
    {
      label: 'Tgl. Transaksi',
      value: 'tgl_tran',
      date: true
    },
    {
      label: 'Cabang',
      value: 'nama_cabang'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Status Pengajuan Batal',
      value: 'pengajuan_batal_status_name'
    },
    {
      label: 'Tgl.Pengajuan Batal',
      value: 'batal_pengajuan_tgl',
      date: true
    },
    {
      label: 'Alasan Pengajuan Batal',
      value: 'batal_pengajuan_alasan'
    },
    {
      label: 'Status Batal',
      value: 'batal_status_name'
    },
    {
      label: 'Status Approval Edit',
      value: 'edit_approval_status'
    },
    {
      label: 'Keterangan Approval Edit',
      value: 'edit_approval_keterangan'
    },
    {
      label: 'Tgl.Edit',
      value: 'edit_tgl',
      date: true
    },
    {
      label: 'Username Edit',
      value: 'edit_user'
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
  displayedColumnsTableKasir = [
    {
      label: 'Cetak',
      value: 'cetak_jurnal_check'
    },
    {
      label: 'No. Transaksi',
      value: 'no_tran'
    },
    {
      label: 'Tgl. Transaksi',
      value: 'tgl_tran',
      date: true
    },
    {
      label: 'Cabang',
      value: 'nama_cabang'
    },
    {
      label: 'Jenis Transaksi',
      value: 'nama_jenis_transaksi'
    },
    {
      label: 'Tipe Transaksi',
      value: 'nama_tipe_transaksi'
    },
    {
      label: 'Saldo Transaksi',
      value: 'saldo_transaksi',
      number: true
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Status Pengajuan Batal',
      value: 'pengajuan_batal_status_name'
    },
    {
      label: 'Tgl. Pengajuan Batal',
      value: 'batal_pengajuan_tgl',
      date: true
    },
    {
      label: 'Alasan Pengajuan Batal',
      value: 'batal_pengajuan_alasan'
    },
    {
      label: 'Status Batal',
      value: 'batal_status_name'
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
  browseInterface = {}
  browseData = []
  browseDataRules = [
    {
      target: 'batal_pengajuan_approval_status',
      replacement: {
        'AP': 'Approved',
        'IP': 'In progress',
        'RJ': 'Reject',
        '': ''
      },
      redefined: 'pengajuan_batal_status_name'
    },
    {
      target: 'batal_status',
      replacement: {
        true: '\u2713',
        false: '',
        '': ''
      },
      redefined: 'batal_status_name'
    },
    {
      target: 'cetak_jurnal',
      replacement: {
        true: '\u2713',
        false: '',
        '': ''
      },
      redefined: 'cetak_jurnal_check'
    }
  ]

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.gbl.need(true, true)
    if (this.formValue.jenis_jurnal === "2") {
      this.displayedColumnsTable = this.displayedColumnsTableKasir
    } else {
      this.displayedColumnsTable = this.displayedColumnsTableUmum
    }
    this.content = content // TITLE NAME
    this.namaTombolPrintDoc = "Cetak Jurnal Umum" // CETAKAN DOKUMEN BUTTON NAME
    this.namaTombolPrintDoc2 = "Cetak Jurnal Kasir" // CETAKAN DOKUMEN BUTTON NAME
    this.reqActivePeriod()
    this.setValPeriodType(this.formValue.jenis_jurnal)
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

  // GET DATA PERIODE AKTIF
  reqActivePeriod() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('periode', 'g-periode-aktif', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.periode_aktif = data['RESULT'].filter(x => x.aktif === '1')[0] || {}
            this.periodeCabang = JSON.parse(JSON.stringify(data['RESULT']))
            this.checkPeriod = data['RESULT']
            // this.formValue.tgl_tran = JSON.stringify(new Date(this.periode_aktif['tahun_periode'] + "-" + this.periode_aktif['bulan_periode'] + "-01"))
            // let val = this.setFormLayout('umum')
            // this.insertAt(this.inputLayout, 5, 1, val)
            this.madeRequest()
            this.ref.markForCheck()
          } else {
            this.ref.markForCheck()
            this.gbl.openSnackBar('Data Periode tidak ditemukan.', 'fail')
          }
        }
      )
    }
  }

  // GET OTHERS DATA
  madeRequest() {
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif !== undefined && this.periode_aktif.id_periode !== "") && !this.requestMade) {
      this.requestMade = true
      this.request.apiData('lookup', 'g-info-company', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.lookupComp = data['RESULT']
            this.ref.markForCheck()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'success')
            this.ref.markForCheck()
          }
        }
      )

      this.request.apiData('lookup', 'g-lookup', { kode_perusahaan: this.kode_perusahaan, kode_group_lookup: 'BATAS-HARI-TRANSAKSI', kode_lookup: 'BATAS-HARI-TRANSAKSI-KASIR' }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            let l = parseInt(data['RESULT'][0]['nilai1'])
            this.dayLimit = l
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar lookup. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
            return
          }
        }
      )

      // GET DATA AKSES CABANG USER
      this.request.apiData('cabang', 'g-cabang-akses', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            this.inputCabangData = data['RESULT']
            // Variable
            let akses_cabang = JSON.parse(JSON.stringify(this.inputCabangData))
            // Cabang Utama User
            this.cabang_utama = akses_cabang.filter(x => x.cabang_utama_user === 'true')[0] || {}
            this.formValue.kode_cabang = this.cabang_utama.kode_cabang
            this.formValue.nama_cabang = this.cabang_utama.nama_cabang
            // this.gbl.updateInputdata(data['RESULT'], 'kode_cabang', this.inputLayout)
            window.parent.postMessage({
              'type': 'CHANGE-PERIODE',
              'value': {
                kode_cabang: this.formValue.kode_cabang
              }
            }, "*")
            this.periode_aktif = this.periodeCabang.filter(x => x.aktif === '1' && x.kode_cabang === this.formValue.kode_cabang)[0] || {}
            if (this.periode_aktif.aktif !== "1") {
              this.disableSubmit = true
            } else {
              this.disableSubmit = false
            }
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
          }
        }
      )

      // GET DATA DIVISI
      this.request.apiData('divisi', 'g-divisi', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputDivisiData = data['RESULT']
            this.reqDataKasir()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar divisi. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  // GET DATA USER KASIR
  reqDataKasir() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('kasir', 'g-status-user-kasir', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            if (data['RESULT'].length > 0) {
              let t = data['RESULT'][0]
              if (t['aktif'] !== 'Y') {
                this.tipe_jurnal.splice(2, 1)
                this.reqDataAkun('umum')
              } else {
                this.id_kasir = t['id_kasir']
                this.reqPeriodeKasir()
              }
            } else {
              this.tipe_jurnal.splice(2, 1)
              this.reqDataAkun('umum')
            }
          } else {
            this.tipe_jurnal.splice(2, 1)
            this.reqDataAkun('umum')
          }
        }
      )
    }
  }

  // GET DATA AKUN
  reqDataAkun(type) {
    this.request.apiData('akun', 'g-group-akun-user', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputAkunData = data['RESULT']
          if (type === "umum") {
            this.loading = false
          } else if (type === "kasir") {
            this.formValue.jenis_jurnal = '2'
            this.detailData.splice(1, 1)
            this.setValPeriodType(this.formValue.jenis_jurnal)
            this.displayedColumnsTable = this.displayedColumnsTableKasir
            this.onSubPrintDoc = false
            this.onSubPrintDoc2 = true
            this.formValue.tgl_tran = ""
            this.tanggalJurnalKasir('')
            this.browseNeedUpdate = true
            this.reqDataJenisTransaksi()
          }
          this.ref.markForCheck()
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan daftar akun. Mohon coba lagi nanti.', 'fail')
          this.ref.markForCheck()
        }
      }
    )
  }

  // GET DATA PERIODE KASIR (JURNAL TRANSAKSI ONLY)
  reqPeriodeKasir() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('periode', 'g-periode-kasir', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.daftar_periode_kasir = data['RESULT']
            this.reqDataAkun('kasir')
            this.ref.markForCheck()
          } else {
            this.gbl.openSnackBar('Data Periode tidak ditemukan.')
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  // GET DATA JENIS TRANSAKSI (JURNAL TRANSAKSI ONLY)
  reqDataJenisTransaksi() {
    this.request.apiData('jenis-transaksi', 'g-jenis-transaksi', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = []
          for (var i = 0; i < data['RESULT'].length; i++) {
            let t = {
              label: data['RESULT'][i]['kode_jenis_transaksi'] + " - " + data['RESULT'][i]['nama_jenis_transaksi'],
              value: data['RESULT'][i]['id_jenis_transaksi']
            }
            res.push(t)
          }
          this.jenis_transaksi = res
          this.inputJenisTransaksiData = data['RESULT']
          this.rightInputLayout.splice(0, 1, {
            labelWidth: 'col-3',
            formWidth: 'col-9',
            label: 'Jenis Transaksi',
            id: 'jenis-transaksi',
            type: 'combobox',
            options: this.jenis_transaksi,
            valueOf: 'id_jenis_transaksi',
            onSelectFunc: (v) => {
              let d = this.inputJenisTransaksiData.filter(x => x['id_jenis_transaksi'] === v)
              if (d.length > 0) {
                this.forminput.updateFormValue('kode_jenis_transaksi', d[0]['kode_jenis_transaksi'])
                this.forminput.updateFormValue('tipe_laporan', d[0]['tipe_laporan'])
              }
              this.formValue.tipe_laporan = d[0]['tipe_laporan']
              if (this.forminput.getData().periode === '0') {
                this.forminput.getData()['tgl_tran'] = ""
                this.formValue.tgl_tran = ""
                if (this.formValue.tipe_laporan === 'b') {
                  let val = this.setFormLayout('kasir-khusus-bank')
                  this.insertAt(this.inputLayout, 5, 1, val)
                } else {
                  let val = this.setFormLayout('kasir')
                  this.insertAt(this.inputLayout, 5, 1, val)
                }
              }

              this.formInputCheckChangesJurnal()
            },
            required: true,
            readOnly: false,
            disabled: false,
            update: {
              disabled: true
            },
            hiddenOn: {
              valueOf: 'jenis_jurnal',
              matchValue: ["0", "1", ""]
            }
          })
          this.reqDataRekeningPerusahaan()
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan daftar jenis transaksi. Mohon coba lagi nanti.', 'fail')
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  // GET DATA REKENING BANK PERUSAHAAN (JURNAL TRANSAKSI ONLY)
  reqDataRekeningPerusahaan() {
    this.request.apiData('rekening-perusahaan', 'g-rekening-perusahaan', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = []
          for (var i = 0; i < data['RESULT'].length; i++) {
            let t = {
              label: data['RESULT'][i]['no_rekening'] + " - " + data['RESULT'][i]['nama_bank'] + " (" + data['RESULT'][i]['atas_nama'] + ")",
              value: data['RESULT'][i]['no_rekening'],
              kode_cabang: data['RESULT'][i]['kode_cabang']
            }
            res.push(t)
          }
          this.bank = res
          let x = this.bank.filter(x => x.kode_cabang === this.formValue.kode_cabang)
          this.inputRekeningPerusahaanData = data['RESULT']
          this.rightInputLayout.splice(1, 1, {
            labelWidth: 'col-3',
            formWidth: 'col-9',
            label: 'Rekening',
            id: 'rekening-perusahaan',
            type: 'combobox',
            options: x,
            valueOf: 'nilai_jenis_transaksi',
            required: true,
            readOnly: false,
            disabled: false,
            hiddenOn: {
              valueOf: 'tipe_laporan',
              matchValue: ["k", "p", "g", ""]
            },
            update: {
              disabled: true
            }
          })
          this.loading = false
          this.ref.markForCheck()
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan daftar rekening perusahaan. Mohon coba lagi nanti.', 'fail')
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  // TAB CHANGE EVENT
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 1 && this.browseNeedUpdate) {
      this.refreshBrowse('')
    }

    if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  }

  // BROWSE DATA (TAB MENU : BROWSE)
  refreshBrowse(message, select?) {
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    this.browseData = []
    if (this.formValue.jenis_jurnal === "2") {
      this.tableLoad = true
      let ba = this.periode_aktif.bulan_periode < 10 ? "0" + this.periode_aktif.bulan_periode : this.periode_aktif.bulan_periode
      if (this.periode_kasir['tgl_periode'] !== '') {
        let tgl_awal = this.periode_kasir['tgl_periode'],
          x = new Date(this.periode_kasir['tgl_periode']),
          y = x.setDate(x.getDate() + this.dayLimit),
          tgl_akhir = this.splitDate(y),
          endRes = {}
        if (this.formValue.periode === "0") {
          endRes = {
            kode_perusahaan: this.kode_perusahaan,
            kode_cabang: this.formValue.kode_cabang,
            jenis_jurnal: '01',
            tgl_periode_awal: tgl_awal,
            tgl_periode_akhir: tgl_akhir,
            periode: this.periode_aktif['tahun_periode'] + '-' + ba
          }
        } else {
          if (this.formValue.tgl_tran !== '') {
            endRes = {
              kode_perusahaan: this.kode_perusahaan,
              kode_cabang: this.formValue.kode_cabang,
              jenis_jurnal: '01',
              tgl_periode: this.formValue.tgl_tran
            }
          } else {
            this.gbl.openSnackBar('Pilih tanggal terlebih dahulu.', 'info', () => {
              this.selectedTab = 0
              this.ref.markForCheck()
            })
          }
        }

        this.request.apiData('jurnal', 'g-jurnal', endRes).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              if (message !== '') {
                this.browseData = data['RESULT']
                this.loading = false
                this.tableLoad = false
                this.browseNeedUpdate = false
                this.ref.markForCheck()
                this.gbl.openSnackBar(message, 'success')
                this.onUpdate = false
              } else {
                this.browseData = data['RESULT']
                if (select !== undefined) {
                  let search = JSON.parse(JSON.stringify(this.browseData)),
                    x
                  x = search.filter(x => x['id_tran'] === select)[0] || {}
                  this.formValue.no_tran = x.no_tran
                  this.formValue.no_jurnal = x.no_jurnal
                  this.printDoc2()
                } else {
                  this.loading = false
                  this.tableLoad = false
                  this.browseNeedUpdate = false
                  this.ref.markForCheck()
                }
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
      } else {
        this.gbl.openSnackBar('Tanggal periode jurnal dan transaksi tidak sesuai.', 'info', () => {
          this.selectedTab = 0
          this.ref.markForCheck()
        })
      }
    } else {
      this.tableLoad = true
      let ba = this.periode_aktif.bulan_periode < 10 ? "0" + this.periode_aktif.bulan_periode : this.periode_aktif.bulan_periode, bs
      if (this.periodeTS != undefined) {
        bs = this.periodeTS.bulan_periode < 10 ? "0" + this.periodeTS.bulan_periode : this.periodeTS.bulan_periode
      }

      this.request.apiData('jurnal', 'g-jurnal', {
        kode_perusahaan: this.kode_perusahaan,
        kode_cabang: this.formValue.kode_cabang,
        jenis_jurnal: this.formValue.jenis_jurnal === '0' ? '04' : '02',
        periode: this.formValue.periode === "0" ? this.periode_aktif.tahun_periode + "-" + ba : this.periodeTS.tahun_periode + "-" + bs
      }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            if (message !== '') {
              this.browseData = data['RESULT']
              this.loading = false
              this.tableLoad = false
              this.ref.markForCheck()
              this.gbl.openSnackBar(message, 'success')
              this.onUpdate = false
            } else {
              this.browseData = data['RESULT']
              if (select !== undefined) {
                let search = JSON.parse(JSON.stringify(this.browseData)),
                  x
                x = search.filter(x => x['id_tran'] === select)[0] || {}
                this.formValue.no_tran = x.no_tran
                this.formValue.no_jurnal = x.no_tran
                this.printDoc()
              } else {
                this.loading = false
                this.tableLoad = false
                this.browseNeedUpdate = false
                this.ref.markForCheck()
              }
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
  }

  // CHOOSE DATA HEADER FROM ROWS
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data)),
      t_tran = new Date(x['tgl_tran'])
    this.enableCancel = false
    this.enableEdit = x['boleh_edit'] === 'Y' ? true : false
    if (this.forminput.getData()['jenis_jurnal'] === "2") {
      this.formValue = this.setFormV(x, t_tran, 'kasir')
      this.id_periode = ''
      if (this.formValue.periode === '0') {
        if (x['buka_kembali'] === '1') {
          this.enableEdit = false
        }
        if (this.formValue.tipe_laporan === 'b') {
          this.insertAt(this.inputLayout, 5, 1, this.setFormLayout('kasir-khusus-bank'))
        } else {
          this.insertAt(this.inputLayout, 5, 1, this.setFormLayout('kasir'))
        }
      }
    } else {
      this.formValue = this.setFormV(x, t_tran, 'umum')
      if (this.forminput.getData()['periode'] === "0") {
        this.insertAt(this.inputLayout, 5, 1, this.setFormLayout('umum'))
      }/* else if(this.forminput.getData()['periode'] === "1"){
        // WAITING
      } */
    }
    this.insertAt(this.inputLayout, 6, 1, this.setFormLayout('ket'))
    this.onUpdate = true;
    this.enableCancel = this.enableEdit == true ? true : false
    this.disableSubmit = this.enableEdit == true ? false : true
    this.disablePrintButton2 = x['batal_pengajuan_approval_status'] == 'AP' || x['batal_status'] == true ? true : false
    this.disablePrintButton = x['batal_pengajuan_approval_status'] == 'AP' || x['batal_status'] == true ? true : false
    if (x['batal_status']) {
      this.enableStatus = true
      this.namaStatus = 'Status Transaksi: BATAL'
      this.styleStatus = {
        'background': '#FD3648'
      }

      this.disablePrintButton2 = true
      this.disablePrintButton = true
    } else {
      if (x['batal_pengajuan_approval_status'] === 'IP') {
        this.enableStatus = true
        this.namaStatus = 'Pengajuan Batal: IN PROGRESS'
        this.styleStatus = {
          'background': '#5785C1'
        }
      } else {
        this.enableStatus = false
      }
    }
    this.getBackToInput();
  }

  // CHOOSE DATA DETAIL FROM ROWS
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
              saldo_kredit: parseFloat(resp[i]['nilai_kredit']),
              lembar_giro: parseFloat(resp[i]['lbr_giro']),
            }
            res.push(t)
          }
          if (this.formValue.jenis_jurnal === "2") {
            if (this.formValue.tipe_transaksi === "0") {
              this.detailData = res.filter(x => x['saldo_kredit'] != 0)
            } else {
              this.detailData = res.filter(x => x['saldo_debit'] != 0)
            }
          } else {
            this.detailData = res
          }
          this.formReport = JSON.parse(JSON.stringify(this.formValue))
          this.reportDetail = JSON.parse(JSON.stringify(this.detailData))
          this.detailLoad = false
          this.ref.markForCheck()
          this.formInputCheckChangesJurnal()
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
          this.detailLoad = false
          this.ref.markForCheck()
        }
      }
    )
  }

  // BACK TO TAB MENU : INPUT
  getBackToInput() {
    this.formReport = {}
    this.reportDetail = []
    this.selectedTab = 0;
    this.getDetail()
    this.formInputCheckChanges()
    this.formInputCheckChangesStatus()
  }

  // FORM SUBMIT
  onSubmit(inputForm: NgForm, type) {
    this.gbl.topPage()
    if (this.forminput !== undefined) {
      if (inputForm.valid && this.validateSubmit()) {
        if (type === "umum") {
          // this.inputDialog("umum")
          this.funcCetakTranJurnal("umum")
        } else if (type === "kasir") {
          // this.inputDialog("kasir")
          this.funcCetakTranJurnal("kasir")
        } else {
          this.saveData('')
        }
      } else {
        if (this.forminput.getData().kode_cabang === '') {
          this.gbl.openSnackBar('Cabang belum diisi.', 'info')
        } else if (this.forminput.getData().tgl_tran === '') {
          this.gbl.openSnackBar('Tanggal transaksi belum diisi.', 'info')
        } else {
          if (this.onUpdate && !this.enableEdit) {
            if (type === "umum") {
              // this.inputDialog("umum")
              this.funcCetakTranJurnal("umum")
            } else if (type === "kasir") {
              // this.inputDialog("kasir")
              this.funcCetakTranJurnal("kasir")
            } else {
              this.gbl.openSnackBar('Transaksi tidak dapat diubah lagi.', 'info')
            }
          } else {
            this.gbl.openSnackBar('Data detail jurnal belum lengkap / total debit&kredit belum balance.', 'info')
          }
        }
      }
    }
  }

  // Cetak Transaksi Jurnal
  funcCetakTranJurnal(type) {
    this.loading = true
    if (type === 'umum') {
      this.onUpdate == true ?
        this.enableEdit == true ?
          this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true ? this.printDoc() : this.saveData('umum') : this.printDoc() : this.saveData('umum')
    } else if (type === 'kasir') {
      this.onUpdate == true ?
        this.enableEdit == true ?
          this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true ? this.printDoc2() : this.saveData('kasir') : this.printDoc2() : this.saveData('kasir')
    }
  }


  // CHECK VALIDATION DATA
  validateSubmit() {
    let valid = true

    let data = this.forminput === undefined ? null : this.forminput.getData()

    if (data != null) {
      if (this.forminput !== undefined) {
        if (this.forminput.getData()['jenis_jurnal'] === '0' || this.forminput.getData()['jenis_jurnal'] === '1')
          if (data['detail'] !== undefined || data['detail'] != null) {
            if (!data['detail']['valid']) {
              valid = false
            }
          }
      } else {
        if (this.formValue.jenis_jurnal === '0' || this.formValue.jenis_jurnal === '1')
          if (data['detail'] !== undefined || data['detail'] != null) {
            if (!data['detail']['valid']) {
              valid = false
            }
          }
      }

      for (var i = 0; i < data['detail']['data'].length; i++) {
        if (data['detail']['data'][i]['id_akun'] === '' || data['detail']['data'][i]['nama_departemen'] === '' || data['detail']['data'][i]['nama_divisi'] === '') {
          valid = false
          break;
        }
      }
    }

    if (this.onUpdate) {
      if (!this.enableEdit) {
        valid = false
      }
    }
    return valid
  }

  // INSERT OR UPDATE DATA
  saveData(type) {
    this.dialog.closeAll()
    this.loading = true
    this.statSubmit = true
    this.ref.markForCheck()
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    this.formValue.id_tran = this.formValue.id_tran === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
      length: 8,
      numeric: true,
      letters: false,
      special: false
    }))}` : this.formValue.id_tran
    this.detailData = this.formValue['detail']['data']
    if (this.formValue.jenis_jurnal !== '2' || this.formValue.tipe_laporan !== 'g') {
      let result = this.detailData.map(detail => {
        const container = detail
        container['lembar_giro'] = 0
        return container
      })
      this.detailData = result
    }
    this.formValue['detail'] = this.detailData
    if (this.formValue.jenis_jurnal === "0" || this.formValue.jenis_jurnal === "1") {
      let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan, id_periode: this.formValue.periode === '0' ? this.periode_aktif['id_periode'] : this.formValue.id_akses_periode }, this.formValue)
      this.request.apiData('jurnal', this.onUpdate ? 'u-jurnal' : 'i-jurnal', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y' || data['STATUS'] === 'A') {
            if (type === "umum") {
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              if (this.onUpdate == false) {
                this.refreshBrowse('', this.formValue.id_tran)
              } else {
                this.refreshBrowse('')
                this.printDoc()
              }
            } else {
              this.resetForm()
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              this.refreshBrowse(this.onUpdate ? data['STATUS'] === 'A' ? "Perubahan perlu dilakukan approval terlebih dahulu" : "Data berhasil diubah" : "Data berhasil ditambahkan")
            }
          } else {
            this.loading = false;
            this.ref.markForCheck()
            this.gbl.openSnackBar(data['RESULT'], 'fail')
          }
        },
        error => {
          this.loading = false;
          this.ref.markForCheck()
          this.gbl.openSnackBar('GAGAL MELAKUKAN PROSES.', 'fail')
        }
      )
    } else if (this.formValue.jenis_jurnal === "2") {
      let nilai_saldo = 0
      for (var i = 0; i < this.formValue['detail'].length; i++) {
        if (this.formValue.tipe_transaksi === "0") {
          nilai_saldo = nilai_saldo + parseFloat(this.formValue['detail'][i]['saldo_kredit'])
        } else {
          nilai_saldo = nilai_saldo + parseFloat(this.formValue['detail'][i]['saldo_debit'])
        }
      }
      this.formValue.saldo_transaksi = nilai_saldo
      this.formValue.id_tran_jt = this.formValue.id_tran_jt === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
        length: 8,
        numeric: true,
        letters: false,
        special: false
      }))}` : this.formValue.id_tran_jt
      let tgl = new Date(this.formValue.periode === '2' ? new Date((this.formValue['tgl_tran'])) : parseInt(this.formValue['tgl_tran'])), idp = ""
      if (this.id_periode !== '' && parseInt(this.id_periode) !== tgl.getTime()) {
        for (var i = 0; i < this.daftar_periode_kasir.length; i++) {
          let dpk = new Date(this.daftar_periode_kasir[i]['tgl_periode'])
          if (tgl.getTime() == (dpk.getTime() - 25200000) && this.formValue['kode_cabang'] === this.daftar_periode_kasir[i]['kode_cabang']) {
            idp = this.daftar_periode_kasir[i]['id_periode']
            break
          }
        }
      } else {
        for (var i = 0; i < this.daftar_periode_kasir.length; i++) {
          let dpk = new Date(this.daftar_periode_kasir[i]['tgl_periode'])
          if (tgl.getTime() == (dpk.getTime()) && this.formValue['kode_cabang'] === this.daftar_periode_kasir[i]['kode_cabang']) {
            idp = this.daftar_periode_kasir[i]['id_periode']
            break
          }
        }
      }
      let endRes = Object.assign({
        id_kasir: this.id_kasir,
        kode_perusahaan: this.kode_perusahaan,
        id_periode_kasir: idp,
        id_periode_jurnal: this.periode_aktif['id_periode']
      },
        this.formValue)
      this.request.apiData('jurnal', this.onUpdate ? 'u-jurnal-transaksi' : 'i-jurnal-transaksi', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            if (type === "kasir") {
              this.browseNeedUpdate = true
              this.id_periode = tgl.getTime().toString()
              this.ref.markForCheck()
              if (this.onUpdate == false) {
                this.refreshBrowse('', this.formValue.id_tran)
              } else {
                this.refreshBrowse('')
                this.printDoc2()
              }
            } else {
              this.resetForm()
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              this.refreshBrowse(this.onUpdate ? "Data berhasil diubah" : "Data berhasil ditambahkan")
            }
          } else {
            this.loading = false;
            this.ref.markForCheck()
            this.gbl.openSnackBar(data['RESULT'], 'fail')
          }
        },
        error => {
          this.loading = false;
          this.ref.markForCheck()
          this.gbl.openSnackBar('GAGAL MELAKUKAN PROSES.', 'fail')
        }
      )
    }
  }

  // FORM CANCEL
  onCancel(spec?) {
    if (!this.onUpdate) {
      this.resetForm()
    } else {
      this.onUpdate = false;
      this.resetForm(spec)
      this.datatable == undefined ? null : this.datatable.reset()
    }
  }

  // RESET VALUE
  resetForm(spec?) {
    this.formValue = {
      id_tran: '',
      no_tran: '',
      no_jurnal: '',
      tgl_tran: this.statSubmit == true ?
        spec != undefined && spec === 'batal' ?
          JSON.stringify(new Date(this.periode_aktif['tahun_periode'] + "-" + this.periode_aktif['bulan_periode'] + "-01")) :
          this.formValue.tgl_tran :
        JSON.stringify(new Date(this.periode_aktif['tahun_periode'] + "-" + this.periode_aktif['bulan_periode'] + "-01")),
      id_akses_periode: this.formValue.id_akses_periode,
      kode_cabang: this.formValue.kode_cabang,
      nama_cabang: this.formValue.nama_cabang,
      keterangan: '',
      jenis_jurnal: this.statSubmit == true ? this.formValue.jenis_jurnal : this.forminput.getData()['jenis_jurnal'],

      // JURNAL TRANSAKSI
      id_tran_jt: '',
      id_jenis_transaksi: '',
      kode_jenis_transaksi: '',
      nilai_jenis_transaksi: '',
      lembar_giro: 0,
      tipe_transaksi: '0',
      saldo_transaksi: 0,
      tipe_laporan: '',
      kode_template: '',

      // TIPE PERIODE
      periode: this.statSubmit == true ? this.formValue.periode : this.forminput.getData()['periode']
    }

    this.enableStatus = false
    this.enableCancel = false
    this.enableEdit = true
    this.disableSubmit = this.enableEdit == true ? false : true
    this.disablePrintButton2 = false
    this.disablePrintButton = false

    if (this.formValue.jenis_jurnal === "2") {
      if (this.formValue.periode === "2") {
        this.tanggalBukaKembali()
      } else {
        this.tanggalJurnalKasir('reset')
      }
    } else {
      if (this.formValue.periode === "1") {
        let val = this.setFormLayout('umum-tutup-sementara')
        this.insertAt(this.inputLayout, 5, 1, val)
      } else {
        let val = this.setFormLayout('umum')
        this.insertAt(this.inputLayout, 5, 1, val)
      }
    }

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
        saldo_kredit: 0,
        lembar_giro: 1
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
        saldo_kredit: 0,
        lembar_giro: 1
      }
    ]
    this.id_periode = ""
    this.formInputCheckChanges()
    this.formInputCheckChangesJurnal()
    this.ref.markForCheck()
  }

  // CANCEL TRANSACTION
  cancelData() {
    this.gbl.topPage()
    if (this.batal_alasan != '') {
      if (this.onUpdate) {
        this.loading = true;
        this.statSubmit = true
        this.ref.markForCheck()
        let endRes = {
          kode_perusahaan: this.kode_perusahaan,
          kode_cabang: this.formValue.kode_cabang,
          id_tran: this.formValue.id_tran,
          batal_alasan: this.batal_alasan
        }
        this.dialog.closeAll()
        this.request.apiData('jurnal', 'u-batal-tran-jurnal', endRes).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.onCancel('batal')
              this.ref.markForCheck()
              this.browseNeedUpdate = true
              if (data['RESULT'] === 'APPROVED') {
                this.refreshBrowse('Sukses! transaksi dibatalkan.')
              } else {
                this.refreshBrowse('Sukses! batal transaksi perlu approval.')
              }
            } else {
              this.loading = false;
              this.ref.markForCheck()
              this.gbl.openSnackBar(data['RESULT'], 'fail')
            }
          },
          error => {
            this.loading = false;
            this.ref.markForCheck()
            this.gbl.openSnackBar('GAGAL MELAKUKAN PENGHAPUSAN.')
          }
        )
      }
    } else {
      let alertSetting = {}
      alertSetting['closeAlert'] = 'spesific'
      this.gbl.openSnackBar('Alasan batal perlu diisi.', 'info', null, alertSetting)
    }

  }

  printDoc() {
    if (this.forminput !== undefined || this.formValue !== undefined) {
      this.ref.markForCheck()
      let ru
      ru = this.kode_perusahaan + this.formValue['kode_cabang'] + this.formValue['no_tran'] + '0'
      if (this.enableEdit == false || (this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true)) {
        this.dialog.closeAll()
      }
      if (this.checkKeyReport[ru] !== undefined && this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true) {
        window.open(this.checkKeyReport[ru], "_blank")
        this.loading = false
        this.ref.markForCheck()
      } else {
        this.formReport = JSON.parse(JSON.stringify(this.formValue))
        this.reportDetail = JSON.parse(JSON.stringify(this.detailData))

        for (var i = 0; i < this.lookupComp.length; i++) {
          if (this.lookupComp[i]['kode_lookup'] === 'ALAMAT-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formReport['kode_cabang']) {
            this.info_company.alamat = this.lookupComp[i]['nilai1']
          }
          if (this.lookupComp[i]['kode_lookup'] === 'KOTA-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formReport['kode_cabang']) {
            this.info_company.kota = this.lookupComp[i]['nilai1']
          }
          if (this.lookupComp[i]['kode_lookup'] === 'TELEPON-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formReport['kode_cabang']) {
            this.info_company.telepon = this.lookupComp[i]['nilai1']
          }
        }
        let data = []
        for (var i = 0; i < this.reportDetail.length; i++) {
          let t = []
          if (this.formReport['jenis_jurnal'] === "2") {
            t.push(this.formReport['no_jurnal'])
          } else {
            t.push(this.formReport['no_tran'])
          }
          t.push(new Date(parseInt(this.formReport['tgl_tran'])).getTime())
          t.push(this.formReport['keterangan'])
          t.push(this.formReport['nama_cabang'])
          t.push(this.reportDetail[i]['kode_akun'])
          t.push(this.reportDetail[i]['nama_akun'])
          t.push(this.reportDetail[i]['kode_divisi'])
          t.push(this.reportDetail[i]['nama_divisi'])
          t.push(this.reportDetail[i]['kode_departemen'])
          t.push(this.reportDetail[i]['nama_departemen'])
          t.push(this.reportDetail[i]['keterangan_1'])
          t.push(this.reportDetail[i]['keterangan_2'])
          t.push(this.reportDetail[i]['saldo_debit'])
          t.push(this.reportDetail[i]['saldo_kredit'])

          data.push(t)
        }

        let rp = JSON.parse(JSON.stringify(this.reportObj)), a = this.gbl.splitDate(parseInt(this.formReport['tgl_tran']), 'M-Y'), b = a.split('-'), c = this.gbl.getNamaBulan(b[0])
        rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
        rp['REPORT_CODE'] = 'DOK-TRAN-JURNAL'
        rp['REPORT_NAME'] = 'Dokumen Transaksi Jurnal Umum'
        rp['REPORT_FORMAT_CODE'] = 'pdf'
        rp['JASPER_FILE'] = 'dokTransaksiJurnal.jasper'
        rp['REPORT_PARAMETERS'] = {
          USER_NAME: localStorage.getItem('user_name') === undefined ? "" : localStorage.getItem('user_name'),
          REPORT_COMPANY_ADDRESS: this.info_company.alamat,
          REPORT_COMPANY_CITY: this.info_company.kota,
          REPORT_COMPANY_TLPN: this.info_company.telepon,
          REPORT_PERIODE: "Periode: " + c + ' ' + b[1]
        }

        rp['FIELD_TITLE'] = [
          "No. Transaksi",
          "Tgl. Transaksi",
          "Keterangan",
          "Nama Cabang",
          "Kode Akun",
          "Nama Akun",
          "Kode Divisi",
          "Nama Divisi",
          "Kode Departemen",
          "Nama Departemen",
          "Keterangan 1",
          "Keterangan 2",
          "Saldo Debit",
          "Saldo Kredit",
        ]
        rp['FIELD_NAME'] = [
          "noTran",
          "tglTran",
          "keterangan",
          "namaCabang",
          "kodeAkun",
          "namaAkun",
          "kodeDivisi",
          "namaDivisi",
          "kodeDepartemen",
          "namaDepartemen",
          "keterangan_1",
          "keterangan_2",
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
          "string",
          "string",
          "string",
          "string",
          "string",
          "string",
          "bigdecimal",
          "bigdecimal"
        ]
        rp['FIELD_DATA'] = data

        this.sendGetPrintDoc(rp, 'umum')
      }
    } else {
      this.loading = false
      this.ref.markForCheck()
      this.gbl.openSnackBar('Gagal memproses dokumen.', 'info')
    }
  }

  printDoc2() {
    if (this.forminput !== undefined || this.formValue !== undefined) {
      this.ref.markForCheck()
      let rk = this.kode_perusahaan + this.formValue['kode_cabang'] + this.formValue['no_tran'] + '1'
      if (this.enableEdit == false || (this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true)) {
        this.dialog.closeAll()
      }
      if (this.checkKeyReport[rk] !== undefined && this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true) {
        window.open(this.checkKeyReport[rk], "_blank")
        this.loading = false
        this.ref.markForCheck()
      } else {
        this.formReport = JSON.parse(JSON.stringify(this.formValue))
        this.reportDetail = JSON.parse(JSON.stringify(this.detailData))
        for (var i = 0; i < this.lookupComp.length; i++) {
          if (this.lookupComp[i]['kode_lookup'] === 'ALAMAT-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formReport['kode_cabang']) {
            this.info_company.alamat = this.lookupComp[i]['nilai1']
          }
          if (this.lookupComp[i]['kode_lookup'] === 'KOTA-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formReport['kode_cabang']) {
            this.info_company.kota = this.lookupComp[i]['nilai1']
          }
          if (this.lookupComp[i]['kode_lookup'] === 'TELEPON-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formReport['kode_cabang']) {
            this.info_company.telepon = this.lookupComp[i]['nilai1']
          }
        }
        let data = []
        for (var i = 0; i < this.reportDetail.length; i++) {
          let t = []
          t.push(this.formReport['no_tran'])
          t.push(this.formReport['periode'] === '2' ? new Date(this.formReport['tgl_tran']).getTime() : new Date(parseInt(this.formReport['tgl_tran'])).getTime())
          t.push(this.formReport['keterangan'])
          t.push(this.formReport['nama_cabang'])
          t.push(this.reportDetail[i]['kode_akun'])
          t.push(this.reportDetail[i]['nama_akun'])
          t.push(this.reportDetail[i]['kode_divisi'])
          t.push(this.reportDetail[i]['nama_divisi'])
          t.push(this.reportDetail[i]['kode_departemen'])
          t.push(this.reportDetail[i]['nama_departemen'])
          t.push(this.reportDetail[i]['keterangan_1'])
          t.push(this.reportDetail[i]['keterangan_2'])
          t.push(this.reportDetail[i]['saldo_debit'])
          t.push(this.reportDetail[i]['saldo_kredit'])
          t.push(this.reportDetail[i]['keterangan_akun'])
          t.push(this.formReport['saldo_transaksi'])

          data.push(t)
        }

        let rp = JSON.parse(JSON.stringify(this.reportObj))
        let rt = (this.formValue.tipe_transaksi === '0' ? 'PEMASUKKAN' : 'PENGELUARAN') + " " + (this.formValue.tipe_laporan === 'k' ? 'KAS' : this.formValue.tipe_laporan === 'b' ? 'BANK' : this.formValue.tipe_laporan === 'g' ? 'GIRO' : 'KAS KECIL')
        rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
        rp['REPORT_CODE'] = 'DOK-JURNAL-TRANSAKSI'
        rp['REPORT_NAME'] = rt
        rp['REPORT_FORMAT_CODE'] = 'pdf'
        rp['JASPER_FILE'] = 'dokTransaksiJurnalTransaksi.jasper'
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
          "Kode Divisi",
          "Nama Divisi",
          "Kode Departemen",
          "Nama Departemen",
          "Keterangan 1",
          "Keterangan 2",
          "Saldo Debit",
          "Saldo Kredit",
          "Keterangan Akun",
          "Saldo Transaksi"
        ]
        rp['FIELD_NAME'] = [
          "noTran",
          "tglTran",
          "keterangan",
          "namaCabang",
          "kodeAkun",
          "namaAkun",
          "kodeDivisi",
          "namaDivisi",
          "kodeDepartemen",
          "namaDepartemen",
          "keterangan_1",
          "keterangan_2",
          "nilaiDebit",
          "nilaiKredit",
          "keteranganAkun",
          "saldoTransaksi"
        ]
        rp['FIELD_TYPE'] = [
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
          "bigdecimal",
          "bigdecimal",
          "string",
          "bigdecimal"
        ]
        rp['FIELD_DATA'] = data
        this.sendGetPrintDoc(rp, 'kasir')
      }
    } else {
      this.loading = false
      this.ref.markForCheck()
      this.gbl.openSnackBar('Gagal memproses dokumen.', 'info')
    }
  }

  sendGetPrintDoc(p, jurnal) {
    let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan, kode_cabang: this.formValue.kode_cabang, no_jurnal: this.formValue.no_tran, jenis_jurnal: jurnal === 'umum' ? '0' : '1' }, p)
    this.request.apiData('report', 'g-cetak-tran-jurnal', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          window.open(data['RESULT']['rep_url'] + "?repId=" + data['RESULT']['rep_id'], "_blank")
          let ru, rk
          if (jurnal === "umum") {
            ru = this.kode_perusahaan + this.formValue['kode_cabang'] + this.formValue['no_tran'] + '0'
            this.checkKeyReport[ru] = data['RESULT']['rep_url'] + "?repId=" + data['RESULT']['rep_id']
          } else if (jurnal === "kasir") {
            rk = this.kode_perusahaan + this.formValue['kode_cabang'] + this.formValue['no_tran'] + '1'
            this.checkKeyReport[rk] = data['RESULT']['rep_url'] + "?repId=" + data['RESULT']['rep_id']
          }
          //
          this.onUpdate = true
          this.loading = false
          this.tableLoad = false
          this.browseNeedUpdate = false
          this.ref.markForCheck()
        } else {
          this.loading = false
          this.ref.markForCheck()
          this.gbl.topPage()
          this.gbl.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail')
        }
      }
    )
  }

  // ---------------------------||--------------------------------------------------

  // SET VALUE TIPE PERIODE
  setValPeriodType(type) {
    if (type === "2") {
      this.tipe_periode.splice(1, 1, {
        label: 'Buka Kembali',
        value: '2'
      })
      this.formValue.periode = '0'
    } else {
      this.tipe_periode.splice(1, 1, {
        label: 'Tutup Sementara',
        value: '1'
      })
      this.formValue.periode = "0"
    }
    this.ref.markForCheck()
  }

  // SET LIST PERIODE (JURNAL UMUM : TUTUP SEMENTARA ONLY)
  reqPeriodTutupSementara() {
    let x = JSON.parse(JSON.stringify(this.checkPeriod));

    this.periodeTS = x.filter(x => x.tutup_sementara === '1' && x.kode_cabang === this.formValue.kode_cabang)[0] || {}
    this.periode_akses = x
    let periode = x.filter(x => x.tutup_sementara === '1' && x.kode_cabang === this.formValue.kode_cabang),
      dp = []

    if (periode.length < 1) {
      this.daftar_periode = [
        {
          label: '',
          value: ''
        }
      ]
      this.insertAt(this.inputLayout, 3, 1, this.setFormLayout('tutup-sementara-null'))
      this.loading = false
      this.disableSubmit = true
      this.ref.markForCheck()
      this.gbl.openSnackBar('Tidak ada periode tutup sementara.', 'info')
      return
    }

    for (var i = 0; i < periode.length; i++) {
      let t = {
        label: this.gbl.getNamaBulan(periode[i]['bulan_periode']) + " " + periode[i]['tahun_periode'],
        value: periode[i]['id_periode']
      }
      dp.push(t)
    }

    this.daftar_periode = dp
    this.forminput.getData()['id_akses_periode'] = this.periodeTS['id_periode'] === undefined ? '' : this.periodeTS['id_periode']
    this.formValue.id_akses_periode = this.periodeTS['id_periode'] === undefined ? '' : this.periodeTS['id_periode']
    let val = ""
    if (this.daftar_periode.length < 2) {
      val = this.setFormLayout('tutup-sementara-null')
      this.insertAt(this.inputLayout, 3, 1, val)
    } else {
      val = this.setFormLayout('tutup-sementara-available')
      this.insertAt(this.inputLayout, 3, 1, val)
    }
    val = this.setFormLayout('umum-tutup-sementara')
    this.insertAt(this.inputLayout, 5, 1, val)
    this.ref.markForCheck()
  }

  // SET LIST TANGGAL TRANSAKSI (JURNAL UMUM : TUTUP SEMENTARA ONLY)
  setPeriode(v) {
    for (var i = 0; i < this.periode_akses.length; i++) {
      if (v === this.periode_akses[i]['id_periode']) {
        this.periodeTS = this.periode_akses[i]
        let val = this.setFormLayout('umum-tutup-sementara')
        this.insertAt(this.inputLayout, 5, 1, val)
        this.ref.markForCheck()
        break
      }
    }
    this.browseNeedUpdate = true
    this.formValue.id_akses_periode = v
  }

  // SET TANGGAL (JURNAL TRANSAKSI : BERJALAN)
  tanggalJurnalKasir(type) {
    let lp = this.daftar_periode_kasir.filter(x => x['kode_cabang'] === this.formValue.kode_cabang && x['aktif'] === '1')[0]
    let dt = new Date(lp['tgl_periode'])
    if (dt.getFullYear() == this.periode_aktif['tahun_periode']) {
      this.periode_kasir = {
        id_periode: lp['id_periode'],
        tgl_periode: lp['tgl_periode']
      }
      let val = this.setFormLayout('kasir')
      this.insertAt(this.inputLayout, 5, 1, val)
      this.browseNeedUpdate = true
      this.disableSubmit = false
      this.ref.markForCheck()
    } else {
      let val = this.setFormLayout('kasir-periode-tidak-sama')
      this.insertAt(this.inputLayout, 5, 1, val)
      this.disableSubmit = true
      this.ref.markForCheck()
      if (type !== 'reset') {
        this.gbl.openSnackBar('Tanggal periode jurnal dan transaksi tidak sesuai.', 'info')
      }
    }
  }

  // SET TANGGAL (JURNAL TRANSAKSI : BUKA KEMBALI)
  tanggalBukaKembali() {
    if (this.onUpdate == false) {
      this.forminput.getData()['tgl_tran'] = ""
      this.formValue.tgl_tran = ""
    }
    this.ref.markForCheck()

    // Filter Tanggal Buka Kembali
    let x = this.daftar_periode_kasir.filter(x => x['kode_cabang'] === this.formValue.kode_cabang && x['buka_kembali'] === '1'),
      // Init Date Browser Time Zone
      y = x.map(detail => {
        const cont = detail
        cont['tgl_periode'] = new Date(detail.tgl_periode)
        return cont
      }),
      // Sort Date
      z = y.sort((a, b) => b.tgl_periode - a.tgl_periode),
      // Init to Date to String
      result = z.map(detail => {
        const cont = detail
        cont['tgl_periode'] = this.gbl.splitDate(detail['tgl_periode'].getTime())
        return cont
      })
    // Tanggal Buka Kembali
    this.inputTanggalData = result
    let val = this.setFormLayout('kasir-periode-buka-kembali')
    this.insertAt(this.inputLayout, 5, 1, val)
  }

  // SET FORM LAYOUT
  setFormLayout(type) {
    let x
    if (type === 'umum') {
      x = {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Tgl. Transaksi',
        id: 'tgl-tran',
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
        },
        onSelectFunc: (value) => {
        }
      }
    } else if (type === 'umum-tutup-sementara') {
      x = {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Tgl. Transaksi',
        id: 'tgl-tran',
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
            y: this.periodeTS['tahun_periode'],
            m: this.periodeTS['bulan_periode']
          }
        },
        onSelectFunc: (value) => {
        }
      }
    } else if (type === 'kasir') {
      x = {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Tgl. Transaksi',
        id: 'tgl-tran',
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
        minDate: () => {
          let dt = new Date(this.periode_kasir['tgl_periode'])
          return {
            year: dt.getFullYear(),
            month: dt.getMonth() + 1,
            day: dt.getDate()
          }
        },
        maxDate: () => {
          let dt = new Date(this.periode_kasir['tgl_periode']),
            maxDt = (dt.getMonth() + 1) == 2 ? this.gbl.leapYear(dt.getFullYear()) == false ? 28 : 29 :
              (
                (dt.getMonth() + 1) == 1 ||
                (dt.getMonth() + 1) == 3 ||
                (dt.getMonth() + 1) == 5 ||
                (dt.getMonth() + 1) == 7 ||
                (dt.getMonth() + 1) == 8 ||
                (dt.getMonth() + 1) == 10 ||
                (dt.getMonth() + 1) == 12
              ) ? 31 : 30,
            exceedDt = (dt.getDate() + this.dayLimit) > maxDt ? true : false,
            yr = exceedDt == true ? dt.getFullYear() + 1 : dt.getFullYear(),
            mt = exceedDt == true ? dt.getMonth() + 2 : dt.getMonth() + 1,
            aDt = exceedDt == true ? ((dt.getDate() + this.dayLimit) - maxDt) : dt.getDate() + this.dayLimit
          return {
            year: yr,
            month: mt,
            day: aDt
          }
        }
      }
    } else if (type === 'kasir-khusus-bank') {
      x = {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Tgl. Transaksi',
        id: 'tgl-tran',
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
        minDate: () => {
          let dt = new Date(this.periode_aktif['tahun_periode'] + '-' + this.periode_aktif['bulan_periode'] + '-' + '01'),
            dtKasir = new Date(this.periode_kasir['tgl_periode']),
            bindDt1 = dtKasir.getFullYear() + (dtKasir.getMonth() + 1),
            bindDt2 = dt.getFullYear() + this.periode_aktif['bulan_periode']
          if (bindDt1 < bindDt2) {
            return {
              year: dtKasir.getFullYear(),
              month: dtKasir.getMonth() + 1,
              day: dtKasir.getDate()
            }
          } else {
            return {
              year: dt.getFullYear(),
              month: dt.getMonth() + 1,
              day: dt.getDate()
            }
          }
        },
        maxDate: () => {
          let dt = new Date(this.periode_kasir['tgl_periode']),
            maxDt = (dt.getMonth() + 1) == 2 ? this.gbl.leapYear(dt.getFullYear()) == false ? 28 : 29 :
              (
                (dt.getMonth() + 1) == 1 ||
                (dt.getMonth() + 1) == 3 ||
                (dt.getMonth() + 1) == 5 ||
                (dt.getMonth() + 1) == 7 ||
                (dt.getMonth() + 1) == 8 ||
                (dt.getMonth() + 1) == 10 ||
                (dt.getMonth() + 1) == 12
              ) ? 31 : 30,
            exceedDt = (dt.getDate() + this.dayLimit) > maxDt ? true : false,
            yr = exceedDt == true ? dt.getFullYear() + 1 : dt.getFullYear(),
            mt = exceedDt == true ? dt.getMonth() + 2 : dt.getMonth() + 1,
            aDt = exceedDt == true ? ((dt.getDate() + this.dayLimit) - maxDt) : dt.getDate() + this.dayLimit
          return {
            year: yr,
            month: mt,
            day: aDt
          }
        }
      }
    } else if (type === "kasir-periode-buka-kembali") {
      x = {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Tgl. Transaksi',
        id: 'tgl-tran',
        type: 'inputgroup',
        click: (type) => this.openDialog(type),
        btnLabel: '',
        btnIcon: 'flaticon-search',
        browseType: 'tgl_tran',
        valueOf: 'tgl_tran',
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      }
    } else if (type === "kasir-periode-tidak-sama") {
      x = {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Tgl. Transaksi',
        id: 'tgl-tran',
        type: 'datepicker',
        valueOf: 'tgl_tran',
        required: true,
        readOnly: false,
        update: {
          disabled: true
        },
        timepick: false,
        enableMin: true,
        enableMax: true,
        disabled: false,
        minDate: () => {
          let dt = new Date(Date.now())
          return {
            year: dt.getFullYear(),
            month: dt.getMonth() + 1,
            day: dt.getDate()
          }
        },
        maxDate: () => {
          let dt = new Date(Date.now())
          return {
            year: dt.getFullYear(),
            month: dt.getMonth() + 1,
            day: dt.getDate()
          }
        }
      }
    } else if (type === "tutup-sementara-null") {
      x = {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Periode Tutup Sementara',
        id: 'periode-akses',
        type: 'combobox',
        options: this.daftar_periode,
        valueOf: 'id_akses_periode',
        required: true,
        readOnly: false,
        disabled: true,
        hiddenOn: {
          valueOf: 'periode',
          matchValue: ["0", "2", ""]
        },
        onSelectFunc: (v) => {
          this.setPeriode(v)
        }
      }
    } else if (type === "tutup-sementara-available") {
      x = {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Periode Tutup Sementara',
        id: 'periode-akses',
        type: 'combobox',
        options: this.daftar_periode,
        valueOf: 'id_akses_periode',
        required: true,
        readOnly: false,
        disabled: false,
        hiddenOn: {
          valueOf: 'periode',
          matchValue: ["0", "2", ""]
        },
        onSelectFunc: (v) => {
          this.setPeriode(v)
        }
      }
    } else if (type === "ket") {
      x = {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Keterangan',
        id: 'keterangan',
        type: 'input',
        valueOf: 'keterangan',
        required: false,
        readOnly: false,
        update: {
          disabled: this.enableEdit == true ? false : true
        }
      }
    }
    return x
  }

  // SET FORM VALUE
  setFormV(value, date_value, type) {
    let x
    if (type === "umum") {
      x = {
        // General
        id_tran: value['id_tran'],
        no_tran: value['no_tran'],
        no_jurnal: value['no_tran'],
        id_akses_periode: value['id_periode'],
        tgl_tran: JSON.stringify(date_value.getTime()),
        kode_cabang: value['kode_cabang'],
        nama_cabang: value['nama_cabang'],
        keterangan: value['keterangan'],

        // Jurnal Umum
        jenis_jurnal: value['jurnal_penyesuaian'],

        periode: this.formValue.periode,

        // Validate Input Box Jurnal Transaksi
        tipe_laporan: ""
      }
    } else if (type === "kasir") {
      x = {
        // General
        id_tran: value['id_tran'],
        no_tran: value['no_tran'],
        tgl_tran: this.forminput.getData()['periode'] === "0" ? JSON.stringify(date_value.getTime()) : this.gbl.splitDate(date_value.getTime()),
        kode_cabang: value['kode_cabang'],
        nama_cabang: value['nama_cabang'],
        keterangan: value['keterangan'],

        // Jurnal Umum
        jenis_jurnal: this.forminput.getData()['jenis_jurnal'],

        // Jurnal Transaksi
        no_jurnal: value['no_jurnal'],
        id_tran_jt: value['id_tran'],
        id_jenis_transaksi: value['id_jenis_transaksi'],
        kode_jenis_transaksi: value['kode_jenis_transaksi'],
        nilai_jenis_transaksi: value['nilai_jenis_transaksi'],
        lembar_giro: value['lbr_giro'],
        tipe_transaksi: value['tipe_transaksi'],
        saldo_transaksi: value['saldo_transaksi'],
        tipe_laporan: value['tipe_laporan'],
        kode_template: value['kode_template'],

        // Jenis Periode
        periode: this.formValue.periode
      }
    }

    return x
  }

  setStatusChange() {
    let x = true,
      y = true,
      z = {},
      statusChange
    //
    z = JSON.parse(JSON.stringify(this.formValue))
    z = this.forminput === undefined ? z : this.forminput.getData()

    if (this.formValue.jenis_jurnal === "2") {
      this.formValue.tipe_transaksi = z['tipe_transaksi']
      this.formValue.lembar_giro = z['lembar_giro']
    }
    this.formValue.tgl_tran = z['tgl_tran']
    this.formValue.keterangan = z['keterangan']
    this.detailData = this.forminput === undefined ? this.detailData : this.forminput.getData()['detail']['data']

    if (Object.keys(this.formReport).length > 0 || this.reportDetail.length > 0) {
      if (JSON.stringify(this.formValue) === JSON.stringify(this.formReport) == false) {
        x = false
      }

      if (JSON.stringify(this.detailData) === JSON.stringify(this.reportDetail) == false) {
        y = false
      }
    }

    statusChange = {
      header: x,
      detail: y
    }

    return statusChange
  }

  openDialog(type) {
    this.gbl.topPage()
    this.dialogType = JSON.parse(JSON.stringify(type))
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '55vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '20px' },
      data: {
        type: type,
        tableInterface:
          type === "kode_cabang" ? this.inputCabangInterface :
            type === "tgl_tran" ? this.inputTanggalInterface :
              {},
        displayedColumns:
          type === "kode_cabang" ? this.inputCabangDisplayColumns :
            type === "tgl_tran" ? this.inputTanggalDisplayColumns :
              [],
        tableData:
          type === "kode_cabang" ? this.inputCabangData :
            type === "tgl_tran" ? this.inputTanggalData :
              [],
        tableRules:
          type === "kode_cabang" ? this.inputCabangDataRules :
            type === "tgl_tran" ? this.inputTanggalDataRules :
              [],
        formValue: this.formValue,
        sizeCont: 380,
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_cabang") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
            this.formValue.kode_cabang = this.forminput.getData()['kode_cabang']
            this.formValue.nama_cabang = this.forminput.getData()['nama_cabang']
            let x = this.bank.filter(x => x.kode_cabang === this.formValue.kode_cabang)
            window.parent.postMessage({
              'type': 'CHANGE-PERIODE',
              'value': {
                kode_cabang: this.formValue.kode_cabang
              }
            }, "*")
            this.periode_aktif = this.periodeCabang.filter(x => x.aktif === '1' && x.kode_cabang === this.formValue.kode_cabang)[0] || {}
            if (this.periode_aktif.aktif !== "1") {
              this.disableSubmit = true
            } else {
              this.disableSubmit = false
            }
            this.rightInputLayout.splice(1, 1, {
              labelWidth: 'col-3',
              formWidth: 'col-9',
              label: 'Rekening',
              id: 'rekening-perusahaan',
              type: 'combobox',
              options: x,
              valueOf: 'nilai_jenis_transaksi',
              required: true,
              readOnly: false,
              disabled: false,
              hiddenOn: {
                valueOf: 'tipe_laporan',
                matchValue: ["k", "p", "g", ""]
              },
              update: {
                disabled: true
              }
            })
            if (this.forminput.getData()['jenis_jurnal'] === "2") {
              if (this.forminput.getData()['periode'] === "0") {
                this.tanggalJurnalKasir('')
                if (this.forminput.getData()['tipe_laporan'] === 'b') {
                  this.insertAt(this.inputLayout, 5, 1, this.setFormLayout('kasir-khusus-bank'))
                } else {
                  this.insertAt(this.inputLayout, 5, 1, this.setFormLayout('kasir'))
                }
              } else {
                this.tanggalBukaKembali()
              }
              this.browseNeedUpdate = true
            } else {
              if (this.forminput.getData()['periode'] === "1") {
                this.reqPeriodTutupSementara()
              }
              this.browseNeedUpdate = true
            }
          }
        } else if (type === "tgl_tran") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('tgl_tran', result.tgl_periode)
            this.browseNeedUpdate = true
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  inputDialog(type) {
    this.gbl.topPage()
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '150px' },
      data: {
        formValue: {},
        inputLayout: [],
        buttonLayout: [],
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => null,
        onSubmit: (x: NgForm) =>
          type === "umum" ?
            this.onUpdate == true ?
              this.enableEdit == true ?
                this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true ? this.printDoc() : this.saveData('umum') :
                this.printDoc()
              : this.saveData('umum')
            : type === "kasir" ?
              this.onUpdate == true ?
                this.enableEdit == true ?
                  this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true ? this.printDoc2() : this.saveData('kasir') :
                  this.printDoc2()
                : this.saveData('kasir') :
              {},
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
      result => null,
      error => null
    )
  }

  // ---------------------------||--------------------------------------------------

  // SPLICE ARRAY
  insertAt(array, index, index1, val?) {
    if (val !== undefined) {
      array.splice(index, index1, val)
    } else {
      array.splice(index, index1)
    }
  }

  // SPLIT DATE FROM MILISECOND TO FORMAT Y-M-D
  splitDate(date) {
    let getDate = new Date(date),
      years = getDate.getUTCFullYear(),
      months = ((getDate.getUTCMonth() + 1) < 10) ? "0" + (getDate.getUTCMonth() + 1) : getDate.getUTCMonth() + 1,
      days = (getDate.getUTCDate() < 10) ? "0" + getDate.getUTCDate() : getDate.getUTCDate(),
      formatYMD = `${years}-${months}-${days}`

    return formatYMD
  }

  getDateNow() {
    let d = this.gbl.getTahunPeriode() + "-" + this.gbl.getBulanPeriode() + "-01"
    let p = new Date(d).getTime()
    return p
  }

  reverseConvertTime(data) {
    let date = new Date(data)

    return JSON.stringify(date.getTime())
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
    }, 1)
  }

  formInputCheckChangesStatus() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput.checkChangesStatus()
    }, 1)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

  formInputChangeTipeTran() {
    this.detailData = this.forminput.getData()['detail']['data']
    for (var i = 0; i < this.forminput.getData()['detail']['data'].length; i++) {
      var tmp_saldo_debit = this.forminput.getData()['detail']['data'][i].saldo_debit
      var tmp_saldo_kredit = this.forminput.getData()['detail']['data'][i].saldo_kredit
      this.detailData[i].saldo_debit = tmp_saldo_kredit
      this.detailData[i].saldo_kredit = tmp_saldo_debit
    }
  }

}