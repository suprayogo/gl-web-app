import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// API Service
import { RequestDataService } from '../../../../service/request-data.service';

// Global Variable Service
import { GlobalVariableService } from '../../../../service/global-variable.service';

// Components
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';


// Title Menu Variable
const content = {
  beforeCodeTitle: 'Pengajuan Buka Periode Kasir'
}

@Component({
  selector: 'kt-pengajuan-buka-periode-kasir',
  templateUrl: './pengajuan-buka-periode-kasir.component.html',
  styleUrls: ['./pengajuan-buka-periode-kasir.component.scss', '../master.style.scss']
})
export class PengajuanBukaPeriodeKasirComponent implements OnInit, AfterViewInit {

  // View Child to Call Function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Others Variable
  loading: boolean = true;
  loadingPeriodeKasir: boolean = false;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = true;
  editable: boolean = false;
  selectedTab: number = 0;
  tableLoad: boolean = true;
  onUpdate: boolean = false;
  disableSubmit: boolean = false;
  enableCancel: boolean = true;
  browseNeedUpdate: boolean = true;
  search: string;
  dialogRef: any;
  dialogType: string = null;
  bulanTahun: any;
  batal_alasan: any = "";
  setBatal: boolean = false;

  // Perusahaan Global Variable
  subPerusahaan: any;
  kode_perusahaan: any;

  // Setting Button Variable
  buttonLayout = [
    {
      btnLabel: 'Pilih Tanggal Pengajuan',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.openDialog('id_periode')
      },
      btnCondition: () => {
        return true
      }
    }
  ]

  // Confirmation Dialog Variable
  c_buttonLayout = [
    {
      btnLabel: 'Batalkan Pengajuan',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.cancelTran()
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
      content: 'Yakin akan membatalkan data pengajuan ?',
      style: {
        'color': 'red',
        'font-size': '18px',
        'font-weight': 'bold'
      }
    }
  ]

  // Tab Menu: "Browse" Variable
  displayedColumnsTable = [
    {
      label: 'Cabang',
      value: 'nama_cabang'
    },
    {
      label: 'No. Transaksi',
      value: 'no_tran'
    },
    {
      label: 'Tgl. Transaksi',
      value: 'tgl_tran',
      date: true
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Diinput oleh',
      value: 'input_by'
    },
    {
      label: 'Diinput tanggal',
      value: 'input_dt',
      date: true
    },
    {
      label: 'Diupdate oleh',
      value: 'update_by'
    },
    {
      label: 'Diupdate tanggal',
      value: 'update_dt',
      date: true
    }
  ];
  browseInterface = {
    // STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []
  // -----------------

  // L.O.V Periode Variable
  inputPeriodeDisplayColumns = [
    {
      label: 'Bulan Periode',
      value: 'bulan_periode'
    },
    {
      label: 'Tahun Periode',
      value: 'tahun_periode'
    },
    {
      label: 'Status Periode',
      value: 'aktif_sub'
    },
    {
      label: 'Tutup Sementara',
      value: 'tutup_sementara_sub'
    },
  ]
  inputPeriodeInterface = {
    bulan_periode: 'string',
    tahun_periode: 'string'
  }
  inputPeriodeData = []
  inputPeriodeDataRules = [
    {
      target: 'aktif',
      replacement: {
        '1': 'Aktif',
        '0': 'Nonaktif'
      },
      redefined: 'aktif_sub'
    },
    {
      target: 'tutup_sementara',
      replacement: {
        '1': 'Aktif',
        '0': 'Nonaktif'
      },
      redefined: 'tutup_sementara_sub'
    },

  ]
  // ----------------------

  // L.O.V Cabang Variable
  inputCabangDisplayColumns = [
    {
      label: 'Kode Cabang',
      value: 'kode_cabang'
    },
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    }
  ]
  inputCabangInterface = {
    kode_cabang: 'string',
    nama_cabang: 'string'
  }
  inputCabangData = []
  inputCabangDataRules = []
  // ----------------------

  // L.O.V Tanggal Pengajuan Variable
  inputPeriodeKasirDisplayColumns = [
    {
      label: 'Tanggal Periode',
      value: 'tgl_periode',
      date: true,
      selectable: true
    }
  ]
  inputPeriodeKasirInterface = {
    id_periode: 'string',
    tgl_periode: 'string'
  }
  inputPeriodeKasirData = []
  inputPeriodeKasirDataFilter = []
  inputPeriodeKasirDataRules = []
  // ----------------------------

  // Detail Data Tanggal Pengajuan Variable
  detailDisplayColumns = [
    {
      label: 'Tgl. Periode',
      value: 'tgl_periode',
    }
  ]
  detailInterface = {
    id_periode: 'string',
    tgl_periode: 'string'
  }
  detailData = []
  detailRules = []
  // -------------

  // Input Name
  formValue = {
    kode_cabang: '',
    nama_cabang: '',
    id_tran: '',
    no_tran: '',
    tgl_tran: JSON.stringify(this.gbl.getDateNow()),
    keterangan: '',

    // Batal Pengajuan
    batal_status: 'false',
    batal_tgl: '',
    batal_alasan: '',
    boleh_batal: '',
    boleh_edit: '',

    //Periode
    bulan_periode: '',
    tahun_periode: ''
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Periode',
      id: 'bulan-periode',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'periode',
      valueOf: 'bulan_periode',
      required: true,
      readOnly: true,
      hiddenOn: false,
      inputInfo: {
        id: 'tahun-periode',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'tahun_periode'
      },
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_cabang',
      valueOf: 'kode_cabang',
      required: true,
      readOnly: false,
      hiddenOn: false,
      inputInfo: {
        id: 'nama-cabang',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_cabang'
      },
      blurOption: {
        ind: 'kode_cabang',
        data: [],
        valueOf: ['kode_cabang', 'nama_cabang'],
        onFound: () => {
          this.filterPeriodeKasirByCabang(this.forminput.getData()['kode_cabang'])
        }
      },
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: false,
      readOnly: true,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Tgl. Transaksi',
      id: 'tgl-tran',
      type: 'datepicker',
      valueOf: 'tgl_tran',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: false,
      enableMax: false,
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
    this.gbl.need(true, true) // <-- Need Access Perusahaan, Periode
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
    this.subPerusahaan === undefined ? null : this.subPerusahaan.unsubscribe()
  }

  reqKodePerusahaan() {
    this.subPerusahaan = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.kode_perusahaan !== "") {
          this.madeRequest()
        }

        if (this.selectedTab == 1 && this.browseNeedUpdate && this.kode_perusahaan !== "") {
          this.refreshBrowse('')
        }
      }
    )
  }

  // Request Data For Input Form
  madeRequest() {
    // Request Data Cabang
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('cabang', 'g-cabang', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.gbl.updateInputdata(data['RESULT'], 'kode_cabang', this.inputLayout)
            this.ref.markForCheck()
            if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
              if (this.dialogType === "kode_cabang") {
                this.dialog.closeAll()
                this.openDialog('kode_cabang')
              }
            }
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. mohon coba lagi nanti.')
            this.ref.markForCheck()
          }
        }
      )

      // Request Data Periode
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputPeriodeData = data['RESULT'].filter(
              x =>
                x['aktif'] === '1' ||
                x['tutup_sementara'] === '1'
            )
            this.ref.markForCheck()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar periode. mohon coba lagi nanti.')
            this.ref.markForCheck()
          }
        }
      )

      // Request Data Periode Kasir
      this.request.apiData('periode', 'g-periode-kasir', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputPeriodeKasirData = data['RESULT']
            this.loading = false
            this.ref.markForCheck()
            if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
              if (this.dialogType === "id_periode") {
                this.dialog.closeAll()
                this.openDialog('id_periode')
              }
            }
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar periode kasir. mohon coba lagi nanti.')
            this.loading = false
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  // Filter Data Periode
  filterPeriode(bulan_periode, tahun_periode) {
    var bulan = bulan_periode.length > 1 ? bulan_periode : "0" + bulan_periode
    var tahun = tahun_periode.toString()
    this.bulanTahun = `${tahun}-${bulan}`
  }

  // Split Date From Data
  getPeriode(date_string) {
    const [_Y, _M, ...other] = date_string.split('-')
    return _Y.concat('-', _M)
  }

  // Filter Data Periode Kasir Using Kode Cabang
  filterPeriodeKasirByCabang(kode_cabang) {
    this.loadingPeriodeKasir = true
    this.ref.markForCheck()
    let tgl_aktif = new Date(this.inputPeriodeKasirData.filter(x => x['aktif'] === '1' && x['kode_cabang'] === kode_cabang)[0]['tgl_periode']).getTime()
    this.inputPeriodeKasirDataFilter = this.inputPeriodeKasirData.filter(
      x =>
        x['aktif'] === '0' &&
        x['buka_kembali'] === '0' &&
        x['kode_cabang'] === kode_cabang &&

        //Filter Based on Bulan & Tahun
        this.getPeriode(x['tgl_periode']) === this.bulanTahun &&
        new Date(x['tgl_periode']).getTime() < tgl_aktif
    )
    this.loadingPeriodeKasir = false
    this.ref.markForCheck()
  }

  // Function: Input Dialog Component
  openDialog(type) {

    // Condition Multi Level L.O.V
    if (type === 'kode_cabang') {
      if (this.forminput.getData()['bulan_periode'] === "") {
        this.gbl.openSnackBar('Pilih Periode Terlebih Dahulu.', 'info', () => {
          setTimeout(() => {
            this.openDialog('periode')
          }, 250)
        })
        return
      }
    } else if (type === 'id_periode') {
      if (this.forminput.getData()['kode_cabang'] === "" && this.forminput.getData()['bulan_periode'] === "") {
        this.gbl.openSnackBar('Pilih Periode dan Cabang Terlebih Dahulu.', 'info', () => {
          setTimeout(() => {
            this.openDialog('periode')
          }, 250)
        })
        return
      } else if (this.forminput.getData()['kode_cabang'] === "") {
        this.gbl.openSnackBar('Pilih Cabang Terlebih Dahulu.', 'info', () => {
          setTimeout(() => {
            this.openDialog('kode_cabang')
          }, 250)
        })
        return
      }
    }
    this.gbl.topPage()
    this.dialogType = JSON.parse(JSON.stringify(type))
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      data: {
        type: type,
        tableInterface:
          type === "periode" ? this.inputPeriodeInterface :
            type === "kode_cabang" ? this.inputCabangInterface :
              type === "id_periode" ? this.inputPeriodeKasirInterface :
                {},
        displayedColumns:
          type === "periode" ? this.inputPeriodeDisplayColumns :
            type === "kode_cabang" ? this.inputCabangDisplayColumns :
              type === "id_periode" ? this.inputPeriodeKasirDisplayColumns :
                [],
        tableData:
          type === "periode" ? this.inputPeriodeData :
            type === "kode_cabang" ? this.inputCabangData :
              type === "id_periode" ? this.inputPeriodeKasirDataFilter :
                [],
        tableRules:
          type === "periode" ? this.inputPeriodeDataRules :
            type === "kode_cabang" ? this.inputCabangDataRules :
              type === "id_periode" ? this.inputPeriodeKasirDataRules :
                [],
        formValue: this.formValue,
        selectable: type === 'id_periode' ? true : false,
        selected: this.detailData,
        selectIndicator: "id_periode",
        loadingData: type === "id_periode" ? this.loadingPeriodeKasir : null
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "periode") {
          if (this.forminput !== undefined) {
            var nama_bulan = result.bulan_periode.toString()
            nama_bulan = this.gbl.getNamaBulan(nama_bulan)
            if (this.forminput.getData()['bulan_periode'] !== nama_bulan) {
              this.forminput.updateFormValue('bulan_periode', nama_bulan)
              this.forminput.updateFormValue('tahun_periode', result.tahun_periode)
              this.forminput.updateFormValue('kode_cabang', '')
              this.forminput.updateFormValue('nama_cabang', '')
              this.filterPeriode(result.bulan_periode, result.tahun_periode)
            }
          }
        } else if (type === "kode_cabang") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
            this.filterPeriodeKasirByCabang(result.kode_cabang)
          }
        } else if (type === "id_periode") {
          let x = result
          for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < this.detailData.length; j++) {
              if (this.detailData[j]['id_periode'] === x[i]['id_periode']) {
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
          this.formDetailInputCheckChanges()
        }
        this.dialogRef = undefined
        this.dialogType = null
        this.ref.markForCheck()
      }
    });
  }

  // Function: Confirmation Dialog Component
  openCDialog() {
    this.gbl.topPage()
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '90px' },
      data: {
        buttonLayout: this.c_buttonLayout,
        labelLayout: this.c_labelLayout,
        inputLayout: [
          {
            label: 'No. Transaksi',
            id: 'no-tran',
            type: 'input',
            valueOf: this.formValue.no_tran,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true
          },
          {
            label: 'Alasan Batal',
            id: 'batal-alasan',
            type: 'input',
            valueOf: null,
            changeOn: (t) => this.batal_alasan = t.target.value,
            required: true,
            readOnly: false,
            disabled: false,
          }
        ]
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(
      result => {
        this.batal_alasan = ""
      },
      // error => null
    )
  }

  // Change Tab Menu 
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 1 && this.browseNeedUpdate) {
      this.refreshBrowse('')
    }

    if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  }

  // Refresh Tab Menu: "Browse"
  refreshBrowse(message) {
    this.tableLoad = true
    this.request.apiData('pengajuan', 'g-pengajuan-buka', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (message !== '') {
            this.browseData = data['RESULT']
            this.loading = false
            this.tableLoad = false
            this.ref.markForCheck()
            this.gbl.openSnackBar(message, 'success')
            this.onUpdate = false
            this.setBatal = false
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

  // Get Detail Data
  getDetail() {
    this.detailLoad = true
    this.request.apiData('pengajuan', 'g-detail-pengajuan-buka', { kode_perusahaan: this.kode_perusahaan, id_tran: this.formValue.id_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.restructureDetailData(data['RESULT'])
          this.detailLoad = false
          this.ref.markForCheck()
        } else {
          this.gbl.openSnackBar('Failed to load detail', 'fail')
          this.detailLoad = false
          this.ref.markForCheck()
        }
      }
    )
  }

  // Action Delete Detail Data
  deleteDetailData(data) {
    for (var i = 0; i < this.detailData.length; i++) {
      if (this.detailData[i]['id_periode'] === data['id_periode']) {
        let x = this.detailData[i]
        this.detailData.splice(i, 1)
        this.dialog.closeAll()
        this.ref.markForCheck()
        this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
        break;
      }
    }
  }

  // Change Structure Detail Input
  restructureDetailData(data) {
    let endRes = []
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < this.inputPeriodeKasirData.length; j++) {
        if (data[i]['id_periode'] === this.inputPeriodeKasirData[j]['id_periode']) {
          let x = {
            id: `${MD5(Date().toLocaleString() + Date.now() + randomString({
              length: 8,
              numeric: true,
              letters: false,
              special: false
            }))}`,
            id_periode: data[i]['id_periode'],
            tgl_periode: this.inputPeriodeKasirData[j]['tgl_periode'],
            aktif: this.inputPeriodeKasirData[j]['aktif']
          }
          endRes.push(x)
          break;
        }
      }
    }
    this.detailData = endRes
    this.updateDataTglPeriode(this.detailData[0]['tgl_periode'])
  }

  // Get Tanggal Periode
  updateDataTglPeriode(tgl_periode) {
    this.bulanTahun = this.getPeriode(tgl_periode)
    var date = tgl_periode;
    var splitDate = date.split("-");
    this.formValue.bulan_periode = this.gbl.getNamaBulan(splitDate[1])
    this.formValue.tahun_periode = splitDate[0]
    this.filterPeriodeKasirByCabang(this.formValue.kode_cabang)
    this.loading = false
  }

  // Select Data from Row 
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    let tgl_tran = new Date(x['tgl_tran'])
    this.formValue = {
      kode_cabang: x['kode_cabang'],
      nama_cabang: x['nama_cabang'],
      id_tran: x['id_tran'],
      no_tran: x['no_tran'],
      tgl_tran: JSON.stringify(tgl_tran.getTime()),
      keterangan: x['keterangan'],

      // Batal Pengajuan
      batal_status: x['batal_status'],
      batal_tgl: x['batal_tgl'],
      batal_alasan: x['batal_alasan'],
      boleh_batal: x['boleh_batal'],
      boleh_edit: x['boleh_edit'],

      //Periode
      bulan_periode: x[''],
      tahun_periode: x['']
    }
    this.onUpdate = true;
    this.enableCancel = x['boleh_batal'] === 'Y' && x['batal_status'] === "false" ? true : false
    this.disableSubmit = x['boleh_edit'] === 'N' ? true : false
    this.bulanTahun = ""
    this.inputPeriodeKasirDataFilter = []
    this.getBackToInput();
  }

  // Back to Tab Menu: "Input"
  getBackToInput() {
    this.loading = true
    this.selectedTab = 0;
    // this.filterPeriodeKasirByCabang(this.formValue.kode_cabang)
    this.getDetail()
    this.formInputCheckChanges()
    this.formDetailInputCheckChanges()
  }

  // Function : Cancel Transaksi Pengajuan
  cancelTran() {
    this.gbl.topPage()
    this.setBatal = true
    this.saveData()
  }

  // Function: Button Save
  onSubmit(inputForm: NgForm) {
    this.gbl.topPage()
    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        if (this.detailData.length <= 0) {
          this.gbl.openSnackBar('Tanggal Pengajuan Belum Diisi.', 'info')
        } else {
          this.saveData()
        }
      } else {
        // Validate Input Form
        if (this.forminput.getData().bulan_periode === '') {
          this.gbl.openSnackBar('Periode Belum Diisi.', 'info')
        } else if (this.forminput.getData().kode_cabang === '') {
          this.gbl.openSnackBar('Cabang Belum Diisi.', 'info')
        }
      }
    }
  }

  // Action Add New Data or Update Data
  saveData() {
    this.loading = true;
    this.ref.markForCheck()
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    if(this.setBatal === true){
    this.formValue.batal_status = "true"
    this.formValue.batal_alasan = this.batal_alasan
    }
    this.formValue.id_tran = this.formValue.id_tran === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
      length: 8,
      numeric: true,
      letters: false,
      special: false
    }))}` : this.formValue.id_tran
    let endRes = Object.assign(
      {
        detail: this.detailData,
        kode_perusahaan: this.kode_perusahaan
        
      },
      this.formValue
    )
    this.dialog.closeAll()
    this.request.apiData('pengajuan', this.onUpdate ? 'u-pengajuan-buka' : 'i-pengajuan-buka', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.resetForm()
          this.browseNeedUpdate = true
          this.ref.markForCheck()
          this.refreshBrowse(this.onUpdate ? this.setBatal ? "BERHASIL DIBATALKAN" : "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
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

  // Reset Value
  resetForm() {
    this.gbl.topPage()
    this.formValue = {
      kode_cabang: '',
      nama_cabang: '',
      id_tran: '',
      no_tran: '',
      tgl_tran: JSON.stringify(this.gbl.getDateNow()),
      keterangan: '',

      // Batal Pengajuan
      batal_status: 'false',
      batal_tgl: '',
      batal_alasan: '',
      boleh_batal: '',
      boleh_edit: '',

      //Periode
      bulan_periode: '',
      tahun_periode: ''
    }
    this.detailData = []
    this.formInputCheckChanges()
    this.formDetailInputCheckChanges()
  }

  // Function: Button Cancel Input
  onCancel() {
    if (!this.onUpdate) {
      this.resetForm()
    } else {
      this.onUpdate = false;
      this.resetForm()
      this.datatable == undefined ? null : this.datatable.reset()
    }
  }

  // Check Changes Form Input Header
  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
    }, 1)
  }

  // Check Changes Form Input Detail
  formDetailInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }
}