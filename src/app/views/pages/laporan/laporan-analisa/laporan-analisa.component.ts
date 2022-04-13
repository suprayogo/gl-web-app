import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// Custom Service
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// Custom Component
import { ForminputComponent } from '../../components/forminput/forminput.component';

@Component({
  selector: 'kt-laporan-analisa',
  templateUrl: './laporan-analisa.component.html',
  styleUrls: ['./laporan-analisa.component.scss', '../laporan.style.scss']
})
export class LaporanAnalisaComponent implements OnInit, AfterViewInit {
  // View Child List
  @ViewChild(ForminputComponent, { static: false }) formInputVC

  // Others Variable
  loading: boolean = true
  subsMenu: any; // Subscription Menu
  kodePerusahaan: string = '' // [Global Variable] Kode Perusahaan
  namaPerusahaan: string = '' // [Global Variable] Nama Perusahaan
  listInfoPerusahaan: any = []// [Request Data] Informasi Perusahaan
  listAksesCabang = [] // [Request Data] Akses Cabang
  listPeriodeTran = [] // [Request Data] Periode Transaksi
  periodeFix: any // [Default Value] Periode Transaksi
  cabangUtama: any // [Default Value] Cabang Utama User
  rptRecycleId: any// [Value] Unique Key ID Laporan
  reportResultId = {} // [Value] Kumpulan ID Laporan yang pernah ditarik
  excelReportTypeId: any // [Value] ID Laporan Khusus untuk Format Excel
  infoLookupSts: boolean = false // Status Request Info Lookup

  // Form Input Value Variable
  formInputValFinal: any
  formInputVal = {
    ekstensi_laporan: 'xlsx',
    bentuk_laporan: '0',
    kode_cabang: '',
    nama_cabang: '',
    dari_tahun: '',
    sd_tahun: ''
  }


  // Combobox Variable
  ekstensiLaporanCbx = [ // Combobox Ekstensi Laporan
    {
      label: 'XLSX - Microsoft Excel 2007/2010',
      value: 'xlsx'
    },
    {
      label: 'XLS - Microsoft Excel 97/2000/XP/2003',
      value: 'xls'
    },
    {
      label: 'PDF - Portable Document Format',
      value: 'pdf'
    }
  ]
  bentukLaporanCbx = [ // Combobox Bentuk Laporan
    {
      label: 'Per Cabang',
      value: '0'
    },
    {
      label: 'ALL - Total Per Cabang',
      value: '1'
    },
    {
      label: 'ALL - Total Semua Cabang',
      value: '2'
    }
  ]
  tahunPeriodeCbx = [] // Combobox Tahun Periode

  // L.o.V (List of Values) Variable
  displayColCabangLov = [ // Tampil kolom di L.o.V Cabang 
    {
      label: 'Kode Cabang',
      value: 'kode_cabang'
    },
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    }
  ]

  // Form Input Layout Variable
  formInputLyt = [
    {
      formWidth: 'col-5',
      label: 'Format Laporan',
      id: 'ekstensi-laporan',
      valueOf: 'ekstensi_laporan',
      type: 'combobox',
      options: this.ekstensiLaporanCbx,
      required: false,
      readOnly: false,
      disabled: false,
    },
    {
      formWidth: 'col-5',
      label: 'Bentuk Laporan',
      id: 'bentuk-laporan',
      valueOf: 'bentuk_laporan',
      type: 'combobox',
      options: this.bentukLaporanCbx,
      required: false,
      readOnly: false,
      disabled: false,
      onSelectFunc: (data) => null
    },
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'kode-cabang',
      valueOf: 'kode_cabang',
      type: 'inputgroup',
      browseType: 'cabang',
      click: (type) => this.inputGroup(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      required: false,
      readOnly: true,
      disabled: false,
      inputInfo: {
        id: 'nama-cabang',
        valueOf: 'nama_cabang',
        required: false,
        readOnly: true,
        disabled: false
      },
      hiddenOn: {
        valueOf: 'bentuk_laporan',
        matchValue: ["1", "2"]
      }
    },
    {
      formWidth: 'col-5',
      label: 'Tahun Periode',
      id: 'dari-tahun',
      valueOf: 'dari_tahun',
      type: 'combobox',
      options: this.tahunPeriodeCbx,
      required: false,
      readOnly: false,
      disabled: false,
      onSelectFunc: (data) => {
        this.formInputVC.updateFormValue('dari_tahun', data)
        this.checkRangePeriod('from', data)
      },

      // Combobox Option
      opt_input: true,
      opt_label: '',
      opt_id: 'sd-tahun',
      opt_valueOf: 'sd_tahun',
      opt_type: 'opt_combobox',
      opt_options: this.tahunPeriodeCbx,
      onSelectFuncOpt: (data) => {
        this.formInputVC.updateFormValue('sd_tahun', data)
        this.checkRangePeriod('to', data)
      }
    }
  ]

  constructor(
    private ref: ChangeDetectorRef,
    public dialog: MatDialog,

    // Custom Service
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.gbl.need(true, false) // Informasi Perusahaan Aktif & Periode Aktif
    this.setPreparation()
  }

  ngAfterViewInit(): void {
    this.kodePerusahaan = this.gbl.getKodePerusahaan()
    this.namaPerusahaan = this.gbl.getNamaPerusahaan()

    if (this.kodePerusahaan != '') {
      this.setPreparation()
    }
  }

  ngOnDestroy(): void {
    this.subsMenu === undefined ? null : this.subsMenu.unsubscribe()
  }

  setPreparation() {
    if (this.kodePerusahaan != '') {

      let cabangAksesSts = false, periodeTranSts = false, // Status Request Data
        reqData = Object.assign({ kode_perusahaan: this.kodePerusahaan }) // Set Request Parameter

      // Request Data Akses Cabang
      this.request.apiData('cabang', 'g-cabang-akses', reqData).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            this.listAksesCabang = data['RESULT']
            cabangAksesSts = true

            // Set List Cabang Utama
            let listAksesCabangDupl = JSON.parse(JSON.stringify(this.listAksesCabang)) // Akses Cabang Duplicate
            this.cabangUtama = listAksesCabangDupl.filter(data => data.cabang_utama_user == 'true')[0] || {} // Cabang Utama User

            // Set Default Form Input (Cabang)
            this.formInputVal.kode_cabang = this.cabangUtama.kode_cabang
            this.formInputVal.nama_cabang = this.cabangUtama.nama_cabang

            if (cabangAksesSts && periodeTranSts) {
              this.setContent()
            }
          } else {
            this.gbl.openSnackBar('Data akses cabang tidak ditemukan.', 'fail')
          }
        }
      )

      // Request Data Periode Transaksi
      this.request.apiData('periode', 'g-periode', reqData).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            this.listPeriodeTran = data['RESULT']
            periodeTranSts = true

            // Set Periode Transaksi Fix
            if (this.listPeriodeTran.length > 0) {
              this.periodeFix = {
                tahunPeriodeMaks: this.gbl.getTahunTertinggi(this.listPeriodeTran)
              }

              // Set Default Form Input (Tahun Periode)
              this.formInputVal.dari_tahun = this.periodeFix.tahunPeriodeMaks
              this.formInputVal.sd_tahun = this.periodeFix.tahunPeriodeMaks
            }

            if (cabangAksesSts && periodeTranSts) {
              this.setContent()
            }
          } else {
            this.gbl.openSnackBar('Data periode transaksi tidak ditemukan.', 'fail')
          }
        }
      )

      if (cabangAksesSts && periodeTranSts) {
        this.setContent()
      }
    }
  }

  setContent() {
    let uniqueKey = [], tmpData = [], listTahunPeriode = [] // Set List Tahun

    for (var i = 0; i < this.listPeriodeTran.length; i++) {
      if (uniqueKey[this.listPeriodeTran[i]['tahun_periode']]) continue;
      uniqueKey[this.listPeriodeTran[i]['tahun_periode']] = true;
      tmpData.push(this.listPeriodeTran[i]['tahun_periode'])
      listTahunPeriode.push({
        label: this.listPeriodeTran[i]['tahun_periode'],
        value: this.listPeriodeTran[i]['tahun_periode']
      });
    }
    this.tahunPeriodeCbx = listTahunPeriode
    this.formInputLyt.splice(3, 1,
      {
        formWidth: 'col-5',
        label: 'Tahun Periode',
        id: 'dari-tahun',
        valueOf: 'dari_tahun',
        type: 'combobox',
        options: this.tahunPeriodeCbx,
        required: false,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => {
          this.formInputVC.updateFormValue('dari_tahun', data)
          this.checkRangePeriod('from', data)
        },

        // Combobox Option
        opt_input: true,
        opt_label: '',
        opt_id: 'sd-tahun',
        opt_valueOf: 'sd_tahun',
        opt_type: 'opt_combobox',
        opt_options: this.tahunPeriodeCbx,
        onSelectFuncOpt: (data) => {
          this.formInputVC.updateFormValue('sd_tahun', data)
          this.checkRangePeriod('to', data)
        }
      }
    )

    this.ref.markForCheck()
    this.loading = false
  }

  onSubmit(inputForm: NgForm) {
    if (this.formInputVC != undefined) {
      this.formInputVal = this.formInputVC.getData()
      if (inputForm.valid) {
        if (this.formInputVC.getData().bentuk_laporan == '0'
          && this.formInputVC.getData().kode_cabang == '') {
          this.gbl.openSnackBar('Cabang belum diisi.', 'info')
        } else {
          this.loading = true
          if (this.listInfoPerusahaan.length < 1) {
            this.setOptionalRequest()
          } else {
            this.actionData()
          }
        }
      }
    }
  }

  actionData() {
    this.ref.markForCheck()
    this.formInputValFinal = {
      format_laporan: this.formInputVal.ekstensi_laporan,
      bentuk_laporan: this.formInputVal.bentuk_laporan,
      kode_cabang: this.formInputVal.bentuk_laporan == '0' ? this.formInputVal.kode_cabang : '',
      nama_cabang: this.formInputVal.bentuk_laporan == '0' ? this.formInputVal.nama_cabang : '',
      tahun_from: this.formInputVal.dari_tahun.toString(),
      tahun_to: this.formInputVal.sd_tahun.toString()
    }

    for (var i = 0; i < this.listInfoPerusahaan.length; i++) {
      if (this.listInfoPerusahaan[i].kode_lookup === 'ALAMAT-PERUSAHAAN'
        && this.listInfoPerusahaan[i].kode_cabang === this.formInputValFinal.kode_cabang) {
        this.formInputValFinal['company_adress'] = this.formInputValFinal.kode_cabang !== "" ? this.listInfoPerusahaan[i]['nilai1'] : ""
      }
      if (this.listInfoPerusahaan[i].kode_lookup === 'KOTA-PERUSAHAAN'
        && this.listInfoPerusahaan[i].kode_cabang === this.formInputValFinal.kode_cabang) {
        this.formInputValFinal['company_city'] = this.formInputValFinal.kode_cabang !== "" ? this.listInfoPerusahaan[i]['nilai1'] : ""
      }
      if (this.listInfoPerusahaan[i].kode_lookup === 'TELEPON-PERUSAHAAN'
        && this.listInfoPerusahaan[i].kode_cabang === this.formInputValFinal.kode_cabang) {
        this.formInputValFinal['company_contact'] = this.formInputValFinal.kode_cabang !== "" ? this.listInfoPerusahaan[i]['nilai1'] : ""
      }
    }

    this.rptRecycleId = this.formInputValFinal.format_laporan
      + this.formInputValFinal.bentuk_laporan
      + this.formInputValFinal.kode_cabang
      + this.formInputValFinal.tahun_from
      + this.formInputValFinal.tahun_to
    if (this.reportResultId[this.rptRecycleId] == undefined) {
      let reqData = Object.assign({
        kode_perusahaan: this.kodePerusahaan,
        nama_perusahaan: this.namaPerusahaan,
        user_name: localStorage.getItem('user_name') === undefined ? '' : localStorage.getItem('user_name')
      }, this.formInputValFinal)
      this.request.apiData('report', 'g-rpt-analisa', reqData).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            let reportResult = data['RESULT']
            this.getReport("01", reportResult)
          } else {
            this.ref.markForCheck()
            this.gbl.openSnackBar('Data laporan tidak ditemukan.', 'fail')
            this.loading = false
          }
        }
      )
    } else {
      this.getReport("02", this.rptRecycleId)
    }
  }

  getReport(type, res?) {
    let useReportId = type == '01' ? res : this.reportResultId[res]
    this.ref.markForCheck()
    if (this.formInputValFinal['format_laporan'] === 'pdf') {
      window.open("http://deva.darkotech.id:8704/report/viewer.html?repId=" + useReportId, "_blank")
    } else {
      if (this.formInputValFinal['format_laporan'] === 'xlsx') {
        this.excelReportTypeId = useReportId + '.xlsx'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      } else {
        this.excelReportTypeId = useReportId + '.xls'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      }
    }
    this.rptRecycleId = this.formInputValFinal.format_laporan
      + this.formInputValFinal.bentuk_laporan
      + this.formInputValFinal.kode_cabang
      + this.formInputValFinal.tahun_from
      + this.formInputValFinal.tahun_to
    this.reportResultId[this.rptRecycleId] = res
    this.loading = false
  }

  onCancel() {
    this.formInputVal = {
      ekstensi_laporan: 'xlsx',
      bentuk_laporan: '0',
      kode_cabang: this.cabangUtama.kode_cabang,
      nama_cabang: this.cabangUtama.nama_cabang,
      dari_tahun: this.periodeFix.tahunPeriodeMaks,
      sd_tahun: this.periodeFix.tahunPeriodeMaks
    }
    this.formInputCheckChanges()
  }

  // ========== Custom Function ========== //
  inputGroup(type?: any) {
    let input, data = [
      {
        type: type,
        title: 'Data Cabang',
        columns: this.displayColCabangLov,
        contain: this.listAksesCabang,
        rules: [],
        interface: {}
      }
    ], setting = {
      width: '50vw',
      posTop: '30px'
    }
    input = this.gbl.openDialog(type, data, this.formInputVal, setting)

    input.afterClosed().subscribe(
      result => {
        if (result) {
          this.ref.markForCheck()
          if (type === 'cabang') {
            this.formInputVC.updateFormValue('kode_cabang', result['kode_cabang'])
            this.formInputVC.updateFormValue('nama_cabang', result['nama_cabang'])
          }
        }
      }
    )
  }

  checkRangePeriod(type, data) {
    if (type == 'from' && parseInt(data) > parseInt(this.formInputVC.getData().sd_tahun)) {
      this.formInputVC.updateFormValue('dari_tahun', this.formInputVC.getData().sd_tahun)
      this.gbl.openSnackBar('Maks.Batas bawah periode s/d batas atas periode!', 'info')
    }

    if (type == 'to' && parseInt(data) < parseInt(this.formInputVC.getData().dari_tahun)) {
      this.formInputVC.updateFormValue('sd_tahun', this.formInputVC.getData().dari_tahun)
      this.gbl.openSnackBar('Min.Batas atas periode s/d batas bawah periode!', 'info')
    }

    this.formInputLyt.splice(3, 1,
      {
        formWidth: 'col-5',
        label: 'Tahun Periode',
        id: 'dari-tahun',
        valueOf: 'dari_tahun',
        type: 'combobox',
        options: this.tahunPeriodeCbx,
        required: false,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => {
          this.formInputVC.updateFormValue('dari_tahun', data)
          this.checkRangePeriod('from', data)
        },

        // Combobox Option
        opt_input: true,
        opt_label: '',
        opt_id: 'sd-tahun',
        opt_valueOf: 'sd_tahun',
        opt_type: 'opt_combobox',
        opt_options: this.tahunPeriodeCbx,
        onSelectFuncOpt: (data) => {
          this.formInputVC.updateFormValue('sd_tahun', data)
          this.checkRangePeriod('to', data)
        }
      }
    )
  }

  setOptionalRequest() {
    let infoCompanySts = false, // Status Request Data
      reqData = Object.assign({ kode_perusahaan: this.kodePerusahaan }) // Set Request Parameter
    this.request.apiData('lookup', 'g-info-company', reqData).subscribe( // Request Informasi Perusahaan
      data => {
        if (data['STATUS'] == 'Y') {
          this.ref.markForCheck()
          this.listInfoPerusahaan = data['RESULT']
          infoCompanySts = true

          if (infoCompanySts) {
            this.actionData()
          }
        } else {
          this.gbl.openSnackBar('Data informasi perusahaan tidak ditemukan.', 'fail')
        }
      }
    )

    if (infoCompanySts) {
      this.actionData()
    }
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.formInputVC === undefined ? null : this.formInputVC.checkChanges()
    }, 1)
  }
}
