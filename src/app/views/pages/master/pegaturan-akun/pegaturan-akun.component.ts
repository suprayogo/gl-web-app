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
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';

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

  //CDialog Delete Akun
  c_buttonLayout = [
    {
      btnLabel: 'Hapus Akun',
      btnClass: 'btn btn-primary',
      btnClick: (e) => {
        this.deleteDetailData(e)
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
      content: 'Yakin akan hapus data akun ?',
      style: {
        'color': 'red',
        'font-size': '16px',
        'font-weight': 'bold'
      }
    }
  ]

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
      value: 'kode_akun',
      number: false
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
    this.gbl.need(true, false)
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
          } else {
            this.ref.markForCheck()
            this.openSnackBar("Gagal Ambil Data Akun", 'fail')
          }
        }
      )
    }
  }

  // Dialog
  openDialog(type) {
    this.gbl.topPage()
    this.dialogType = JSON.parse(JSON.stringify(type))
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      position: { top: '20px' },
      backdropClass: 'bg-dialog',
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
        containerHeight: '300',
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

  openCDialog(e) { // Confirmation Dialog
    this.gbl.topPage()
    let akun = {
      kode_akun: e['kode_akun'],
      nama_akun: e['nama_akun']
    }
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '70px' },
      data: {
        buttonLayout: this.c_buttonLayout,
        labelLayout: this.c_labelLayout,
        formValue : akun,
        inputLayout: [
          {
            label: 'Kode Akun',
            id: 'kode-akun',
            type: 'input',
            valueOf: akun['kode_akun'],
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Nama Akun',
            id: 'nama-akun',
            type: 'input',
            valueOf: akun['nama_akun'],
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
        // this.batal_alasan = ""
      },
      // error => null
    )

  }

  getDetail() {
    this.detailLoad = true
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('akun', 'g-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
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
    this.dialog.closeAll()
    console.log(data)
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
            id_akun: this.inputAkunData[j]['id_akun'],
            nama_akun: this.inputAkunData[j]['nama_akun']
          }
          endRes.push(x)
          break;
        }
      }
    }
    this.detailData = endRes
  }

  refreshBrowse(message) {
    this.openSnackBar(message, 'success')
    this.loading = false
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.gbl.topPage()
        this.loading = true;
        this.ref.markForCheck()
        let endRes = Object.assign(
          {
            detail_akun: this.detailData,
            kode_perusahaan: this.kode_perusahaan
          })
        this.request.apiData('akun', 'i-akun', endRes).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.resetForm()
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              this.openSnackBar("BERHASIL DISIMPAN", 'success')
              this.loading = false
            } else {
              this.loading = false;
              this.ref.markForCheck()
              this.openSnackBar("TIDAK BERHASIL DISIMPAN", 'fail')
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

  openSnackBar(message, type?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '120px' },
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