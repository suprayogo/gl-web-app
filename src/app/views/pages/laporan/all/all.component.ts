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
  beforeCodeTitle: 'Daftar Laporan'
}

@Component({
  selector: 'kt-all',
  templateUrl: './all.component.html',
  styleUrls: ['./all.component.scss', '../laporan.style.scss']
})
export class AllComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild('ns', { static: false }) forminputNS;
  @ViewChild('bb', { static: false }) forminputBB;
  @ViewChild('lr', { static: false }) forminputLR;
  @ViewChild('ak', { static: false }) forminputAK;
  @ViewChild('jl', { static: false }) forminputJL;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  nama_tombol: any;
  onSub: boolean = false;
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

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // Input Name
  formValueNS = {
    periode: JSON.stringify(this.getDateNow())
  }

  formValueBB = {
    periode: JSON.stringify(this.getDateNow())
  }

  formValueLR = {
    periode: JSON.stringify(this.getDateNow())
  }

  formValueAK = {
    periode: JSON.stringify(this.getDateNow())
  }

  formValueJL = {
    periode: JSON.stringify(this.getDateNow())
  }

  // Layout Form
  inputLayoutNS = [
    {
      formWidth: 'col-8',
      label: 'Periode',
      id: 'periode',
      type: 'datepicker',
      valueOf: 'periode',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: false,
      enableMax: false,
    }
  ]

  inputLayoutBB = [
    {
      formWidth: 'col-8',
      label: 'Periode',
      id: 'periode',
      type: 'datepicker',
      valueOf: 'periode',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: false,
      enableMax: false,
    }
  ]

  inputLayoutLR = [
    {
      formWidth: 'col-8',
      label: 'Periode',
      id: 'periode',
      type: 'datepicker',
      valueOf: 'periode',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: false,
      enableMax: false,
    }
  ]

  inputLayoutAK = [
    {
      formWidth: 'col-8',
      label: 'Periode',
      id: 'periode',
      type: 'datepicker',
      valueOf: 'periode',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: false,
      enableMax: false,
    }
  ]

  inputLayoutJL = [
    {
      formWidth: 'col-8',
      label: 'Periode',
      id: 'periode',
      type: 'datepicker',
      valueOf: 'periode',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: false,
      enableMax: false,
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
    this.nama_tombol = 'Lihat Laporan'
    this.gbl.need(true, false)
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
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.loading = false
  }

  refreshBrowse(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.openSnackBar(message, 'success')
  }

  //Form submit
  onSubmitNS(inputForm: NgForm) {
    this.gbl.topPage()
    if (this.forminput !== undefined) {
      this.formValueNS = this.forminput === undefined ? this.formValueNS : this.forminput.getData()
      if (inputForm.valid) {
        this.addNewDataNS()
      } else {
        this.openSnackBar('Data Tidak Lengkap.', 'info')
      }
    }
  }

  addNewDataNS() {
    this.loading = true;
    this.ref.markForCheck()
    let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan }, this.formValueNS)
    this.request.apiData('bank', this.onUpdate ? 'u-bank' : 'i-bank', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.resetFormNS()
          this.browseNeedUpdate = true
          this.ref.markForCheck()
          this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
        } else {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('Gagal Tambah Data ! Kode Bank Sudah Ada', 'fail')
        }
      },
      error => {
        this.loading = false;
        this.ref.markForCheck()
        this.openSnackBar('GAGAL MELAKUKAN PROSES.')
      }
    )
  }

  //Reset Value
  resetFormNS() {
    this.gbl.topPage()
    this.formValueNS = {
      periode: JSON.stringify(this.getDateNow())
    }
    this.formInputCheckChanges()
  }

  onCancelNS() {
    this.resetFormNS()
  }

  openSnackBar(message, type?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '90vw',
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
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }

  //Date Functions
  getDateNow() {
    // let d = this.gbl.getTahunPeriode() + "-" + this.gbl.getBulanPeriode() + "-01"
    let p = new Date().getTime()
    return p
  }

  reverseConvertTime(data) {
    let date = new Date(data)

    return JSON.stringify(date.getTime())
  }
}
