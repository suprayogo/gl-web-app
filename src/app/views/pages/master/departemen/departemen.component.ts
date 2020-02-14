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
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  loadingDepartemen: boolean = false;
  loadingDataText: string = "Loading Departemen.."
  search: string;

  //Configuration
  // tipe_menu: Object = []

  // Input Name
  formValue = {
    kode_departemen: '',
    nama_departemen: '',
    induk_departemen: '',
    nama_induk_departemen: '',
    kode_perusahaan: '',
    nama_perusahaan: '',
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
        disabled: false
      }
    },
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

  sendRequestDepartemen(kp: any) {
    this.loadingDepartemen = true
    this.ref.markForCheck()
    this.request.apiData('departemen', 'g-departemen', { kode_perusahaan: kp }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseData = data['RESULT']
          this.inputDepartemenData = data['RESULT']
          this.loadingDepartemen = false
          this.ref.markForCheck()
        } else {
          this.loadingDepartemen = false
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
            type === "induk_departemen" ? this.inputDepartemenInterface :
              {},
        displayedColumns:
          type === "kode_perusahaan" ? this.inputPerusahaanDisplayColumns :
            type === "induk_departemen" ? this.inputDepartemenDisplayColumns :
              [],
        tableData:
          type === "kode_perusahaan" ? this.inputPerusahaanData :
            type === "induk_departemen" ? this.inputDepartemenData :
              [],
        tableRules:
          type === "kode_perusahaan" ? this.inputPerusahaanDataRules :
            type === "induk_departemen" ? this.inputDepartemenDataRules :
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
        } else if (type === "kode_perusahaan") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_perusahaan', result.kode_perusahaan)
            this.forminput.updateFormValue('nama_perusahaan', result.nama_perusahaan)
            this.sendRequestDepartemen(result.kode_perusahaan)
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

    for (var i = 0; i < this.inputDepartemenData.length; i++) {
      if (this.inputDepartemenData[i]['kode_departemen'] === this.formValue['induk_departemen']) {
        this.formValue['kode_perusahaan'] = this.inputPerusahaanData[i]['kode_perusahaan']
        this.formValue['nama_perusahaan'] = this.inputPerusahaanData[i]['nama_perusahaan']
        this.formValue['nama_induk_departemen'] = this.inputDepartemenData[i]['nama_departemen']

      } else {
        this.formValue['kode_perusahaan'] = this.inputPerusahaanData[i]['kode_perusahaan']
        this.formValue['nama_perusahaan'] = this.inputPerusahaanData[i]['nama_perusahaan']
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
        this.request.apiData('departemen', this.onUpdate ? 'u-departemen' : 'i-departemen', this.formValue).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.loading = false
              this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
              this.onCancel()
              this.ref.markForCheck()
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
      kode_perusahaan: '',
      nama_perusahaan: '',
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
    if (this.onUpdate) {
      this.loading = true;
      this.ref.markForCheck()
      this.request.apiData('departemen', 'd-departemen', { kode_perusahaan: this.formValue.kode_perusahaan, kode_departemen: this.formValue.kode_departemen }).subscribe(
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
