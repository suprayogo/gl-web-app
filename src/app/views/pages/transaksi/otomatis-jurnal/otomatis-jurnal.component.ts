import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
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
  beforeCodeTitle: 'Jurnal Otomatis'
}

@Component({
  selector: 'kt-otomatis-jurnal',
  templateUrl: './otomatis-jurnal.component.html',
  styleUrls: ['./otomatis-jurnal.component.scss', '../transaksi.style.scss']
})
export class OtomatisJurnalComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild('rt', { static: false }) rt; // Riwayat Tarik
  @ViewChild('ht', { static: false }) ht; // Hasil Tarik
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // LOADING
  loading: boolean = true;
  tableLoadHT: boolean = false;
  tableLoadRT: boolean = false;
  // DIALOG
  rightLayout: boolean = false; // SET ACTIVE LAYOUT INPUT RIGHT SIDE
  dialogRef: any;
  dialogType: string = null;
  // BUTTON
  noCancel: boolean = true; // SET ACTIVE HIDE BUTTON CANCEL
  // METHOD HASIL TARIK JURNAL OTOMATIS
  partHT: any = ''; // PART DATA LOADING
  needReqVal: any = 0; // PART GET DATA
  cabang_tmp: any = ''; // CABANG
  re_get_tmp: any = ''; // VALUE PART AWAL 
  result: any = []; // FUll DATA
  resultTotal: any = []; // VALUE LOADING
  // OTHERS
  content: any;
  onUpdate: boolean = false
  loadingDataTextHT: string = 'Loading Data Jurnal Otomatis..'
  loadingDataTextRT: string = 'Loading Riwayat Tarik Data..'
  nama_tombol: any;
  periode: any;
  cabang_utama: any;
  tipe_setting: any;
  jenisTransaksiData = {}
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
  tgl_jurnal: any;

  opsi_tahun: any
  opsi_bulan: any
  checkTutup: any

  tipe_laporan = [
    {
      label: 'Ya',
      value: '1'
    },
    {
      label: 'Tidak',
      value: '0'
    }
  ]

  //
  formValue = {
    tgl_tarik: '',
    bulan_periode: '',
    tahun_periode: '',
    rekap_harian: '1',
    tgl_tran: '',
    rekap_bulanan: '1',
    rekap_transaksi: '1',
    kode_cabang: '',
    nama_cabang: ''
  }

  //
  formDetail = {
    nama_cabang: '',
    jenis_jurnal: '0',
    nama_jenis_jurnal: '0',
    // HEADER UMUM
    id: '',
    kode_setting: '',
    nama_setting: '',
    no_referensi: '',
    tgl_tran: '',
    keterangan: '',
    // HEADER (+KASIR)
    tipe_laporan: '',
    id_jenis_transaksi: '',
    nama_jenis_transaksi: '',
    nama_bank: '',
    no_rekening: '',
    atas_nama: '',
    rekening_perusahaan: '',
    lembar_giro: 0,
    tipe_transaksi: '',
    nama_tipe_transaksi: '',
    saldo_transaksi: 0
  }

  // LAYOUT FORM INPUT
  inputLayout = [
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
      label: 'Tanggal Tarik Terakhir',
      id: 'tgl-tarik',
      type: 'input',
      valueOf: 'tgl_tarik',
      required: false,
      readOnly: true,
      disabled: true,
      update: {
        disabled: false
      }
    },
    // {
    //   labelWidth: 'col-4',
    //   formWidth: 'col-7',
    //   label: 'Periode Aktif',
    //   id: 'bulan-periode',
    //   type: 'inputgroup',
    //   valueOf: 'bulan_periode',
    //   required: true,
    //   readOnly: true,
    //   noButton: true,
    //   disabled: true,
    //   inputInfo: {
    //     id: 'tahun-periode',
    //     disabled: false,
    //     readOnly: true,
    //     required: false,
    //     valueOf: 'tahun_periode'
    //   },
    //   update: {
    //     disabled: false
    //   }
    // },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
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
      // blurOption: {
      //   ind: 'kode_cabang',
      //   data: [],
      //   valueOf: ['kode_cabang', 'nama_cabang'],
      //   onFound: () => {
      //     this.formValue.kode_cabang = this.forminput.getData()['kode_cabang']
      //     if (this.formValue.kode_cabang !== this.forminput.getData()['kode_cabang']) {
      //       this.browseDataHT = []
      //       this.result = []
      //       this.needReqVal = 0
      //       this.resultTotal = []
      //       this.partHT = ''
      //     }
      //     this.cabang_tmp = this.forminput.getData()['kode_cabang']
      //   }
      // },
      update: {
        disabled: true
      }
    },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
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
      labelWidth: 'col-4',
      formWidth: 'col-7',
      label: 'Bulan',
      id: 'bulan-periode',
      type: 'combobox',
      options: [],
      valueOf: 'bulan_periode',
      required: false,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
      },
      onSelectFunc: (v) => { }
    },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
      label: 'Rekap Harian',
      id: 'rekap-harian',
      type: 'combobox',
      options: this.tipe_laporan,
      valueOf: 'rekap_harian',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
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
      },
      hiddenOn: {
        valueOf: 'rekap_harian',
        matchValue: '0'
      }
    },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
      label: 'Rekap Bulanan',
      id: 'rekap-bulanan',
      type: 'combobox',
      options: this.tipe_laporan,
      valueOf: 'rekap_bulanan',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
      label: 'Rekap Transaksi',
      id: 'rekap-transaksi',
      type: 'combobox',
      options: this.tipe_laporan,
      valueOf: 'rekap_transaksi',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
      label: 'Filter Jurnal',
      type: 'detail',
      click: (type) => this.openDialog(type),
      btnLabel: 'Data Jurnal',
      btnIcon: 'flaticon-list-3',
      browseType: 'kode_jurnal',
      valueOf: 'kode',
      required: false,
      readOnly: true,
      update: {
        disabled: false
      }
    },
  ]

  // LAYOUT FORM DETAIL
  detailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'Jenis Jurnal',
      id: 'jenis-jurnal',
      type: 'input',
      valueOf: 'nama_jenis_jurnal',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: false
    },
    {
      formWidth: 'col-5',
      label: 'Nama Jurnal',
      id: 'nama-jurnal',
      type: 'input',
      valueOf: 'nama_setting',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: false
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
      label: 'Keterangan',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: true,
      disabled: true
    }
  ]

  rightDetailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'Jenis Transaksi',
      id: 'jenis-transaksi',
      type: 'input',
      valueOf: 'nama_jenis_transaksi',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Rekening & Bank',
      id: 'rekening',
      type: 'input',
      valueOf: 'rekening_perusahaan',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Atas Nama',
      id: 'atas-nama',
      type: 'input',
      valueOf: 'atas_nama',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Lembar Giro',
      id: 'lembar-giro',
      type: 'input',
      valueOf: 'lembar_giro',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Tipe Transaksi',
      id: 'tipe-transaksi',
      type: 'input',
      valueOf: 'nama_tipe_transaksi',
      required: true,
      readOnly: true,
      disabled: true
    }
  ]

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
  inputCabangInterface = {}
  inputCabangData = []
  inputCabangDataRules = []
  // ----------------------

  // LIST FILTER JURNAL
  inputJurnalDisplayColumns = [
    {
      label: 'Nama Jurnal',
      value: 'nama_jurnal',
      selectable: true
    },
    {
      label: 'Kode Cabang',
      value: 'kode_cabang'
    }
  ]
  inputJurnalInterface = {}
  inputJurnalData = []
  inputJurnalDataRules = []
  filterDataJurnal = []
  checkFilterJurnal = []
  // --------------------

  // LIST HASIL TARIK DATA JURNAL OTOMATIS
  displayedColumnsTableHT = [
    {
      label: 'Cabang',
      value: 'nama_cabang'
    },
    {
      label: 'Jenis Jurnal',
      value: 'jenis_jurnal_sub'
    },
    {
      label: 'Nama Jurnal',
      value: 'nama_setting'
    },
    {
      label: 'Tgl. Transaksi',
      value: 'tgl_tran',
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    }
  ]
  browseInterfaceHT = {}
  browseDataHT = []
  browseDataRulesHT = [
    {
      target: 'jenis_jurnal',
      replacement: {
        '0': 'Jurnal Umum',
        '1': 'Jurnal Kasir'
      },
      redefined: 'jenis_jurnal_sub'
    }
  ]
  // -------------------------------------

  // LIST RIWAYAT TARIK DATA JURNAL OTOMATIS
  displayedColumnsTableRT = [
    {
      label: 'Ditarik Oleh',
      value: 'input_by'
    },
    {
      label: 'Ditarik Tanggal',
      value: 'input_dt',
      date: true
    }
  ]
  browseInterfaceRT = {}
  browseDataRT = []
  browseDataRulesRT = []
  // ---------------------------------------

  // DETAIL
  detailData = []

  // New Update
  periodeCabang: any
  periodeCabangTutup: any

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.gbl.need(true, true)
    this.nama_tombol = 'Tarik Data'
    this.madeRequest()
  }

  ngAfterViewInit(): void {
    // PERUSAHAAN AKTIF
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    if (this.kode_perusahaan !== '') {
      this.madeRequest()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
    this.subsPA === undefined ? null : this.subsPA.unsubscribe()
  }

  madeRequest() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== '') {
      this.request.apiData('periode', 'g-periode-aktif', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.periode_aktif = data['RESULT'].filter(x => x.aktif === '1')[0] || {}
            this.periode_tutup = JSON.parse(JSON.stringify(data['RESULT'].filter(x => x.aktif === '1' || x.tutup_sementara === '1')))
            this.periodeCabang = JSON.parse(JSON.stringify(data['RESULT']))
            this.periodeCabangTutup = JSON.parse(JSON.stringify(data['RESULT']))
            this.ref.markForCheck()
            this.getCabang()
          } else {
            this.gbl.openSnackBar('Data Periode tidak ditemukan.')
          }
        }
      )
    }
  }

  // GET DATA CABANG
  getCabang() {
    this.request.apiData('cabang', 'g-cabang-akses', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputCabangData = data['RESULT']
          // Variable
          let akses_cabang = JSON.parse(JSON.stringify(this.inputCabangData))
          // Cabang Utama User
          this.cabang_utama = akses_cabang.filter(x => x.cabang_utama_user === 'true')[0] || {}
          this.formValue.kode_cabang = this.cabang_utama.kode_cabang
          this.formValue.nama_cabang = this.cabang_utama.nama_cabang
          this.cabang_tmp = this.cabang_utama.kode_cabang
          // this.gbl.updateInputdata(data['RESULT'], 'kode_cabang', this.inputLayout)
          // New Update
          this.periode_aktif = this.periodeCabang.filter(x => x.aktif === '1' && x.kode_cabang === this.formValue.kode_cabang)[0] || {}
          this.periode_tutup = this.periodeCabangTutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.formValue.kode_cabang)

          this.gbl.periodeAktif(this.periode_aktif['id_periode'], this.periode_aktif['tahun_periode'], this.periode_aktif['bulan_periode'])
          this.idPeriodeAktif = this.gbl.getIdPeriodeAktif()
          this.tahunPeriodeAktif = this.gbl.getTahunPeriodeAktif()
          this.bulanPeriodeAktif = this.gbl.getBulanPeriodeAktif()
          this.nama_bulan_aktif = this.gbl.getNamaBulan(this.bulanPeriodeAktif)
          this.periode_aktif = this.gbl.getActive()
          this.ref.markForCheck()
          window.parent.postMessage({
            'type': 'CHANGE-PERIODE',
            'value': {
              kode_cabang: this.formValue.kode_cabang
            }
          }, "*")
          // -------------

          this.formValue = {
            tgl_tarik: '',
            bulan_periode: this.periode_aktif.bulan_periode,
            tahun_periode: this.periode_aktif.tahun_periode,
            rekap_harian: this.formValue.rekap_harian,
            tgl_tran: this.formValue.tgl_tran,
            rekap_bulanan: this.formValue.rekap_bulanan,
            rekap_transaksi: this.formValue.rekap_transaksi,
            kode_cabang: this.formValue.kode_cabang,
            nama_cabang: this.formValue.nama_cabang
          }

          this.inputFilter()
          this.ref.markForCheck()
          this.getSettingJurnal()
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan data cabang. Mohon coba lagi nanti.', 'fail')
        }
      }
    )
  }

  inputFilter() {
    // this.inputLayout.splice(5, 1,
    //   {
    //     labelWidth: 'col-4',
    //     formWidth: 'col-7',
    //     label: 'Tgl. Transaksi',
    //     id: 'tgl-tran',
    //     type: 'datepicker',
    //     valueOf: 'tgl_tran',
    //     required: true,
    //     readOnly: false,
    //     update: {
    //       disabled: false
    //     },
    //     timepick: false,
    //     enableMin: true,
    //     enableMax: true,
    //     minMaxDate: () => {
    //       return {
    //         y: this.periode_aktif.tahun_periode,
    //         m: this.periode_aktif.bulan_periode
    //       }
    //     },
    //     onSelectFunc: (value) => {
    //     },
    //     hiddenOn: {
    //       valueOf: 'rekap_harian',
    //       matchValue: '0'
    //     }
    //   },
    // )
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

    this.inputLayout.splice(2, 2,
      {
        labelWidth: 'col-4',
        formWidth: 'col-7',
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
          // this.forminput.getData().tahun_periode = v
          // this.formValue.tahun_periode = v

          // RESET
          this.forminput.getData().bulan_periode = ''
          // this.formValue.bulan_periode = ''

          this.filterMonth(v)
        }
      },
      {
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Bulan',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.opsi_bulan,
        valueOf: 'bulan_periode',
        required: false,
        readOnly: false,
        disabled: false,
        update: {
          disabled: true
        },
        onSelectFunc: (v) => {
          // this.forminput.getData().bulan_periode = v
          // this.formValue.bulan_periode = v
        }
      }
    )
    this.filterMonth(this.formValue.tahun_periode)
  }

  filterMonth(v) {
    this.inputLayout.splice(3, 1,
      {
        labelWidth: 'col-4',
        formWidth: 'col-7',
        label: 'Bulan',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.opsi_bulan.filter(x => x.tahun_periode === parseInt(v)),
        valueOf: 'bulan_periode',
        required: false,
        readOnly: false,
        disabled: false,
        update: {
          disabled: true
        },
        onSelectFunc: (v) => {
          // this.forminput.getData().bulan_periode = v
          // this.formValue.bulan_periode = v
        }
      }
    )
  }


  // GET DATA SETTING JURNAL
  getSettingJurnal() {
    this.request.apiData('jurnal-otomatis', 'g-setting-jurnal-otomatis', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputJurnalData = data['RESULT']
          let x = JSON.parse(JSON.stringify(data['RESULT']))
          this.restructureDetailData(x)
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan data setting jurnal. Mohon coba lagi nanti.', 'fail')
        }
      }
    )
    this.loading = false
    this.getRiwayatTarik()
  }

  // GET DATA RIWAYAT TARIK JURNAL
  getRiwayatTarik() {
    this.tableLoadRT = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== '') && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== '')) {
      this.request.apiData('jurnal-otomatis', 'g-tarik-data-terakhir', { kode_perusahaan: this.kode_perusahaan, id_periode: this.periode_aktif.id_periode }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.browseDataRT = data['RESULT']
            if (data['RESULT'].length > 0) {
              let dt = data['RESULT'][0]['input_dt'].split(' ')[0],
                st = dt.split('-'),
                y = st[0],
                m = st[1].replace('0', ''),
                d = st[2],
                edt = d + ' ' + this.gbl.getNamaBulan(m) + ' ' + y
              this.formValue.tgl_tarik = edt
              this.forminput.updateFormValue('tgl_tarik', edt)
            } else {
              this.formValue.tgl_tarik = 'Belum pernah tarik'
              this.forminput.updateFormValue('tgl_tarik', 'Belum pernah tarik')
            }
            this.tableLoadRT = false
          } else {
            this.ref.markForCheck()
            this.tableLoadRT = false
            this.gbl.openSnackBar('Data Riwayat tidak ditemukan.')
          }
        }
      )
    }
  }

  // INITIALIZATION HASIL TARIK DATA JURNAL OTOMATIS
  initHasilTarik() {
    let x = JSON.parse(JSON.stringify(this.forminput.getData()))
    if (JSON.stringify(this.formValue) === JSON.stringify(this.forminput.getData()) == false) {
      this.browseDataHT = []
      this.result = []
      this.needReqVal = 0
      this.resultTotal = []
      this.partHT = ''
      this.formValue = x
    } else {
      this.formValue = x
    }
    this.setRequestValue()
  }

  setRequestValue() {
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== '') && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== '')) {
      this.periode = this.gbl.getTahunPeriodeAktif() + '-' + (this.gbl.getBulanPeriodeAktif().length > 1 ? this.gbl.getBulanPeriodeAktif() : '0' + this.gbl.getBulanPeriodeAktif())
      this.tipe_setting = []
      if (this.formValue.rekap_transaksi === '1') {
        this.tipe_setting.push('2')
      }
      if (this.formValue.rekap_harian === '1') {
        this.tipe_setting.push('1')
        this.tgl_jurnal = this.formValue.tgl_tran === '' ? '' : this.gbl.splitDateLocal(parseInt(this.formValue.tgl_tran))
      } else {
        this.tgl_jurnal = ''
      }
      if (this.formValue.rekap_bulanan === '1') {
        this.tipe_setting.push('0')
      }
      if (this.forminput.getData().bulan_periode === '') {
        this.gbl.openSnackBar('Mohon pilih bulan terlebih dahulu!', 'fail')
      } else {
        this.gbl.bottomPage()
        this.tableLoadHT = true
        this.onUpdate = true
        this.getJurnalOtomatis('')
      }
    }
  }

  // GET DATA JURNAL OTOMATIS
  getJurnalOtomatis(reqStatus) {
    this.ref.markForCheck()
    if (reqStatus === '' || reqStatus === 'W') {
      let b = parseInt(this.formValue.bulan_periode) < 10 ? "0" + this.formValue.bulan_periode : this.formValue.bulan_periode
      let endRes = Object.assign(
        {
          kode_perusahaan: this.kode_perusahaan,
          kode_cabang: this.formValue.kode_cabang,
          periode: this.formValue.tahun_periode + "-" + b,
          tgl_periode: this.tgl_jurnal,
          tipe_setting: this.tipe_setting,
          re_get: this.needReqVal,
          list_kode_jurnal: this.filterDataJurnal
        })
      this.request.apiData('jurnal-otomatis', 'g-data-jurnal-otomatis', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'W') {

            // Clone Result
            let dataJOtomatis = JSON.parse(JSON.stringify(data['RESULT'])),
              totalSetting = JSON.parse(JSON.stringify(data['RESULT']))

            // Init Data Jurnal Otomatis
            dataJOtomatis.splice(0, 1)
            for (var i = 0; i < dataJOtomatis.length; i++) {
              dataJOtomatis[i]['detail'] = JSON.parse(dataJOtomatis[i]['detail'])
              this.result.push(dataJOtomatis[i])
            }
            this.browseDataHT = this.result
            this.loadingDataTextHT = 'Please wait..'

            // Init Data Setting
            totalSetting.splice(1, i)
            for (var j = 0; j < totalSetting.length; j++) {
              let initTotal = {
                re_get: totalSetting[j]['re_get']
              }
              this.resultTotal.push(initTotal)
            }

            // Part loading start
            let f, g, h, startloadPart,
              // Part loading final
              x, y, z, finalLoadPart

            if (this.re_get_tmp === '') {
              this.re_get_tmp = data['RESULT'][0]['re_get']
            }

            if (this.re_get_tmp !== '') {
              // Init Start Count Part Loading
              if (data['RESULT'][0]['re_get'].toString().length == 1) {
                f = data['RESULT'][0]['re_get']
                g = Math.round(f)
                h = g
                startloadPart = h / this.re_get_tmp
              } else if (data['RESULT'][0]['re_get'].toString().length == 2) {
                f = data['RESULT'][0]['re_get'] / 10
                g = Math.round(f)
                h = g * 10
                startloadPart = h / this.re_get_tmp
              } else if (data['RESULT'][0]['re_get'].toString().length == 3) {
                f = data['RESULT'][0]['re_get'] / 100
                g = Math.round(f)
                h = g * 100
                startloadPart = h / this.re_get_tmp
              }

              // Init Final Count Part Loading
              if (data['RESULT'][0]['re_get_total'].toString().length == 1) {
                x = data['RESULT'][0]['re_get_total']
                y = Math.round(x)
                z = y
                finalLoadPart = z / this.re_get_tmp
              } else if (data['RESULT'][0]['re_get_total'].toString().length == 2) {
                x = data['RESULT'][0]['re_get_total'] / 10
                y = Math.round(x)
                z = y * 10
                finalLoadPart = z / this.re_get_tmp
              } else if (data['RESULT'][0]['re_get_total'].toString().length == 3) {
                x = data['RESULT'][0]['re_get_total'] / 100
                y = Math.round(x)
                z = y * 100
                finalLoadPart = z / this.re_get_tmp
              }
            }

            // Type Loading Percent (Optional)
            let dec = 100 / finalLoadPart,
              percentage = Math.round(this.resultTotal.length * dec)
            if (percentage > 100) {
              percentage = 100
            }
            let loadPercent = percentage + ' %'

            // Loading Per Part Setting Data
            // this.partHT = startloadPart + ' / ' + finalLoadPart

            // Loading Percent
            this.partHT = loadPercent
            this.ref.markForCheck()

            // Continue Request
            this.needReqVal = data['RESULT'][0]['re_get']
            if (this.needReqVal > 0) {
              this.getJurnalOtomatis('W')
            }

          } else if (data['STATUS'] === 'Y') {
            this.checkFilterJurnal = JSON.parse(JSON.stringify(this.filterDataJurnal))
            this.tableLoadHT = false
            setTimeout(() => {
              this.ref.markForCheck()
              this.gbl.screenPosition(700)
            }, 1000);
            this.ref.markForCheck()
          } else {
            this.onUpdate = false
            this.needReqVal = 0
            this.resultTotal = []
            this.partHT = ''
            this.tableLoadHT = false
            this.ref.markForCheck()
            this.gbl.openSnackBar('Data hasil tarik tidak ditemukan.', 'fail')
          }
        },
        err => {
          this.onUpdate = false
          this.needReqVal = 0
          this.resultTotal = []
          this.partHT = ''
          this.tableLoadHT = false
          this.ref.markForCheck()
          this.gbl.openSnackBar('Gagal mendapatkan hasil tarik data.', 'fail')
        }
      )
    }
  }

  // BROWSE BINDING EVENT (HEADER)
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formDetail = {
      nama_cabang: x['nama_cabang'],
      jenis_jurnal: x['jenis_jurnal'] === '1' ? '2' : '0',
      nama_jenis_jurnal: x['jenis_jurnal'] === '1' ? 'Jurnal Kasir' : 'Jurnal Umum',
      // HEADER UMUM
      id: x['id'],
      kode_setting: x['kode_setting'],
      nama_setting: x['nama_setting'],
      no_referensi: x['no_referensi'],
      tgl_tran: x['tgl_tran'],
      keterangan: x['keterangan'],
      // HEADER (+KASIR)
      tipe_laporan: x['tipe_laporan'],
      id_jenis_transaksi: x['id_jenis_transaksi'],
      nama_jenis_transaksi: x['nama_jenis_transaksi'],
      nama_bank: x['nama_bank'],
      no_rekening: x['no_rekening'],
      atas_nama: x['atas_nama'],
      rekening_perusahaan: '',
      lembar_giro: parseFloat(x['nilai_jenis_transaksi']),
      tipe_transaksi: x['tipe_transaksi'],
      nama_tipe_transaksi: x['tipe_transaksi'] === '0' ? 'Masuk' : x['tipe_transaksi'] === '1' ? 'Keluar' : '',
      saldo_transaksi: x['saldo_transaksi']
    }
    this.formDetail.rekening_perusahaan = this.formDetail.no_rekening + '(' + this.formDetail.nama_bank + ')'
    this.rightLayout = this.formDetail.jenis_jurnal === '2' ? true : false
    this.viewDetailLayout()
  }

  // BROWSE BINDING EVENT (DETAIL)
  getDetail() {
    let filter = [], tmp = JSON.parse(JSON.stringify(this.browseDataHT)), detail = []
    // Filter Spesific Detail
    filter = tmp.filter(header => header.id === this.formDetail.id)[0]['detail']
    // Init Detail Data
    detail = filter.map(detail => {
      const container = detail
      // Add Important Object
      container['keterangan_akun'] = detail.keterangan
      container['saldo_debit'] = parseFloat(detail.nilai_debit)
      container['saldo_kredit'] = parseFloat(detail.nilai_kredit)
      // Delete Useless Object
      delete container.keterangan
      delete container.nilai_debit
      delete container.nilai_kredit
      return container
    })

    // Check Type Jurnal
    if (this.formDetail.jenis_jurnal === '2') {
      if (this.formDetail.tipe_transaksi === '0') {
        this.detailData = detail.filter(x => x['saldo_kredit'] != 0)
      } else {
        this.detailData = detail.filter(x => x['saldo_debit'] != 0)
      }
    } else {
      this.detailData = detail
    }
    this.formInputCheckChangesJurnal()
    this.inputDialog()
  }

  // Form submit
  onSubmit() {
    let valid = this.validateSubmit()
    if (valid === true) {
      let x = this.periode_tutup.filter(x => x.tahun_periode === +this.formValue.tahun_periode && x.bulan_periode === +this.formValue.bulan_periode)
      this.loading = true
      this.ref.markForCheck()
      let endRes = {
        batch: '',
        kode_perusahaan: this.kode_perusahaan,
        id_periode: x[0].id_periode,
        detail: this.browseDataHT
      }
      this.request.apiData('jurnal-otomatis', 'i-jurnal-otomatis', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onUpdate = false
            this.loading = false
            this.tableLoadRT = true
            this.result = []
            this.needReqVal = 0
            this.resultTotal = []
            this.partHT = ''
            this.browseDataHT = []
            this.browseDataRT = []
            this.ref.markForCheck()
            this.getRiwayatTarik()
          } else {
            this.onUpdate = false
            this.loading = false
            this.ref.markForCheck()
            this.gbl.topPage()
            this.gbl.openSnackBar('Gagal menyimpan jurnal. Mohon dicoba beberapa saat lagi.', 'fail')
          }
        }
      )
    } else {
      this.gbl.topPage()
      if (valid === 'nodata') {
        this.gbl.openSnackBar('Tidak ada hasil tarik data jurnal. Mohon tarik data terlebih dahulu', 'info')
      } else if (valid === 'nobalance') {
        this.gbl.openSnackBar('Nilai saldo jurnal ada yang tidak seimbang.', 'fail')
      }
    }
  }

  validateSubmit() {
    let valid: any = true

    for (var i = 0; i < this.browseDataHT.length; i++) {
      let dataI = this.browseDataHT[i],
        debit = 0,
        kredit = 0
      // for (var j = 0; j < dataI['detail'].length; j++) {
      //   if (dataI['detail'][j]['debit'] === true) {
      //     debit = debit + parseFloat(dataI['detail'][j]['saldo'])
      //   } else if (dataI['detail'][j]['debit'] === false) {
      //     kredit = kredit + parseFloat(dataI['detail'][j]['saldo'])
      //   }
      // }

      if (debit !== kredit) {
        valid = 'nobalance'
        break
      }
    }

    if (this.browseDataHT.length < 1) {
      valid = 'nodata'
    }

    return valid
  }

  // Reset Value
  resetForm() {
    this.gbl.topPage()
    this.tableLoadHT = true
    this.onUpdate = false
    this.result = []
    this.needReqVal = 0
    this.resultTotal = []
    this.partHT = ''
    this.browseDataHT = []
    this.ref.markForCheck()
    setTimeout(() => {
      this.tableLoadHT = false
      this.ref.markForCheck()
    }, 500)
  }

  cancInput() {
    this.formValue = this.forminput.getData()
    this.formValue = {
      tgl_tarik: this.formValue.tgl_tarik,
      bulan_periode: this.formValue.bulan_periode,
      tahun_periode: this.formValue.tahun_periode,
      rekap_harian: this.formValue.rekap_harian,
      tgl_tran: '',
      rekap_bulanan: this.formValue.rekap_bulanan,
      rekap_transaksi: this.formValue.rekap_transaksi,
      kode_cabang: this.formValue.kode_cabang,
      nama_cabang: this.formValue.nama_cabang
    }
    this.formInputCheckChanges()
  }

  onCancel() {
    this.cancInput()
    this.resetForm()
    this.ht == undefined ? null : this.ht.reset()
    this.rt == undefined ? null : this.rt.reset()
  }

  restructureDetailData(data) {
    let endRes = []
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < this.inputJurnalData.length; j++) {
        if (data[i]['kode_jurnal'] === this.inputJurnalData[j]['kode_jurnal']) {
          let x = {
            id: `${MD5(Date().toLocaleString() + Date.now() + randomString({
              length: 8,
              numeric: true,
              letters: false,
              special: false
            }))}`,
            kode_jurnal: data[i]['kode_jurnal'],
            nama_jurnal: this.inputJurnalData[j]['nama_jurnal']
          }
          endRes.push(x)
          break;
        }
      }
    }
    this.filterDataJurnal = endRes
  }

  viewDetailLayout() {
    this.rightLayout = this.formDetail.jenis_jurnal === '2' ? true : false
    if (this.formDetail.jenis_jurnal === '2') {
      if (this.formDetail.tipe_laporan === 'b') {
        this.setDetailLayout('bank-rightSide')
      } else if (this.formDetail.tipe_laporan === 'g') {
        this.setDetailLayout('giro-rightSide')
      } else {
        this.setDetailLayout('others')
      }
    }
    this.getDetail()
  }

  setDetailLayout(type) {
    if (type === 'reset-rightSide') {
      this.rightDetailInputLayout = [
        {
          formWidth: 'col-5',
          label: 'Jenis Transaksi',
          id: 'jenis-transaksi',
          type: 'input',
          valueOf: 'nama_jenis_transaksi',
          required: true,
          readOnly: true,
          disabled: true
        },
        {
          formWidth: 'col-5',
          label: 'Rekening & Bank',
          id: 'rekening',
          type: 'input',
          valueOf: 'rekening_perusahaan',
          required: true,
          readOnly: true,
          disabled: true
        },
        {
          formWidth: 'col-5',
          label: 'Atas Nama',
          id: 'atas-nama',
          type: 'input',
          valueOf: 'atas_nama',
          required: true,
          readOnly: true,
          disabled: true
        },
        {
          formWidth: 'col-5',
          label: 'Lembar Giro',
          id: 'lembar-giro',
          type: 'input',
          valueOf: 'lembar_giro',
          required: true,
          readOnly: true,
          disabled: true
        },
        {
          formWidth: 'col-5',
          label: 'Tipe Transaksi',
          id: 'tipe-transaksi',
          type: 'input',
          valueOf: 'nama_tipe_transaksi',
          required: true,
          readOnly: true,
          disabled: true
        }
      ]
    } else if (type === 'bank-rightSide') {
      this.rightDetailInputLayout.splice(3, 1)
    } else if (type === 'giro-rightSide') {
      this.rightDetailInputLayout.splice(1, 2)
    } else if (type === 'others') {
      this.rightDetailInputLayout.splice(1, 3)
    }
  }

  openDialog(type) {
    this.gbl.topPage()
    this.dialogType = JSON.parse(JSON.stringify(type))
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '55vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '20px' },
      data: {
        type: type,
        tableInterface:
          type === 'kode_cabang' ? this.inputCabangInterface :
            type === 'kode_jurnal' ? this.inputJurnalInterface :
              {},
        displayedColumns:
          type === 'kode_cabang' ? this.inputCabangDisplayColumns :
            type === 'kode_jurnal' ? this.inputJurnalDisplayColumns :
              [],
        tableData:
          type === 'kode_cabang' ? this.inputCabangData :
            type === 'kode_jurnal' ? this.cabang_tmp === '' ? this.inputJurnalData : this.inputJurnalData.filter(x => x.kode_cabang === this.cabang_tmp) :
              [],
        tableRules:
          type === 'kode_cabang' ? this.inputCabangDataRules :
            type === 'kode_jurnal' ? this.inputJurnalDataRules :
              [],
        formValue: this.formValue,
        selectable: type === 'kode_jurnal' ? true : false,
        selected: this.filterDataJurnal,
        selectIndicator: 'kode_jurnal',
        sizeCont: 380,
      },
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === 'kode_cabang') {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
            this.cabang_tmp = this.forminput.getData()['kode_cabang']
            // if (this.forminput.getData()['kode_cabang'] !== this.formValue.kode_cabang) {
            //   this.forminput.getData()['bulan_periode'] = ''
            // }

            this.periode_aktif = this.periodeCabang.filter(x => x.aktif === '1' && x.kode_cabang === this.forminput.getData()['kode_cabang'])[0] || {}
            this.periode_tutup = this.periodeCabangTutup.filter(x => (x.aktif === '1' || x.tutup_sementara === '1') && x.kode_cabang === this.forminput.getData()['kode_cabang'])
            this.gbl.periodeAktif(this.periode_aktif['id_periode'], this.periode_aktif['tahun_periode'], this.periode_aktif['bulan_periode'])
            this.idPeriodeAktif = this.gbl.getIdPeriodeAktif()
            this.tahunPeriodeAktif = this.gbl.getTahunPeriodeAktif()
            this.bulanPeriodeAktif = this.gbl.getBulanPeriodeAktif()
            this.nama_bulan_aktif = this.gbl.getNamaBulan(this.bulanPeriodeAktif)
            this.periode_aktif = this.gbl.getActive()
            this.inputFilter()
            window.parent.postMessage({
              'type': 'CHANGE-PERIODE',
              'value': {
                kode_cabang: this.forminput.getData()['kode_cabang']
              }
            }, "*")
          }
        } else if (type === 'kode_jurnal') {
          let x = result, y = true
          for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < this.filterDataJurnal.length; j++) {
              if (this.filterDataJurnal[j]['kode_jurnal'] === x[i]['kode_jurnal']) {
                x[i] = this.filterDataJurnal[j]
              }
            }
          }
          this.filterDataJurnal.splice(0, this.filterDataJurnal.length)
          for (var i = 0; i < x.length; i++) {
            if (x[i]['id'] === '' || x[i]['id'] == null || x[i]['id'] === undefined) {
              x[i]['id'] = `${MD5(Date().toLocaleString() + Date.now() + randomString({
                length: 8,
                numeric: true,
                letters: false,
                special: false
              }))}`
            }
            this.filterDataJurnal.push(x[i])
            if (Object.keys(this.checkFilterJurnal).length > 0) {
              if (JSON.stringify(this.filterDataJurnal) === JSON.stringify(this.checkFilterJurnal) == false) {
                y = false
              }
            }

            if (y == false) {
              this.browseDataHT = []
              this.result = []
              this.needReqVal = 0
              this.resultTotal = []
              this.partHT = ''
            }
          }
          this.formInputCheckChangesDetail()
        }
        this.dialogRef = undefined
        this.dialogType = null
        this.ref.markForCheck();
      }
    });
  }

  inputDialog() {
    this.gbl.screenPosition(340)
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: this.formDetail.jenis_jurnal === '2' ? '46vh' : '48vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '400px' },
      data: {
        width: '85vw',
        title: this.formDetail.nama_cabang,
        formValue: this.formDetail,
        rightLayout: this.rightLayout,
        rightInputLayout: this.rightDetailInputLayout,
        inputLayout: this.detailInputLayout,
        buttonLayout: [],
        detailJurnal: true,
        detailLoad: false,
        jurnalData: this.detailData,
        noEditJurnal: true,
        noButtonSave: true,
        resetForm: () => null,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.ht == undefined ? null : this.ht.reset()
        this.setDetailLayout('reset-rightSide')
      },
      error => null,
    );
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 10)
  }

  formInputCheckChangesDetail() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 10)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }
}
