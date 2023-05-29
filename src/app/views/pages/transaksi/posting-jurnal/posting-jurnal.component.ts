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
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

const content = {
  beforeCodeTitle: 'Posting Jurnal & Tutup Periode'
}

@Component({
  selector: 'kt-posting-jurnal',
  templateUrl: './posting-jurnal.component.html',
  styleUrls: ['./posting-jurnal.component.scss', '../transaksi.style.scss']
})
export class PostingJurnalComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild('TP', { static: false }) forminputTP;
  @ViewChild('TPS', { static: false }) forminputTPS;
  @ViewChild('jbp', { static: false }) djbp;
  @ViewChild('rp', { static: false }) drp;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // VARIABLES
  loading: boolean = true;
  tableLoad: boolean = false;
  detailJurnalLoad: boolean = false;
  tableLoadBP: boolean = false;
  loadingDataText: string = "Loading Data Riwayat.."
  loadingDataTextBP: string = "Loading Data Belum Posting.."
  content: any;
  button_name: any;
  nama_tombolPJ: any;
  nama_tombolUP: any;
  nama_tombolTP: any;
  nama_tombolTPS: any;
  onSub: boolean = false;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  enableCancel: boolean = false;
  noCancel: boolean = true;
  editable: boolean = false;
  selectedTab: number = 0;
  loadTab: boolean = false;
  loadTabTPS: boolean = false;
  onUpdate: boolean = false;
  enableDelete: boolean = false;
  browseNeedUpdate: boolean = true;
  search: string;

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // GLOBAL VARIABLE PERIODE AKTIF
  subsPA: any;
  periode_aktif: any;
  periode_tutup: any;
  idPeriodeAktif: any;
  tahunPeriodeAktif: any;
  bulanPeriodeAktif: any;
  nama_bulan_aktif: any;

  // GLOBAL VARIABLE AKSES PERIODE
  //
  opsi_tahun: any
  opsi_bulan: any
  checkTutup: any

  cabang_utama: any
  dialogType: string = null;
  periode_cabang_aktif: any;
  periode_cabang_tutup: any;
  disableSubmit: boolean = false
  disableSubmitTPS: boolean = false
  disableSubmitTP: boolean = false

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

  //CDialog Posting Jurnal
  c_buttonLayoutPJ = [
    {
      btnLabel: 'Posting Jurnal',
      btnClass: 'btn btn-primary',
      btnClick: (pj) => {
        this.onSubmit(pj)
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
  c_labelLayoutPJ = [
    {
      content: 'Yakin akan memposting data jurnal ?',
      style: {
        'color': 'red',
        'font-size': '16px',
        'font-weight': 'bold'
      }
    }
  ]

  c_inputLayoutPJ = []

  //CDialog Un-Posting Jurnal
  c_buttonLayoutUP = [
    {
      btnLabel: 'Unposting Jurnal',
      btnClass: 'btn btn-primary',
      btnClick: (up) => {
        this.onSubmitUP(up)
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
  c_labelLayoutUP = [
    {
      content: 'Yakin akan Unposting data jurnal ?',
      style: {
        'color': 'red',
        'font-size': '16px',
        'font-weight': 'bold'
      }
    }
  ]

  c_inputLayoutUP = []

  // CDialog Tutup Periode
  c_buttonLayoutTP = [
    {
      btnLabel: 'Tutup Periode',
      btnClass: 'btn btn-primary',
      btnClick: (e) => {
        this.onSubmitTP(e)
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

  // CDialog Tutup Periode
  c_buttonLayoutTPS = [
    {
      btnLabel: 'Tutup Periode Sementara',
      btnClass: 'btn btn-primary',
      btnClick: (e) => {
        this.onSubmitTPS(e)
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

  c_labelLayoutTP = [
    {
      content: 'Yakin akan menutup periode ?',
      style: {
        'color': 'red',
        'font-size': '18px',
        'font-weight': 'bold'
      }
    }
  ]

  c_labelLayoutTPS = [
    {
      content: 'Yakin akan menutup periode sementara ?',
      style: {
        'color': 'red',
        'font-size': '18px',
        'font-weight': 'bold'
      }
    }
  ]



  c_inputLayoutTP = []
  c_inputLayoutTPS = []

  // Input Name
  formDetail = {
    id_tran: '',
    no_tran: '',
    tgl_tran: '',
    nama_cabang: '',
    nama_divisi: '',
    nama_departemen: '',
    keterangan: '',
    jenis_jurnal: '0'
  }

  detailData = []

  detailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Tgl. Transaksi',
      id: 'tgl-transaksi',
      type: 'input',
      valueOf: 'tgl_tran',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'nama-cabang',
      type: 'input',
      valueOf: 'nama_cabang',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Keterangan',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: true,
      disabled: true
    }
  ]


  // RIWAYAT TABLE
  displayedColumnsTable = [
    {
      label: 'No. Transaksi',
      value: 'no_tran'
    },
    {
      label: 'Diposting Oleh',
      value: 'input_by'
    },
    {
      label: 'Tgl. Posting',
      value: 'input_dt',
      date: true
    },
    {
      label: 'Diunposting oleh',
      value: 'update_by'
    },
    {
      label: 'Tgl. Unposting',
      value: 'update_dt',
      date: true
    }
  ];
  browseInterface = {
    no_tran: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []

  // DATA BELUM POSTING
  displayedColumnsTableBP = [
    {
      label: 'No. Transaksi',
      value: 'no_tran'
    },
    {
      label: 'Tanggal Transaksi',
      value: 'tgl_tran',
      date: true
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Cabang',
      value: 'nama_cabang'
    },
    {
      label: 'Diinput oleh',
      value: 'input_by'
    },
    {
      label: 'Diinput tanggal',
      value: 'input_dt',
      date: true
    },
    {
      label: 'Di Update oleh',
      value: 'update_by'
    },
    {
      label: 'Di Update tanggal',
      value: 'update_dt',
      date: true
    }
  ];
  browseInterfaceBP = {
    no_tran: 'string',
    tgl_tran: 'string',
    keterangan: 'string',
    nama_divisi: 'string',
    nama_departemen: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseDataBP = []
  browseDataRulesBP = []

  // Input Name POSTING JURNAL
  formValue = {
    kode_cabang: '',
    nama_cabang: '',
    bulan_periode: '',
    tahun_periode: 0,
    numb_bulan_periode: 0,
    id_posting: '',
    id_tran: '',
    no_tran: '',
    boleh_batal: '',
  }

  // Input Name TUTUP PERIODE
  formValueTP = {
    kode_cabang: '',
    nama_cabang: '',
    id_periode: '',
    tahun_periode: 0,
    bulan_periode: '',
    numb_bulan_periode: 0
  }

  // Input Name TUTUP PERIODE
  formValueTPS = {
    kode_cabang: '',
    nama_cabang: '',
    id_periode: '',
    tahun_periode: 0,
    bulan_periode: '',
    numb_bulan_periode: 0
  }

  // Layout Form POSTING JURNAL
  inputLayout = [
    {
      formWidth: 'col-9',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.listDialog(type),
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
    // {
    {
      formWidth: 'col-9',
      label: 'Tahun',
      id: 'tahun-periode',
      type: 'combobox',
      options: [],
      valueOf: 'tahun_periode',
      required: false,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
      },
      onSelectFunc: (v) => { }
    },
    {
      formWidth: 'col-9',
      label: 'Bulan',
      id: 'bulan-periode',
      type: 'combobox',
      options: [],
      valueOf: 'numb_bulan_periode',
      required: false,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
      },
      onSelectFunc: (v) => { }
    },
    {
      formWidth: 'col-9',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: false,
      readOnly: true,
      disabled: true,
      update: {
        disabled: false
      }
    }
  ]

  // Layout Form TUTUP PERIODE
  inputLayoutTP = [
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.listDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_cabangTP',
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
      formWidth: 'col-5',
      label: 'Tahun',
      id: 'tahun-periode',
      type: 'combobox',
      options: [],
      valueOf: 'tahun_periode',
      required: false,
      readOnly: false,
      disabled: false,
      onSelectFunc: (v) => { }
    },
    {
      formWidth: 'col-5',
      label: 'Bulan',
      id: 'bulan-periode',
      type: 'combobox',
      options: [],
      valueOf: 'numb_bulan_periode',
      required: false,
      readOnly: false,
      disabled: false,
      onSelectFunc: (v) => { }
    }
  ]

  // Layout Form TUTUP PERIODE
  inputLayoutTPS = [
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.listDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_cabangTPS',
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
      formWidth: 'col-5',
      label: 'Tahun',
      id: 'tahun-periode',
      type: 'input',
      valueOf: 'tahun_periode',
      required: false,
      readOnly: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Bulan',
      id: 'bulan-periode',
      type: 'combobox',
      options: [],
      valueOf: 'numb_bulan_periode',
      required: false,
      readOnly: false,
      disabled: false,
      onSelectFunc: (v) => { }
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
    this.nama_tombolPJ = 'Posting'
    this.nama_tombolUP = 'Unposting'
    this.nama_tombolTP = 'Tutup Periode'
    this.nama_tombolTPS = 'Tutup Periode Sementara'
    this.gbl.need(true, false)
    this.reqKodePerusahaan()
  }

  ngAfterViewInit(): void {
    // PERUSAHAAN AKTIF
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    if (this.kode_perusahaan !== "") {
      this.reqActivePeriod()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
    this.subsPA === undefined ? null : this.subsPA.unsubscribe()
  }

  reqKodePerusahaan() {
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.kode_perusahaan !== "") {
          this.reqActivePeriod()
        }

        if (this.selectedTab == 1 && this.browseNeedUpdate && this.kode_perusahaan !== "") {
          this.tabTP()
        } else if (this.selectedTab == 2 && this.browseNeedUpdate && this.kode_perusahaan !== "") {
          this.tabTPS()
        }
      }
    )
  }

  reqActivePeriod(type?) {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('periode', 'g-periode-aktif', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.periode_cabang_aktif = data['RESULT']
            this.periode_cabang_tutup = JSON.parse(JSON.stringify(data['RESULT']))
            this.cabangAkt(type)
            this.ref.markForCheck()
          } else {
            this.openSnackBar('Data Periode tidak ditemukan.')
          }
        }
      )
    }
  }

  cabangAkt(type?) {
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
          if (type == undefined || type === 'true') {
            this.formValue.kode_cabang = this.cabang_utama.kode_cabang
            this.formValue.nama_cabang = this.cabang_utama.nama_cabang
            this.formValueTPS.kode_cabang = this.cabang_utama.kode_cabang
            this.formValueTPS.nama_cabang = this.cabang_utama.nama_cabang
            this.formValueTP.kode_cabang = this.cabang_utama.kode_cabang
            this.formValueTP.nama_cabang = this.cabang_utama.nama_cabang
            this.periode_aktif = this.periode_cabang_aktif.filter(x => x.aktif === '1' && x.kode_cabang === this.formValue.kode_cabang)[0] || {}
            this.periode_tutup = this.periode_cabang_tutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.formValue.kode_cabang)
          }

          if (type != undefined && type === 'falseTPS') {
            this.periode_aktif = this.periode_cabang_aktif.filter(x => x.aktif === '1' && x.kode_cabang === this.formValueTPS.kode_cabang)[0] || {}
            this.periode_tutup = this.periode_cabang_tutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.formValueTPS.kode_cabang)
          }

          if (type != undefined && type === 'falseTP') {
            this.periode_aktif = this.periode_cabang_aktif.filter(x => x.aktif === '1' && x.kode_cabang === this.formValueTP.kode_cabang)[0] || {}
            this.periode_tutup = this.periode_cabang_tutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.formValueTP.kode_cabang)
          }

          this.ref.markForCheck()
          this.actPeriod()
          this.madeRequest()
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
        }
      }
    )
  }

  actPeriod() {
    this.gbl.periodeAktif(this.periode_aktif['id_periode'], this.periode_aktif['tahun_periode'], this.periode_aktif['bulan_periode'])
    this.idPeriodeAktif = this.gbl.getIdPeriodeAktif()
    this.tahunPeriodeAktif = this.gbl.getTahunPeriodeAktif()
    this.bulanPeriodeAktif = this.gbl.getBulanPeriodeAktif()
    this.nama_bulan_aktif = this.gbl.getNamaBulan(this.bulanPeriodeAktif)
    this.periode_aktif = this.gbl.getActive()
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    this.formValue = {
      kode_cabang: this.formValue.kode_cabang,
      nama_cabang: this.formValue.nama_cabang,
      bulan_periode: this.periode_aktif.nama_bulan_periode,
      tahun_periode: this.periode_aktif.tahun_periode,
      numb_bulan_periode: this.periode_aktif.bulan_periode,
      id_posting: '',
      id_tran: '',
      no_tran: '',
      boleh_batal: '',
    }

    this.postJurnalInput()
    this.loading = false
    setTimeout(() => {
      this.tabTP()
      this.tabTPS()
    }, 1000)
    this.ref.markForCheck()
    this.sendRequestRiwayat(this.periode_aktif.id_periode)
    this.sendRequesBelumPosting(this.periode_aktif.id_periode)
  }

  postJurnalInput() {
    // INIT LIST TAHUN BOLEH TUTUP FULL
    let list_tahun = JSON.parse(JSON.stringify(this.periode_tutup)).map(detail => {
      const cont = detail
      cont['label'] = detail['tahun_periode']
      cont['value'] = detail['tahun_periode']
      return cont
    }),

      flags = [], x = []
    for (var i = 0; i < list_tahun.length; i++) {
      if (flags[list_tahun[i]['tahun_periode']]) continue;
      flags[list_tahun[i]['tahun_periode']] = true;
      x.push(list_tahun[i])
    }

    // INIT LIST BULAN BOLEH TUTUP
    let list_bulan = JSON.parse(JSON.stringify(this.periode_tutup)).map(detail => {
      const cont = detail
      cont['label'] = this.gbl.getNamaBulan(detail['bulan_periode'])
      cont['value'] = detail['bulan_periode']
      return cont
    })

    // =========================
    this.opsi_tahun = x
    this.opsi_bulan = list_bulan
    // ========= || ============

    // if (this.forminput != undefined) {
    //   this.forminput.updateFormValue('tahun_periode', this.gbl.getTahunTertinggi(this.periode_tutup))
    //   this.forminput.updateFormValue('numb_bulan_periode', this.gbl.getBulanTertinggi(this.periode_tutup, parseInt(this.forminput.getData()['tahun_periode'])).toString())
    //   this.formValue.tahun_periode = parseInt(this.forminput.getData()['tahun_periode'])
    //   this.formValue.bulan_periode = this.gbl.getNamaBulan(this.forminput.getData()['numb_bulan_periode'])
    //   this.formValue.numb_bulan_periode = parseInt(this.forminput.getData()['numb_bulan_periode'])
    // }

    this.inputLayout.splice(0, 3,
      {
        formWidth: 'col-9',
        label: 'Cabang',
        id: 'kode-cabang',
        type: 'inputgroup',
        click: (type) => this.listDialog(type),
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
      // {
      {
        formWidth: 'col-9',
        label: 'Tahun',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.opsi_tahun,
        valueOf: 'tahun_periode',
        required: false,
        readOnly: false,
        disabled: false,
        update: {
          disabled: true
        },
        onSelectFunc: (v) => {
          this.forminput.getData().tahun_periode = parseInt(v)
          this.formValue.tahun_periode = parseInt(v)

          // RESET
          this.forminput.updateFormValue('bulan_periode', '')
          this.forminput.updateFormValue('numb_bulan_periode', 0)
          this.formValue.bulan_periode = ''
          this.formValue.numb_bulan_periode = 0

          this.filterMonth(v, 'PJ')
        }
      },
      {
        formWidth: 'col-9',
        label: 'Bulan',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.opsi_bulan,
        valueOf: 'numb_bulan_periode',
        required: false,
        readOnly: false,
        disabled: false,
        update: {
          disabled: true
        },
        onSelectFunc: (v) => {
          this.forminput.updateFormValue('bulan_periode', this.gbl.getNamaBulan(v))
          this.forminput.updateFormValue('numb_bulan_periode', parseInt(v))
          this.formValue.bulan_periode = this.gbl.getNamaBulan(v)
          this.formValue.numb_bulan_periode = parseInt(v)
          let x = this.periode_tutup.filter(x => x.tahun_periode === this.formValue.tahun_periode && x.bulan_periode === this.formValue.numb_bulan_periode)
          this.sendRequestRiwayat(x[0].id_periode)
          this.sendRequesBelumPosting(x[0].id_periode)
        }
      }
    )
    let z = this.periode_tutup.filter(x => x.tahun_periode === this.formValue.tahun_periode && x.bulan_periode === this.formValue.numb_bulan_periode)
    this.sendRequestRiwayat(z[0].id_periode)
    this.sendRequesBelumPosting(z[0].id_periode)
    this.filterMonth(this.formValue.tahun_periode, 'PJ')
  }

  sendRequestRiwayat(id) {
    this.tableLoad = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.request.apiData('posting-jurnal', 'g-posting', { kode_perusahaan: this.kode_perusahaan, id_periode: id }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.browseData = data['RESULT']
            this.tableLoad = false
            this.ref.markForCheck()
          } else {
            this.tableLoad = false
            this.ref.markForCheck()
            this.openSnackBar('Data Riwayat tidak ditemukan.')
          }
        }
      )
    }
  }

  sendRequesBelumPosting(id) {
    this.tableLoadBP = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.request.apiData('posting-jurnal', 'g-jurnal-belum-posting', { kode_perusahaan: this.kode_perusahaan, id_periode: id }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.browseDataBP = data['RESULT']
            this.tableLoadBP = false
            this.ref.markForCheck()
          } else {
            this.tableLoadBP = false
            this.ref.markForCheck()
            this.openSnackBar('Data belum posting tidak ditemukan.')
          }
        }
      )
    }
  }

  // TUTUP FULL
  tabTP() {
    this.loadTab = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.formValueTP = {
        kode_cabang: this.formValueTP.kode_cabang,
        nama_cabang: this.formValueTP.nama_cabang,
        id_periode: this.periode_aktif.id_periode,
        bulan_periode: this.periode_aktif.nama_bulan_periode,
        numb_bulan_periode: this.periode_aktif.bulan_periode,
        tahun_periode: this.periode_aktif.tahun_periode
      }
      this.inputTP()
      this.ref.markForCheck()
    }
    this.loadTab = false
  }

  inputTP() {
    // INIT LIST TAHUN BOLEH TUTUP FULL
    let list_tahun = JSON.parse(JSON.stringify(this.periode_tutup)).map(detail => {
      const cont = detail
      cont['label'] = detail['tahun_periode']
      cont['value'] = detail['tahun_periode']
      return cont
    }),

      flags = [], x = []
    for (var i = 0; i < list_tahun.length; i++) {
      if (flags[list_tahun[i]['tahun_periode']]) continue;
      flags[list_tahun[i]['tahun_periode']] = true;
      x.push(list_tahun[i])
    }

    // INIT LIST BULAN BOLEH TUTUP
    let list_bulan = JSON.parse(JSON.stringify(this.periode_tutup)).map(detail => {
      const cont = detail
      cont['label'] = this.gbl.getNamaBulan(detail['bulan_periode'])
      cont['value'] = detail['bulan_periode']
      return cont
    })

    // =========================
    this.opsi_tahun = x
    this.opsi_bulan = list_bulan
    // ========= || ============

    this.inputLayoutTP.splice(0, 3,
      {
        formWidth: 'col-5',
        label: 'Cabang',
        id: 'kode-cabang',
        type: 'inputgroup',
        click: (type) => this.listDialog(type),
        btnLabel: '',
        btnIcon: 'flaticon-search',
        browseType: 'kode_cabangTP',
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
        formWidth: 'col-5',
        label: 'Tahun',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.opsi_tahun,
        valueOf: 'tahun_periode',
        required: false,
        readOnly: false,
        disabled: false,
        onSelectFunc: (v) => {
          this.forminputTP.getData().tahun_periode = parseInt(v)
          this.formValueTP.tahun_periode = parseInt(v)

          // RESET
          this.forminputTP.updateFormValue('bulan_periode', '')
          this.forminputTP.updateFormValue('numb_bulan_periode', 0)
          this.formValueTP.bulan_periode = ''
          this.formValueTP.numb_bulan_periode = 0

          this.filterMonth(v, 'TP')
        }
      },
      {
        formWidth: 'col-5',
        label: 'Bulan',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.opsi_bulan,
        valueOf: 'numb_bulan_periode',
        required: false,
        readOnly: false,
        disabled: false,
        onSelectFunc: (v) => {
          this.forminputTP.updateFormValue('bulan_periode', this.gbl.getNamaBulan(v))
          this.forminputTP.updateFormValue('numb_bulan_periode', parseInt(v))
          this.formValueTP.bulan_periode = this.gbl.getNamaBulan(v)
          this.formValueTP.numb_bulan_periode = parseInt(v)
        }
      }
    )

    this.filterMonth(this.formValueTP.tahun_periode, 'TP')
  }

  tabTPS() {
    this.loadTabTPS = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.formValueTPS = {
        kode_cabang: this.formValueTPS.kode_cabang,
        nama_cabang: this.formValueTPS.nama_cabang,
        id_periode: this.periode_aktif.id_periode,
        bulan_periode: this.periode_aktif.nama_bulan_periode,
        numb_bulan_periode: this.periode_aktif.bulan_periode,
        tahun_periode: this.periode_aktif.tahun_periode
      }
      this.inputTPS()
      this.ref.markForCheck()
    }
    this.loadTabTPS = false
  }

  inputTPS() {
    // INIT LIST TAHUN BOLEH TUTUP FULL
    let list_tahun = JSON.parse(JSON.stringify(this.periode_tutup)).map(detail => {
      const cont = detail
      cont['label'] = detail['tahun_periode']
      cont['value'] = detail['tahun_periode']
      return cont
    }),

      flags = [], x = []
    for (var i = 0; i < list_tahun.length; i++) {
      if (flags[list_tahun[i]['tahun_periode']]) continue;
      flags[list_tahun[i]['tahun_periode']] = true;
      x.push(list_tahun[i])
    }

    // INIT LIST BULAN BOLEH TUTUP
    let list_bulan = JSON.parse(JSON.stringify(this.periode_tutup)).map(detail => {
      const cont = detail
      cont['label'] = this.gbl.getNamaBulan(detail['bulan_periode'])
      cont['value'] = detail['bulan_periode']
      return cont
    })

    // =========================
    this.opsi_tahun = x
    this.opsi_bulan = list_bulan
    // ========= || ============

    this.inputLayoutTPS.splice(0, 3,
      {
        formWidth: 'col-5',
        label: 'Cabang',
        id: 'kode-cabang',
        type: 'inputgroup',
        click: (type) => this.listDialog(type),
        btnLabel: '',
        btnIcon: 'flaticon-search',
        browseType: 'kode_cabangTPS',
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
        formWidth: 'col-5',
        label: 'Tahun',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.opsi_tahun,
        valueOf: 'tahun_periode',
        required: false,
        readOnly: false,
        disabled: false,
        onSelectFunc: (v) => {
          this.forminputTPS.getData().tahun_periode = parseInt(v)
          this.formValueTPS.tahun_periode = parseInt(v)

          // RESET
          this.forminputTPS.updateFormValue('bulan_periode', '')
          this.forminputTPS.updateFormValue('numb_bulan_periode', 0)
          this.formValueTPS.bulan_periode = ''
          this.formValueTPS.numb_bulan_periode = 0

          this.filterMonth(v, 'TPS')
        }
      },
      {
        formWidth: 'col-5',
        label: 'Bulan',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.opsi_bulan,
        valueOf: 'numb_bulan_periode',
        required: false,
        readOnly: false,
        disabled: false,
        onSelectFunc: (v) => {
          this.forminputTPS.updateFormValue('bulan_periode', this.gbl.getNamaBulan(v))
          this.forminputTPS.updateFormValue('numb_bulan_periode', parseInt(v))
          this.formValueTPS.bulan_periode = this.gbl.getNamaBulan(v)
          this.formValueTPS.numb_bulan_periode = parseInt(v)
        }
      }
    )

    this.filterMonth(this.formValueTPS.tahun_periode, 'TPS')
  }

  openCDialog(type) { // Confirmation Dialog
    this.c_inputLayoutPJ = [
      {
        formWidth: 'col-5',
        label: 'Tahun Periode Aktif',
        id: 'tahun-periode',
        type: 'input',
        valueOf: this.formValue.tahun_periode,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      },
      {
        formWidth: 'col-5',
        label: 'Bulan Periode Aktif',
        id: 'bulan-periode',
        type: 'input',
        valueOf: this.formValue.bulan_periode,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      }
    ]
    this.c_inputLayoutTP = [
      {
        formWidth: 'col-5',
        label: 'Tahun',
        id: 'tahun-periode',
        type: 'input',
        valueOf: this.formValueTP.tahun_periode,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      },
      {
        formWidth: 'col-5',
        label: 'Bulan',
        id: 'bulan-periode',
        type: 'input',
        valueOf: this.formValueTP.bulan_periode,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      }
    ]
    this.c_inputLayoutTPS = [
      {
        formWidth: 'col-5',
        label: 'Tahun',
        id: 'tahun-periode',
        type: 'input',
        valueOf: this.formValueTPS.tahun_periode,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      },
      {
        formWidth: 'col-5',
        label: 'Bulan',
        id: 'bulan-periode',
        type: 'input',
        valueOf: this.formValueTPS.bulan_periode,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      }
    ]
    this.gbl.topPage()
    if (this.onSub === false) {
      this.ref.markForCheck()
      if (type === "tutup_periode") {
        if (this.forminputTP.getData().numb_bulan_periode == 0 && this.forminputTP.getData().bulan_periode === '') {
          this.openSnackBar('Mohon pilih bulan terlebih dahulu!', 'fail')
        } else {
          this.openConfirm(type)
        }
      } else if (type === "posting_jurnal") {
        if (this.forminput.getData().numb_bulan_periode == 0 && this.forminput.getData().bulan_periode === '') {
          this.openSnackBar('Mohon pilih bulan terlebih dahulu!', 'fail')
        } else {
          this.openConfirm(type)
        }
      } else {
        this.openConfirm(type)
      }
    } else {
      if (this.enableCancel) {
        const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
          width: 'auto',
          height: 'auto',
          maxWidth: '95vw',
          maxHeight: '95vh',
          backdropClass: 'bg-dialog',
          position: { top: '70px' },
          data: {
            type: type,
            buttonLayout:
              type === "posting_jurnal" ? this.c_buttonLayoutUP :
                {},
            labelLayout:
              type === "posting_jurnal" ? this.c_labelLayoutUP :
                {},
            inputLayout:
              type === "posting_jurnal" ? this.c_inputLayoutUP :
                {},
          },
          disableClose: true
        })


        dialogRef.afterClosed().subscribe(
          result => {
            // this.batal_alasan = ""
          },
          // error => null
        )
      } else {
        this.openSnackBar('Tidak dapat melakukan unposting lagi.', 'info')
      }
    }
  }

  openConfirm(type) {
    if (type === "tutup_periode_sementara") {
      if (this.forminputTPS.getData()['bulan_periode'] === "") {
        this.openSnackBar('Pilih bulan periode terlebih dahulu', 'info')
      } else {
        this.confirmSubmit(type)
      }
    }
    if (type === "tutup_periode") {
      if (this.forminputTP.getData()['bulan_periode'] === "") {
        this.openSnackBar('Pilih bulan periode terlebih dahulu', 'info')
      } else {
        this.confirmSubmit(type)
      }
    }
    if (type === "posting_jurnal") {
      this.confirmSubmit(type)
    }
  }

  confirmSubmit(type) {
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '70px' },
      data: {
        type: type,
        buttonLayout:
          type === "posting_jurnal" ? this.c_buttonLayoutPJ :
            type === "tutup_periode" ? this.c_buttonLayoutTP :
              type === "tutup_periode_sementara" ? this.c_buttonLayoutTPS :
                {},
        labelLayout:
          type === "posting_jurnal" ? this.c_labelLayoutPJ :
            type === "tutup_periode" ? this.c_labelLayoutTP :
              type === "tutup_periode_sementara" ? this.c_labelLayoutTPS :
                {},
        inputLayout:
          type === "posting_jurnal" ? this.c_inputLayoutPJ :
            type === "tutup_periode" ? this.c_inputLayoutTP :
              type === "tutup_periode_sementara" ? this.c_inputLayoutTPS :
                {},
      },
      disableClose: true
    })


    dialogRef.afterClosed().subscribe(
      result => {
        // this.batal_alasan = ""
      },
      // error => null
    )
  }

  //Tab change event
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 2) {
      this.periode_aktif = this.periode_cabang_aktif.filter(x => x.aktif === '1' && x.kode_cabang === this.formValueTP.kode_cabang)[0] || {}
      this.periode_tutup = this.periode_cabang_tutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.forminputTP.getData()['kode_cabang'])
      this.djbp == undefined ? null : this.djbp.reset()
      this.drp == undefined ? null : this.drp.reset()
      this.actPeriod()
      this.tabTP()
      this.formInputCheckChanges()
    } else if (this.selectedTab == 1) {
      this.periode_aktif = this.periode_cabang_aktif.filter(x => x.aktif === '1' && x.kode_cabang === this.formValueTPS.kode_cabang)[0] || {}
      this.periode_tutup = this.periode_cabang_tutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.forminputTPS.getData()['kode_cabang'])
      this.djbp == undefined ? null : this.djbp.reset()
      this.drp == undefined ? null : this.drp.reset()
      this.actPeriod()
      this.tabTPS()
      this.formInputCheckChanges()
    } else if (this.selectedTab == 0) {
      this.periode_aktif = this.periode_cabang_aktif.filter(x => x.aktif === '1' && x.kode_cabang === this.formValue.kode_cabang)[0] || {}
      this.periode_tutup = this.periode_cabang_tutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.forminput.getData()['kode_cabang'])
      this.djbp == undefined ? null : this.djbp.checkColumnFit()
      this.drp == undefined ? null : this.drp.checkColumnFit()
      this.actPeriod()
      // this.postJurnalInput()
      this.formInputCheckChanges()
    }
  }

  refreshTab(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.openSnackBar(message, 'success')
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = this.formValue
    x.id_posting = data['id_posting']
    x.id_tran = data['id_tran']
    x.no_tran = data['no_tran']
    x.boleh_batal = data['boleh_batal']
    this.formValue = x
    this.enableCancel = data['boleh_batal'] === 'Y' ? true : false
    this.onSub = true;
    this.onUpdate = true;
    this.getBackToInput();
  }

  browseSelectRowBP(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formDetail = {
      id_tran: x['id_tran'],
      no_tran: x['no_tran'],
      tgl_tran: x['tgl_tran'],
      nama_cabang: x['nama_cabang'],
      nama_divisi: x['nama_divisi'],
      nama_departemen: x['nama_departemen'],
      keterangan: x['keterangan'],
      jenis_jurnal: '0'
    }
    this.getDetail()
  }

  getDetail() {
    this.detailJurnalLoad = true
    this.ref.markForCheck()
    this.request.apiData('jurnal', 'g-jurnal-detail', { kode_perusahaan: this.kode_perusahaan, id_tran: this.formDetail.id_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = [], resp = JSON.parse(JSON.stringify(data['RESULT']))
          for (var i = 0; i < resp.length; i++) {
            let t = {
              id_akun: resp[i]['id_akun'],
              kode_akun: resp[i]['kode_akun'],
              nama_akun: resp[i]['nama_akun'],
              keterangan_akun: resp[i]['keterangan_akun'],
              kode_divisi: resp[i]['kode_divisi'],
              nama_divisi: resp[i]['nama_divisi'],
              kode_departemen: resp[i]['kode_departemen'],
              nama_departemen: resp[i]['nama_departemen'],
              keterangan: resp[i]['keterangan'],
              saldo_debit: parseFloat(resp[i]['nilai_debit']),
              saldo_kredit: parseFloat(resp[i]['nilai_kredit'])
            }
            res.push(t)
          }
          this.detailData = res
          this.openDialog()
        } else {
          this.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
          this.detailJurnalLoad = false
          this.ref.markForCheck()
        }
      }
    )
  }

  listDialog(type) {
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
            type === "kode_cabangTPS" ? this.inputCabangInterface :
              type === "kode_cabangTP" ? this.inputCabangInterface :
                {},
        displayedColumns:
          type === "kode_cabang" ? this.inputCabangDisplayColumns :
            type === "kode_cabangTPS" ? this.inputCabangDisplayColumns :
              type === "kode_cabangTP" ? this.inputCabangDisplayColumns :
                [],
        tableData:
          type === "kode_cabang" ? this.inputCabangData :
            type === "kode_cabangTPS" ? this.inputCabangData :
              type === "kode_cabangTP" ? this.inputCabangData :
                [],
        tableRules:
          type === "kode_cabang" ? this.inputCabangDataRules :
            type === "kode_cabangTPS" ? this.inputCabangDataRules :
              type === "kode_cabangTP" ? this.inputCabangDataRules :
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

            // PERIODE
            this.periode_tutup = this.periode_cabang_tutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.formValue.kode_cabang)
            this.forminput.updateFormValue('tahun_periode', this.periode_tutup[0]['tahun_periode'])
            this.forminput.updateFormValue('numb_bulan_periode', parseInt(this.periode_tutup[0]['bulan_periode']))
            this.forminput.updateFormValue('bulan_periode', this.gbl.getNamaBulan(this.periode_tutup[0]['bulan_periode']))
            this.formValue.tahun_periode = this.periode_tutup[0]['tahun_periode']
            this.formValue.numb_bulan_periode = parseInt(this.periode_tutup[0]['bulan_periode'])
            this.formValue.bulan_periode = this.gbl.getNamaBulan(this.periode_tutup[0]['bulan_periode'])

            if (this.periode_tutup.length > 0) {
              this.disableSubmit = false
            } else {
              this.disableSubmit = true
            }
            this.postJurnalInput()
            this.ref.markForCheck()
          }
        } else if (type === "kode_cabangTPS") {
          if (this.forminputTPS !== undefined) {
            this.forminputTPS.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminputTPS.updateFormValue('nama_cabang', result.nama_cabang)
            this.formValueTPS.kode_cabang = this.forminputTPS.getData()['kode_cabang']
            this.formValueTPS.nama_cabang = this.forminputTPS.getData()['nama_cabang']

            // PERIODE
            this.periode_tutup = this.periode_cabang_tutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.formValueTPS.kode_cabang)
            this.forminputTPS.updateFormValue('tahun_periode', this.periode_tutup[0]['tahun_periode'])
            this.forminputTPS.updateFormValue('bulan_periode', this.gbl.getNamaBulan(this.periode_tutup[0]['bulan_periode']))
            this.forminputTPS.updateFormValue('numb_bulan_periode', parseInt(this.periode_tutup[0]['bulan_periode']))
            this.formValueTPS.bulan_periode = this.gbl.getNamaBulan(this.periode_tutup[0]['bulan_periode'])
            this.formValueTPS.numb_bulan_periode = parseInt(this.periode_tutup[0]['bulan_periode'])

            if (this.periode_tutup.length > 0) {
              this.disableSubmitTPS = false
            } else {
              this.disableSubmitTPS = true
            }

            this.inputTPS()
            this.ref.markForCheck()
          }
        } else if (type === "kode_cabangTP") {
          if (this.forminputTP !== undefined) {
            this.forminputTP.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminputTP.updateFormValue('nama_cabang', result.nama_cabang)
            this.formValueTP.kode_cabang = this.forminputTP.getData()['kode_cabang']
            this.formValueTP.nama_cabang = this.forminputTP.getData()['nama_cabang']

            // PERIODE
            this.periode_tutup = this.periode_cabang_tutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.formValueTP.kode_cabang)
            this.forminputTP.updateFormValue('tahun_periode', this.periode_tutup[0]['tahun_periode'])
            this.forminputTP.updateFormValue('bulan_periode', this.gbl.getNamaBulan(this.periode_tutup[0]['bulan_periode']))
            this.forminputTP.updateFormValue('numb_bulan_periode', parseInt(this.periode_tutup[0]['bulan_periode']))
            this.formValueTP.bulan_periode = this.gbl.getNamaBulan(this.periode_tutup[0]['bulan_periode'])
            this.formValueTP.numb_bulan_periode = parseInt(this.periode_tutup[0]['bulan_periode'])


            if (this.periode_tutup.length > 0) {
              this.disableSubmitTP = false
            } else {
              this.disableSubmitTP = true
            }
            this.inputTP()
            this.ref.markForCheck()
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  openDialog() {
    this.gbl.topPage()
    this.ref.markForCheck()
    // this.formInputCheckChangesJurnal()
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: '60vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '10px' },
      data: {
        width: '85vw',
        formValue: this.formDetail,
        inputLayout: this.detailInputLayout,
        buttonLayout: [],
        detailJurnal: true,
        detailLoad: this.detailData === [] ? this.detailJurnalLoad : false,
        jurnalData: this.detailData,
        jurnalDataAkun: [],
        noEditJurnal: true,
        noButtonSave: true,
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => null,
        // onSubmit: (x: NgForm) => this.submitDetailData(this.formDetail),
        deleteData: () => null,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.datatable == undefined ? null : this.datatable.reset()
      },
      error => null,
    );
  }

  getBackToInput() {
    this.selectedTab = 0;
    this.gbl.topPage()
    this.c_inputLayoutUP = [
      {
        formWidth: 'col-5',
        label: 'Tahun Periode Aktif',
        id: 'tahun-periode',
        type: 'input',
        valueOf: this.formValue.tahun_periode,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      },
      {
        formWidth: 'col-5',
        label: 'Bulan Periode Aktif',
        id: 'bulan-periode',
        type: 'input',
        valueOf: this.formValue.bulan_periode,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      },
      {
        formWidth: 'col-5',
        label: 'No. Transaksi',
        id: 'no-tran',
        type: 'input',
        valueOf: this.formValue.no_tran,
        required: false,
        readOnly: true,
        disabled: true,
        update: {
          disabled: false
        }
      }
    ]
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    let status_save = this.checkPeriodeTutup('PJ')
    if (status_save == false) {
      this.openSnackBar('LAKUKAN POSTING JURNAL PADA PERIODE SEBELUMNYA', 'fail')
    } else {
      this.dialog.closeAll()
      this.gbl.topPage()
      let u_id = localStorage.getItem('user_id')
      this.loading = true;
      this.ref.markForCheck()
      this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
      this.formValue.id_posting = this.formValue.id_posting === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
        length: 8,
        numeric: true,
        letters: false,
        special: false
      }))}` : this.formValue.id_posting
      let endRes = Object.assign(
        {
          user_id: u_id,
          kode_perusahaan: this.kode_perusahaan,
          id_periode: this.checkTutup.id
        },
        this.formValue)
      this.request.apiData('posting-jurnal', 'i-posting-jurnal', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.loading = false
            this.refreshTab("BERHASIL POSTING JURNAL")
            this.resetForm()
            this.browseNeedUpdate = true
            this.ref.markForCheck()
            let x = this.periode_tutup.filter(x => x.tahun_periode === this.formValue.tahun_periode && x.bulan_periode === this.formValue.numb_bulan_periode)
            this.sendRequestRiwayat(x[0].id_periode)
            this.sendRequesBelumPosting(x[0].id_periode)
          } else {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar('DATA JURNAL GAGAL DI POSTING', 'fail')
          }
        },
        error => {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('GAGAL MELAKUKAN PROSES.')
        }
      )
    }
  }

  //Form submit
  onSubmitTP(inputForm: NgForm) {
    let status_save = this.checkPeriodeTutup('TP')
    if (status_save == false) {
      this.openSnackBar('TUTUP PERIODE GAGAL! LAKUKAN TUTUP PERIODE PADA PERIODE SEBELUMNYA', 'fail')
    } else {
      this.dialog.closeAll()
      this.gbl.topPage()
      this.ref.markForCheck()
      this.loading = true
      this.formValueTP.id_periode = this.checkTutup.id
      let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan }, this.formValueTP)
      this.request.apiData('periode', this.onUpdate ? '' : 'i-tutup-periode', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            window.parent.postMessage({
              'type': 'UPDATE-PERIODE'
            }, "*")
            this.browseNeedUpdate = true
            this.loadTab = true
            this.ref.markForCheck()
            this.openSnackBar("PERIODE TELAH DITUTUP", 'success')
            this.reqActivePeriod('falseTP')
          } else {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar('GAGAL MELAKUKAN TUTUP PERIODE', 'fail')
          }
        },
        error => {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('GAGAL MELAKUKAN PROSES.')
        }
      )
    }
  }

  //Form submit
  onSubmitTPS(inputForm: NgForm) {
    let status_save = this.checkPeriodeTutup('TPS')
    if (status_save == false) {
      this.openSnackBar('TUTUP PERIODE SEMENTARA GAGAL! LAKUKAN TUTUP PERIODE SEMENTARA PADA PERIODE SEBELUMNYA', 'fail')
    } else {
      this.dialog.closeAll()
      this.gbl.topPage()
      this.loading = true
      this.ref.markForCheck()
      this.formValueTPS.id_periode = this.checkTutup.id
      let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan }, this.formValueTPS)
      this.request.apiData('periode', this.onUpdate ? '' : 'i-tutup-periode-sementara', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            window.parent.postMessage({
              'type': 'UPDATE-PERIODE'
            }, "*")
            this.browseNeedUpdate = true
            this.loadTabTPS = true
            this.ref.markForCheck()
            this.openSnackBar("PERIODE TELAH DITUTUP SEMENTARA", 'success')
            this.reqActivePeriod('falseTPS')
          } else {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar('GAGAL MELAKUKAN TUTUP PERIODE SEMENTARA', 'fail')
          }
        },
        error => {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('GAGAL MELAKUKAN PROSES.')
        }
      )
    }
  }

  // Form Submit
  onSubmitUP(inputForm: NgForm) {
    this.dialog.closeAll()
    this.gbl.topPage()
    let u_id = localStorage.getItem('user_id')
    this.loading = true;
    this.ref.markForCheck()
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    let endRes = Object.assign(
      {
        user_id: u_id,
        kode_perusahaan: this.kode_perusahaan,
        id_periode: this.periode_aktif.id_periode
      },
      this.formValue)
    this.request.apiData('posting-jurnal', this.onUpdate ? 'i-unposting-jurnal' : '', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (this.formValue.boleh_batal === "Y") {
            this.loading = false
            this.refreshTab(this.onUpdate ? "DATA JURNAL TELAH DI UNPOSTING" : "")
            this.resetForm()
            this.browseNeedUpdate = true
            this.ref.markForCheck()
            let x = this.periode_tutup.filter(x => x.tahun_periode === this.formValue.tahun_periode && x.bulan_periode === this.formValue.numb_bulan_periode)
            this.sendRequestRiwayat(x[0].id_periode)
            this.sendRequesBelumPosting(x[0].id_periode)
          }
        } else {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('DATA JURNAL GAGAL DI UNPOSTING', 'fail')
        }
      },
      error => {
        this.loading = false;
        this.ref.markForCheck()
        this.openSnackBar('GAGAL MELAKUKAN PROSES.')
      }
    )
  }

  checkPeriodeTutup(type) {
    let selectTahun, filterBulan,
      status_save = true
    if (type === 'TP') {
      for (var i = 0; i < this.opsi_tahun.length; i++) {
        if (this.formValueTP.tahun_periode === this.opsi_tahun[i]['value']) {
          selectTahun = this.opsi_tahun[i]['tahun_periode']
          break;
        }
      }

      filterBulan = JSON.parse(JSON.stringify(this.opsi_bulan)).filter(x => x.tahun_periode === selectTahun)

      for (var i = 0; i < filterBulan.length; i++) {
        if (this.formValueTP.numb_bulan_periode === filterBulan[i]['value']) {
          this.checkTutup = {
            tahun: filterBulan[i]['tahun_periode'],
            bulan: filterBulan[i]['bulan_periode'],
            aktif: filterBulan[i]['aktif'],
            ts: filterBulan[i]['tutup_sementara'],
            id: filterBulan[i]['id_periode'],
          }
          break;
        }
      }


      if (this.periode_tutup.length > 1) {
        for (var i = 0; i < this.periode_tutup.length; i++) {
          if (this.periode_tutup[i].tahun_periode < this.checkTutup.tahun) {
            status_save = false
            break;
          } else {
            if (filterBulan.length > 1) {
              for (var j = 0; j < filterBulan.length; j++) {
                if (filterBulan[j].bulan_periode < this.checkTutup.bulan) {
                  status_save = false
                  break;
                }
              }
            }
          }
        }
      }
    } if (type === 'TPS') {
      for (var i = 0; i < this.opsi_tahun.length; i++) {
        if (this.formValueTPS.tahun_periode === this.opsi_tahun[i]['value']) {
          selectTahun = this.opsi_tahun[i]['tahun_periode']
          break;
        }
      }

      filterBulan = JSON.parse(JSON.stringify(this.opsi_bulan)).filter(x => x.tahun_periode === selectTahun)

      for (var i = 0; i < filterBulan.length; i++) {
        if (this.formValueTPS.numb_bulan_periode === filterBulan[i]['value']) {
          this.checkTutup = {
            tahun: filterBulan[i]['tahun_periode'],
            bulan: filterBulan[i]['bulan_periode'],
            aktif: filterBulan[i]['aktif'],
            ts: filterBulan[i]['tutup_sementara'],
            id: filterBulan[i]['id_periode'],
          }
          break;
        }
      }


      if (this.periode_tutup.length > 1) {
        for (var i = 0; i < this.periode_tutup.length; i++) {
          if (this.periode_tutup[i].tahun_periode < this.checkTutup.tahun) {
            status_save = true
            break;
          } else {
            if (filterBulan.length > 1) {
              for (var j = 0; j < filterBulan.length; j++) {
                if (filterBulan[j].bulan_periode < this.checkTutup.bulan) {
                  status_save = true
                  break;
                }
              }
            }
          }
        }
      }
    } else if (type === 'PJ') {
      for (var i = 0; i < this.opsi_tahun.length; i++) {
        if (this.formValue.tahun_periode === this.opsi_tahun[i]['value']) {
          selectTahun = this.opsi_tahun[i]['tahun_periode']
          break;
        }
      }

      filterBulan = JSON.parse(JSON.stringify(this.opsi_bulan)).filter(x => x.tahun_periode === selectTahun)

      for (var i = 0; i < filterBulan.length; i++) {
        if (this.formValue.numb_bulan_periode === filterBulan[i]['value']) {
          this.checkTutup = {
            tahun: filterBulan[i]['tahun_periode'],
            bulan: filterBulan[i]['bulan_periode'],
            aktif: filterBulan[i]['aktif'],
            ts: filterBulan[i]['tutup_sementara'],
            id: filterBulan[i]['id_periode'],
          }
          break;
        }
      }


      if (this.periode_tutup.length > 1) {
        for (var i = 0; i < this.periode_tutup.length; i++) {
          if (this.periode_tutup[i].tahun_periode < this.checkTutup.tahun) {
            // status_save = false // DISABLE
            status_save = true
            break;
          } else {
            if (filterBulan.length > 1) {
              for (var j = 0; j < filterBulan.length; j++) {
                if (filterBulan[j].bulan_periode < this.checkTutup.bulan) {
                  // status_save = false // DISABLE
                  status_save = true
                  break;
                }
              }
            }
          }
        }
      }
    }
    return status_save
  }

  filterMonth(v, type) {
    if (type === 'TP') {
      this.inputLayoutTP.splice(2, 1,
        {
          formWidth: 'col-5',
          label: 'Bulan',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.opsi_bulan.filter(x => x.tahun_periode === parseInt(v)),
          valueOf: 'numb_bulan_periode',
          required: false,
          readOnly: false,
          disabled: false,
          onSelectFunc: (v) => {
            this.forminputTP.updateFormValue('bulan_periode', this.gbl.getNamaBulan(v))
            this.forminputTP.updateFormValue('numb_bulan_periode', parseInt(v))
            this.formValueTP.bulan_periode = this.gbl.getNamaBulan(v)
            this.formValueTP.numb_bulan_periode = parseInt(v)
          }
        }
      )
    } else if (type === 'TPS') {
      this.inputLayoutTPS.splice(2, 1,
        {
          formWidth: 'col-5',
          label: 'Bulan',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.opsi_bulan.filter(x => x.tahun_periode === parseInt(v)),
          valueOf: 'numb_bulan_periode',
          required: false,
          readOnly: false,
          disabled: false,
          onSelectFunc: (v) => {
            this.forminputTPS.updateFormValue('bulan_periode', this.gbl.getNamaBulan(v))
            this.forminputTPS.updateFormValue('numb_bulan_periode', parseInt(v))
            this.formValueTPS.bulan_periode = this.gbl.getNamaBulan(v)
            this.formValueTPS.numb_bulan_periode = parseInt(v)
          }
        }
      )
    } else if (type === 'PJ') {
      this.inputLayout.splice(2, 1,
        {
          formWidth: 'col-9',
          label: 'Bulan',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.opsi_bulan.filter(x => x.tahun_periode === parseInt(v)),
          valueOf: 'numb_bulan_periode',
          required: false,
          readOnly: false,
          disabled: false,
          update: {
            disabled: true
          },
          onSelectFunc: (v) => {
            this.forminput.updateFormValue('bulan_periode', this.gbl.getNamaBulan(v))
            this.forminput.updateFormValue('numb_bulan_periode', parseInt(v))
            this.formValue.bulan_periode = this.gbl.getNamaBulan(v)
            this.formValue.numb_bulan_periode = parseInt(v)

            let x = this.periode_tutup.filter(x => x.tahun_periode === this.formValue.tahun_periode && x.bulan_periode === this.formValue.numb_bulan_periode)
            this.sendRequestRiwayat(x[0].id_periode)
            this.sendRequesBelumPosting(x[0].id_periode)
          }
        }
      )
    }
    this.formInputCheckChanges()
  }

  //Reset Value
  resetForm() {
    this.gbl.topPage()
    this.formValue = {
      kode_cabang: this.formValue.kode_cabang,
      nama_cabang: this.formValue.nama_cabang,
      bulan_periode: this.formValue.bulan_periode,
      tahun_periode: this.formValue.tahun_periode,
      numb_bulan_periode: this.formValue.numb_bulan_periode,
      id_posting: '',
      id_tran: '',
      no_tran: '',
      boleh_batal: '',
    }
    this.enableCancel = false;
    this.onSub = false;
    this.formInputCheckChanges()
  }

  onCancel() {
    if (!this.onUpdate) {
      this.resetForm()
      this.drp == undefined ? null : this.drp.reset()
    } else {
      this.onUpdate = false;
      this.onSub = false;
      this.resetForm()
      this.djbp == undefined ? null : this.djbp.reset()
      this.drp == undefined ? null : this.drp.reset()
    }
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
      this.forminputTP === undefined ? null : this.forminputTP.checkChanges()
      this.forminputTPS === undefined ? null : this.forminputTPS.checkChanges()
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 10)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

}
