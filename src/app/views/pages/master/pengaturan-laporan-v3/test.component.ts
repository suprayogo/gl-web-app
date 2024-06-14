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
// import { log } from 'console';

const content = {
  beforeCodeTitle: 'Pengaturan Pengakuan Nilai V3'
}

@Component({
  selector: 'kt-pengaturan-laporan-v3',
  templateUrl: './pengaturan-laporan-v3.component.html',
  styleUrls: ['./pengaturan-laporan-v3.component.scss']
})
export class PengaturanLaporanV3Component implements OnInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild('lb', { static: false }) forminputLB;
  @ViewChild('ak', { static: false }) forminputAK;
  @ViewChild(ForminputComponent, { static: false }) forminput;

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
  selectedKodeAkun: Set<string> = new Set();
  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // FORM VALUE
  formLBValue = {
    kode_laporan: '',
    nama_laporan: '',
    jenis_laporan: '0'
  }
  formNRValue = {
    kode_laporan: '',
    nama_laporan: '',
    jenis_laporan: '0'
  }
  formAKValue = {
    kode_laporan: '',
    nama_laporan: '',
    id_akun: '',
    kode_akun: '',
    nama_akun: '',
    jenis_laporan: '0'
  }

  jenis_laporanAK = [
    {
      label: 'Rekap Arus Kas Langsung',
      value: '0'
    },
    {
      label: 'Rincian Arus Kas Langsung',
      value: '1'
    },
    {
      label: 'Rekap Arus Kas Tidak Langsung',
      value: '2'
    },
    {
      label: 'Rincian Arus Kas Tidak Langsung',
      value: '3'
    }
  ]

  jenis_laporanNR = [
    {
      label: 'Rekap Neraca',
      value: '0'
    },
    {
      label: 'Rincian Neraca',
      value: '1'
    }
  ]

  jenis_laporanLB = [
    {
      label: 'Rekap Laba Rugi',
      value: '0'
    },
    {
      label: 'Rincian Laba Rugi Perpertual',
      value: '1'
    },
    {
      label: 'Rincian Laba Rugi Periodik',
      value: '2'
    }
  ]

  // DYNAMIC VARIABLE
  buttonLBLayout = [
    {
      btnLabel: 'Tambah Akun',
      btnClass: 'btn btn-primary',
      btnClick: (type) => {
        this.openDialog("kode_akun", "lbrg", type)
        console.log("INI ADALAH BUTTON TAMBAH AKUN UNTUK OPEN DIALOG : "
, this.openADialog
        );
        
      },
      btnCondition: () => {
        return true
      }
    }
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
    }
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
    }
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
    },
    {
      formWidth: 'col-4',
      label: 'Jenis Laporan',
      id: 'jenis-laporan',
      type: 'combobox',
      options: this.jenis_laporanLB,
      valueOf: 'jenis_laporan',
      required: true,
      readOnly: false,
      disabled: false,
      onSelectFunc: (value) => {
        this.changeJenisLB(value)
      }
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
    },
    {
      formWidth: 'col-4',
      label: 'Jenis Laporan',
      id: 'jenis-laporan',
      type: 'combobox',
      options: this.jenis_laporanNR,
      valueOf: 'jenis_laporan',
      required: true,
      readOnly: false,
      disabled: false,
      onSelectFunc: (value) => {
        this.changeJenisNR(value)
      }
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
      label: 'Jenis Laporan',
      id: 'jenis-laporan',
      type: 'combobox',
      options: this.jenis_laporanAK,
      valueOf: 'jenis_laporan',
      required: true,
      readOnly: false,
      disabled: false,
      onSelectFunc: (value) => {
        this.changeJenisAK(value)
      }
    },
    // {
    //   formWidth: 'col-4',
    //   label: 'Akun Kas',
    //   id: 'akun-kas',
    //   type: 'inputgroup',
    //   click: (type) => this.openADialog(type),
    //   btnLabel: '',
    //   btnIcon: 'flaticon-search',
    //   browseType: 'kode_akun',
    //   valueOf: 'kode_akun',
    //   required: false,
    //   readOnly: false,
    //   inputInfo: {
    //     id: 'nama-akun',
    //     disabled: false,
    //     readOnly: true,
    //     required: false,
    //     valueOf: 'nama_akun'
    //   },
    //   blurOption: {
    //     ind: 'kode_akun',
    //     data: [],
    //     valueOf: ['id_akun', 'kode_akun', 'nama_akun'],
    //     onFound: null
    //   },
    //   update: {
    //     disabled: false
    //   }
    // },
  ]

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    
    this.loadSelectedKodeAkun();
    this.content = content // <-- Init the content
    this.gbl.need(true, false)
    this.sendRequestAkun()
    this.reqKodePerusahaan()
  }

  loadSelectedKodeAkun(): void {
    const storedData = localStorage.getItem('selectedKodeAkun');
    if (storedData) {
      this.selectedKodeAkun = new Set(JSON.parse(storedData));
    }
  }

  saveSelectedKodeAkun(): void {
    localStorage.setItem('selectedKodeAkun', JSON.stringify(Array.from(this.selectedKodeAkun)));
    console.log("INI ADALAH SAVE SELECT KODE AKUN :", this.saveSelectedKodeAkun);
    
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
          console.log("INI ADALAH OnSubmit :", data);
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


/*--------------------------------------------------------------
# Dialog
--------------------------------------------------------------*/


// Open Diaglog
openADialog(type) {
  this.gbl.topPage()
  this.dialogType = JSON.parse(JSON.stringify(type))
  console.log("INI GBL.TopPage :" + this.gbl.topPage, " INI Dialog Type :" + this.dialogType);

  const filteredData = this.inputAkunData.filter(data => !this.selectedKodeAkun.has(data.id_akun));

  this.dialogRef = this.dialog.open(DialogComponent, {
    width: '70vw',
    height: 'auto',
    maxWidth: '95vw',
    maxHeight: '95vh',
    backdropClass: 'bg-dialog',
    position: { top: '90px' },
    data: {
      type: type,
      tableInterface: type === "kode_akun" ? {} : {},
      displayedColumns: type === "kode_akun" ? this.inputAkunDisplayColumns : [],
      tableData: type === "kode_akun" ? filteredData : [],
      tableRules: type === "kode_akun" ? [] : [],
      formValue: this.formAKValue,
      loadingData: type === "kode_akun" ? this.loadingAkun : null,
      sizeCont: 320
    }
  });


  this.dialogRef.afterClosed().subscribe(result => {
    if (result) {
      if (type === "kode_akun") {
        this.selectedKodeAkun.add(result.id_akun);
        this.saveSelectedKodeAkun();
        console.log("INI ADALAH RESULT :" ,result);
        


        if (this.forminputAK !== undefined) {
          this.forminputAK.updateFormValue('id_akun', result.id_akun);
          this.forminputAK.updateFormValue('kode_akun', result.kode_akun);
          this.forminputAK.updateFormValue('nama_akun', result.nama_akun);
        }
      }
      this.ref.markForCheck();
    }
    this.dialogRef = undefined;
    this.dialogType = undefined;
  });
}


openDialog(type, st, ft) {
  let lv1 = 125, lv2 = 505, lv3 = 885, lv4 = 1265,
    topPst =
      ft === 'pn' || ft === 'hpp' || ft === 'al' || ft === 'at' || ft === 'ak' || ft === 'psv' ? lv1 + 'px' :
      ft === 'pu' || ft === 'bp' || ft === 'atb' || ft === 'hl' || ft === 'bdp' || ft === 'bp' ? lv2 + 'px' :
      ft === 'adu' || ft === 'plu' || ft === 'hjp' || ft === 'ms' || ft === 'bau' ? lv3 + 'px' :
      ft === 'blu' || ft === 'lr' || ft === 'inv' || ft === 'pdn' || ft === 'bpp' ? this.formAKValue.jenis_laporan === "0" || this.formAKValue.jenis_laporan === "1" ? lv4 + 'px' : lv3 + 'px' : '20px',

    screenPst =
      ft === 'pn' || ft === 'hpp' || ft === 'al' || ft === 'at' || ft === 'ak' || ft === 'psv' ? lv1 :
      ft === 'pu' || ft === 'bp' || ft === 'atb' || ft === 'hl' || ft === 'bdp' || ft === 'bp' ? lv2 :
      ft === 'adu' || ft === 'plu' || ft === 'hjp' || ft === 'ms' || ft === 'bau' ? lv3 :
      ft === 'blu' || ft === 'lr' || ft === 'inv' || ft === 'pdn' || ft === 'bpp' ? this.formAKValue.jenis_laporan === "0" || this.formAKValue.jenis_laporan === "1" ? lv4 : lv3 : 20
  this.gbl.screenPosition(screenPst)

  console.log("ININ ADALAH GBL SCREEN POSITION : " + this.gbl.screenPosition);
  const filteredData = this.inputAkunData.filter(data => !this.selectedKodeAkun.has(data.id_akun));

  console.log("INI ADALAH FILTERDATA : " ,filteredData);
  

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
      displayedColumns: type === "kode_akun" ? this.inputAkunDisplayColumns : [],
      tableData: type === "kode_akun" ? (
        st === "lbrg" ? filteredData.filter(x => !this.selectedLBAkun.includes(x['id_akun'])) :
        st === "nr" ? filteredData.filter(x => !this.selectedNRAkun.includes(x['id_akun'])) :
        st === "ak" ? filteredData.filter(x => !this.selectedAKAkun.includes(x['id_akun'])) :
        filteredData
      ) : [],
      tableRules: type === "kode_akun" ? this.inputAkunTableRules : [],
      formValue: {},
      sizeCont: 320
    }
  })

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      let x = {
        id_akun: result.id_akun,
        kode_akun: result.kode_akun,
        nama_akun: result.nama_akun,
        tipe_akun: result.tipe_akun,
        level_akun: result.level_akun,
        id_induk_akun: result.id_induk_akun,
        kode_induk_akun: result.kode_induk_akun,
        nama_induk_akun: result.nama_induk_akun,
        tipe_induk: result.tipe_induk,
        id_kategori_akun: result.id_kategori_akun,
        kode_kategori_akun: result.kode_kategori_akun,
        nama_kategori_akun: result.nama_kategori_akun
      }
      if (type === "kode_akun") {
        this.selectedKodeAkun.add(x.id_akun);
        this.saveSelectedKodeAkun();
        if (st === "lbrg") {
          this.loadingLB = true
          this.ref.markForCheck()
          this.LBSetting['daftarPengakuanNilai'][ft].push(x)
          this.selectedLBAkun.push(x.id_akun)

          setTimeout(() => {
            this.loadingLB = false
            this.ref.markForCheck()
          }, 500)
        } else if (st === "nr") {
          this.loadingNR = true
          this.ref.markForCheck()

          this.NRSetting['daftarPengakuanNilai'][ft].push(x)
          this.selectedNRAkun.push(x.id_akun)

          setTimeout(() => {
            this.loadingNR = false
            this.ref.markForCheck()
          }, 500)
        } else if (st === "ak") {
          this.loadingAK = true
          this.ref.markForCheck()

          this.AKSetting['daftarPengakuanNilai'][ft].push(x)
          this.selectedAKAkun.push(x.id_akun)

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


  
  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "" && this.kode_perusahaan != null) {
      this.request.apiData('setting-laporan', 'g-setting-laporan', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            for (var i = 0; i < data['RESULT'].length; i++) {
              this.laporanData[data['RESULT'][i]['kode_laporan']] = data['RESULT'][i]
            }

            if (this.formLBValue.jenis_laporan === "0") {
              if (this.laporanData['RPLBRG-RE'] !== undefined) {
                this.formLBValue.kode_laporan = this.laporanData['RPLBRG-RE']['kode_laporan']
                this.formLBValue.nama_laporan = this.laporanData['RPLBRG-RE']['nama_laporan']
                this.LBSetting = JSON.parse(this.laporanData['RPLBRG-RE']['setting'])
              }
            } else if (this.formLBValue.jenis_laporan === "1") {
              if (this.laporanData['RPLBRG-DT-PT'] !== undefined) {
                this.formLBValue.kode_laporan = this.laporanData['RPLBRG-DT-PT']['kode_laporan']
                this.formLBValue.nama_laporan = this.laporanData['RPLBRG-DT-PT']['nama_laporan']
                this.LBSetting = JSON.parse(this.laporanData['RPLBRG-DT-PT']['setting'])
              }
            } else {
              if (this.laporanData['RPLBRG-DT-PR'] !== undefined) {
                this.formLBValue.kode_laporan = this.laporanData['RPLBRG-DT-PR']['kode_laporan']
                this.formLBValue.nama_laporan = this.laporanData['RPLBRG-DT-PR']['nama_laporan']
                this.LBSetting = JSON.parse(this.laporanData['RPLBRG-DT-PR']['setting'])
              }
            }

            if (this.formNRValue.jenis_laporan === "0") {
              if (this.laporanData['RPNRC-RE'] !== undefined) {
                this.formNRValue.kode_laporan = this.laporanData['RPNRC-RE']['kode_laporan']
                this.formNRValue.nama_laporan = this.laporanData['RPNRC-RE']['nama_laporan']
                this.NRSetting = JSON.parse(this.laporanData['RPNRC-RE']['setting'])
              }
            } else {
              if (this.laporanData['RPNRC-DT'] !== undefined) {
                this.formNRValue.kode_laporan = this.laporanData['RPNRC-DT']['kode_laporan']
                this.formNRValue.nama_laporan = this.laporanData['RPNRC-DT']['nama_laporan']
                this.NRSetting = JSON.parse(this.laporanData['RPNRC-DT']['setting'])
              }
            }

            if (this.formAKValue.jenis_laporan === "0") {
              if (this.laporanData['RPAKLR-RE'] !== undefined) {
                this.AKSetting = JSON.parse(this.laporanData['RPAKLR-RE']['setting'])
                let akun = this.inputAkunData.filter(x => x['id_akun'] === (this.AKSetting['id_akun'] === undefined ? "" : this.AKSetting['id_akun']))
                this.formAKValue.kode_laporan = this.laporanData['RPAKLR-RE']['kode_laporan']
                this.formAKValue.nama_laporan = this.laporanData['RPAKLR-RE']['nama_laporan']
                this.formAKValue.id_akun = this.AKSetting['id_akun']
                this.formAKValue.kode_akun = akun.length > 0 ? akun[0]['kode_akun'] : ""
                this.formAKValue.nama_akun = akun.length > 0 ? akun[0]['nama_akun'] : ""
              }
            } else if (this.formAKValue.jenis_laporan === "1") {
              if (this.laporanData['RPAKLR-DT'] !== undefined) {
                this.AKSetting = JSON.parse(this.laporanData['RPAKLR-DT']['setting'])
                let akun = this.inputAkunData.filter(x => x['id_akun'] === (this.AKSetting['id_akun'] === undefined ? "" : this.AKSetting['id_akun']))
                this.formAKValue.kode_laporan = this.laporanData['RPAKLR-DT']['kode_laporan']
                this.formAKValue.nama_laporan = this.laporanData['RPAKLR-DT']['nama_laporan']
                this.formAKValue.id_akun = this.AKSetting['id_akun']
                this.formAKValue.kode_akun = akun.length > 0 ? akun[0]['kode_akun'] : ""
                this.formAKValue.nama_akun = akun.length > 0 ? akun[0]['nama_akun'] : ""
              }
            } else if (this.formAKValue.jenis_laporan === "2") {
              if (this.laporanData['RPAKTL-RE'] !== undefined) {
                this.AKSetting = JSON.parse(this.laporanData['RPAKTL-RE']['setting'])
                let akun = this.inputAkunData.filter(x => x['id_akun'] === (this.AKSetting['id_akun'] === undefined ? "" : this.AKSetting['id_akun']))
                this.formAKValue.kode_laporan = this.laporanData['RPAKTL-RE']['kode_laporan']
                this.formAKValue.nama_laporan = this.laporanData['RPAKTL-RE']['nama_laporan']
                this.formAKValue.id_akun = this.AKSetting['id_akun']
                this.formAKValue.kode_akun = akun.length > 0 ? akun[0]['kode_akun'] : ""
                this.formAKValue.nama_akun = akun.length > 0 ? akun[0]['nama_akun'] : ""
              }
            } else if (this.formAKValue.jenis_laporan === "3") {
              if (this.laporanData['RPAKTL-DT'] !== undefined) {
                this.AKSetting = JSON.parse(this.laporanData['RPAKTL-DT']['setting'])
                let akun = this.inputAkunData.filter(x => x['id_akun'] === (this.AKSetting['id_akun'] === undefined ? "" : this.AKSetting['id_akun']))
                this.formAKValue.kode_laporan = this.laporanData['RPAKTL-DT']['kode_laporan']
                this.formAKValue.nama_laporan = this.laporanData['RPAKTL-DT']['nama_laporan']
                this.formAKValue.id_akun = this.AKSetting['id_akun']
                this.formAKValue.kode_akun = akun.length > 0 ? akun[0]['kode_akun'] : ""
                this.formAKValue.nama_akun = akun.length > 0 ? akun[0]['nama_akun'] : ""
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

  changeJenisLB(type) {
    this.formLBValue.jenis_laporan = type
    this.forminputLB.getData()['jenis_laporan'] = type
    if (type === "0") {
      if (this.laporanData['RPLBRG-RE'] !== undefined) {
        this.formLBValue.kode_laporan = this.laporanData['RPLBRG-RE']['kode_laporan']
        this.formLBValue.nama_laporan = this.laporanData['RPLBRG-RE']['nama_laporan']
        this.LBSetting = JSON.parse(this.laporanData['RPLBRG-RE']['setting'])

        this.forminputLB.getData()['kode_laporan'] = this.laporanData['RPLBRG-RE']['kode_laporan']
        this.forminputLB.getData()['nama_laporan'] = this.laporanData['RPLBRG-RE']['nama_laporan']
      }
    } else if (type === "1") {
      if (this.laporanData['RPLBRG-DT-PT'] !== undefined) {
        this.formLBValue.kode_laporan = this.laporanData['RPLBRG-DT-PT']['kode_laporan']
        this.formLBValue.nama_laporan = this.laporanData['RPLBRG-DT-PT']['nama_laporan']
        this.LBSetting = JSON.parse(this.laporanData['RPLBRG-DT-PT']['setting'])

        this.forminputLB.getData()['kode_laporan'] = this.laporanData['RPLBRG-DT-PT']['kode_laporan']
        this.forminputLB.getData()['nama_laporan'] = this.laporanData['RPLBRG-DT-PT']['nama_laporan']
      }
    } else {
      if (this.laporanData['RPLBRG-DT-PR'] !== undefined) {
        this.formLBValue.kode_laporan = this.laporanData['RPLBRG-DT-PR']['kode_laporan']
        this.formLBValue.nama_laporan = this.laporanData['RPLBRG-DT-PR']['nama_laporan']
        this.LBSetting = JSON.parse(this.laporanData['RPLBRG-DT-PR']['setting'])

        this.forminputLB.getData()['kode_laporan'] = this.laporanData['RPLBRG-DT-PR']['kode_laporan']
        this.forminputLB.getData()['nama_laporan'] = this.laporanData['RPLBRG-DT-PR']['nama_laporan']
      }
    }
  }

  changeJenisNR(type) {
    this.formNRValue.jenis_laporan = type
    this.forminput.getData()['jenis_laporan'] = type
    if (type === "0") {
      if (this.laporanData['RPNRC-RE'] !== undefined) {
        this.formNRValue.kode_laporan = this.laporanData['RPNRC-RE']['kode_laporan']
        this.formNRValue.nama_laporan = this.laporanData['RPNRC-RE']['nama_laporan']
        this.NRSetting = JSON.parse(this.laporanData['RPNRC-RE']['setting'])

        this.forminput.getData()['kode_laporan'] = this.laporanData['RPNRC-RE']['kode_laporan']
        this.forminput.getData()['nama_laporan'] = this.laporanData['RPNRC-RE']['nama_laporan']
      }
    } else {
      if (this.laporanData['RPNRC-DT'] !== undefined) {
        this.formNRValue.kode_laporan = this.laporanData['RPNRC-DT']['kode_laporan']
        this.formNRValue.nama_laporan = this.laporanData['RPNRC-DT']['nama_laporan']
        this.NRSetting = JSON.parse(this.laporanData['RPNRC-DT']['setting'])

        this.forminput.getData()['kode_laporan'] = this.laporanData['RPNRC-DT']['kode_laporan']
        this.forminput.getData()['nama_laporan'] = this.laporanData['RPNRC-DT']['nama_laporan']
      }
    }
  }

  changeJenisAK(type) {
    this.formAKValue.jenis_laporan = type
    this.forminputAK.getData()['jenis_laporan'] = type
    if (type === "0") {
      if (this.laporanData['RPAKLR-RE'] !== undefined) {
        this.AKSetting = JSON.parse(this.laporanData['RPAKLR-RE']['setting'])
        let akun = this.inputAkunData.filter(x => x['id_akun'] === (this.AKSetting['id_akun'] === undefined ? "" : this.AKSetting['id_akun']))
        this.formAKValue.kode_laporan = this.laporanData['RPAKLR-RE']['kode_laporan']
        this.formAKValue.nama_laporan = this.laporanData['RPAKLR-RE']['nama_laporan']
        this.formAKValue.id_akun = this.AKSetting['id_akun']
        this.formAKValue.kode_akun = akun.length > 0 ? akun[0]['kode_akun'] : ""
        this.formAKValue.nama_akun = akun.length > 0 ? akun[0]['nama_akun'] : ""

        // Refresh
        this.forminputAK.getData()['kode_laporan'] = this.laporanData['RPAKLR-RE']['kode_laporan']
        this.forminputAK.getData()['nama_laporan'] = this.laporanData['RPAKLR-RE']['nama_laporan']
        this.forminputAK.getData()['id_akun'] = this.AKSetting['id_akun']
        this.forminputAK.getData()['kode_akun'] = akun.length > 0 ? akun[0]['kode_akun'] : ""
        this.forminputAK.getData()['nama_akun'] = akun.length > 0 ? akun[0]['nama_akun'] : ""
      }
    } else if (type === "1") {
      if (this.laporanData['RPAKLR-DT'] !== undefined) {
        this.AKSetting = JSON.parse(this.laporanData['RPAKLR-DT']['setting'])
        let akun = this.inputAkunData.filter(x => x['id_akun'] === (this.AKSetting['id_akun'] === undefined ? "" : this.AKSetting['id_akun']))
        this.formAKValue.kode_laporan = this.laporanData['RPAKLR-DT']['kode_laporan']
        this.formAKValue.nama_laporan = this.laporanData['RPAKLR-DT']['nama_laporan']
        this.formAKValue.id_akun = this.AKSetting['id_akun']
        this.formAKValue.kode_akun = akun.length > 0 ? akun[0]['kode_akun'] : ""
        this.formAKValue.nama_akun = akun.length > 0 ? akun[0]['nama_akun'] : ""

        // Refresh
        this.forminputAK.getData()['kode_laporan'] = this.laporanData['RPAKLR-DT']['kode_laporan']
        this.forminputAK.getData()['nama_laporan'] = this.laporanData['RPAKLR-DT']['nama_laporan']
        this.forminputAK.getData()['id_akun'] = this.AKSetting['id_akun']
        this.forminputAK.getData()['kode_akun'] = akun.length > 0 ? akun[0]['kode_akun'] : ""
        this.forminputAK.getData()['nama_akun'] = akun.length > 0 ? akun[0]['nama_akun'] : ""
      }
    } else if (type === "2") {
      if (this.laporanData['RPAKTL-RE'] !== undefined) {
        this.AKSetting = JSON.parse(this.laporanData['RPAKTL-RE']['setting'])
        let akun = this.inputAkunData.filter(x => x['id_akun'] === (this.AKSetting['id_akun'] === undefined ? "" : this.AKSetting['id_akun']))
        this.formAKValue.kode_laporan = this.laporanData['RPAKTL-RE']['kode_laporan']
        this.formAKValue.nama_laporan = this.laporanData['RPAKTL-RE']['nama_laporan']
        this.formAKValue.id_akun = this.AKSetting['id_akun']
        this.formAKValue.kode_akun = akun.length > 0 ? akun[0]['kode_akun'] : ""
        this.formAKValue.nama_akun = akun.length > 0 ? akun[0]['nama_akun'] : ""

        // Refresh
        this.forminputAK.getData()['kode_laporan'] = this.laporanData['RPAKTL-RE']['kode_laporan']
        this.forminputAK.getData()['nama_laporan'] = this.laporanData['RPAKTL-RE']['nama_laporan']
        this.forminputAK.getData()['id_akun'] = this.AKSetting['id_akun']
        this.forminputAK.getData()['kode_akun'] = akun.length > 0 ? akun[0]['kode_akun'] : ""
        this.forminputAK.getData()['nama_akun'] = akun.length > 0 ? akun[0]['nama_akun'] : ""
      }
    } else if (type === "3") {
      if (this.laporanData['RPAKTL-DT'] !== undefined) {
        this.AKSetting = JSON.parse(this.laporanData['RPAKTL-DT']['setting'])
        let akun = this.inputAkunData.filter(x => x['id_akun'] === (this.AKSetting['id_akun'] === undefined ? "" : this.AKSetting['id_akun']))
        this.formAKValue.kode_laporan = this.laporanData['RPAKTL-DT']['kode_laporan']
        this.formAKValue.nama_laporan = this.laporanData['RPAKTL-DT']['nama_laporan']
        this.formAKValue.id_akun = this.AKSetting['id_akun']
        this.formAKValue.kode_akun = akun.length > 0 ? akun[0]['kode_akun'] : ""
        this.formAKValue.nama_akun = akun.length > 0 ? akun[0]['nama_akun'] : ""

        // Refresh
        this.forminputAK.getData()['kode_laporan'] = this.laporanData['RPAKTL-DT']['kode_laporan']
        this.forminputAK.getData()['nama_laporan'] = this.laporanData['RPAKTL-DT']['nama_laporan']
        this.forminputAK.getData()['id_akun'] = this.AKSetting['id_akun']
        this.forminputAK.getData()['kode_akun'] = akun.length > 0 ? akun[0]['kode_akun'] : ""
        this.forminputAK.getData()['nama_akun'] = akun.length > 0 ? akun[0]['nama_akun'] : ""
      }
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
