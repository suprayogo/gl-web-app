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
  selector: 'kt-batch',
  templateUrl: './batch.component.html',
  styleUrls: ['./batch.component.scss', '../transaksi.style.scss']
})
export class BatchComponent implements OnInit, AfterViewInit {

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

  // CONFIRMATION DIALOG VARIABLE
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

  // INFO COMPANY
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

  // OPSI EKSTENSI BERKAS CETAK REPORT
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
    tgl_tran: JSON.stringify(this.getDateNow()),
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

  // FORM INPUT NAME CETAKAN DOKUMEN
  formDetail = {
    format_cetak: 'pdf'
  }

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
          this.onSubPrintDoc = true
          this.onSubPrintDoc2 = false
          this.displayedColumnsTable = this.displayedColumnsTableUmum
          this.forminput.getData()['tgl_tran'] = ""
          this.formValue.tgl_tran = JSON.stringify(new Date(this.periode_aktif['tahun_periode'] + "-" + this.periode_aktif['bulan_periode'] + "-01"))
          this.forminput.getData()['id_jenis_transaksi'] = ""
          this.formValue.id_jenis_transaksi = ""
          this.forminput.getData()['tipe_laporan'] = ""
          this.formValue.tipe_laporan = ""
          let val = this.setFormLayout('umum')
          this.insertAt(this.inputLayout, 5, 1, val)
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
        if (value === "0") {
          if (this.forminput.getData()['jenis_jurnal'] === "2") {
            this.forminput.getData()['tgl_tran'] = ""
            this.formValue.tgl_tran = ""
            this.tanggalJurnalKasir('')
            this.browseNeedUpdate = true
          } else {
            this.formValue.tgl_tran = JSON.stringify(new Date(this.periode_aktif['tahun_periode'] + "-" + this.periode_aktif['bulan_periode'] + "-01"))
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
      label: 'Periode Akses',
      id: 'periode-akses',
      type: 'combobox',
      options: this.daftar_periode,
      valueOf: 'id_akses_periode',
      onSelectFunc: (v) => {
        this.setPeriode(v)
      },
      required: true,
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
        onFound: () => {
          this.formValue.kode_cabang = this.forminput.getData()['kode_cabang']
          this.formValue.nama_cabang = this.forminput.getData()['nama_cabang']
          if (this.forminput.getData()['jenis_jurnal'] === "2") {
            if (this.forminput.getData()['periode'] === "0") {
              this.tanggalJurnalKasir('')
            } else {
              this.tanggalBukaKembali()
            }
          }
        }
      },
      update: {
        disabled: true
      }
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'No. Jurnal',
      id: 'no-jurnal',
      type: 'input',
      valueOf: 'no_jurnal',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: true
      }
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
      label: 'No. Transaksi',
      id: 'nomor-transaksi',
      type: 'input',
      valueOf: 'no_tran',
      required: false,
      readOnly: false,
      disabled: true,
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
      label: 'Jenis Transaksi',
      id: 'jenis-transaksi',
      type: 'combobox',
      options: [],
      valueOf: 'id_jenis_transaksi',
      onSelectFunc: (v) => {

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
      label: 'Lembar Giro',
      id: 'lembar-giro',
      type: 'input',
      valueOf: 'lembar_giro',
      required: false,
      readOnly: false,
      hiddenOn: {
        valueOf: 'tipe_laporan',
        matchValue: ["k", "p", "b", ""]
      },
      numberOnly: true,
      update: {
        disabled: false
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
        disabled: false
      },
      hiddenOn: {
        valueOf: 'jenis_jurnal',
        matchValue: ["0", "1", ""]
      },
      onSelectFunc: (v) => {
        // this.resetForm()
        this.formValue.tipe_transaksi = v
        this.formInputCheckChangesJurnal()
      }
    }
  ]

  // FORM LAYOUT CETAKAN DOKUMEN
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

  // --------------------------------------------||----------------------------------------------------

  // TAB MENU BROWSE
  displayedColumnsTable = [];
  displayedColumnsTableUmum = [
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
      label: 'Keterangan',
      value: 'keterangan'
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
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Tipe Transaksi',
      value: 'tipe_transaksi_sub'
    },
    {
      label: 'Saldo Transaksi',
      value: 'saldo_transaksi',
      number: true
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
  browseInterface = {}
  browseData = []
  browseDataRules = []

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
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.periode_aktif = data['RESULT'].filter(x => x.aktif === '1')[0] || {}
            this.checkPeriod = data['RESULT']
            this.formValue.tgl_tran = JSON.stringify(new Date(this.periode_aktif['tahun_periode'] + "-" + this.periode_aktif['bulan_periode'] + "-01"))
            let val = this.setFormLayout('umum')
            this.insertAt(this.inputLayout, 5, 1, val)
            if (this.periode_aktif.aktif !== "1") {
              this.disableSubmit = true
            } else {
              this.disableSubmit = false
            }
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
            this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
            return
          }
        }
      )

      // GET DATA AKSES CABANG USER
      this.request.apiData('cabang', 'g-cabang-akses').subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            // Variable
            let akses_cabang = JSON.parse(JSON.stringify(this.inputCabangData))
            // Cabang Utama User
            this.cabang_utama = akses_cabang.filter(x => x.cabang_utama_user === 'true')[0] || {}
            this.formValue.kode_cabang = this.cabang_utama.kode_cabang
            this.formValue.nama_cabang = this.cabang_utama.nama_cabang
            this.gbl.updateInputdata(data['RESULT'], 'kode_cabang', this.inputLayout)
            this.ref.markForCheck()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
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
    this.request.apiData('akun', 'g-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputAkunData = data['RESULT']
          if (type === "umum") {
            this.loading = false
          } else if (type === "kasir") {
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
          this.rightInputLayout.splice(1, 1, {
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
          this.rightInputLayout.splice(2, 1, {
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
      if (this.periode_kasir['tgl_periode'] !== '') {
        let tgl_awal = this.periode_kasir['tgl_periode'],
          x = new Date(this.periode_kasir['tgl_periode']),
          y = x.setDate(x.getDate() + this.dayLimit),
          tgl_akhir = this.splitDate(y),
          endRes = {}
        if (this.formValue.periode === "0") {
          endRes = {
            kode_perusahaan: this.kode_perusahaan,
            tgl_periode_awal: tgl_awal,
            tgl_periode_akhir: tgl_akhir
          }
        } else {
          if (this.formValue.tgl_tran !== '') {
            endRes = {
              kode_perusahaan: this.kode_perusahaan,
              tgl_periode: this.formValue.tgl_tran
            }
          } else {
            this.gbl.openSnackBar('Pilih tanggal terlebih dahulu.', 'info', () => {
              this.selectedTab = 0
              this.ref.markForCheck()
            })
          }
        }

        this.request.apiData('jurnal', 'g-jurnal-transaksi', endRes).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              if (message !== '') {
                this.browseData = data['RESULT'].filter(x => x['kode_cabang'] === this.formValue.kode_cabang)
                this.loading = false
                this.tableLoad = false
                this.browseNeedUpdate = false
                this.ref.markForCheck()
                this.gbl.openSnackBar(message, 'success')
                this.onUpdate = false
              } else {
                this.browseData = data['RESULT'].filter(x => x['kode_cabang'] === this.formValue.kode_cabang)
                if (select !== undefined) {
                  let search = JSON.parse(JSON.stringify(this.browseData)),
                    x
                  x = search.filter(x => x['id_tran'] === select)[0] || {}
                  this.formValue.no_tran = x.no_tran
                  this.formValue.no_jurnal = x.no_jurnal
                  this.printDoc2(this.formDetail)
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
      this.request.apiData('jurnal', 'g-jurnal', {
        kode_perusahaan: this.kode_perusahaan,
        id_periode: this.formValue.periode === "0" ?
          this.periode_aktif['id_periode'] : this.formValue.id_akses_periode
      }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            if (message !== '') {
              this.browseData = data['RESULT'].filter(x => x['kode_cabang'] === this.formValue.kode_cabang)
              this.loading = false
              this.tableLoad = false
              this.ref.markForCheck()
              this.gbl.openSnackBar(message, 'success')
              this.onUpdate = false
            } else {
              this.browseData = data['RESULT'].filter(x => x['kode_cabang'] === this.formValue.kode_cabang)
              if (select !== undefined) {
                let search = JSON.parse(JSON.stringify(this.browseData)),
                  x
                x = search.filter(x => x['id_tran'] === select)[0] || {}
                this.formValue.no_tran = x.no_tran
                this.formValue.no_jurnal = x.no_tran
                this.printDoc(this.formDetail)
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
      this.id_periode = x['id_periode']
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
              saldo_kredit: parseFloat(resp[i]['nilai_kredit'])
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
  }

  // FORM SUBMIT
  onSubmit(inputForm: NgForm, type) {
    this.gbl.topPage()
    if (this.forminput !== undefined) {
      if (inputForm.valid && this.validateSubmit()) {
        if (type === "umum") {
          this.inputDialog("umum")
        } else if (type === "kasir") {
          this.inputDialog("kasir")
        } else {
          this.saveData('', '')
        }
      } else {
        if (this.forminput.getData().kode_cabang === '') {
          this.gbl.openSnackBar('Cabang belum diisi.', 'info')
        } else if (this.forminput.getData().tgl_tran === '') {
          this.gbl.openSnackBar('Tanggal transaksi belum diisi.', 'info')
        } else {
          if (this.onUpdate && !this.enableEdit) {
            if (type === "umum") {
              this.inputDialog("umum")
            } else if (type === "kasir") {
              this.inputDialog("kasir")
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
  saveData(type, cetak) {
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
    this.formValue['detail'] = this.detailData
    if (this.formValue.jenis_jurnal === "0" || this.formValue.jenis_jurnal === "1") {
      let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan, id_periode: this.periode_aktif['id_periode'] }, this.formValue)
      this.request.apiData('jurnal', this.onUpdate ? 'u-jurnal' : 'i-jurnal', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            if (type === "umum") {
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              if (this.onUpdate == false) {
                this.refreshBrowse('', this.formValue.id_tran)
              } else {
                this.refreshBrowse('')
                this.printDoc(cetak)
              }
            } else {
              this.resetForm()
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
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
      let tgl = new Date(parseInt(this.formValue['tgl_tran'])), idp = ""
      if (!this.onUpdate) {
        for (var i = 0; i < this.daftar_periode_kasir.length; i++) {
          let dpk = new Date(this.daftar_periode_kasir[i]['tgl_periode'])
          if (tgl.getTime() == (dpk.getTime() - 25200000) && this.formValue['kode_cabang'] === this.daftar_periode_kasir[i]['kode_cabang']) {
            idp = this.daftar_periode_kasir[i]['id_periode']
            break
          }
        }
      }
      let endRes = Object.assign({
        id_kasir: this.id_kasir,
        kode_perusahaan: this.kode_perusahaan,
        id_periode_kasir: this.onUpdate ? this.id_periode : idp,
        id_periode_jurnal: this.periode_aktif['id_periode']
      },
        this.formValue)
      this.request.apiData('jurnal', this.onUpdate ? 'u-jurnal-transaksi' : 'i-jurnal-transaksi', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            if (type === "kasir") {
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              if (this.onUpdate == false) {
                this.refreshBrowse('', this.formValue.id_tran_jt)
              } else {
                this.refreshBrowse('')
                this.printDoc2(cetak)
              }
            } else {
              this.resetForm()
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
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
  onCancel() {
    if (!this.onUpdate) {
      this.resetForm()
    } else {
      this.onUpdate = false;
      this.resetForm()
      this.datatable == undefined ? null : this.datatable.reset()
    }
  }

  // RESET VALUE
  resetForm() {
    this.formValue = {
      id_tran: '',
      no_tran: '',
      no_jurnal: '',
      tgl_tran: this.statSubmit == true ? this.formValue.tgl_tran : JSON.stringify(new Date(this.periode_aktif['tahun_periode'] + "-" + this.periode_aktif['bulan_periode'] + "-01")),
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

    this.enableCancel = false
    this.enableEdit = true

    if (this.formValue.jenis_jurnal === "2") {
      this.tanggalJurnalKasir('reset')
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
    this.id_periode = ""
    this.formInputCheckChanges()
    this.formInputCheckChangesJurnal()
    this.ref.markForCheck()
  }

  // CANCEL TRANSACTION
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
            this.gbl.openSnackBar(data['RESULT'])
          }
        },
        error => {
          this.loading = false;
          this.ref.markForCheck()
          this.gbl.openSnackBar('GAGAL MELAKUKAN PENGHAPUSAN.')
        }
      )
    }
  }

  printDoc(v) {
    if (this.forminput !== undefined || this.formValue !== undefined) {
      this.ref.markForCheck()
      let ru
      if (this.formValue.jenis_jurnal === "2") {
        ru = this.formValue['id_tran'] + this.formValue['no_jurnal'] + this.formDetail['format_cetak']
      } else {
        ru = this.formValue['id_tran'] + this.formValue['no_tran'] + this.formDetail['format_cetak']
      }
      if (this.enableEdit == false || (this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true)) {
        this.dialog.closeAll()
      }
      if (this.checkKeyReport[ru] !== undefined && this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true) {
        if (this.formDetail['format_cetak'] === 'pdf') {
          window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + this.checkKeyReport[ru], "_blank")
        } else {
          if (this.formDetail['format_cetak'] === 'xlsx') {
            this.keyReportFormatExcel = this.checkKeyReport[ru] + '.xlsx'
          } else {
            this.keyReportFormatExcel = this.checkKeyReport[ru] + '.xls'
          }
          setTimeout(() => {
            let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
            sbmBtn.click();
          }, 100)
        }
        this.loading = false
        this.ref.markForCheck()
      } else {
        this.formReport = JSON.parse(JSON.stringify(this.formValue))
        this.reportDetail = JSON.parse(JSON.stringify(this.detailData))
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
          t.push(this.reportDetail[i]['keterangan_1'])
          t.push(this.reportDetail[i]['keterangan_2'])
          t.push(this.reportDetail[i]['saldo_debit'])
          t.push(this.reportDetail[i]['saldo_kredit'])

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
          "bigdecimal",
          "bigdecimal"
        ]
        rp['FIELD_DATA'] = data

        this.sendGetPrintDoc(rp, v['format_cetak'], 'umum')
      }
    } else {
      this.loading = false
      this.ref.markForCheck()
      this.gbl.openSnackBar('Gagal memproses dokumen.', 'info')
    }
  }

  printDoc2(v) {
    if (this.forminput !== undefined || this.formValue !== undefined) {
      this.ref.markForCheck()
      let rk = this.formValue['id_tran'] + this.formValue['id_tran_jt'] + this.formValue['no_tran'] + this.formValue['no_jurnal'] + this.formDetail['format_cetak']
      if (this.enableEdit == false || (this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true)) {
        this.dialog.closeAll()
      }
      if (this.checkKeyReport[rk] !== undefined && this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true) {
        if (this.formDetail['format_cetak'] === 'pdf') {
          window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + this.checkKeyReport[rk], "_blank")
        } else {
          if (this.formDetail['format_cetak'] === 'xlsx') {
            this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xlsx'
          } else {
            this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xls'
          }
          setTimeout(() => {
            let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
            sbmBtn.click();
          }, 100)
        }
        this.loading = false
        this.ref.markForCheck()
      } else {
        this.formReport = JSON.parse(JSON.stringify(this.formValue))
        this.reportDetail = JSON.parse(JSON.stringify(this.detailData))
        let data = []
        for (var i = 0; i < this.reportDetail.length; i++) {
          let t = []
          t.push(this.formReport['no_tran'])
          t.push(new Date(parseInt(this.formReport['tgl_tran'])).getTime())
          t.push(this.formReport['keterangan'])
          t.push(this.formReport['nama_cabang'])
          t.push(this.reportDetail[i]['kode_akun'])
          t.push(this.reportDetail[i]['nama_akun'])
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
        rp['REPORT_FORMAT_CODE'] = v['format_cetak']
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
          "bigdecimal",
          "bigdecimal",
          "string",
          "bigdecimal"
        ]
        rp['FIELD_DATA'] = data
        this.sendGetPrintDoc(rp, v['format_cetak'], 'kasir')
      }
    } else {
      this.loading = false
      this.ref.markForCheck()
      this.gbl.openSnackBar('Gagal memproses dokumen.', 'info')
    }
  }

  sendGetPrintDoc(p, type, jurnal) {
    this.request.apiData('report', 'g-report', p).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (type === 'pdf') {
            window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + data['RESULT'], "_blank");
          } else {
            if (type === 'xlsx') {
              this.keyReportFormatExcel = data['RESULT'] + '.xlsx'
            } else {
              this.keyReportFormatExcel = data['RESULT'] + '.xls'
            }
            setTimeout(() => {
              let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
              sbmBtn.click();
            }, 100)
          }
          //
          let ru, rk
          if (jurnal === "umum") {
            ru = this.formValue['id_tran'] + this.formValue['no_tran'] + this.formDetail['format_cetak']
            this.checkKeyReport[ru] = data['RESULT']
          } else if (jurnal === "kasir") {
            rk = this.formValue['id_tran'] + this.formValue['id_tran_jt'] + this.formValue['no_tran'] + this.formValue['no_jurnal'] + this.formDetail['format_cetak']
            this.checkKeyReport[rk] = data['RESULT']
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

  resetDetailForm() {
    this.formDetail = {
      format_cetak: 'pdf'
    }
  }

  // ---------------------------||--------------------------------------------------

  // SET VALUE TIPE PERIODE
  setValPeriodType(type) {
    if (type === "2") {
      this.tipe_periode.splice(1, 1, {
        label: 'Buka Kembali',
        value: '2'
      })
      this.forminput.getData()['periode'] = "0"
      this.formValue.periode = this.forminput.getData()['periode']
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

    this.periodeTS = x.filter(x => x.tutup_sementara === '1')[0] || {}
    this.periode_akses = x
    let periode = x.filter(x => x.tutup_sementara === '1'),
      dp = []

    if (periode.length < 1) {
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
      this.insertAt(this.inputLayout, 2, 1, val)
    } else {
      val = this.setFormLayout('tutup-sementara-available')
      this.insertAt(this.inputLayout, 2, 1, val)
    }
    val = this.setFormLayout('umum-tutup-sementara')
    this.insertAt(this.inputLayout, 5, 1, val)
    this.ref.markForCheck()
  }

  // SET LIST TANGGAL TRANSAKSI (JURNAL UMUM : TUTUP SEMENTARA ONLY)
  setPeriode(v) {
    if (v !== this.formValue.id_akses_periode) {
      this.browseNeedUpdate = true
      this.formValue.id_akses_periode = v
    }
    for (var i = 0; i < this.periode_akses.length; i++) {
      if (v === this.periode_akses[i]['id_periode']) {
        this.periodeTS = this.periode_akses[i]
        let val = this.setFormLayout('umum-tutup-sementara')
        this.insertAt(this.inputLayout, 5, 1, val)
        this.ref.markForCheck()
        break
      }
    }
  }

  // SET TANGGAL (JURNAL TRANSAKSI : BERJALAN)
  tanggalJurnalKasir(type) {
    let lp = this.daftar_periode_kasir.filter(x => x['kode_cabang'] === this.formValue.kode_cabang && x['aktif'] === '1')[0]
    let dt = new Date(lp['tgl_periode'])
    if (dt.getFullYear() == this.periode_aktif['tahun_periode'] && (dt.getMonth() + 1) == this.periode_aktif['bulan_periode']) {
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
    this.forminput.getData()['tgl_tran'] = ""
    this.formValue.tgl_tran = ""
    this.ref.markForCheck()
    this.inputTanggalData = this.daftar_periode_kasir.filter(x => x['kode_cabang'] === this.formValue.kode_cabang && x['buka_kembali'] === '1')
    let val = this.setFormLayout('kasir-periode-buka-kembali')
    this.insertAt(this.inputLayout, 5, 1, val)
  }

  // SET FORM LAYOUT
  setFormLayout(type) {
    let x;
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
          disabled: this.enableEdit == true ? false : true
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
            maxDt = (dt.getMonth() + 1) == 2 ? 29 :
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
            mt = exceedDt == true ? dt.getMonth() + 2 : dt.getMonth() + 1,
            aDt = exceedDt == true ? ((dt.getDate() + this.dayLimit) - maxDt) : dt.getDate() + this.dayLimit
          return {
            year: dt.getFullYear(),
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
        onSelectFunc: (v) => this.setPeriode(v)
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
        onSelectFunc: (v) => this.setPeriode(v)
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
        id_tran: value['id_tran_jurnal'],
        no_tran: value['no_tran'],
        tgl_tran: JSON.stringify(date_value.getTime()),
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
    } else {
      this.formValue.tgl_tran = z['tgl_tran']
    }
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
            this.rightInputLayout.splice(2, 1, {
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
              } else {
                this.tanggalBukaKembali()
              }
              this.browseNeedUpdate = true
            } else {
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
        formValue: this.formDetail,
        inputLayout: this.detailInputLayout,

        buttonLayout: [],
        buttonName: 'Cetak',
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => this.resetDetailForm(),
        onSubmit: (x: NgForm) => type === "umum" ?
          this.onUpdate == true ?
            this.enableEdit == true ?
              this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true ? this.printDoc(this.formDetail) : this.saveData('umum', this.formDetail) :
              this.printDoc(this.formDetail)
            : this.saveData('umum', this.formDetail) :
          type === "kasir" ?
            this.onUpdate == true ?
              this.enableEdit == true ?
                this.setStatusChange()['header'] == true && this.setStatusChange()['detail'] == true ? this.printDoc2(this.formDetail) : this.saveData('kasir', this.formDetail) :
                this.printDoc2(this.formDetail)
              : this.saveData('kasir', this.formDetail) :
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
      result => {
        this.batal_alasan = ""
      },
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
      months = (getDate.getUTCMonth() < 10) ? "0" + (getDate.getUTCMonth() + 1) : getDate.getUTCMonth() + 1,
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
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

}