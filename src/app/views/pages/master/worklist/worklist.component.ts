import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';

const content = {
  beforeCodeTitle: 'Worklist'
}

@Component({
  selector: 'kt-worklist',
  templateUrl: './worklist.component.html',
  styleUrls: ['./worklist.component.scss', '../master.style.scss']
})
export class WorklistComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // VARIABLES
  noSaveButton: boolean = true;
  noCancel: boolean = true;
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  detailJurnalLoad: boolean = false;
  enableDetail: boolean = false;
  editable: boolean = false;
  accReqData: boolean = false;
  selectedTab: number = 0;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  loadingDataText: string = "Loading Data Transaksi Jurnal.."
  search: string;
  browseNeedUpdate: boolean = true;
  dialogRef: any;
  dialogType: string = null;

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // GLOBAL VARIABLE PERIODE AKTIF
  subsAP: any;
  access_period: any;

  // INPUT VALUE DETAIL
  formDetail = {
    id_worklist: '',
    kode_approval: '',
    nama_cabang: '',
    id_tran: '',
    no_tran: '',
    tgl_tran: '',
    keterangan: '',
    catatan: '',
    user_id: '',
  }

  detailData = []

  detailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'nama-cabang',
      type: 'input',
      valueOf: 'nama_cabang',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Tgl. Transaksi',
      id: 'tgl-tran',
      type: 'input',
      valueOf: 'tgl_tran',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Deskripsi',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Catatan',
      id: 'catatan-wl',
      type: 'input',
      valueOf: 'catatan',
      required: false,
      readOnly: false,
      disabled: false
    },
  ]

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'Tanggal',
      value: 'tanggal',
      date: true
    },
    {
      label: 'Nama Approval',
      value: 'nama_wl'
    },
    {
      label: 'Deskripsi',
      value: 'keterangan'
    },
    {
      label: 'Dari User',
      value: 'dari_user_name'
    }
  ];
  browseInterface = {
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []

  selectableDisplayColumns = [
    {
      label: 'Tanggal Periode',
      value: 'tgl_periode',
      date: true
    }
  ];
  selectableInterface = {
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  selectableData = []
  selectableDataRules = []

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.gbl.need(true, true)
    this.reqKodePerusahaan()
    this.reqAccessPeriod()
    this.madeRequest('')

  }

  ngAfterViewInit(): void {
    // PERUSAHAAN AKTIF
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    // PERIODE AKTIF
    this.access_period = this.gbl.getAccessPeriod()

    // AKSES PERIODE
    // this.akses_periode

    if (this.kode_perusahaan !== "") {
      this.madeRequest('')
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
    this.subsAP === undefined ? null : this.subsAP.unsubscribe()
  }

  reqKodePerusahaan() {
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        // this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.kode_perusahaan !== "") {
          this.madeRequest('')
        }

        /* if (this.selectedTab == 1 && this.browseNeedUpdate && this.kode_perusahaan !== "") {
          this.tabTP()
        } */
      }
    )
  }

  reqAccessPeriod() {
    this.subsAP = this.gbl.change_periode.subscribe(
      value => {
        this.access_period = value
        // this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.access_period.id_periode !== "") {
          this.madeRequest('')
        }

        /* if (this.selectedTab == 1 && this.browseNeedUpdate && this.access_period.id_periode !== "") {
          this.tabTP()
        } */
      }
    )
  }

  madeRequest(pesan) {
    this.loading = true
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('worklist', 'g-worklist', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            if (pesan !== "") {
              this.browseData = data['RESULT']
              this.loading = false
              this.ref.markForCheck()
              this.gbl.openSnackBar(pesan, 'success')
            } else {
              this.browseData = data['RESULT']
              this.loading = false
              this.ref.markForCheck()
            }
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan data periode. Mohon coba lagi nanti.', 'fail')
            this.loading = false
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  getDetail() {
    this.request.apiData('pengajuan', 'g-pengajuan-buka', { kode_perusahaan: this.kode_perusahaan, no_tran: this.formDetail.no_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = [], resp = JSON.parse(JSON.stringify(data['RESULT']))
          for (var i = 0; i < resp.length; i++) {
            let t = {
              id_tran: resp[i]['id_tran'],
              nama_cabang: resp[i]['nama_cabang'],
              tgl_tran: resp[i]['tgl_tran'],
            }
            res.push(t)
          }
          this.formDetail.id_tran = res[0].id_tran
          this.formDetail.nama_cabang = res[0].nama_cabang
          this.formDetail.tgl_tran = res[0].tgl_tran
          this.accReqData = true
          this.ref.markForCheck()
          this.getDetailTglPeriode()
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
          this.ref.markForCheck()
        }
      }
    )

  }

  getDetailTglPeriode() {
    if (this.formDetail.id_tran !== '' && this.accReqData === true) {
      this.request.apiData('pengajuan', 'g-detail-pengajuan-buka', { kode_perusahaan: this.kode_perusahaan, id_tran: this.formDetail.id_tran }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            let res = [], resp = JSON.parse(JSON.stringify(data['RESULT']))
            for (var i = 0; i < resp.length; i++) {
              let t = {
                id_periode: resp[i]['id_periode'],
                tgl_periode: resp[i]['tgl_periode'],
                aktif: resp[i]['aktif']
              }
              res.push(t)
            }
            this.selectableData = res
            this.ref.markForCheck()
            this.inputDialog()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  inputDialog() {
    this.gbl.topPage()
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: '70vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '50px' },
      data: {
        buttonName: 'Terima',
        width: '90vw',
        formValue: this.formDetail,
        inputLayout: this.detailInputLayout,
        buttonLayout: [],
        selectableDatatable: true,
        lowLoader: false,
        selectableDisplayColumns: this.selectableDisplayColumns,
        selectableInterface: this.selectableInterface,
        selectableData: this.selectableData,
        selectableDataRules: this.selectableDataRules,
        jurnalDataAkun: [],
        noEditJurnal: true,
        noButton: true,
        btnWL: true,
        btnReject: 'Tolak',
        btnRevision: 'Revisi',
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => null,
        onSubmit: (x: NgForm) => this.approve(this.formDetail),
        rejectData: () => this.reject(this.formDetail),
        revisionData: () => this.revision(this.formDetail),
        deleteData: () => null
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.dialog.closeAll()
        this.datatable == undefined ? null : this.datatable.reset()
      },
      error => null,
    );
  }

  approve(formDetail) {
    if (formDetail.catatan !== "") {
      this.dialog.closeAll()
      this.loading = true
      let endRes = Object.assign(
        {
          kode_perusahaan: this.kode_perusahaan,
          status_approval: '1'
        },
        formDetail
      )
      this.saveData(endRes, "DATA TELAH DI APPROVE")
    } else {
      setTimeout(() => {
        this.gbl.openSnackBar('Catatan belum diisi', 'info')
        setTimeout(() => {
          this.dialog.closeAll()
          
        }, 800)
      }, 1)
      setTimeout(() => {
        this.inputDialog()
      }, 1200)
    }
  }


  reject(formDetail) {
    if (formDetail.catatan !== "") {
      this.dialog.closeAll()
      this.loading = true
      let endRes = Object.assign(
        {
          kode_perusahaan: this.kode_perusahaan,
          status_approval: '3'
        },
        formDetail
      )
      this.saveData(endRes, "DATA TELAH DI REJECT")
    } else {
      setTimeout(() => {
        this.gbl.openSnackBar('Catatan belum diisi', 'info')
        setTimeout(() => {
          this.dialog.closeAll()
          
        }, 800)
      }, 1)
      setTimeout(() => {
        this.inputDialog()
      }, 1200)
    }
  }

  revision(formDetail) {
    if (formDetail.catatan !== "") {
      this.dialog.closeAll()
      this.loading = true
      let endRes = Object.assign(
        {
          kode_perusahaan: this.kode_perusahaan,
          status_approval: '2'
        },
        formDetail
      )
      this.saveData(endRes, "STATUS DATA : REVISI")
    } else {
      setTimeout(() => {
        this.gbl.openSnackBar('Catatan belum diisi', 'info')
        setTimeout(() => {
          this.dialog.closeAll()
          
        }, 800)
      }, 1)
      setTimeout(() => {
        this.inputDialog()
      }, 1200)
    }
  }

  saveData(endRes, pesan) {
    this.request.apiData('worklist', 'u-worklist', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseNeedUpdate = true
          this.ref.markForCheck()
          this.madeRequest(pesan)
        } else {
          this.loading = false;
          this.ref.markForCheck()
          this.gbl.openSnackBar(data['RESULT'], 'fail')
        }
      },
      error => {
        this.loading = false;
        this.ref.markForCheck()
        this.gbl.openSnackBar('GAGAL MELAKUKAN PROSES.', 'fail')
      }
    )
  }

  // refreshBrowse(message) {
  //   this.madeRequest()
  //   this.loading = false
  //   this.ref.markForCheck()
  //   this.onUpdate = false
  //   this.gbl.openSnackBar(message, 'success')
  // }

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formDetail = {
      id_worklist: x['id'],
      kode_approval: x['kode_wl'],
      id_tran: x['id_tran'],
      no_tran: x['no_tran'],
      tgl_tran: x['tgl_tran'],
      nama_cabang: x['nama_cabang'],
      keterangan: x['keterangan'],
      catatan: x['catatan_wl'],
      user_id: x['dari_user_id']
    }
    this.getDetail()
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
    }, 1)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

}

