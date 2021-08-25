import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NgForm } from '@angular/forms';

// ADD SERVICE
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// ADD COMPONENTS
import { ForminputComponent } from '../../components/forminput/forminput.component';

@Component({
  selector: 'kt-laporan-coa',
  templateUrl: './laporan-coa.component.html',
  styleUrls: ['./laporan-coa.component.scss', '../laporan.style.scss']
})
export class LaporanCoaComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;

  // VARIABLES
  checkKeyReport = {}
  keyReportFormatExcel: any;
  loading: boolean = false;

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;
  nama_perusahaan: any;

  // INFO PERUSAHAAN
  lookupComp: any
  info_company = {
    alamat: '',
    kota: '',
    telepon: ''
  }

  format_laporan = [
    {
      label: 'XLSX - Microsoft Excel 2007/2010',
      value: 'xlsx'
    },
    {
      label: 'XLS - Microsoft Excel 97/2000/XP/2003',
      value: 'xls'
    }
  ]

  // Input Name
  formValue = {
    format_laporan: 'xlsx'
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Format Laporan',
      id: 'format-laporan',
      type: 'combobox',
      options: this.format_laporan,
      valueOf: 'format_laporan',
      required: true,
      readOnly: false,
      disabled: false,
    }
  ]

  constructor(
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.gbl.need(true, false) // Show-Hide Perusahaan & Periode
    this.reqData() // Request Mandatory Data
  }

  ngAfterViewInit(): void {
    this.kode_perusahaan = this.gbl.getKodePerusahaan()
    this.nama_perusahaan = this.gbl.getNamaPerusahaan()

    if (this.kode_perusahaan !== "") {
      this.reqData() // Request Mandatory Data
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
  }

  // Request Mandatory Data
  reqData() {
    this.loading = true
    if (this.kode_perusahaan !== '' && this.kode_perusahaan != null && this.kode_perusahaan !== undefined) {
      this.request.apiData('lookup', 'g-info-company', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.lookupComp = data['RESULT']
            this.ref.markForCheck()
            this.loading = false
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'fail')
          }
        }
      )
    }
  }

  // Submit Data
  onSubmit(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.loading = true
        this.getRpt() // Get Data Report
      }
    }
  }

  // Get Data Report
  getRpt() {
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    this.formInputCheckChanges()
    let rk = this.formValue.format_laporan // Report Key
    if (this.checkKeyReport[rk] != undefined) {
      if (this.formValue.format_laporan === 'xlsx') {
        this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xlsx'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      } else {
        this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xls'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      }
      this.ref.markForCheck()
      this.loading = false  
    } else {
      let reqP = {}
      reqP['format_laporan'] = this.formValue.format_laporan
      reqP['kode_perusahaan'] = this.kode_perusahaan
      reqP['nama_perusahaan'] = this.nama_perusahaan
      reqP['company_adress'] = this.info_company.alamat
      reqP['company_city'] = this.info_company.kota
      reqP['company_contact'] = this.info_company.telepon
      reqP['user_name'] = localStorage.getItem('user_name') === undefined ? '' : localStorage.getItem('user_name')
      this.request.apiData('report', 'g-rpt-coa', reqP).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.createRpt(data['RESULT'], this.formValue['format_laporan'])
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan data transaksi jurnal.', 'fail')
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  createRpt(params, formatRpt) {
    if (formatRpt === 'xlsx') {
      this.keyReportFormatExcel = params + '.xlsx'
      setTimeout(() => {
        let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
        sbmBtn.click();
      }, 100)
    } else {
      this.keyReportFormatExcel = params + '.xls'
      setTimeout(() => {
        let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
        sbmBtn.click();
      }, 100)
    }

    let rk = this.formValue['format_laporan']
    this.checkKeyReport[rk] = params
    this.ref.markForCheck()
    this.loading = false
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
    }, 1)
  }
}