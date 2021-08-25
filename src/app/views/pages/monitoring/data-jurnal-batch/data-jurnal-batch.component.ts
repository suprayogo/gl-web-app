// Add Library
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
// Add Service
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';
// Add Component
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'kt-data-jurnal-batch',
  templateUrl: './data-jurnal-batch.component.html',
  styleUrls: ['./data-jurnal-batch.component.scss', '../monitoring.style.scss']
})
export class DataJurnalBatchComponent implements OnInit, AfterViewInit {

  // View Child
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Global Service Variable
  subsCompany: any // Subscription for Akses Perusahaan 
  kodePerusahaan: any // Contain Data Perusahaan Aktif

  // Load Variable
  menuload: boolean = true
  tableLoad: boolean = false

  // Contain Data Variable
  lastYears: any // Contain Data Tahun Tertinggi
  lastMonths: any // Contain Data Bulan Tertinggi
  inputCabangData = []
  inputPeriodeData = []
  browseData = [] // Contain Data Result (Jurnal)
  detailData = []
  formValue = { // Input Value
    jenis_jurnal: '01',
    kode_cabang: '',
    nama_cabang: '',
    tahun_periode: '',
    bulan_periode: '',
    filter_jurnal: '2'
  }
  formDetail = { // Input Value
    id_tran: '',
    no_tran: '',
    tgl_tran: '',
    keterangan: '',

    // Kasir
    nama_jenis_transaksi: '',
    nama_tipe_transaksi: '',
    rekening: '',

    // Status
    jenis_jurnal: '0',
    tipe_transaksi: '0',
    tipe_laporan: '',
    batal_status: ''
  }

  // Display Select Box Variable
  filTipeJurnal = [
    {
      label: 'All',
      value: '2'
    },
    {
      label: 'Jurnal Kasir',
      value: '1'
    },
    {
      label: 'Jurnal Umum',
      value: '0'
    }
  ]
  tipeJurnal = [
    {
      label: 'Jurnal Kasir',
      value: '01'
    },
    {
      label: 'Jurnal Umum',
      value: '04'
    },
    {
      label: 'Jurnal Penyesuaian',
      value: '02'
    },
    {
      label: 'Jurnal Otomatis',
      value: '03'
    }
  ]
  listTahun = []
  listBulan = []

  // Display Columns Table Variable
  inputCabangDisplayColumns = [ // Display For Input Data Cabang
    {
      label: 'Kode Cabang',
      value: 'kode_cabang'
    },
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    }
  ]
  displayColumnsDefault = [ // Display Columns (Default Jurnal)
    {
      label: 'Data Jurnal',
      value: ''
    }
  ]
  displayColumnsJU = [
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
      label: 'Status Batal',
      value: 'batal_status_name'
    }
  ] // Display Columns (Jurnal Umum)
  displayColumnsJT = [ // Display Columns (Jurnal Kasir/Transaksi)
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
      label: 'Jenis Transaksi',
      value: 'nama_jenis_transaksi'
    },
    {
      label: 'Tipe Transaksi',
      value: 'nama_tipe_transaksi'
    },
    {
      label: 'Saldo Transaksi',
      value: 'saldo_transaksi',
      number: true
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Status Batal',
      value: 'batal_status_name'
    }
  ]
  displayColumnsJO = [ // Display Columns (Jurnal Otomatis)
    {
      label: 'Jenis Jurnal',
      value: 'jenis_jurnal_name'
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
      label: 'Jenis Transaksi',
      value: 'nama_jenis_transaksi'
    },
    {
      label: 'Tipe Transaksi',
      value: 'nama_tipe_transaksi'
    },
    {
      label: 'Saldo Transaksi',
      value: 'saldo_transaksi',
      number: true
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Status Batal',
      value: 'batal_status_name'
    }
  ]
  displayColumns = JSON.parse(JSON.stringify(this.displayColumnsDefault))

  // Display Layout Form Variable
  inputLayout = [
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Jenis Jurnal',
      id: 'jenis-jurnal',
      type: 'combobox',
      options: this.tipeJurnal,
      valueOf: 'jenis_jurnal',
      required: false,
      readOnly: true,
      disabled: false
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.inputGroup(type),
      btnIcon: 'flaticon-search',
      browseType: 'cabang',
      valueOf: 'kode_cabang',
      required: false,
      readOnly: true,
      inputInfo: {
        id: 'nama-cabang',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_cabang'
      },
      disabled: false
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Tahun Periode',
      id: 'tahun-periode',
      type: 'combobox',
      options: this.listTahun,
      onSelectFunc: (filterVal) => this.filterMonth(filterVal, ''),
      valueOf: 'tahun_periode',
      required: false,
      readOnly: true,
      disabled: false
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Bulan Periode',
      id: 'bulan-periode',
      type: 'combobox',
      options: this.listBulan,
      valueOf: 'bulan_periode',
      required: false,
      readOnly: true,
      disabled: false
    }
  ]

  rightInputLayout = [
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Filter Jurnal',
      id: 'filter-jurnal',
      type: 'combobox',
      options: this.filTipeJurnal,
      valueOf: 'filter_jurnal',
      required: false,
      readOnly: true,
      disabled: false,
      hiddenOn: {
        valueOf: 'jenis_jurnal',
        matchValue: ['', '01', '02', '04']
      }
    }
  ]

  detailDefaultLayout = [
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Tgl. Transaksi',
      id: 'tgl-tran',
      type: 'input',
      valueOf: 'tgl_tran',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Jenis Transaksi',
      id: 'nama-jenis-transaksi',
      type: 'input',
      valueOf: 'nama_jenis_transaksi',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Rekening',
      id: 'rekening',
      type: 'input',
      valueOf: 'rekening',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Tipe Transaksi',
      id: 'nama-tipe-transaksi',
      type: 'input',
      valueOf: 'nama_tipe_transaksi',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Keterangan',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Status Batal',
      id: 'batal-status',
      type: 'input',
      valueOf: 'batal_status',
      required: false,
      readOnly: true,
      disabled: true
    }
  ]

  detailInputLayout = JSON.parse(JSON.stringify(this.detailDefaultLayout))

  // Columns Table Rules Variable
  browseDataRules = [
    {
      target: 'jurnal_kasir',
      replacement: {
        '0': 'Jurnal Umum',
        '1': 'Jurnal Kasir'
      },
      redefined: 'jenis_jurnal_name'
    },
    {
      target: 'batal_status',
      replacement: {
        true: 'Y',
        false: '',
        '': ''
      },
      redefined: 'batal_status_name'
    }
  ]

  constructor(
    // Library
    private ref: ChangeDetectorRef,
    public dialog: MatDialog,
    // Service
    private request: RequestDataService,
    private gbl: GlobalVariableService,
  ) { }

  ngOnInit() {
    this.gbl.need(true, false) // Show-Hide Perusahaan & Periode
    this.getCompany() // Subs Company Active
    this.reqData() // Request Mandatory Data
  }

  ngAfterViewInit(): void {
    this.kodePerusahaan = this.gbl.getKodePerusahaan()

    if (this.kodePerusahaan !== '') {
      this.reqData() // Request Mandatory Data
    }
  }

  ngOnDestroy(): void {
    this.subsCompany === undefined ? null : this.subsCompany.unsubscribe()
  }

  // Subs Company Active
  getCompany() {
    this.subsCompany = this.gbl.change.subscribe(
      value => {
        this.kodePerusahaan = value
        this.ref.markForCheck()

        if (this.kodePerusahaan !== '') {
          this.reqData()
        }
      }
    )
  }

  // Request Mandatory Data
  reqData() {
    if (this.kodePerusahaan != undefined &&
      this.kodePerusahaan != null &&
      this.kodePerusahaan !== '') {
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kodePerusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputPeriodeData = data['RESULT']
            if (this.inputPeriodeData.length > 0) {
              this.lastYears = this.gbl.getTahunTertinggi(this.inputPeriodeData)
              this.lastMonths = this.gbl.getBulanTertinggi(this.inputPeriodeData, this.lastYears)
            }
            this.ref.markForCheck()
            this.reqDataCabang()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan data periode. Mohon coba lagi nanti.', 'fail')
          }
        }
      )
    }
  }

  // Request Data Cabang Akses
  reqDataCabang() {
    this.request.apiData('cabang', 'g-cabang-akses', { kode_perusahaan: this.kodePerusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.ref.markForCheck()
          this.inputCabangData = data['RESULT']
          let cabangAcs = JSON.parse(JSON.stringify(data['RESULT'])), // Duplicate Result
            cabangUtama = cabangAcs.filter(x => x.cabang_utama_user === 'true')[0] || {}
          this.ref.markForCheck()
          this.formValue.kode_cabang = cabangUtama.kode_cabang
          this.formValue.nama_cabang = cabangUtama.nama_cabang
          this.setValPeriod()
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
        }
      }
    )
  }

  // Set Display Select Box Data (Periode)
  setValPeriod() {
    let temp = [], flags = [], yearsList = [], monthList = {}
    // Set Tahun
    for (var i = 0; i < this.inputPeriodeData.length; i++) {
      if (flags[this.inputPeriodeData[i]['tahun_periode']]) continue;
      flags[this.inputPeriodeData[i]['tahun_periode']] = true;
      temp.push(this.inputPeriodeData[i]['tahun_periode'])
      yearsList.push({
        label: this.inputPeriodeData[i]['tahun_periode'],
        value: this.inputPeriodeData[i]['tahun_periode']
      });
    }
    this.listTahun = yearsList
    this.formValue.tahun_periode = this.lastYears.toString()
    // Set Bulan
    for (var i = 0; i < temp.length; i++) {
      monthList[temp[i]] = []
      for (var j = 0; j < this.inputPeriodeData.length; j++) {
        if (this.inputPeriodeData[j]['tahun_periode'] === temp[i]) {
          flags[this.inputPeriodeData[j]['bulan_periode']] = true;
          monthList[temp[i]].push({
            label: this.inputPeriodeData[j]['bulan_periode'],
            value: this.inputPeriodeData[j]['bulan_periode']
          })
        }
      }
    }
    this.listBulan = monthList[this.formValue.tahun_periode]
    this.formValue.bulan_periode = this.lastMonths.toString()
    this.ref.markForCheck()
    this.inputLayout.splice(2, 2,
      {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.listTahun,
        onSelectFunc: (filterVal) => this.filterMonth(filterVal, monthList),
        valueOf: 'tahun_periode',
        required: false,
        readOnly: true,
        disabled: false
      },
      {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.listBulan,
        valueOf: 'bulan_periode',
        required: false,
        readOnly: true,
        disabled: false
      }
    )
    this.menuload = false
  }

  filterMonth(filterVal, monthList) {
    this.forminput.updateFormValue('tahun_periode', filterVal)
    this.forminput.updateFormValue('bulan_periode', this.gbl.getBulanTertinggi(this.inputPeriodeData, parseInt(filterVal)).toString())
    this.listBulan = monthList[filterVal]
    this.inputLayout.splice(3, 1,
      {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.listBulan,
        valueOf: 'bulan_periode',
        required: false,
        readOnly: true,
        disabled: false
      }
    )
  }

  onSubmit(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.tableLoad = true
        this.reqDataJurnal() // Get Data Report
      }
    }
  }

  reqDataJurnal() {
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    // Request Params Mandatory
    let reqParams = {
      kode_perusahaan: this.kodePerusahaan,
      kode_cabang: this.formValue.kode_cabang,
      jenis_jurnal: this.formValue.jenis_jurnal
    },
      initMonth = this.formValue.bulan_periode.length > 1 ? this.formValue.bulan_periode : '0' + this.formValue.bulan_periode
    if (this.formValue.jenis_jurnal === '01') { // Kasir
      this.displayColumns = this.displayColumnsJT
      // Request Params Optional
      reqParams['periode'] = this.formValue.tahun_periode + '-' + initMonth
      reqParams['tgl_periode_awal'] = this.formValue.tahun_periode + '-' + initMonth + '-' + '01'
      reqParams['tgl_periode_akhir'] = this.formValue.tahun_periode + '-' + initMonth + '-' + this.gbl.maxDate(this.formValue.bulan_periode, this.formValue.tahun_periode)
    } else if (this.formValue.jenis_jurnal === '02' || this.formValue.jenis_jurnal === '04') { // Penyesuaian atau Umum
      this.displayColumns = this.displayColumnsJU
      // Request Params Optional
      reqParams['periode'] = this.formValue.tahun_periode + '-' + initMonth
    } else if (this.formValue.jenis_jurnal === '03') { // Otomatis
      if (this.formValue.filter_jurnal === '2') {
        this.displayColumns = this.displayColumnsJO
      } else if (this.formValue.filter_jurnal === '1') {
        this.displayColumns = this.displayColumnsJT
      } else {
        this.displayColumns = this.displayColumnsJU
      }

      // Request Params Optional
      reqParams['periode'] = this.formValue.tahun_periode + '-' + initMonth
    }
    this.request.apiData('jurnal', 'g-jurnal', reqParams).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseData = data['RESULT']
          if (data['RESULT'].length < 1) {
            this.gbl.openSnackBar('Data jurnal tidak ditemukan', 'info')
          } else {
            if (this.formValue.jenis_jurnal === '03') {
              if (this.formValue.filter_jurnal !== '2') {
                let res = [], dataDupl = JSON.parse(JSON.stringify(data['RESULT']))
                for (var i = 0; i < dataDupl.length; i++) {
                  if (dataDupl[i]['jurnal_kasir'] === this.formValue.filter_jurnal) {
                    res[i] = dataDupl[i]
                  }
                }
                if (res.length < 1) {
                  this.gbl.openSnackBar('Data jurnal tidak ditemukan', 'info')
                }
                this.browseData = res
              }
            }
          }
          this.ref.markForCheck()
          this.tableLoad = false
          if (this.browseData.length > 0) {
            setTimeout(() => {
              this.ref.markForCheck()
              this.gbl.screenPosition()
            }, 450);
          }
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan data jurnal. Mohon coba lagi nanti.', 'fail')
          this.ref.markForCheck()
          this.tableLoad = false
        }
      }
    )
    this.formInputCheckChanges()
  }

  selectRow(data) {
    let x = JSON.parse(JSON.stringify(data)), cancStat
    this.formDetail.id_tran = x['id_tran']
    this.formDetail.no_tran = x['no_tran']
    this.formDetail.tgl_tran = this.gbl.splitDate(x['tgl_tran'], 'D-M-Y')
    this.formDetail.keterangan = x['keterangan']
    // Kasir
    this.formDetail.nama_jenis_transaksi = x['nama_jenis_transaksi']
    this.formDetail.nama_tipe_transaksi = x['nama_tipe_transaksi']
    // Status
    this.formDetail.jenis_jurnal = x['jurnal_kasir'] === '1' ? '2' : '0'
    this.formDetail.tipe_transaksi = x['tipe_transaksi']
    this.formDetail.tipe_laporan = x['tipe_laporan']
    this.formDetail.rekening = x['no_rekening'] + ' - ' + x['nama_bank']
    cancStat = x['batal_status'] === '' || !x['batal_status'] ? false : true

    if (this.formDetail.jenis_jurnal !== '2') {
      this.detailInputLayout.splice(2, 3)
    } else {
      if (this.formDetail.tipe_laporan !== 'b') {
        this.detailInputLayout.splice(3, 1)
      }
    }

    if (!cancStat) {
      this.detailInputLayout.splice(6, 1)
    } else {
      this.formDetail.batal_status = 'Batal'
    }

    this.getDetail()
  }

  getDetail() {
    this.request.apiData('jurnal', 'g-jurnal-detail', { kode_perusahaan: this.kodePerusahaan, id_tran: this.formDetail.id_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let detail = [], temp = JSON.parse(JSON.stringify(data['RESULT']))

          detail = temp.map(detail => {
            const container = detail
            // Add Important Object
            container['saldo_debit'] = parseFloat(detail.nilai_debit)
            container['saldo_kredit'] = parseFloat(detail.nilai_kredit)
            container['lembar_giro'] = parseFloat(detail.lbr_giro)
            // Delete Useless Object
            delete container.nilai_debit
            delete container.nilai_kredit
            delete container.lbr_giro
            return container
          }
          )
          // Check Jurnal Type
          if (this.formDetail.jenis_jurnal === '2') {
            if (this.formDetail.tipe_transaksi === '0') {
              this.detailData = detail.filter(x => x['saldo_kredit'] != 0)
            } else {
              this.detailData = detail.filter(x => x['saldo_debit'] != 0)
            }
          } else {
            this.detailData = detail
          }
          this.formInputCheckChangesJurnal()
          this.inputDialog(this.formDetail.jenis_jurnal)
        }
      }
    )
  }

  inputGroup(type?: any) {
    let data = [
      {
        type: type,
        title: 'Data Cabang',
        columns: this.inputCabangDisplayColumns,
        contain: this.inputCabangData,
        rules: [],
        interface: {}
      }
    ], setting = {
      width: '50vw',
      posTop: '30px'
    },

      input = this.gbl.openDialog(type, data, this.formValue, setting)
    input.afterClosed().subscribe(result => {
      if (result) {
        if (type === 'cabang') {
          this.forminput.updateFormValue('kode_cabang', result['kode_cabang'])
          this.forminput.updateFormValue('nama_cabang', result['nama_cabang'])
        }
      }
      this.ref.markForCheck()
    }
    )
  }

  inputDialog(type?: any) {
    this.gbl.screenPosition()
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: '50vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '320px' },
      data: {
        width: '85vw',
        title: 'Informasi Data Jurnal',
        buttonLayout: [],
        noButtonSave: true,
        detailJurnal: true,
        noEditJurnal: true,
        formValue: this.formDetail,
        jurnalData: this.detailData,
        jurnalDataAkun: [],
        inputLayout: this.detailInputLayout,
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => null,
        onSubmit: (x: NgForm) => null,
        deleteData: () => null
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.datatable == undefined ? null : this.datatable.reset()
        this.ref.markForCheck()
        this.detailInputLayout = JSON.parse(JSON.stringify(this.detailDefaultLayout))
      },
      error => null,
    );
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
