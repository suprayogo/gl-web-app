import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';

const content = {
  beforeCodeTitle: 'Monitoring Transaksi Jurnal Otomatis'
}

@Component({
  selector: 'kt-transaksi-jurnal-otomatis',
  templateUrl: './transaksi-jurnal-otomatis.component.html',
  styleUrls: ['./transaksi-jurnal-otomatis.component.scss', '../monitoring.style.scss']
})
export class TransaksiJurnalOtomatisComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // VARIABLES
  content: any;
  noSaveButton: boolean = true; // SET ACTIVE HIDE BUTTON SAVE
  noCancel: boolean = true; // SET ACTIVE HIDE BUTTON CANCEL
  loading: boolean = true;
  loadingDataText: string = 'Loading Data Transaksi Jurnal..'
  tableLoad: boolean = false;
  detailJurnalLoad: boolean = false;
  rightLayout: boolean = false; // SET ACTIVE LAYOUT INPUT RIGHT SIDE
  valueTmp: any; // CHECK STATUS REQUEST
  filterBrowseData = []
  keyReportFormatExcel: any; // <-- KEY RESULT REPORT
  checkKeyReport = {} // <-- CHECK SAME KEY REPORT
  dialogRef: any;
  dialogType: string = null;

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // GLOBAL VARIABLE PERIODE
  subsAP: any;
  access_period: any;
  periode_aktif: any;

  // INFO COMPANY
  info_company = {
    alamat: '',
    kota: '',
    telepon: ''
  }

  // FORMAT CETAK VARIABLE COMBOBOX
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

  // TEMPLATE REPORT VARIABLE
  reportObj = {}

  // VALUE REPORT JURNAL UMUM
  title_umum = [
    'No. Transaksi',
    'Tgl. Transaksi',
    'Keterangan',
    'Nama Cabang',
    'Kode Akun',
    'Nama Akun',
    'Keterangan 1',
    'Keterangan 2',
    'Saldo Debit',
    'Saldo Kredit',
  ]
  name_umum = [
    'noTran',
    'tglTran',
    'keterangan',
    'namaCabang',
    'kodeAkun',
    'namaAkun',
    'keterangan_1',
    'keterangan_2',
    'nilaiDebit',
    'nilaiKredit'
  ]
  type_umum = [
    'string',
    'date',
    'string',
    'string',
    'string',
    'string',
    'string',
    'string',
    'bigdecimal',
    'bigdecimal'
  ]

  // VALUE REPORT JURNAL KASIR
  title_kasir = [
    'No. Transaksi',
    'Tgl. Transaksi',
    'Keterangan',
    'Nama Cabang',
    'Kode Akun',
    'Nama Akun',
    'Keterangan 1',
    'Keterangan 2',
    'Saldo Debit',
    'Saldo Kredit',
    'Keterangan Akun',
    'Saldo Transaksi'
  ]
  name_kasir = [
    'noTran',
    'tglTran',
    'keterangan',
    'namaCabang',
    'kodeAkun',
    'namaAkun',
    'keterangan_1',
    'keterangan_2',
    'nilaiDebit',
    'nilaiKredit',
    'keteranganAkun',
    'saldoTransaksi'
  ]
  type_kasir = [
    'string',
    'date',
    'string',
    'string',
    'string',
    'string',
    'string',
    'string',
    'bigdecimal',
    'bigdecimal',
    'string',
    'bigdecimal'
  ]

  //
  formValue = {
    id_periode: '',
    bulan_periode: '',
    tahun_periode: '',
    kode_cabang: '',
    nama_cabang: ''
  }

  //
  formDetail = {
    // General
    nama_cabang: '',
    jenis_jurnal: '', // Cek Jenis Detail : Jurnal Umum / Kasir ???
    nama_jenis_jurnal: '',
    id_tran: '',
    no_tran: '',
    tgl_tran: '',
    keterangan: '',

    // Kasir
    tipe_laporan: '',
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

  //
  formCetak = {
    format_cetak: 'pdf'
  }

  // BEGIN: L.O.V PERIODE VARIABLE
  inputPeriodeDisplayColumns = [
    {
      label: 'Bulan Periode',
      value: 'bulan_periode'
    },
    {
      label: 'Tahun Periode',
      value: 'tahun_periode'
    }
  ]
  inputPeriodeInterface = {}
  inputPeriodeData = []
  inputPeriodeDataRules = []
  // END: L.O.V PERIODE VARIABLE

  // BEGIN: L.O.V CABANG VARIABLE
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
  // END: L.O.V CABANG VARIABLE

  // BEGIN: LIST JURNAL OTOMATIS VARIABLE
  displayedColumnsTable = [
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    },
    {
      label: 'Jenis Jurnal',
      value: 'jenis_jurnal_sub'
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
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Jenis Transaksi',
      value: 'jenis_transaksi_sub'
    },
    {
      label: 'Tipe Transaksi',
      value: 'tipe_transaksi_sub'
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
  ]
  browseInterface = {}
  browseData = [] // HEADER
  detailData = [] // DETAIL
  browseDataRules = [
    {
      target: 'jurnal_kasir',
      replacement: {
        '0': 'Jurnal Umum',
        '1': 'Jurnal Kasir'
      },
      redefined: 'jenis_jurnal_sub'
    },
    {
      target: 'nama_jenis_transaksi',
      replacement: {
        '': '-'
      },
      redefined: 'jenis_transaksi_sub'
    },
    {
      target: 'tipe_transaksi',
      replacement: {
        '': '-',
        '0': 'Masuk',
        '1': 'Keluar'
      },
      redefined: 'tipe_transaksi_sub'
    }
  ]
  // END: LIST JURNAL OTOMATIS VARIABLE

  // FILTER INPUT
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Periode',
      id: 'periode',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'periode',
      valueOf: 'bulan_periode',
      required: false,
      readOnly: true,
      inputInfo: {
        id: 'tahun-periode',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'tahun_periode'
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'cabang',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'cabang',
      valueOf: 'kode_cabang',
      required: false,
      readOnly: false,
      inputInfo: {
        id: 'nama_cabang',
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
          if (this.forminput.getData()['kode_cabang'] !== '') {
            this.getDataJurnal(this.forminput.getData()['id_periode'], this.forminput.getData()['kode_cabang'])
          }

        }
      },
      update: {
        disabled: false
      }
    },
  ]

  // SPECIFIC INFO
  detailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'Jenis Jurnal',
      id: 'jenis-jurnal',
      type: 'input',
      valueOf: 'nama_jenis_jurnal',
      required: true,
      readOnly: true,
      disabled: true
    },
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
      id: 'tgl-tran',
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

  detailCetakLayout = [
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

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.gbl.need(true, true) // <-- Request Perusahaan dan Periode
    this.madeRequest()
  }

  ngAfterViewInit(): void {
    // PERUSAHAAN AKTIF
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    // PERIODE AKTIF
    this.access_period = this.gbl.getAccessPeriod()

    if (this.kode_perusahaan !== '') {
      this.madeRequest()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
    this.subsAP === undefined ? null : this.subsAP.unsubscribe()
  }

  // Important Data
  madeRequest() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== '') {
      this.request.apiData('lookup', 'g-info-company', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
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
            this.ref.markForCheck()
            this.inputPeriodeData = data['RESULT']
            this.periode_aktif = JSON.parse(JSON.stringify(data['RESULT'])).filter(x => x.aktif === '1')[0] || {}
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan data periode. Mohon coba lagi nanti.', 'fail')
          }
        }
      )

      this.request.apiData('cabang', 'g-cabang', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            this.inputCabangData = data['RESULT']
            this.loading = false
            this.gbl.updateInputdata(data['RESULT'], 'kode_cabang', this.inputLayout)
            if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
              if (this.dialogType === 'kode_cabang') {
                this.dialog.closeAll()
                this.openDialog('kode_cabang')
              }
            }
          } else {
            this.ref.markForCheck()
            this.gbl.openSnackBar('Gagal mendapatkan data cabang. Mohon coba lagi nanti.', 'fail')
            this.loading = false
          }
        }
      )
    }
  }

  // Data Jurnal Otomatis
  getDataJurnal(id_periode, kode_cabang) {
    this.valueTmp === '' ? id_periode : this.valueTmp
    this.tableLoad = true
    if (this.valueTmp !== id_periode) {
      this.request.apiData('jurnal', 'g-hasil-jurnal-oto', { kode_perusahaan: this.kode_perusahaan, id_periode: id_periode }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            this.valueTmp = id_periode
            this.filterBrowseData = JSON.parse(JSON.stringify(data['RESULT']))
            if (kode_cabang === '') {
              this.browseData = data['RESULT']
            } else {
              this.browseData = data['RESULT'].filter(x => x['kode_cabang'] === kode_cabang)
            }
            this.tableLoad = false
          } else {
            this.ref.markForCheck()
            this.gbl.openSnackBar('Gagal mendapatkan data. Mohon coba lagi nanti.', 'fail')
            this.tableLoad = false
          }
        }
      )
    } else {
      this.browseData = this.filterBrowseData.filter(x => x['kode_cabang'] === kode_cabang)
      this.ref.markForCheck()
      setTimeout(() => {
        this.ref.markForCheck()
        this.tableLoad = false
      }, 500);
    }
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formDetail = {
      // General
      nama_cabang: x['nama_cabang'],
      jenis_jurnal: x['jurnal_kasir'] === '1' ? '2' : '0', // 2 : Kasir, 0: Umum
      nama_jenis_jurnal: x['jurnal_kasir'] === '1' ? 'Jurnal Kasir' : 'Jurnal Umum',
      id_tran: x['id_tran'],
      no_tran: x['no_tran'],
      tgl_tran: x['tgl_tran'],
      keterangan: x['keterangan'],

      // Kasir
      tipe_laporan: x['tipe_laporan'],
      nama_jenis_transaksi: x['nama_jenis_transaksi'],
      nama_bank: x['nama_bank'],
      no_rekening: x['no_rekening'],
      atas_nama: x['atas_nama'],
      rekening_perusahaan: '',
      lembar_giro: parseFloat(x['lembar_giro']),
      tipe_transaksi: x['tipe_transaksi'],
      nama_tipe_transaksi: x['tipe_transaksi'] === '0' ? 'Masuk' : x['tipe_transaksi'] === '1' ? 'Keluar' : '',
      saldo_transaksi: parseFloat(x['saldo_transaksi'])
    }
    this.formDetail.rekening_perusahaan = this.formDetail.no_rekening + '(' + this.formDetail.nama_bank + ')'
    this.viewDetailLayout()
  }

  // Detail Data Jurnal Otomatis
  getDetailJurnal() {
    this.request.apiData('jurnal', 'g-jurnal-detail', { kode_perusahaan: this.kode_perusahaan, id_tran: this.formDetail.id_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let result = [], temp = JSON.parse(JSON.stringify(data['RESULT']))

          // Init Result Detail
          result = temp.map(detail => {
            const container = detail
            // Add Important Object
            container['saldo_debit'] = parseFloat(detail.nilai_debit)
            container['saldo_kredit'] = parseFloat(detail.nilai_kredit)
            // Delete Useless Object
            delete container.nilai_debit
            delete container.nilai_kredit
            return container
          })

          // Filter Detail
          if (this.formDetail.jenis_jurnal === '2') {
            if (this.formDetail.tipe_transaksi === '0') {
              this.detailData = result.filter(x => x['saldo_kredit'] != 0)
            } else {
              this.detailData = result.filter(x => x['saldo_debit'] != 0)
            }
          } else {
            this.detailData = result
          }
          this.formInputCheckChangesJurnal()
          this.inputDialog('jurnal')
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan rincian data. Mohon coba lagi nanti.', 'fail')
        }
      }
    )
  }

  openDialog(type) {
    if (type === 'cabang') {
      if (this.forminput.getData()['bulan_periode'] === '') {
        this.gbl.openSnackBar('Pilih Periode Terlebih Dahulu.', 'info', () => {
          setTimeout(() => {
            this.openDialog('periode')
          }, 250)
        })
        return
      }
    }
    this.dialogType = JSON.parse(JSON.stringify(type))
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '50vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      data: {
        type: type,
        tableInterface:
          type === 'periode' ? this.inputPeriodeInterface :
            type === 'cabang' ? this.inputCabangInterface :
              {},
        displayedColumns:
          type === 'periode' ? this.inputPeriodeDisplayColumns :
            type === 'cabang' ? this.inputCabangDisplayColumns :
              [],
        tableData:
          type === 'periode' ? this.inputPeriodeData :
            type === 'cabang' ? this.inputCabangData :
              [],
        tableRules:
          type === 'periode' ? this.inputPeriodeDataRules :
            type === 'cabang' ? this.inputCabangDataRules :
              [],
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === 'periode') {
          if (this.forminput !== undefined) {
            var nama_bulan = result.bulan_periode.toString()
            nama_bulan = this.gbl.getNamaBulan(nama_bulan)
            if (this.forminput.getData().bulan_periode !== nama_bulan) {
              // PERIODE
              this.forminput.updateFormValue('id_periode', result.id_periode)
              this.forminput.updateFormValue('bulan_periode', nama_bulan)
              this.forminput.updateFormValue('tahun_periode', result.tahun_periode)
              this.formValue.id_periode = result.id_periode
              this.formValue.bulan_periode = nama_bulan
              this.formValue.tahun_periode = result.tahun_periode
              // CABANG
              this.forminput.updateFormValue('kode_cabang', this.forminput.getData().kode_cabang === undefined ? '' : this.forminput.getData().kode_cabang)
              this.forminput.updateFormValue('nama_cabang', this.forminput.getData().nama_cabang === undefined ? '' : this.forminput.getData().nama_cabang)
              this.formValue.kode_cabang = this.forminput.getData().kode_cabang
              this.formValue.nama_cabang = this.forminput.getData().nama_cabang
              this.getDataJurnal(result.id_periode, this.forminput.getData().kode_cabang === undefined ? '' : this.forminput.getData().kode_cabang)
            }
          }
        } else if (type === 'cabang') {
          if (this.forminput !== undefined) {
            if (this.forminput.getData()['kode_cabang'] !== result.kode_cabang) {
              this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
              this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
              this.formValue.kode_cabang = result.kode_cabang
              this.formValue.nama_cabang = result.nama_cabang
              this.getDataJurnal(this.forminput.getData()['id_periode'], result.kode_cabang)
            }
          }
        }
      }
      this.ref.markForCheck()
      this.dialogRef = undefined
      this.dialogType = null
    }
    )
  }

  inputDialog(type) {
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height:
        type === 'jurnal' ? this.formDetail.jenis_jurnal === '2' ? '85vh' : '82vh' :
          type === 'cetak' ? 'auto' :
            undefined,
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position:
        type === 'jurnal' ? { top: '30px' } :
          type === 'cetak' ? { top: '100px' } :
            {},
      data: {
        width:
          type === 'jurnal' ? '85vw' :
            type === 'cetak' ? undefined :
              undefined, // Content Width
        title:
          type === 'jurnal' ? this.formDetail.nama_cabang :
            type === 'cetak' ? 'Cetak Transaksi' :
              undefined, // Title Name
        formValue:
          type === 'jurnal' ? this.formDetail :
            type === 'cetak' ? this.formCetak :
              {}, // Variable Input
        rightLayout:
          type === 'jurnal' ? this.rightLayout :
            type === 'cetak' ? false :
              undefined, // Show Right Layout Side ???
        rightInputLayout: this.rightDetailInputLayout, // Input Box Right Layout Side
        inputLayout:
          type === 'jurnal' ? this.detailInputLayout :
            type === 'cetak' ? this.detailCetakLayout :
              [], // Input Box Left Layout Side (Default Side)
        buttonLayout:
          type === 'jurnal' ?
            [
              {
                btnLabel: 'Cetak Transaksi',
                btnClick: () => {
                  this.inputDialog('cetak')
                },
                btnClass: 'btn btn-primary'
              }
            ] :
            type === 'cetak' ?
              [
                {
                  btnLabel: 'Cetak',
                  btnClick: () => {
                    this.printDoc(this.formCetak)
                  },
                  btnClass: 'btn btn-primary margin-left-5'
                }
              ] :
              [],
        detailJurnal:
          type === 'jurnal' ? true :
            type === 'cetak' ? false :
              undefined, // Show Detail Data Jurnal ???
        detailLoad: this.detailJurnalLoad, // Loading Dialog
        jurnalData: this.detailData, // Detail Data Jurnal
        noEditJurnal: true, // Disable Input Box
        noButtonSave: true, // Hide Button Save
        resetForm: () => null
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.datatable == undefined ? null : this.datatable.reset()
        this.setDetailLayout('reset-rightSide')
      },
      error => null,
    );
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
    this.getDetailJurnal()
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

  printDoc(value) {
    this.dialog.closeAll()
    let keyPrint = this.formDetail.jenis_jurnal + this.formDetail.no_tran + this.formCetak.format_cetak
    this.loading = true
    if (this.checkKeyReport[keyPrint] !== undefined) {
      if (this.formCetak.format_cetak === 'pdf') {
        window.open('http://deva.darkotech.id:8704/report/viewer.html?repId=' + this.checkKeyReport[keyPrint], '_blank')
      } else {
        if (this.formCetak.format_cetak === 'xlsx') {
          this.keyReportFormatExcel = this.checkKeyReport[keyPrint] + '.xlsx'
        } else {
          this.keyReportFormatExcel = this.checkKeyReport[keyPrint] + '.xls'
        }
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      }
      this.loading = false
      this.viewDetailLayout()
    } else {
      let detail = JSON.parse(JSON.stringify(this.detailData)),
        result = detail.map(detail => {
          let data = []
          data[0] = this.formDetail.no_tran
          data[1] = new Date(this.formDetail.tgl_tran).getTime()
          data[2] = this.formDetail.keterangan
          data[3] = this.formDetail.nama_cabang
          data[4] = detail.kode_akun
          data[5] = detail.nama_akun
          data[6] = detail.keterangan_1
          data[7] = detail.keterangan_2
          data[8] = parseFloat(detail.saldo_debit)
          data[9] = parseFloat(detail.saldo_kredit)
          if (this.formDetail.jenis_jurnal === '2') {
            data[10] = parseFloat(detail.keterangan_akun)
            data[11] = this.formDetail.saldo_transaksi
          }
          return data
        })

      let name_kasir = (this.formDetail.tipe_transaksi === '0' ? 'PEMASUKKAN' : 'PENGELUARAN') + ' ' + (this.formDetail.tipe_laporan === 'k' ? 'KAS' : this.formDetail.tipe_laporan === 'b' ? 'BANK' : this.formDetail.tipe_laporan === 'g' ? 'GIRO' : 'KAS KECIL')
      this.reportObj = {
        REPORT_COMPANY: this.gbl.getNamaPerusahaan(),
        REPORT_CODE: this.formDetail.jenis_jurnal === '2' ? 'DOK-JURNAL-TRANSAKSI' : 'DOK-TRAN-JURNAL',
        REPORT_NAME: this.formDetail.jenis_jurnal === '2' ? name_kasir : 'Dokumen Transaksi Jurnal Otomatis',
        REPORT_FORMAT_CODE: value['format_cetak'],
        JASPER_FILE: this.formDetail.jenis_jurnal === '2' ? 'dokTransaksiJurnalTransaksi.jasper' : 'dokTransaksiJurnal.jasper',
        REPORT_PARAMETERS: {
          USER_NAME: localStorage.getItem('user_name') === undefined ? '' : localStorage.getItem('user_name'),
          REPORT_COMPANY_ADDRESS: this.info_company.alamat,
          REPORT_COMPANY_CITY: this.info_company.kota,
          REPORT_COMPANY_TLPN: this.info_company.telepon,
          REPORT_PERIODE: 'Periode: ' + this.gbl.getNamaBulan(this.periode_aktif['bulan_periode']) + ' ' + this.periode_aktif['tahun_periode']
        },
        FIELD_TITLE: this.formDetail.jenis_jurnal === '2' ? this.title_kasir : this.title_umum,
        FIELD_NAME: this.formDetail.jenis_jurnal === '2' ? this.name_kasir : this.name_umum,
        FIELD_TYPE: this.formDetail.jenis_jurnal === '2' ? this.type_kasir : this.type_umum,
        FIELD_DATA: result
      }
      this.sendGetPrintDoc(this.reportObj, value['format_cetak'])
    }
  }

  sendGetPrintDoc(p, type) {
    this.request.apiData('report', 'g-report', p).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (type === 'pdf') {
            window.open('http://deva.darkotech.id:8704/report/viewer.html?repId=' + data['RESULT'], '_blank');
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
          this.ref.markForCheck()
          let keyPrint = this.formDetail.jenis_jurnal + this.formDetail.no_tran + this.formCetak.format_cetak
          this.checkKeyReport[keyPrint] = data['RESULT']
          this.loading = false
          this.viewDetailLayout()
        } else {
          this.ref.markForCheck()
          this.loading = false
          this.gbl.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail')
        }
      }
    )
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
    }, 1)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

}

