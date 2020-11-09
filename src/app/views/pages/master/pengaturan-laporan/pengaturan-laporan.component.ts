import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';
import { DetailinputAgGridComponent } from '../../components/detailinput-ag-grid/detailinput-ag-grid.component';

const content = {
  beforeCodeTitle: 'Pengaturan Pengakuan Nilai'
}

@Component({
  selector: 'kt-pengaturan-laporan',
  templateUrl: './pengaturan-laporan.component.html',
  styleUrls: ['./pengaturan-laporan.component.scss', '../master.style.scss']
})
export class PengaturanLaporanComponent implements OnInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild('forminputLB', { static: false }) forminputLB;
  @ViewChild('ak', { static: false }) forminputAK;

  // VARIABLES
  loading: boolean = true;
  loadingLB: boolean = false;
  loadingNR: boolean = true;
  loadingAK: boolean = true;
  loadingAkun: boolean = false;
  content: any;
  selectedTab: number = 0;
  formNoButton: boolean = true;
  objectKey = Object.keys;
  dialogRef: any;
  dialogType: any;

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // FORM VALUE
  formLBValue = {
    kode_laporan: '',
    nama_laporan: ''
  }
  formNRValue = {
    kode_laporan: '',
    nama_laporan: ''
  }
  formAKValue = {
    kode_laporan: '',
    nama_laporan: '',
    id_akun: '',
    kode_akun: '',
    nama_akun: ''
  }

  // DYNAMIC VARIABLE
  buttonLBLayout = [
    {
      btnLabel: 'Tambah Akun',
      btnClass: 'btn btn-primary',
      btnClick: (type) => {
        this.openDialog("kode_akun", "lbrg", type)
      },
      btnCondition: () => {
        return true
      }
    },
    // {
    //   btnLabel: 'Ulang',
    //   btnClass: 'btn btn-secondary',
    //   btnClick: () => null,
    //   btnCondition: () => {
    //     return true
    //   }
    // }
  ]
  buttonNRLayout = [
    {
      btnLabel: 'Tambah Akun',
      btnClass: 'btn btn-primary',
      btnClick: (type) => {
        this.openDialog("kode_akun", "nr", type)
      },
      btnCondition: () => {
        return true
      }
    },
    // {
    //   btnLabel: 'Ulang',
    //   btnClass: 'btn btn-secondary',
    //   btnClick: () => null,
    //   btnCondition: () => {
    //     return true
    //   }
    // }
  ]
  buttonAKLayout = [
    {
      btnLabel: 'Tambah Akun',
      btnClass: 'btn btn-primary',
      btnClick: (type) => {
        this.openDialog("kode_akun", "ak", type)
      },
      btnCondition: () => {
        return true
      }
    },
    // {
    //   btnLabel: 'Ulang',
    //   btnClass: 'btn btn-secondary',
    //   btnClick: () => null,
    //   btnCondition: () => {
    //     return true
    //   }
    // }
  ]
  inputAkunDisplayColumns = [
    {
      label: 'Kode Akun',
      value: 'kode_akun'
    },
    {
      label: 'Nama Akun',
      value: 'nama_akun'
    }
  ]
  inputAkunData = []
  inputAkunTableRules = []
  selectedLBAkun = []
  selectedNRAkun = []
  selectedAKAkun = []
  laporanData = {}
  LBSetting = {}
  NRSetting = {}
  AKSetting = {}

  // LAYOUT
  inputLBLayout = [
    {
      formWidth: 'col-4',
      label: 'Kode Laporan',
      id: 'kode-laporan',
      type: 'input',
      valueOf: 'kode_laporan',
      required: false,
      readOnly: false,
      disabled: true,
      number: false,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-4',
      label: 'Nama Laporan',
      id: 'nama-laporan',
      type: 'input',
      valueOf: 'nama_laporan',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: true
      },
      inputPipe: true
    }
  ]
  inputNRLayout = [
    {
      formWidth: 'col-4',
      label: 'Kode Laporan',
      id: 'kode-laporan',
      type: 'input',
      valueOf: 'kode_laporan',
      required: false,
      readOnly: false,
      disabled: true,
      number: false,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-4',
      label: 'Nama Laporan',
      id: 'nama-laporan',
      type: 'input',
      valueOf: 'nama_laporan',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: true
      },
      inputPipe: true
    }
  ]
  inputAKLayout = [
    {
      formWidth: 'col-4',
      label: 'Kode Laporan',
      id: 'kode-laporan',
      type: 'input',
      valueOf: 'kode_laporan',
      required: false,
      readOnly: false,
      disabled: true,
      number: false,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-4',
      label: 'Nama Laporan',
      id: 'nama-laporan',
      type: 'input',
      valueOf: 'nama_laporan',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-4',
      label: 'Akun Kas',
      id: 'akun-kas',
      type: 'inputgroup',
      click: (type) => this.openADialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_akun',
      valueOf: 'kode_akun',
      required: false,
      readOnly: false,
      inputInfo: {
        id: 'nama-akun',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_akun'
      },
      blurOption: {
        ind: 'kode_akun',
        data: [],
        valueOf: ['id_akun', 'kode_akun', 'nama_akun'],
        onFound: null
      },
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
    this.gbl.need(true, true)
    this.sendRequestAkun()
    this.reqKodePerusahaan()
  }

  ngAfterViewInit(): void {
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    if (this.kode_perusahaan !== "") {
      this.sendRequestAkun()
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

        if (this.kode_perusahaan !== "") {
          this.sendRequestAkun()
        }
      }
    )
  }

  //Tab change event
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 2) {
      this.loadingLB = true
      this.loadingNR = true
      this.loadingAK = false
      this.ref.markForCheck()
    } else if (this.selectedTab == 1) {
      this.loadingLB = true
      this.loadingNR = false
      this.loadingAK = true
      this.ref.markForCheck()
    } else if (this.selectedTab == 0) {
      this.loadingLB = false
      this.loadingNR = true
      this.loadingAK = true
      this.ref.markForCheck()
    }

    // if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  }

  getBackToInput() {
    this.selectedTab = 0;
    //this.getDetail()
    this.formInputLBCheckChanges()
  }

  //Form submit
  onSubmit(type) {
    this.loading = true
    this.ref.markForCheck()
    if (type === 'lbrg') {
      let res = this.formLBValue
      res['kode_perusahaan'] = this.kode_perusahaan
      res['setting'] = JSON.stringify(this.LBSetting)
      this.request.apiData('setting-laporan', 'u-setting-laporan', res).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.openSnackBar('Berhasil disimpan.', 'success')
            this.madeRequest()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Gagal menyimpan setting laporan.', 'fail')
          }
        }
      )
    } else if (type === 'nr') {
      let res = this.formNRValue
      res['kode_perusahaan'] = this.kode_perusahaan
      res['setting'] = JSON.stringify(this.NRSetting)
      this.request.apiData('setting-laporan', 'u-setting-laporan', res).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.openSnackBar('Berhasil disimpan.', 'success')
            this.madeRequest()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Gagal menyimpan setting laporan.', 'fail')
          }
        }
      )
    } else if (type === 'ak') {
      this.formAKValue = this.forminputAK.getData()
      let res = this.formAKValue
      res['kode_perusahaan'] = this.kode_perusahaan
      this.AKSetting['id_akun'] = this.formAKValue['id_akun']
      res['setting'] = JSON.stringify(this.AKSetting)
      this.request.apiData('setting-laporan', 'u-setting-laporan', res).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.openSnackBar('Berhasil disimpan.', 'success')
            this.madeRequest()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Gagal menyimpan setting laporan.', 'fail')
          }
        }
      )
    }
  }

  //Reset Value
  resetForm() {
    this.gbl.topPage()

    // this.detailData = []
    this.formInputLBCheckChanges()
  }

  onCancel() {
    this.resetForm()
    // this.datatable == undefined ? null : this.datatable.reset()
  }

  // Dialog
  openADialog(type) {
    this.gbl.topPage()
    this.dialogType = JSON.parse(JSON.stringify(type))
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: '70vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '90px' },
      data: {
        type: type,
        tableInterface:
          type === "kode_akun" ? {} :
            {},
        displayedColumns:
          type === "kode_akun" ? this.inputAkunDisplayColumns :
            [],
        tableData:
          type === "kode_akun" ? this.inputAkunData :
            [],
        tableRules:
          type === "kode_akun" ? [] :
            [],
        formValue: this.formAKValue,
        loadingData: type === "kode_akun" ? this.loadingAkun : null,
        sizeCont: 320
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_akun") {
          if (this.forminputAK !== undefined) {
            this.forminputAK.updateFormValue('id_akun', result.id_akun)
            this.forminputAK.updateFormValue('kode_akun', result.kode_akun)
            this.forminputAK.updateFormValue('nama_akun', result.nama_akun)
          }
        }
        this.ref.markForCheck();
      }
      this.dialogRef = undefined;
      this.dialogType = undefined;
    });
  }

  openDialog(type, st, ft) {
    let topPst = ft === 'al' || ft === 'at' || ft === 'akao' || ft === 'akai' ? '90px' : ft === 'k' || ft === 'e' || ft === 'akap' ? '540px' : '90px',
      screenPst = ft === 'al' || ft === 'at' || ft === 'akao' || ft === 'akai' ? 90 : ft === 'k' || ft === 'e' || ft === 'akap' ? 540 : 90
    this.gbl.screenPosition(screenPst)
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '70vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: topPst },
      data: {
        type: type,
        tableInterface: {},
        displayedColumns:
          type === "kode_akun" ? this.inputAkunDisplayColumns :
            [],
        tableData:
          type === "kode_akun" ? (
            st === "lbrg" ? this.inputAkunData.filter(x => !this.selectedLBAkun.includes(x['id_akun'])) :
              st === "nr" ? this.inputAkunData.filter(x => !this.selectedNRAkun.includes(x['id_akun'])) :
                st === "ak" ? this.inputAkunData.filter(x => !this.selectedAKAkun.includes(x['id_akun'])) :
                  this.inputAkunData
          ) :
            [],
        tableRules:
          type === "kode_akun" ? this.inputAkunTableRules :
            [],
        formValue: {},
        sizeCont: 320
      }
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_akun") {
          if (st === "lbrg") {
            this.loadingLB = true
            this.ref.markForCheck()

            this.LBSetting['daftarPengakuanNilai'][ft].push(result)
            this.selectedLBAkun.push(result['id_akun'])

            setTimeout(() => {
              this.loadingLB = false
              this.ref.markForCheck()
            }, 500)
          } else if (st === "nr") {
            this.loadingNR = true
            this.ref.markForCheck()

            this.NRSetting['daftarPengakuanNilai'][ft].push(result)
            this.selectedNRAkun.push(result['id_akun'])

            setTimeout(() => {
              this.loadingNR = false
              this.ref.markForCheck()
            }, 500)
          } else if (st === "ak") {
            this.loadingAK = true
            this.ref.markForCheck()

            this.AKSetting['daftarPengakuanNilai'][ft].push(result)
            this.selectedAKAkun.push(result['id_akun'])

            setTimeout(() => {
              this.loadingAK = false
              this.ref.markForCheck()
            }, 500)
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  delDetailData(e, st, ft) {
    if (st === "lbrg") {
      this.loadingLB = true
      this.ref.markForCheck()

      this.selectedLBAkun = this.selectedLBAkun.filter(x => x['id_akun'] !== e['id_akun'])
      this.LBSetting['daftarPengakuanNilai'][ft] = this.LBSetting['daftarPengakuanNilai'][ft].filter(x => x['id_akun'] !== e['id_akun'])

      setTimeout(() => {
        this.loadingLB = false
        this.ref.markForCheck()
      }, 500)
    } else if (st === "nr") {
      this.loadingNR = true
      this.ref.markForCheck()

      this.selectedNRAkun = this.selectedNRAkun.filter(x => x['id_akun'] !== e['id_akun'])
      this.NRSetting['daftarPengakuanNilai'][ft] = this.NRSetting['daftarPengakuanNilai'][ft].filter(x => x['id_akun'] !== e['id_akun'])

      setTimeout(() => {
        this.loadingNR = false
        this.ref.markForCheck()
      }, 500)
    } else if (st === "ak") {
      this.loadingAK = true
      this.ref.markForCheck()

      this.selectedAKAkun = this.selectedAKAkun.filter(x => x['id_akun'] !== e['id_akun'])
      this.AKSetting['daftarPengakuanNilai'][ft] = this.AKSetting['daftarPengakuanNilai'][ft].filter(x => x['id_akun'] !== e['id_akun'])

      setTimeout(() => {
        this.loadingAK = false
        this.ref.markForCheck()
      }, 500)
    }
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "" && this.kode_perusahaan != null) {
      this.request.apiData('setting-laporan', 'g-setting-laporan', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            for (var i = 0; i < data['RESULT'].length; i++) {
              this.laporanData[data['RESULT'][i]['kode_laporan']] = data['RESULT'][i]
            }
            if (this.laporanData['LBRG'] !== undefined) {
              this.formLBValue = {
                kode_laporan: this.laporanData['LBRG']['kode_laporan'],
                nama_laporan: this.laporanData['LBRG']['nama_laporan']
              }
              this.LBSetting = JSON.parse(this.laporanData['LBRG']['setting'])
            }
            if (this.laporanData['NR'] !== undefined) {
              this.formNRValue = {
                kode_laporan: this.laporanData['NR']['kode_laporan'],
                nama_laporan: this.laporanData['NR']['nama_laporan']
              }
              this.NRSetting = JSON.parse(this.laporanData['NR']['setting'])
            }
            if (this.laporanData['AK'] !== undefined) {
              this.AKSetting = JSON.parse(this.laporanData['AK']['setting'])
              let akun = this.inputAkunData.filter(x => x['id_akun'] === (this.AKSetting['id_akun'] === undefined ? "" : this.AKSetting['id_akun']))
              this.formAKValue = {
                kode_laporan: this.laporanData['AK']['kode_laporan'],
                nama_laporan: this.laporanData['AK']['nama_laporan'],
                id_akun: this.AKSetting['id_akun'],
                kode_akun: akun.length > 0 ? akun[0]['kode_akun'] : "",
                nama_akun: akun.length > 0 ? akun[0]['nama_akun'] : ""
              }
            }
            this.loading = false
            this.ref.markForCheck()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Gagal mendapatkan pengaturan laporan. Mohon coba beberapa saat lagi.', 'fail')
          }
        }
      )
    }
  }

  sendRequestAkun() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "" && this.kode_perusahaan != null) {
      this.request.apiData('akun', 'g-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputAkunData = data['RESULT']
            this.madeRequest()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Gagal mendapatkan daftar akun.', 'fail')
          }
        }
      )
    }
  }

  openSnackBar(message, type?: any, onCloseFunc?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '120px' },
      data: {
        type: type === undefined || type == null ? '' : type,
        message: message === undefined || message == null ? '' : message.charAt(0).toUpperCase() + message.substr(1).toLowerCase(),
        onCloseFunc: onCloseFunc === undefined || onCloseFunc == null ? null : () => onCloseFunc()
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      this.dialog.closeAll()
    })
  }

  formInputLBCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminputLB === undefined ? null : this.forminputLB.checkChanges()
    }, 1)
  }

}
