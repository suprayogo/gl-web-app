import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// Request Data API
import { RequestDataService } from '../../../../service/request-data.service';

// Components
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

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
  // Variables
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  editable: boolean = false;
  selectedTab: number = 0;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  loadingDivisi: boolean = false;
  loadingDataText: string = "Loading Divisi.."
  search: string;

  //Configuration
  // tipe_menu: Object = []

  // Input Name
  formValue = {
    kode_divisi: '',
    nama_divisi: '',
    kode_perusahaan: '',
    nama_perusahaan: '',
    keterangan: ''
  }

  // Layout Form
  inputLayout = [
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
        disabled: true
      }
    },
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

  //Tree view Variables
  titleComponent = "Daftar Divisi"
  indicator = "induk_divisi"
  indicatorValue = ""
  subIndicator = "kode_divisi"
  rowOf = 0
  headerView = [
    {
      label: 'Nama Divisi',
      value: 'nama_divisi'
    },
    {
      label: 'Kode Divisi',
      value: 'kode_divisi'
    }
  ]
  sortBy = "nama_divisi"

  inputDivisiDisplayColumns = [
    {
      label: 'Kode Divisi',
      value: 'kode_divisi'
    },
    {
      label: 'Nama Divisi',
      value: 'nama_divisi'
    }
  ]
  inputDivisiInterface = {
    kode_divisi: 'string',
    nama_divisi: 'string',
  }
  inputDivisiData = []
  inputDivisiDataRules = []

  // TAB MENU BROWSE 
  browseData = []
  browseDataRules = []

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.madeRequest()
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.loading = false
    this.sendRequestPerusahaan()
  }

  sendRequestDivisi(kp: any) {
    this.loadingDivisi = true
    this.ref.markForCheck()
    this.request.apiData('divisi', 'g-divisi', { kode_perusahaan: kp }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseData = data['RESULT']
          this.inputDivisiData = data['RESULT']
          this.loadingDivisi = false
          this.ref.markForCheck()
        } else {
          this.loadingDivisi = false
          this.ref.markForCheck()
          // this.openSnackBar('Gagal mendapatkan data.')
        }
      }
    )
  }

  sendRequestPerusahaan() {
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
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_perusahaan") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_perusahaan', result.kode_perusahaan)
            this.forminput.updateFormValue('nama_perusahaan', result.nama_perusahaan)
            this.sendRequestDivisi(result.kode_perusahaan)
          }
        }
        this.ref.markForCheck();
      }
    });
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
    for (var i = 0; i < this.inputDivisiData.length; i++) {
      this.formValue['kode_perusahaan'] = this.inputPerusahaanData[i]['kode_perusahaan']
      this.formValue['nama_perusahaan'] = this.inputPerusahaanData[i]['nama_perusahaan']
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
        this.request.apiData('divisi', this.onUpdate ? 'u-divisi' : 'i-divisi', this.formValue).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.loading = false
              this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
              this.onCancel()
              this.ref.markForCheck()
              this.sendRequestDivisi(this.formValue.kode_perusahaan)
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
      kode_perusahaan: this.formValue.kode_perusahaan,
      nama_perusahaan: this.formValue.nama_perusahaan,
      keterangan: ''
    }
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
      this.request.apiData('divisi', 'd-divisi', { kode_perusahaan: this.formValue.kode_perusahaan, kode_divisi: this.formValue.kode_divisi }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
            this.ref.markForCheck()
            this.refreshBrowse('BERHASIL DIHAPUS')
            this.sendRequestDivisi(this.formValue.kode_perusahaan)
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