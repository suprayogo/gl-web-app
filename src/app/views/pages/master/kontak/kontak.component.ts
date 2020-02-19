import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
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

const content = {
  beforeCodeTitle: 'Daftar Kontak'
}

@Component({
  selector: 'kt-kontak',
  templateUrl: './kontak.component.html',
  styleUrls: ['./kontak.component.scss', '../master.style.scss']
})
export class KontakComponent implements OnInit, AfterViewInit {

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
  tableLoad: boolean = false;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  browseNeedUpdate: boolean = true;
  search: string;
  subscription: any;
  kp: any;

  // Configuration Select box
  // tipe_aktif: Object = []

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
      label: 'Kode Kontak',
      value: 'kode_kontak'
    },
    {
      label: 'Nama Kontak',
      value: 'nama_kontak'
    },
    {
      label: 'Alamat',
      value: 'alamat'
    },
    {
      label: 'Telepon',
      value: 'telepon'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
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
    kode_kontak: 'string',
    nama_kontak: 'string',
    alamat: 'string',
    telepon: 'string',
    keterangan: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []

  // Input Name
  formValue = {
    kode_kontak: '',
    nama_kontak: '',
    alamat: '',
    telepon: '',
    keterangan: '',
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Kontak',
      id: 'kode-kontak',
      type: 'input',
      valueOf: 'kode_kontak',
      required: true,
      readOnly: false,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Nama Kontak',
      id: 'nama-kontak',
      type: 'input',
      valueOf: 'nama_kontak',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Alamat',
      id: 'alamat',
      type: 'input',
      valueOf: 'alamat',
      required: false,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Telepon',
      id: 'telepon',
      type: 'input',
      valueOf: 'telepon',
      required: false,
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

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.madeRequest()
    this.reqKodePerusahaan()
  }

  ngAfterViewInit(): void {
    this.kp = this.gbl.getKodePerusahaan()
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
  }

  reqKodePerusahaan() {
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kp = value
        this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.selectedTab == 1 && this.browseNeedUpdate) {
          this.refreshBrowse('', value)
        }
      }
    )
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.loading = false
  }

  //Tab change event
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 1 && this.browseNeedUpdate) {
      this.refreshBrowse('')
    }

    if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  }

  refreshBrowse(message, val = null) {
    this.tableLoad = true
    this.request.apiData('kontak', 'g-kontak', { kode_perusahaan: val ? val : this.kp }).subscribe(
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
    x.kode_kontak = data['kode_kontak']
    x.nama_kontak = data['nama_kontak']
    x.alamat = data['alamat']
    x.telepon = data['telepon']
    x.keterangan = data['keterangan']
    this.formValue = x
    this.onUpdate = true;
    this.getBackToInput();
  }

  getBackToInput() {
    this.selectedTab = 0;
    //this.getDetail()
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm, val = null) {

    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        let endRes = Object.assign({ kode_perusahaan: val ? val : this.kp }, this.formValue)
        this.request.apiData('kontak', this.onUpdate ? 'u-kontak' : 'i-kontak', endRes).subscribe(
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
      kode_kontak: '',
      nama_kontak: '',
      alamat: '',
      telepon: '',
      keterangan: '',
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

  deleteData(val = null) {
    if (this.onUpdate) {
      this.loading = true;
      this.ref.markForCheck()
      let endRes = Object.assign({ kode_perusahaan: val ? val : this.kp }, this.formValue)
      this.request.apiData('kontak', 'd-kontak', endRes).subscribe(
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