import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// Request Data API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// Components
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';

const content = {
  beforeCodeTitle: 'Chart of Account (COA)'
}

@Component({
  selector: 'kt-chart-of-account',
  templateUrl: './chart-of-account.component.html',
  styleUrls: ['./chart-of-account.component.scss', '../master.style.scss']
})
export class ChartOfAccountComponent implements OnInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  //Configuration
  tipe_induk: Object = [
    {
      label: 'Induk',
      value: "0"
    },
    {
      label: 'Perincian',
      value: "1"
    }
  ]
  tipe_akun: Object = [
    {
      label: 'Debit',
      value: 0
    },
    {
      label: 'Kredit',
      value: 1
    }
  ]

  // Variables
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  editable: boolean = false;
  selectedTab: number = 0;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  loadingCOA: boolean = true;
  loadingDataText: string = "Loading Menu.."
  search: string;
  subscription: any;
  kode_perusahaan: string;

  //Confirmation Variable
  c_buttonLayout = [
    {
      btnLabel: 'Hapus Data',
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
      content: 'Yakin akan menghapus data ?',
      style: {
        'color': 'red',
        'font-size': '20px',
        'font-weight': 'bold'
      }
    }
  ]

  // Input Name
  formValue = {
    id_akun: '',
    kode_akun: '',
    nama_akun: '',
    id_kategori_akun: '',
    kode_kategori_akun: '',
    nama_kategori_akun: '',
    tipe_induk: "0",
    id_induk_akun: '',
    kode_induk_akun: '',
    nama_induk_akun: '',
    tipe_akun: 0,
    saldo_awal: 0,
    saldo_saat_ini: 0,
    keterangan: '',
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Akun',
      id: 'kode-akun',
      type: 'input',
      valueOf: 'kode_akun',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Nama Akun',
      id: 'nama-akun',
      type: 'input',
      valueOf: 'nama_akun',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Kategori Akun',
      id: 'kode-kategori-akun',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kategori_akun',
      valueOf: 'kode_kategori_akun',
      required: false,
      readOnly: false,
      inputInfo: {
        id: 'nama-kategori-akun',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_kategori_akun'
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Tipe Induk',
      id: 'tipe-induk',
      type: 'combobox',
      options: this.tipe_induk,
      valueOf: 'tipe_induk',
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Induk Akun',
      id: 'kode-induk-akun',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_akun',
      valueOf: 'kode_induk_akun',
      required: false,
      readOnly: false,
      inputInfo: {
        id: 'nama-induk-akun',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_induk_akun'
      },
      update: {
        disabled: false
      },
      hiddenOn: {
        valueOf: 'tipe_induk',
        matchValue: "0"
      }
    },
    {
      formWidth: 'col-5',
      label: 'Tipe Akun',
      id: 'tipe-akun',
      type: 'combobox',
      options: this.tipe_akun,
      valueOf: 'tipe_akun',
      disabledOn: [
        {
          key: 'id_induk_akun',
          notEmpty: true
        },
        {
          key: 'kode_induk_akun',
          notEmpty: true
        },
        {
          key: 'nama_induk_akun',
          notEmpty: true
        }
      ],
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Saldo Awal',
      id: 'saldo-awal',
      type: 'input',
      valueOf: 'saldo_awal',
      required: false,
      readOnly: false,
      disabled: true,
      currency: true,
      leftAddon: 'Rp.',
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

  //Tree view Variables
  titleComponent = "Daftar Chart of Account (COA)"
  indicator = "kode_induk_akun"
  indicatorValue = ""
  subIndicator = "kode_akun"
  rowOf = 0
  headerView = [
    {
      label: 'Nama Akun',
      value: 'nama_akun'
    },
    {
      label: 'Kode Akun',
      value: 'kode_akun'
    },
    {
      label: 'Kategori akun',
      value: 'nama_kategori_akun'
    },
    {
      label: 'Induk Akun',
      value: 'nama_induk_akun'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Saldo Awal',
      value: 'saldo_awal'
    },
    {
      label: 'Saldo',
      value: 'saldo_saat_ini'
    }
  ]
  sortBy = "kode_akun"

  inputAkunDisplayColumns = [
    {
      label: 'Kode Akun',
      value: 'kode_akun'
    },
    {
      label: 'Nama Akun',
      value: 'nama_akun'
    },
    {
      label: 'Kategori Akun',
      value: 'nama_kategori Akun'
    },
    {
      label: 'Induk Akun',
      value: 'nama_induk Akun'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Saldo Awal',
      value: 'saldo_awal',
      number: true
    },
    {
      label: 'Saldo Saat Ini',
      value: 'saldo_saat_ini',
      number: true
    },
    {
      label: 'Diinput Oleh',
      value: 'nama_input_by'
    },
    {
      label: 'Tgl. Input',
      value: 'input_dt',
      date: true
    },
    {
      label: 'Diupdate Oleh',
      value: 'nama_update_by'
    },
    {
      label: 'Tgl. Update',
      value: 'update_dt',
      date: true
    },
  ]

  inputAkunInterface = {
    kode_kategori_akun: 'string',
    nama_kategori_akun: 'string',
    input_by: 'string',
    nama_input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    nama_update_by: 'string',
    update_dt: 'string'
  }
  inputAkunData = []
  inputAkunDataRules = []
  inputKategoriAkunDisplayColumns = [
    {
      label: 'Kode Kategori Akun',
      value: 'kode_kategori_akun'
    },
    {
      label: 'Nama Kategori Akun',
      value: 'nama_kategori_akun'
    },
    {
      label: 'Diinput Oleh',
      value: 'nama_input_by'
    },
    {
      label: 'Tgl. Input',
      value: 'input_dt',
      date: true
    },
    {
      label: 'Diupdate Oleh',
      value: 'nama_update_by'
    },
    {
      label: 'Tgl. Update',
      value: 'update_dt',
      date: true
    },
  ]

  inputKategoriAkunInterface = {
    kode_kategori_akun: 'string',
    nama_kategori_akun: 'string',
    input_by: 'string',
    nama_input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    nama_update_by: 'string',
    update_dt: 'string'
  }
  inputKategoriAkunData = []
  inputKategoriAkunDataRules = []

  // TAB MENU BROWSE 
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
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        this.resetForm()
        this.madeRequest()
      }
    )
  }

  ngAfterViewInit(): void {
    if (this.kode_perusahaan === undefined) {
      this.kode_perusahaan = this.gbl.getKodePerusahaan()
      if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== '') {
        this.madeRequest()
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
  }

  //Browse binding event
  browseSelectRow(data) {
    console.log(data)
    let x = JSON.parse(JSON.stringify(data))
    this.formValue = {
      id_akun: x['id_akun'],
      kode_akun: x['kode_akun'],
      nama_akun: x['nama_akun'],
      id_kategori_akun: x['id_kategori_akun'],
      tipe_induk: x['tipe_induk'],
      kode_kategori_akun: x['kode_kategori_akun'],
      nama_kategori_akun: x['nama_kategori_akun'],
      id_induk_akun: x['id_induk_akun'],
      kode_induk_akun: x['kode_induk_akun'],
      nama_induk_akun: x['nama_induk_akun'],
      tipe_akun: x['tipe_akun'],
      saldo_awal: parseFloat(x['saldo_awal']),
      saldo_saat_ini: parseFloat(x['saldo_saat_ini']),
      keterangan: x['keterangan'],
    }
    this.enableDelete = x['boleh_hapus'] === 'Y' ? true : false
    this.onUpdate = true;
    window.scrollTo(0, 0)
    this.formInputCheckChanges()
  }

  getBackToInput() {
    this.selectedTab = 0;
    //this.getDetail()
    this.formInputCheckChanges()
  }

  // Dialog
  openDialog(type) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        type: type,
        tableInterface:
          type === "kategori_akun" ? this.inputKategoriAkunInterface :
            type === "kode_akun" ? this.inputAkunInterface :
              {},
        displayedColumns:
          type === "kategori_akun" ? this.inputKategoriAkunDisplayColumns :
            type === "kode_akun" ? this.inputAkunDisplayColumns :
              [],
        tableData:
          type === "kategori_akun" ? this.inputKategoriAkunData :
            type === "kode_akun" ? this.inputAkunData.filter(x => x['id_kategori_akun'] === (this.forminput === undefined ? null : this.forminput.getData()['id_kategori_akun']) && x['id_akun'] !== (this.forminput === undefined ? null : this.forminput.getData()['id_akun'])) :
              [],
        tableRules:
          type === "kategori_akun" ? this.inputKategoriAkunDataRules :
            type === "kode_akun" ? this.inputAkunDataRules :
              [],
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kategori_akun") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('id_kategori_akun', result.id_kategori_akun)
            this.forminput.updateFormValue('kode_kategori_akun', result.kode_kategori_akun)
            this.forminput.updateFormValue('nama_kategori_akun', result.nama_kategori_akun)
          }
        } else if (type === "kode_akun") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('id_induk_akun', result.id_akun)
            this.forminput.updateFormValue('kode_induk_akun', result.kode_akun)
            this.forminput.updateFormValue('nama_induk_akun', result.nama_akun)
            this.forminput.updateFormValue('tipe_akun', result.tipe_akun)
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  openCDialog() { // Confirmation Dialog
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        buttonLayout: this.c_buttonLayout,
        labelLayout: this.c_labelLayout,
        inputLayout: [
          {
            label: 'Kode Akun',
            id: 'kode-akun',
            type: 'input',
            valueOf: this.formValue.kode_akun,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Nama Akun',
            id: 'nama-akun',
            type: 'input',
            valueOf: this.formValue.nama_akun,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Nama Kategori Akun',
            id: 'nama-kategori-akun',
            type: 'input',
            valueOf: this.formValue.nama_kategori_akun,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Induk Akun',
            id: 'induk-akun',
            type: 'input',
            valueOf: this.formValue.kode_induk_akun,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
        ]
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

  refreshBrowse(message) {
    this.onUpdate = false
    this.sendRequestAkunBisaJadiInduk()
    this.sendRequestAkun()
    this.openSnackBar(message, 'success')
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    this.loading = true
    this.ref.markForCheck()
    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        this.formValue.id_akun = this.formValue.id_akun === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
          length: 8,
          numeric: true,
          letters: false,
          special: false
        }))}` : this.formValue.id_akun
        this.formValue['kode_perusahaan'] = this.kode_perusahaan
        if (this.formValue.tipe_induk === "0") {
          this.formValue.id_induk_akun = ""
          this.formValue.kode_induk_akun = ""
          this.formValue.nama_induk_akun = ""
        }
        this.request.apiData('akun', this.onUpdate ? 'u-akun' : 'i-akun', this.formValue).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.loading = false
              this.resetForm()
              this.ref.markForCheck()
              this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
            } else {
              this.loading = false;
              this.ref.markForCheck()
              this.openSnackBar(data['RESULT'])
            }
          },
          error => {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar('GAGAL MELAKUKAN PROSES.', 'fail')
          }
        )
      } else {
        this.openSnackBar('DATA TIDAK LENGKAP.', 'fail')
      }
    }
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      id_kategori_akun: '',
      tipe_induk: this.formValue.tipe_induk,
      kode_kategori_akun: '',
      nama_kategori_akun: '',
      id_induk_akun: '',
      kode_induk_akun: '',
      nama_induk_akun: '',
      tipe_akun: 0,
      saldo_awal: 0,
      saldo_saat_ini: 0,
      keterangan: '',
    }
    //this.detailData = []
    this.formInputCheckChanges()
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
    this.dialog.closeAll()
    if (this.onUpdate) {
      this.loading = true;
      this.ref.markForCheck()
      this.request.apiData('akun', 'd-akun', { kode_perusahaan: this.kode_perusahaan, id_akun: this.formValue.id_akun }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
            this.ref.markForCheck()
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

  madeRequest() {
    this.loading = true
    this.ref.markForCheck()

    this.request.apiData('kategori-akun', 'g-kategori-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputKategoriAkunData = data['RESULT']
        } else {
          this.inputKategoriAkunData = []
          this.openSnackBar('Gagal mendapatkan daftar kategori akun', 'fail')
          this.ref.markForCheck()
        }
      }
    )

    this.sendRequestAkunBisaJadiInduk()
    this.sendRequestAkun()

  }

  sendRequestAkun() {
    this.loadingCOA = true
    this.ref.markForCheck()
    this.request.apiData('akun', 'g-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseData = data['RESULT']
          this.loadingCOA = false
          this.ref.markForCheck()
        } else {
          this.browseData = []
          this.loading = false
          this.loadingCOA = false
          this.ref.markForCheck()
          this.openSnackBar('Gagal mendapatkan daftar akun.', 'fail')
        }
      }
    )
  }

  sendRequestAkunBisaJadiInduk() {
    this.request.apiData('akun', 'g-akun-bisa-jadi-induk', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputAkunData = data['RESULT']
          this.loading = false
          this.ref.markForCheck()
        } else {
          this.inputAkunData = []
          this.loading = false
          this.ref.markForCheck()
          this.openSnackBar('Gagal mendapatkan daftar induk akun.', 'fail')
        }
      }
    )
  }

  openSnackBar(message, type?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
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
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }

}
