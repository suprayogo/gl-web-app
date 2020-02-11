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
  beforeCodeTitle: 'Daftar Divisi'
}

@Component({
  selector: 'kt-divisi',
  templateUrl: './divisi.component.html',
  styleUrls: ['./divisi.component.scss', '../master.style.scss']
})
export class DivisiComponent implements OnInit {

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
    kode_divisi: '',
    nama_divisi: '',
    kode_perusahaan: '',
    nama_perusahaan:'',
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Divisi',
      id: 'kode-divisi',
      type: 'input',
      valueOf: 'kode_divisi',
      required: true,
      readOnly: false,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Nama Divisi',
      id: 'nama-divisi',
      type: 'input',
      valueOf: 'nama_divisi',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Perusahaan',
      id: 'kode-perusahaan',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_perusahaan',
      valueOf: 'kode_perusahaan',
      required: true,
      readOnly: false,
      hiddenOn: false,
      inputInfo: {
        id: 'nama_perusahaan',
        disabled: false,
        readOnly: true,
        required: true,
        valueOf: 'nama_perusahaan'
      },
      update: {
        disabled: false
      }
    },
  ]

  inputPerusahaanDisplayColumns = [
    {
      label: 'Kode Perusahaan',
      value: 'kode_perusahaan'
    },
    {
      label: 'Nama Perusahaan',
      value: 'nama_perusahaan'
    }
  ];
  inputPerusahaanInterface = {
    kode_perusahaan: 'string',
    nama_perusahaan: 'string'
  }
  inputPerusahaanData = []
  inputPerusahaanDataRules = []

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
  displayedColumnsTable = [
    {
      label: 'Kode Divisi',
      value: 'kode_divisi'
    },
    {
      label: 'Nama Divisi',
      value: 'nama_divisi'
    },
    {
      label: 'Kode Perusahaan',
      value: 'kode_perusahaan'
    },
    {
      label: 'Diinput oleh',
      value: 'input_by',
    },
    {
      label: 'Diinput tanggal',
      value: 'input_dt'
    },
    {
      label: 'Diupdate oleh',
      value: 'update_by'
    },
    {
      label: 'Diupdate tanggal',
      value: 'update_dt'
    }
  ];
  browseInterface = {
    kode_divisi: 'string',
    nama_divisi: 'string',
    kode_perusahaan: 'string',
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
          this.inputPerusahaanData = data['RESULT']
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
          type === "kode_perusahaan" ? this.inputPerusahaanInterface :
            {},
        displayedColumns:
          type === "kode_perusahaan" ? this.inputPerusahaanDisplayColumns :
            [],
        tableData:
          type === "kode_perusahaan" ? this.inputPerusahaanData :
            [],
        tableRules:
          type === "kode_perusahaan" ? this.inputPerusahaanDataRules :
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
        if (type === "kode_perusahaan") {
          this.formValue.kode_perusahaan = result.kode_perusahaan
          this.formValue.nama_perusahaan = result.nama_perusahaan
          this.ref.markForCheck();
        }
        this.dialogRef = undefined
        this.dialogType = null
        this.formInputCheckChanges()
      }
    });
  }

  //Tab change event
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 1 && this.browseNeedUpdate) {
      this.refreshBrowse('')
    }

    if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  }

  refreshBrowse(message) {
    this.tableLoad = true
    this.request.apiData('divisi', 'g-divisi').subscribe(
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
        }
      }
    )
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = this.formValue
    x.kode_divisi = data['kode_divisi']
    x.nama_divisi = data['nama_divisi']
    x.kode_perusahaan = data['kode_perusahaan']
    this.formValue = x
    this.onUpdate = true;
    this.getBackToInput();
  }

  getBackToInput() {
    this.selectedTab = 0;
    // this.getDetail()
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm) {

    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        this.request.apiData('divisi', this.onUpdate ? 'u-divisi' : 'i-divisi', this.formValue).subscribe(
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
      kode_divisi: '',
      nama_divisi: '',
      kode_perusahaan: '',
      nama_perusahaan:'',
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
      this.request.apiData('divisi', 'd-divisi', this.formValue).subscribe(
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