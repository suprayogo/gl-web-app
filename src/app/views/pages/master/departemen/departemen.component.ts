import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

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
  beforeCodeTitle: 'Daftar Departemen'
}

@Component({
  selector: 'kt-departemen',
  templateUrl: './departemen.component.html',
  styleUrls: ['./departemen.component.scss', '../master.style.scss']
})
export class DepartemenComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  editable: boolean = false;
  selectedTab: number = 0;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  loadingDepartemen: boolean = false;
  loadingDataText: string = "Loading Departemen.."
  search: string;
  subscription: any;
  kode_perusahaan: any;

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
    kode_departemen: '',
    nama_departemen: '',
    induk_departemen: '',
    nama_induk_departemen: '',
    kode_divisi: '',
    nama_divisi: '',
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Departemen',
      id: 'kode-departemen',
      type: 'input',
      valueOf: 'kode_departemen',
      required: true,
      readOnly: false,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Nama Departemen',
      id: 'nama-departemen',
      type: 'input',
      valueOf: 'nama_departemen',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Induk Departemen',
      id: 'kode-induk-departemen',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'induk_departemen',
      valueOf: 'induk_departemen',
      required: false,
      readOnly: false,
      hiddenOn: false,
      inputInfo: {
        id: 'nama_induk_departemen',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_induk_departemen'
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Divisi',
      id: 'kode-divisi',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_divisi',
      valueOf: 'kode_divisi',
      required: true,
      readOnly: false,
      hiddenOn: false,
      inputInfo: {
        id: 'nama-divisi',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_divisi'
      },
      update: {
        disabled: false
      }
    }
  ]

  //Tree view Variables
  titleComponent = "Daftar Departemen"
  indicator = "induk_departemen"
  indicatorValue = ""
  subIndicator = "kode_departemen"
  rowOf = 0
  headerView = [
    {
      label: 'Nama Departemen',
      value: 'nama_departemen'
    },
    {
      label: 'Kode Departemen',
      value: 'kode_departemen'
    },
    {
      label: 'Induk Departemen',
      value: 'induk_departemen'
    }
  ]
  sortBy = "nama_departemen"

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
      label: 'Induk Departemen',
      value: 'induk_departemen'
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

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.request.apiData('divisi', 'g-divisi', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputDivisiData = data['RESULT']
          this.loading = false
          this.sendRequestDepartemen()
        } else {
          this.openSnackBar('Gagal mendapatkan daftar divisi. Mohon coba lagi nanti.', 'fail')
          this.loading = false
          this.loadingDepartemen = false
          this.ref.markForCheck()
        }
      }
    )
  }

  sendRequestDepartemen() {
    this.loadingDepartemen = true
    this.ref.markForCheck()
    this.request.apiData('departemen', 'g-departemen', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseData = data['RESULT']
          this.inputDepartemenData = data['RESULT']
          this.loadingDepartemen = false
          this.ref.markForCheck()
        } else {
          this.loadingDepartemen = false
          this.ref.markForCheck()
          this.openSnackBar('Data Departemen tidak ditemukan.')
        }
      }
    )
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
          type === "induk_departemen" ? this.inputDepartemenInterface :
            type === "kode_divisi" ? this.inputDivisiInterface :
              {},
        displayedColumns:
          type === "induk_departemen" ? this.inputDepartemenDisplayColumns :
            type === "kode_divisi" ? this.inputDivisiDisplayColumns :
              [],
        tableData:
          type === "induk_departemen" ? this.inputDepartemenData :
            type === "kode_divisi" ? this.inputDivisiData :
              [],
        tableRules:
          type === "induk_departemen" ? this.inputDepartemenDataRules :
            type === "kode_divisi" ? this.inputDivisiData :
              [],
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "induk_departemen") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('induk_departemen', result.kode_departemen)
            this.forminput.updateFormValue('nama_induk_departemen', result.nama_departemen)
          }
        } else if (type === "kode_divisi") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_divisi', result.kode_divisi)
            this.forminput.updateFormValue('nama_divisi', result.kode_divisi)
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
            label: 'Kode Departemen',
            id: 'kode-departemen',
            type: 'input',
            valueOf: this.formValue.kode_departemen,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Nama Departemen',
            id: 'nama-departemen',
            type: 'input',
            valueOf: this.formValue.nama_departemen,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Induk Departemen',
            id: 'induk-departemen',
            type: 'input',
            valueOf: this.formValue.induk_departemen,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Kode Divisi',
            id: 'kode-divisi',
            type: 'input',
            valueOf: this.formValue.kode_divisi,
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
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.openSnackBar(message, 'success')
  }

  //Browse binding event
  browseSelectRow(data) {
    this.formValue = data

    for (var i = 0; i < this.inputDepartemenData.length; i++) {
      if (this.inputDepartemenData[i]['kode_departemen'] === this.formValue['induk_departemen']) {
        this.formValue['nama_induk_departemen'] = this.inputDepartemenData[i]['nama_departemen']

      }
      break
    }
    this.onUpdate = true;
    window.scrollTo(0, 0)
    this.formInputCheckChanges()
  }

  getBackToInput() {
    this.selectedTab = 0;
    //this.getDetail()
    this.formInputCheckChanges()
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
        let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan }, this.formValue)
        this.request.apiData('departemen', this.onUpdate ? 'u-departemen' : 'i-departemen', endRes).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.loading = false
              this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
              this.onCancel()
              this.ref.markForCheck()
              this.sendRequestDepartemen()
            } else {
              this.loading = false;
              this.ref.markForCheck()
              this.openSnackBar(data['RESULT'])
            }
          },
          error => {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar('GAGAL MELAKUKAN PROSES.')
          }
        )
      } else {
        this.openSnackBar('DATA TIDAK LENGKAP.')
      }
    }
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      kode_departemen: '',
      nama_departemen: '',
      induk_departemen: '',
      nama_induk_departemen: '',
      kode_divisi: '',
      nama_divisi: '',
    }
    this.browseData = []
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
      this.request.apiData('departemen', 'd-departemen', { kode_perusahaan: this.kode_perusahaan, kode_departemen: this.formValue.kode_departemen }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
            this.ref.markForCheck()
            this.refreshBrowse('BERHASIL DIHAPUS')
            this.sendRequestDepartemen()
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
