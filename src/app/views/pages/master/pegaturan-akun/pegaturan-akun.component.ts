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
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

const content = {
  beforeCodeTitle: 'Pengaturan Daftar Akun'
}

@Component({
  selector: 'kt-pegaturan-akun',
  templateUrl: './pegaturan-akun.component.html',
  styleUrls: ['./pegaturan-akun.component.scss', '../master.style.scss']
})
export class PegaturanAkunComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  loading: boolean = true;
  loadingAkun: boolean = false;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = true;
  editable: boolean = false;
  selectedTab: number = 0;
  tableLoad: boolean = true;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  browseNeedUpdate: boolean = true;
  dialogRef: any;
  dialogType: string = null;
  search: string;

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  buttonLayout = [
    {
      btnLabel: 'Tambah Akun',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.openDialog('kode_akun')
      },
      btnCondition: () => {
        return true
      }
    }
  ]

  // Aplikasi List
  inputAkunDisplayColumns = [
    {
      label: 'Kode Akun',
      value: 'kode_akun',
      selectable: true
    },
    {
      label: 'Nama Akun',
      value: 'nama_akun'
    }
  ]
  inputAkunInterface = {
    id_akun: 'string',
    kode_akun: 'string',
    nama_akun: 'string'
  }
  inputAkunData = []
  inputAkunDataRules = []

  // User-Aplikasi List Detail
  detailDisplayColumns = [
    {
      label: 'Kode Akun',
      value: 'kode_akun'
    },
    {
      label: 'Nama Akun',
      value: 'nama_akun'
    }
  ]
  detailInterface = {
    id_akun: 'string',
    kode_akun: 'string',
    nama_akun: 'string'
  }
  detailData = []
  detailRules = []

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
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    if (this.kode_perusahaan !== "") {
      this.madeRequest()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
  }

  reqKodePerusahaan() {
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        this.resetForm()
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.kode_perusahaan !== "") {
          this.madeRequest()
        }

        /* if (this.selectedTab == 1 && this.browseNeedUpdate && this.kode_perusahaan !== "") {
          this.refreshBrowse('')
        } */
      }
    )
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('akun', 'g-akun-dc', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputAkunData = data['RESULT']
            this.loading = false
            this.getDetail()
            this.ref.markForCheck()
            if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
              if (this.dialogType === "kode_akun") {
                this.dialog.closeAll()
                this.openDialog('kode_akun')
              }
            }
          }
        }
      )
    }
  }

  // Dialog
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
          type === "kode_akun" ? this.inputAkunInterface :
            {},
        displayedColumns:
          type === "kode_akun" ? this.inputAkunDisplayColumns :
            [],
        tableData:
          type === "kode_akun" ? this.inputAkunData :
            [],
        tableRules:
          type === "kode_akun" ? this.inputAkunDataRules :
            [],
        selectable: type === 'kode_akun' ? true : false,
        selected: this.detailData,
        selectIndicator: "kode_akun",
        loadingData: type === "kode_akun" ? this.loadingAkun : null
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_akun") {
          let x = result
          for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < this.detailData.length; j++) {
              if (this.detailData[j]['kode_akun'] === x[i]['kode_akun']) {
                x[i] = this.detailData[j]
              }
            }
          }
          this.detailData.splice(0, this.detailData.length)
          for (var i = 0; i < x.length; i++) {
            if (x[i]['id'] === "" || x[i]['id'] == null || x[i]['id'] === undefined) {
              x[i]['id'] = `${MD5(Date().toLocaleString() + Date.now() + randomString({
                length: 8,
                numeric: true,
                letters: false,
                special: false
              }))}`
            }
            this.detailData.push(x[i])
          }
          this.ref.markForCheck()
          this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
        }
        this.dialogRef = undefined
        this.dialogType = null
        this.ref.markForCheck();
      }
    });
  }

  getDetail() {
    this.detailLoad = true
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('akun', 'g-akun', {kode_perusahaan: this.kode_perusahaan}).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.restructureDetailData(data['RESULT'])
            this.detailLoad = false
            this.ref.markForCheck()
          } else {
            this.openSnackBar('Failed to load detail')
            this.detailLoad = false
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  editDetailData(data) {
  }

  deleteDetailData(data) {
    for (var i = 0; i < this.detailData.length; i++) {
      if (this.detailData[i]['kode_akun'] === data['kode_akun']) {
        let x = this.detailData[i]
        this.detailData.splice(i, 1)
        this.dialog.closeAll()
        this.ref.markForCheck()
        this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
        break;
      }
    }
  }

  restructureDetailData(data) {
    let endRes = []
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < this.inputAkunData.length; j++) {
        if (data[i]['kode_akun'] === this.inputAkunData[j]['kode_akun']) {
          let x = {
            id: `${MD5(Date().toLocaleString() + Date.now() + randomString({
              length: 8,
              numeric: true,
              letters: false,
              special: false
            }))}`,
            kode_akun: data[i]['kode_akun'],
            nama_akun: this.inputAkunData[j]['nama_akun']
          }
          endRes.push(x)
          break;
        }
      }
    }
    this.detailData = endRes
  }

 /*  //Tab change event
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 1 && this.browseNeedUpdate) {
      this.refreshBrowse('')
    }

    if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  } */

  refreshBrowse(message) {
    this.tableLoad = true
    this.request.apiData('perusahaan', 'g-perusahaan').subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (message !== '') {

            this.loading = false
            this.tableLoad = false
            this.ref.markForCheck()
            this.openSnackBar(message, 'success')
            this.onUpdate = false
          } else {

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
 /*  browseSelectRow(data) {
    // let x = this.formValue
    // x.kode_perusahaan = data['kode_perusahaan']
    // x.nama_perusahaan = data['nama_perusahaan']
    // x.keterangan = data['keterangan']
    // this.formValue = x
    this.onUpdate = true;
    this.getBackToInput();
  } */

  /* getBackToInput() {
    this.selectedTab = 0;
    this.getDetail()
    this.formInputCheckChanges()
  } */

  //Form submit
  onSubmit(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.loading = true;
        this.ref.markForCheck()
        // this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        let endRes = Object.assign({ detail_perusahaan: this.detailData })
        this.request.apiData('perusahaan', this.onUpdate ? 'u-perusahaan' : 'i-perusahaan', endRes).subscribe(
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
        this.openSnackBar('DATA TIDAK LENGKAP.', 'fail')
      }
    }
  }

  //Reset Value
  resetForm() {
    /* this.formValue = {
      kode_perusahaan: '',
      nama_perusahaan: '',
      keterangan: '',
    } */
    this.getDetail()
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

  /* deleteData() {
    this.dialog.closeAll()
    if (this.onUpdate) {
      this.loading = true;
      this.ref.markForCheck()
      this.request.apiData('perusahaan', 'd-perusahaan').subscribe(
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
  } */

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
      this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }
}