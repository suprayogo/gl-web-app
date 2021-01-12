import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
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
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';

const content = {
  beforeCodeTitle: 'Transaksi Kasir'
}

@Component({
  selector: 'kt-transaksi-kasir',
  templateUrl: './transaksi-kasir.component.html',
  styleUrls: ['./transaksi-kasir.component.scss', '../monitoring.style.scss']
})
export class TransaksiKasirComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // VARIABLES
  noSaveButton: boolean = true;
  noCancel: boolean = true;
  loading: boolean = true;
  tableLoad: boolean = true;
  content: any;
  dataJurnal: any;
  detailLoad: boolean = false;
  detailJurnalLoad: boolean = false;
  enableDetail: boolean = false;
  editable: boolean = false;
  selectedTab: number = 0;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  loadingDataText: string = "Loading Data Transaksi Kasir.."
  search: string;
  browseNeedUpdate: boolean = true;
  dialogRef: any;
  dialogType: string = null;

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // GLOBAL VARIABLE PERIODE AKTIF
  subsAP: any;
  access_period: any;

  formValue = {
    id_periode: '',
    bulan_periode: '',
    tahun_periode: ''
  }

  // Input Name
  formDetail = {
    nama_cabang: '',
    nama_kasir: '',
    no_jurnal: '',
    id_tran: '',
    no_tran: '',
    tgl_tran: '',
    nama_jenis_transaksi: '',
    nama_bank: '',
    no_rekening: '',
    atas_nama: '',
    saldo_masuk: 0,
    saldo_keluar: 0,
    nilai_saldo: 'Rp.' + 0,
    keterangan: '',
    tipe_laporan: '',
    lembar_giro: '',
    kode_template: '',
    jenis_jurnal: '2',
    tipe_transaksi: '0',
  }

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
  inputPeriodeInterface = {
    id_periode: 'string',
    bulan_periode: 'string',
    tahun_periode: 'string'
  }
  inputPeriodeData = []
  inputPeriodeDataRules = []

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

  detailData = []

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
          this.sendReqPeriodeJurnal(this.forminput.getData()['id_periode'], this.forminput.getData()['kode_cabang'])
        }
      },
      update: {
        disabled: false
      }
    },
  ]

  detailInputLayout = [
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
      label: 'No. Jurnal',
      id: 'no-jurnal',
      type: 'input',
      valueOf: 'no_jurnal',
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
      label: 'Jenis Transaksi',
      id: 'nama-jenis-transaksi',
      type: 'input',
      valueOf: 'nama_jenis_transaksi',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Saldo Transaksi',
      id: 'nilai-saldo',
      type: 'input',
      valueOf: 'nilai_saldo',
      required: false,
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

  // TAB MENU BROWSE 
  displayedColumnsTable = [
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
      label: 'Kode Perusahaan',
      value: 'kode_perusahaan'
    },
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Nama Jenis Transaksi',
      value: 'jenis_transaksi_sub'
    },
    {
      label: 'Nilai Jenis Transaksi',
      value: 'nilai_jenis_transaksi'
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
    no_tran: 'string',
    tgl_tran: 'string',
    nama_cabang: 'string',
    nama_divisi: 'string',
    nama_departemen: 'string',
    keterangan: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.gbl.need(true, true)
    this.reqKodePerusahaan()
    this.reqAccessPeriod()
    this.madeRequest()

  }

  ngAfterViewInit(): void {
    // PERUSAHAAN AKTIF
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    // PERIODE AKTIF
    this.access_period = this.gbl.getAccessPeriod()

    // AKSES PERIODE
    // this.akses_periode

    if (this.kode_perusahaan !== "") {
      this.madeRequest()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
    this.subsAP === undefined ? null : this.subsAP.unsubscribe()
  }

  reqKodePerusahaan() {
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        // this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.kode_perusahaan !== "") {
          this.madeRequest()
        }

        /* if (this.selectedTab == 1 && this.browseNeedUpdate && this.kode_perusahaan !== "") {
          this.tabTP()
        } */
      }
    )
  }

  reqAccessPeriod() {
    this.subsAP = this.gbl.change_periode.subscribe(
      value => {
        this.access_period = value
        // this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.access_period.id_periode !== "") {
          this.madeRequest()
        }

        /* if (this.selectedTab == 1 && this.browseNeedUpdate && this.access_period.id_periode !== "") {
          this.tabTP()
        } */
      }
    )
  }

  madeRequest() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputPeriodeData = data['RESULT']
            this.ref.markForCheck()
          } else {
            this.openSnackBar('Gagal mendapatkan data periode. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )

      this.request.apiData('cabang', 'g-cabang', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.gbl.updateInputdata(data['RESULT'], 'kode_cabang', this.inputLayout)
            if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
              if (this.dialogType === "kode_cabang") {
                this.dialog.closeAll()
                this.openDialog('kode_cabang')
              }
            }
            this.loading = false
            this.tableLoad = false
            this.ref.markForCheck()
          } else {
            this.openSnackBar('Gagal mendapatkan data periode. Mohon coba lagi nanti.', 'fail')
            this.loading = false
            this.tableLoad = false
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
  sendReqPeriodeJurnal(id_periode, kode_cabang) {
    this.tableLoad = true
    this.request.apiData('jurnal', 'g-jurnal', { kode_perusahaan: this.kode_perusahaan, id_periode: id_periode }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.dataJurnal = data['RESULT']
          this.ref.markForCheck()
        } else {
          this.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
          this.ref.markForCheck()
        }
      }
    )

    this.request.apiData('kasir', 'g-transaksi-kasir', { kode_perusahaan: this.kode_perusahaan, id_periode: id_periode }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (kode_cabang === "") {
            this.browseData = data['RESULT']
          } else {
            this.browseData = data['RESULT'].filter(x => x['kode_cabang'] === kode_cabang)
          }

          this.tableLoad = false
          this.ref.markForCheck()
        } else {
          this.openSnackBar('Gagal mendapatkan data. Mohon coba lagi nanti.', 'fail')
          this.tableLoad = false
          this.ref.markForCheck()
        }
      }
    )
  }

  getDetail() {
    let specData = this.dataJurnal.filter(x => x['no_tran'] === this.formDetail.no_jurnal)[0] || {}

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
              keterangan_1: resp[i]['keterangan_1'],
              keterangan_2: resp[i]['keterangan_2'],
              saldo_debit: parseFloat(resp[i]['nilai_debit']),
              saldo_kredit: parseFloat(resp[i]['nilai_kredit'])
            }
            res.push(t)
          }
          if (this.formDetail.tipe_transaksi === "0") {
            this.detailData = res.filter(x => x['saldo_kredit'] != 0)
          } else {
            this.detailData = res.filter(x => x['saldo_debit'] != 0)
          }
          // this.detailData = res
          this.formInputCheckChangesJurnal()
          if (this.formDetail.tipe_laporan === 'b') {
            this.detailInputLayout.splice(5, 0,
              {
                formWidth: 'col-5',
                label: 'Bank',
                id: 'nama-bank',
                type: 'input',
                valueOf: 'nama_bank',
                required: false,
                readOnly: true,
                disabled: true
              },
              {
                formWidth: 'col-5',
                label: 'No. Rekening',
                id: 'no-rekening',
                type: 'input',
                valueOf: 'no_rekening',
                required: false,
                readOnly: true,
                disabled: true
              },
              {
                formWidth: 'col-5',
                label: 'Atas Nama',
                id: 'atas-nama',
                type: 'input',
                valueOf: 'atas_nama',
                required: false,
                readOnly: true,
                disabled: true
              }
            )
          } else if (this.formDetail.tipe_laporan === 'g') {
            this.detailInputLayout.splice(5, 0,
              {
                formWidth: 'col-5',
                label: 'Bank',
                id: 'nama-bank',
                type: 'input',
                valueOf: 'nama_bank',
                required: false,
                readOnly: true,
                disabled: true
              },
              {
                formWidth: 'col-5',
                label: 'No. Rekening',
                id: 'no-rekening',
                type: 'input',
                valueOf: 'no_rekening',
                required: false,
                readOnly: true,
                disabled: true
              },
              {
                formWidth: 'col-5',
                label: 'Atas Nama',
                id: 'atas-nama',
                type: 'input',
                valueOf: 'atas_nama',
                required: false,
                readOnly: true,
                disabled: true
              },
              {
                formWidth: 'col-5',
                label: 'Lembar Giro',
                id: 'lembar-giro',
                type: 'input',
                valueOf: 'lembar_giro',
                required: false,
                readOnly: true,
                disabled: true
              },
            )
          }
          if (this.formDetail.kode_template !== undefined && this.formDetail.kode_template !== null && this.formDetail.kode_template !== '') {
            if (this.formDetail.tipe_laporan === 'b') {
              this.detailInputLayout.splice(10, 0,
                {
                  formWidth: 'col-5',
                  label: 'Kode Template',
                  id: 'kode-template',
                  type: 'input',
                  valueOf: 'kode_template',
                  required: false,
                  readOnly: true,
                  disabled: true
                }
              )
            } else if (this.formDetail.tipe_laporan === 'g') {
              this.detailInputLayout.splice(11, 0,
                {
                  formWidth: 'col-5',
                  label: 'Kode Template',
                  id: 'kode-template',
                  type: 'input',
                  valueOf: 'kode_template',
                  required: false,
                  readOnly: true,
                  disabled: true
                }
              )
            }else{
              this.detailInputLayout.splice(7, 0,
                {
                  formWidth: 'col-5',
                  label: 'Kode Template',
                  id: 'kode-template',
                  type: 'input',
                  valueOf: 'kode_template',
                  required: false,
                  readOnly: true,
                  disabled: true
                }
              )
            }
          }else{

          }
          this.ref.markForCheck()
          this.inputDialog()
        } else {
          this.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
          this.ref.markForCheck()
        }
      }
    )
  }

  openDialog(type) {
    if (type === 'cabang') {
      if (this.forminput.getData()['bulan_periode'] === "") {
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
          type === "periode" ? this.inputPeriodeInterface :
            type === "cabang" ? this.inputCabangInterface :
              {},
        displayedColumns:
          type === "periode" ? this.inputPeriodeDisplayColumns :
            type === "cabang" ? this.inputCabangDisplayColumns :
              [],
        tableData:
          type === "periode" ? this.inputPeriodeData :
            type === "cabang" ? this.inputCabangData :
              [],
        tableRules:
          type === "periode" ? this.inputPeriodeDataRules :
            type === "cabang" ? this.inputCabangDataRules :
              [],
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "periode") {
          if (this.forminput !== undefined) {
            var nama_bulan = result.bulan_periode.toString()
            nama_bulan = this.gbl.getNamaBulan(nama_bulan)
            if (this.forminput.getData()['bulan_periode'] !== nama_bulan) {
              this.forminput.updateFormValue('id_periode', result.id_periode)
              this.forminput.updateFormValue('bulan_periode', nama_bulan)
              this.forminput.updateFormValue('tahun_periode', result.tahun_periode)
              this.forminput.updateFormValue('kode_cabang', this.forminput.getData()['kode_cabang'] === undefined ? "" : this.forminput.getData()['kode_cabang'])
              this.forminput.updateFormValue('nama_cabang', this.forminput.getData().nama_cabang === undefined ? "" : this.forminput.getData()['nama_cabang'])
              this.sendReqPeriodeJurnal(result.id_periode, this.forminput.getData()['kode_cabang'] === undefined ? "" : this.forminput.getData()['kode_cabang'])
            }
          }
        } else if (type === "cabang") {
          if (this.forminput !== undefined) {
            if (this.forminput.getData()['kode_cabang'] !== result.kode_cabang) {
              this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
              this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
              this.sendReqPeriodeJurnal(this.forminput.getData()['id_periode'], result.kode_cabang)
            }
          }
        }
      }
      this.dialogRef = undefined
      this.dialogType = null
      this.ref.markForCheck()
    }
    );
  }

  inputDialog() {
    this.gbl.topPage()
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: 'auto',
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
        detailLoad: this.detailJurnalLoad,
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
        this.detailInputLayout = [
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
            label: 'No. Jurnal',
            id: 'no-jurnal',
            type: 'input',
            valueOf: 'no_jurnal',
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
            label: 'Jenis Transaksi',
            id: 'nama-jenis-transaksi',
            type: 'input',
            valueOf: 'nama_jenis_transaksi',
            required: true,
            readOnly: true,
            disabled: true
          },
          {
            formWidth: 'col-5',
            label: 'Saldo Transaksi',
            id: 'nilai-saldo',
            type: 'input',
            valueOf: 'nilai_saldo',
            required: false,
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

      },
      error => null,
    );
  }

  refreshBrowse(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.openSnackBar(message, 'success')
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formDetail = {
      nama_cabang: x['nama_cabang'],
      nama_kasir: x['nama_kasir'],
      no_jurnal: x['no_jurnal'],
      id_tran: x['id_tran_jurnal'],
      no_tran: x['no_tran'],
      tgl_tran: x['tgl_tran'],
      nama_jenis_transaksi: x['nama_jenis_transaksi'],
      nama_bank: x['nama_bank'],
      no_rekening: x['no_rekening'],
      atas_nama: x['atas_nama'],
      saldo_masuk: x['saldo_masuk'],
      saldo_keluar: x['saldo_keluar'],
      nilai_saldo: 'Rp. ' + parseFloat(x['saldo_transaksi']),
      keterangan: x['keterangan'],
      tipe_laporan: x['tipe_laporan'],
      lembar_giro: x['lembar_giro'],
      kode_template: x['kode_template'],
      jenis_jurnal: '2',
      tipe_transaksi: x['tipe_transaksi']
    }
    this.getDetail()
  }

  openSnackBar(message, type?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
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
    }, 1)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

}
