import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTabChangeEvent, MatDialog, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// Request Data API
import { RequestDataService } from '../../../../service/request-data.service';

// Components
import { DialogComponent } from '../../components/dialog/dialog.component';
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';

const content = {
  beforeCodeTitle: 'Daftar Departemen'
}

@Component({
  selector: 'kt-departemen',
  templateUrl: './departemen.component.html',
  styleUrls: ['./departemen.component.scss', '../master.style.scss']
})
export class DepartemenComponent implements OnInit {

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
  tableLoad: boolean = true;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  // loadingAplikasi: boolean = true;
  browseNeedUpdate: boolean = true;
  dialogRef: any;
  dialogType: string = null;
  search: string;

  // Configuration Select box
  tipe_aktif: Object = []

  // Input Name
  formValue = {
    kode_departemen: '',
    nama_departemen: '',
    induk_departemen: '',
    nama_induk_departemen:'',
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
      required: true,
      readOnly: false,
      hiddenOn: false,
      inputInfo: {
        id: 'nama_induk_departemen',
        disabled: false,
        readOnly: true,
        required: true,
        valueOf: 'nama_induk_departemen'
      },
      update: {
        disabled: false
      }
    },
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
      label: 'Induk Departemen',
      value: 'induk_departemen'
    },
    {
      label: 'Nama Induk Departemen',
      value: 'nama_induk_departemen'
    },
  ];
  inputDepartemenInterface = {
    kode_departemen: 'string',
    nama_departemen: 'string',
    induk_departemen: 'string',
    nama_induk_departemen: 'string',
  }
  inputDepartemenData = []
  inputDepartemenDataRules = []

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
      value: 'kode_departemen'
    }
  ]
  sortBy = "nama_departemen"

  /* buttonLayout = [
    {
      btnLabel: 'Tambah Akses',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.openDialog('kode_aplikasi')
      },
      btnCondition: () => {
        return true
      }
    }
  ] */

  // List Dialog
  /* inputAplikasiDisplayColumns = [
    {
      label: '',
      value: '',
      selectable: true
    },
  ]
  inputAplikasiInterface = {
    contoh: 'string'
  }
  inputAplikasiData = []
  inputAplikasiDataRules = [] */

  // List Detail
  /* detailDisplayColumns = [
    {
      label: '',
      value: ''
    },
  ]
  detailInterface = {
    contoh: 'string'
  }
  detailData = []
  detailRules = [] */

  // TAB MENU BROWSE 
  /* displayedColumnsTable = [
    {
      label: '',
      value: ''
    },
  ];
  browseInterface = {
    Contoh: 'string',
  } */
  browseData = []
  browseDataRules = [] 

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private request: RequestDataService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.madeRequest()
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.request.apiData('perusahaan', 'g-perusahaan').subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseData = data['RESULT']
          this.inputDepartemenData = data['RESULT']
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  openDialog(type) {
    this.dialogType = JSON.parse(JSON.stringify(type))
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        type: type,
        tableInterface:
          type === "induk_departemen" ? this.inputDepartemenInterface :
            {},
        displayedColumns:
          type === "induk_departemen" ? this.inputDepartemenDisplayColumns :
            [],
        tableData:
          type === "induk_departemen" ? this.inputDepartemenData :
            [],
        tableRules:
          type === "induk_departemen" ? this.inputDepartemenDataRules :
            [],
        formValue: this.formValue,
        // selectable: type === 'kode_aplikasi' ? true : false,
        // selected: this.detailData,
        // selectIndicator: "kode_aplikasi",
        // loadingData: type === "kode_aplikasi" ? this.loadingAplikasi : null
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "induk_departemen") {
          this.formValue.induk_departemen = result.kode_departemen
          this.formValue.nama_induk_departemen = result.nama_departemen
          this.ref.markForCheck();
        }
        this.dialogRef = undefined
        this.dialogType = null
        this.formInputCheckChanges()
      }
    });
  }

  refreshBrowse(message) {
    this.request.apiData('departemen', 'g-departemen').subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseData = data['RESULT']
          this.inputDepartemenData = data['RESULT']
          this.loading = false
          this.ref.markForCheck()
          this.openSnackBar(message, 'success')
          this.onUpdate = false
        }
      }
    )
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = this.formValue
    x.kode_departemen = data['kode_departemen']
    x.nama_departemen = data['nama_departemen']
    x.induk_departemen = data['induk_departemen']
    x.nama_induk_departemen = data['nama_induk_departemen']
    this.formValue = x
    this.onUpdate = true;
  }

  //Form submit
  onSubmit(inputForm: NgForm) {

    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        this.request.apiData('departemen', this.onUpdate ? 'u-departemen' : 'i-departemen', this.formValue).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.resetForm()
              this.browseNeedUpdate = true
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
      nama_induk_departemen:'',
    }
    // this.detailData = []
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
    if (this.onUpdate) {
      this.loading = true;
      this.ref.markForCheck()
      this.request.apiData('departemen', 'd-departemen', this.formValue).subscribe(
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