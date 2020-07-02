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

const content = {
  beforeCodeTitle: 'Pengaturan Jurnal Otomatis'
}

@Component({
  selector: 'kt-pengaturan-jurnal-otomatis',
  templateUrl: './pengaturan-jurnal-otomatis.component.html',
  styleUrls: ['./pengaturan-jurnal-otomatis.component.scss', '../master.style.scss']
})
export class PengaturanJurnalOtomatisComponent implements OnInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // VARIABLES
  loading: boolean = true;
  loadingDepartemen: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = true;
  selectedTab: number = 0;
  tableLoad: boolean = false;
  onUpdate: boolean = false;
  enableCancel: boolean = true;
  enableDelete: boolean = false;
  disableSubmit: boolean = false;
  browseNeedUpdate: boolean = true;
  subscription: any;
  subPeriode: any;
  subPeriodeAktif: any;
  kode_perusahaan: any;
  requestMade: boolean = false;
  batal_alasan: any = "";
  dialogRef: any;
  dialogType: any;

  // Input Name
  formValue = {
    kode_jurnal: '',
    nama_jurnal: '',
    kode_cabang: '',
    nama_cabang: '',
    keterangan: ''
  }
  detailData = [
    {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      keterangan_akun: '',
      keterangan_1: '',
      keterangan_2: '',
      saldo_debit: 0,
      saldo_kredit: 0
    },
    {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      keterangan_akun: '',
      keterangan_1: '',
      keterangan_2: '',
      saldo_debit: 0,
      saldo_kredit: 0
    }
  ]

  //Confirmation Variable
  c_buttonLayout = [
    {
      btnLabel: 'Hapus Pengaturan',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.deleteData()
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
      content: 'Yakin akan menghapus pengaturan?',
      style: {
        'color': 'red',
        'font-size': '18px',
        'font-weight': 'bold'
      }
    }
  ]

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'Kode Jurnal',
      value: 'kode_jurnal'
    },
    {
      label: 'Nama Jurnal',
      value: 'nama_jurnal'
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
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    }
  ]
  inputCabangInterface = {
    kode_cabang: 'string',
    nama_cabang: 'string',
    keterangan: 'string'
  }
  inputCabangData = []
  inputCabangDataRules = []
  inputAkunData = []
  inputSettingData = []

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Jurnal',
      id: 'kode-jurnal',
      type: 'input',
      valueOf: 'kode_jurnal',
      required: true,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Nama Jurnal',
      id: 'nama-jurnal',
      type: 'input',
      valueOf: 'nama_jurnal',
      required: true,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
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
        onFound: null
      },
      update: {
        disabled: false
      }
    },
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
    this.subPeriode === undefined ? null : this.subPeriode.unsubscribe()
    this.subPeriodeAktif === undefined ? null : this.subPeriodeAktif.unsubscribe()
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
    this.formValue = {
      kode_jurnal: x['kode_jurnal'],
      nama_jurnal: x['nama_jurnal'],
      kode_cabang: x['kode_cabang'],
      nama_cabang: x['nama_cabang'],
      keterangan: x['keterangan']
    }
    this.onUpdate = true;
    this.enableDelete = true
    this.enableCancel = false
    this.getBackToInput();
  }

  getBackToInput() {
    this.selectedTab = 0;
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
        this.detailData = this.formValue['detail']['data']
        this.formValue['detail'] = this.detailData
        let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan }, this.formValue)
        this.request.apiData('jurnal-otomatis', this.onUpdate ? 'u-setting-jurnal-otomatis' : 'i-setting-jurnal-otomatis', endRes).subscribe(
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
        if (this.forminput.getData().nama_divisi === '') {
          this.openSnackBar('Divisi tidak valid.', 'info')
        } else if (this.forminput.getData().nama_departemen === '') {
          this.openSnackBar('Departemen tidak valid.', 'info')
        } else {
          this.openSnackBar('Ada akun yang tidak memiliki sumber data atau sumber data tidak seimbang.', 'info')
        }
        this.gbl.topPage()
      }
    }
  }

  validateSubmit() {
    let valid = true, hasDebit = false, hasKredit = false

    let data = this.forminput === undefined ? null : this.forminput.getData()

    if (data != null) {

      for (var i = 0; i < data['detail']['data'].length; i++) {
        if (data['detail']['data'][i]['id_akun'] === '') {
          valid = false
          break;
        }
      }

      for (var i = 0; i < data['detail']['data'].length; i++) {
        if (data['detail']['data'][i]['setting_debit'] === '' && data['detail']['data'][i]['setting_kredit'] === '') {
          valid = false
          break;
        }
      }

      for (var i = 0; i < data['detail']['data'].length; i++) {
        if (data['detail']['data'][i]['setting_debit'] !== '') {
          hasDebit = true
        }
        if (data['detail']['data'][i]['setting_kredit'] !== '') {
          hasKredit = true
        }
      }

      if (data['nama_departemen'] === '') valid = false
      if (data['nama_divisi'] === '') valid = false
    }

    if (!hasKredit || !hasDebit) {
      valid = false
    }

    return valid
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      kode_jurnal: '',
      nama_jurnal: '',
      kode_cabang: '',
      nama_cabang: '',
      keterangan: ''
    }
    this.detailData = [
      {
        id_akun: '',
        kode_akun: '',
        nama_akun: '',
        keterangan_akun: '',
        keterangan_1: '',
        keterangan_2: '',
        saldo_debit: 0,
        saldo_kredit: 0
      },
      {
        id_akun: '',
        kode_akun: '',
        nama_akun: '',
        keterangan_akun: '',
        keterangan_1: '',
        keterangan_2: '',
        saldo_debit: 0,
        saldo_kredit: 0
      }
    ]
    this.formInputCheckChanges()
    this.formInputCheckChangesJurnal()
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

  deleteData() {
    this.gbl.topPage()
    this.dialog.closeAll()
    if (this.onUpdate) {
      this.gbl.topPage()
      this.loading = true;
      this.ref.markForCheck()
      let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan }, this.formValue)
      this.request.apiData('jurnal-otomatis', 'd-setting-jurnal-otomatis', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
            this.ref.markForCheck()
            this.browseNeedUpdate = true
            this.refreshBrowse('BERHASIL DIHAPUS')
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
    if (type === 'kode_departemen') {
      let fc = this.forminput.getData()
      if (fc['kode_divisi'] === '' || fc['nama_divisi'] === '') {
        this.openSnackBar('Pilih divisi terlebih dahulu.', 'info', () => {
          setTimeout(() => {
            this.openDialog('kode_divisi')
          }, 500)
        })
        return
      }
    }
    this.dialogType = JSON.parse(JSON.stringify(type))
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      data: {
        type: type,
        tableInterface:
          type === "kode_divisi" ? this.inputDivisiInterface :
            type === "kode_departemen" ? this.inputDepartemenInterface :
              type === "kode_cabang" ? this.inputCabangInterface :
                {},
        displayedColumns:
          type === "kode_divisi" ? this.inputDivisiDisplayColumns :
            type === "kode_departemen" ? this.inputDepartemenDisplayColumns :
              type === "kode_cabang" ? this.inputCabangDisplayColumns :
                [],
        tableData:
          type === "kode_divisi" ? this.inputDivisiData :
            type === "kode_departemen" ? this.inputDepartemenData.filter(x => x['kode_divisi'] === (this.forminput === undefined ? null : this.forminput.getData()['kode_divisi'])) :
              type === "kode_cabang" ? this.inputCabangData :
                [],
        tableRules:
          type === "kode_divisi" ? this.inputDivisiDataRules :
            type === "kode_departemen" ? this.inputDepartemenDataRules :
              type === "kode_cabang" ? this.inputCabangDataRules :
                [],
        formValue: this.formValue,
        loadingData: type === "kode_departemen" ? this.loadingDepartemen : null
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_departemen") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_departemen', result.kode_departemen)
            this.forminput.updateFormValue('nama_departemen', result.nama_departemen)
            this.forminput.updateFormValue('kode_divisi', result.kode_divisi)
            this.forminput.updateFormValue('nama_divisi', result.nama_divisi)
          }
        } else if (type === "kode_divisi") {
          if (this.forminput !== undefined) {
            let kd = this.forminput.getData()['kode_divisi']
            this.forminput.updateFormValue('kode_divisi', result.kode_divisi)
            this.forminput.updateFormValue('nama_divisi', result.nama_divisi)
            if (kd !== result.kode_divisi) this.sendRequestDepartemen(result.kode_divisi)
          }
        } else if (type === "kode_cabang") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
          }
        }
        this.ref.markForCheck();
      }
      this.dialogRef = undefined;
      this.dialogType = undefined;
    });
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
            label: 'Kode Jurnal',
            id: 'kode-jurnal',
            type: 'input',
            valueOf: this.formValue.kode_jurnal,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Nama Jurnal',
            id: 'nama-jurnal',
            type: 'input',
            valueOf: this.formValue.nama_jurnal,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
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
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && !this.requestMade) {
      this.requestMade = true
      this.request.apiData('divisi', 'g-divisi', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputDivisiData = data['RESULT']
            this.updateInputdata(data['RESULT'], 'kode_divisi')
            this.sendRequestCabang()
          } else {
            this.openSnackBar('Gagal mendapatkan daftar divisi. Mohon coba lagi nanti.', 'fail')
            this.loading = false
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  sendRequestDepartemen(kode_divisi) {
    this.loadingDepartemen = true
    this.request.apiData('departemen', 'g-departemen-divisi', { kode_perusahaan: this.kode_perusahaan, kode_divisi: kode_divisi }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputDepartemenData = data['RESULT']
          this.updateInputdata(data['RESULT'], 'kode_departemen')
          this.loadingDepartemen = false
          this.ref.markForCheck()
          if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
            if (this.dialogType === "kode_departemen") {
              this.dialog.closeAll()
              this.openDialog('kode_departemen')
            }
          }
        } else {
          this.loadingDepartemen = false
          this.dialog.closeAll()
          this.openSnackBar('Gagal mendapatkan daftar departemen. Mohon coba lagi nanti.', 'fail')
        }
      }
    )
  }

  sendRequestCabang() {
    this.request.apiData('cabang', 'g-cabang', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputCabangData = data['RESULT']
          this.updateInputdata(data['RESULT'], 'kode_cabang')
          this.sendRequestAkun()
        } else {
          this.openSnackBar('Gagal mendapatkan daftar cabang.', 'fail')
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  sendRequestAkun() {
    this.request.apiData('akun', 'g-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputAkunData = data['RESULT']
          this.sendRequestSetting()
        } else {
          this.openSnackBar('Gagal mendapatkan daftar departemen. Mohon coba lagi nanti.', 'fail')
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  sendRequestSetting() {
    this.request.apiData('setting-link', 'g-setting-link-tarik-data', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputSettingData = data['RESULT']
          this.loading = false
          this.ref.markForCheck()
        } else {
          this.openSnackBar('Gagal mendapatkan daftar setting tarik data', 'fail')
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  getDetail() {
    this.detailLoad = true
    this.ref.markForCheck()
    this.request.apiData('jurnal-otomatis', 'g-setting-jurnal-otomatis-detail', { kode_perusahaan: this.kode_perusahaan, kode_jurnal: this.formValue.kode_jurnal }).subscribe(
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
              setting_debit: resp[i]['kode_debit'],
              setting_kredit: resp[i]['kode_kredit']
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
    this.request.apiData('jurnal-otomatis', 'g-setting-jurnal-otomatis', { kode_perusahaan: this.kode_perusahaan }).subscribe(
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
