// Add Library
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core'
import { MatDialog, MatTabChangeEvent } from '@angular/material'
import { NgForm } from '@angular/forms'
// Add Service
import { RequestDataService } from '../../../../service/request-data.service'
import { GlobalVariableService } from '../../../../service/global-variable.service'
// Add Component
import { ForminputComponent } from '../../components/forminput/forminput.component'
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component'
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component'
// Others
import * as MD5 from 'crypto-js/md5'
import * as randomString from 'random-string'
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component'


@Component({
  selector: 'kt-daftar-group-coa',
  templateUrl: './daftar-group-coa.component.html',
  styleUrls: ['./daftar-group-coa.component.scss', '../master.style.scss']
})
export class DaftarGroupCoaComponent implements OnInit, AfterViewInit {

  // View Child
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Input Value Variable 
  formValue = {
    kode_group_akun: '',
    nama_group_akun: '',
    keterangan: ''
  }

  // Layout Form Input Variable
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Group Akun',
      id: 'kode-group-akun',
      type: 'input',
      valueOf: 'kode_group_akun',
      required: true,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Nama Group Akun',
      id: 'nama-group-akun',
      type: 'input',
      valueOf: 'nama_group_akun',
      required: true,
      readOnly: false,
      disabled: false,
      update: {
        disabled: false
      },
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Keterangan',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: false,
      disabled: false,
      update: {
        disabled: false
      },
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Group Akun',
      type: 'detail',
      click: (type) => this.inputGroup(type),
      btnLabel: 'Pilih Group Akun',
      btnIcon: 'flaticon-list-3',
      browseType: 'kode_akun',
      valueOf: 'kode',
      required: false,
      readOnly: true,

      update: {
        disabled: false
      }
    },
  ]

  confirmButtonLayout = [
    {
      btnLabel: 'Hapus Data',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.deleteData()
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
  confirmLabelLayout = [
    {
      content: 'Yakin akan menghapus data ?',
      style: {
        'color': 'red',
        'font-size': '18px',
        'font-weight': 'bold'
      }
    }
  ]

  // L.o.V (List of Values) Variable
  displayColAkunLov = [ // Tampil kolom di L.o.V Akun
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

  // 'Browse' Tab Menu Variable
  tableColumn = [
    {
      label: 'Kode Group Akun',
      value: 'kode_group_akun'
    },
    {
      label: 'Nama Group Akun',
      value: 'nama_group_akun'
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
  browseInterface = {}
  tableData = []
  tableRules = []

  // Other Variable
  companyCode: any // Global Variable 'Kode Perusahaan'
  statusSubsCompany: any // Global Variable 'Status Subscription'
  loading = false
  tableLoad = false
  listAkun = [] // List Akun
  listAkunDupl = [] // List Akun Dupicate
  listSelectAkun = [] // Data Akun Selected
  selectedTab: number = 0
  browseNeedUpdate: boolean = true
  onUpdate: boolean = false
  enableDelete: boolean = true

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
    this.getCompany()
    this.reqData()
  }

  ngAfterViewInit(): void {
    this.companyCode = this.gbl.getKodePerusahaan()

    if (this.companyCode !== '') {
      this.reqData()
    }
  }

  ngOnDestroy(): void {
    this.statusSubsCompany === undefined ? null : this.statusSubsCompany.unsubscribe()
  }

  getCompany() {
    this.statusSubsCompany = this.gbl.change.subscribe(
      value => {
        this.companyCode = value
        this.tableData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.companyCode !== '') {
          this.reqData()
        }

        if (this.selectedTab == 1 && this.browseNeedUpdate && this.companyCode !== '') {
          this.refreshBrowse(null)
        }
      }
    )
  }

  reqData() {
    this.loading = true
    if (this.companyCode != '' && this.companyCode != undefined && this.companyCode != null) {
      let akunAksesSts = false, // Status Request Data
        reqData = Object.assign({ kode_perusahaan: this.companyCode }) // Set Request Parameter

      // Request Data Akun
      this.request.apiData('akun', 'g-akun', reqData).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            this.listAkun = data['RESULT']
            akunAksesSts = true

            // Set List Akun
            this.listAkunDupl = JSON.parse(JSON.stringify(this.listAkun)) // Akun Duplicate
            this.restructureDetailData('akun', this.listAkunDupl, 'default')

            if (akunAksesSts) {
              this.loading = false
            }
          } else {
            this.gbl.openSnackBar('Data akun tidak ditemukan', 'fail')
          }
        }
      )

      if (akunAksesSts) {
        this.loading = false
      }
    }
  }

  onSubmit(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.saveData()
      } else {
        if (this.forminput.getData()['kode_group_akun'] == '') {
          this.gbl.openSnackBar('Kode group akun belum diisi', 'info')
        } else if (this.forminput.getData()['nama_group_akun'] == '') {
          this.gbl.openSnackBar('Nama group akun belum diisi', 'info')
        }
      }

    }
  }

  saveData() {
    this.loading = true
    this.ref.markForCheck()
    this.formValue = this.forminput == undefined ? this.formValue : this.forminput.getData()
    let endRes = Object.assign(
      {
        kode_perusahaan: this.companyCode,
        data_detail: this.listSelectAkun
      },
      this.formValue
    )
    this.request.apiData('akun', !this.onUpdate ? 'i-group-akun' : 'u-group-akun', endRes).subscribe(
      data => {
        if (data['STATUS'] == 'Y') {
          this.browseNeedUpdate = true
          this.ref.markForCheck()
          this.refreshBrowse(!this.onUpdate ? 'Data baru berhasil ditambahkan' : 'Data berhasil diupdate')
          this.onCancel()
        } else {
          this.loading = false
          this.ref.markForCheck()
          this.gbl.openSnackBar(data['RESULT'], 'fail')
        }
      }
    )
  }

  deleteData() {
    this.dialog.closeAll()
    this.loading = true
    this.ref.markForCheck()
    let endRes = Object.assign({ kode_perusahaan: this.companyCode }, this.formValue)
    this.request.apiData('akun', 'd-group-akun', endRes).subscribe(
      data => {
        if (data['STATUS'] == 'Y') {
          this.onCancel()
          this.ref.markForCheck()
          this.browseNeedUpdate = true
          this.refreshBrowse('Data group akun berhasil dihapus')
        } else {
          this.loading = false
          this.ref.markForCheck()
          this.gbl.openSnackBar(data['RESULT'])
        }
      }
    )
  }

  onCancel() {
    this.onUpdate = false
    this.formValue = {
      kode_group_akun: '',
      nama_group_akun: '',
      keterangan: ''
    }
    this.restructureDetailData('akun', [], 'default')
    this.formInputCheckChanges()

    this.ref.markForCheck()
    this.datatable == undefined ? null : this.datatable.reset()
  }

  // Change Tab Menu 
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 1 && this.browseNeedUpdate) {
      this.refreshBrowse(null)
    }

    if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  }

  // Refresh Tab Menu: 'Browse'
  refreshBrowse(message) {
    this.tableLoad = true
    this.request.apiData('akun', 'g-group-akun-header', { kode_perusahaan: this.companyCode }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (message !== null) {
            this.tableData = data['RESULT']
            this.ref.markForCheck()
            this.loading = false
            this.tableLoad = false
            this.gbl.openSnackBar(message, 'success')
          } else {
            this.tableData = data['RESULT']
            this.ref.markForCheck()
            this.loading = false
            this.tableLoad = false
            this.browseNeedUpdate = false
          }
        }
      }
    )
  }

  selectRow(data) {
    this.loading = true
    this.onUpdate = true
    this.selectedTab = 0
    let x = JSON.parse(JSON.stringify(data))
    this.formValue = {
      kode_group_akun: x['kode_group_akun'],
      nama_group_akun: x['nama_group_akun'],
      keterangan: x['keterangan']
    }

    // Data Detail
    this.ref.markForCheck()
    this.request.apiData('akun', 'g-group-akun-detail', { kode_perusahaan: this.companyCode, kode_group_akun: this.formValue.kode_group_akun }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = [], resDupl = JSON.parse(JSON.stringify(data['RESULT']))
          for (var i = 0; i < resDupl.length; i++) {
            let x = {
              id_akun: resDupl[i]['id_akun'],
              kode_akun: resDupl[i]['kode_akun'],
              nama_akun: resDupl[i]['nama_akun'],
              kode_group_akun: resDupl[i]['kode_group_akun']
            }
            res.push(x)
          }
          this.restructureDetailData('akun', res, 'change')
        }
      }
    )
    this.formInputCheckChanges()
    this.loading = false
  }

  restructureDetailData(type, data, dataConf) {
    this.ref.markForCheck()
    let endRes = [],
      bindData = []


    if (dataConf === 'default') {
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < bindData.length; j++) {
          if (data[i]['id_akun'] === bindData[j]['id_akun']) {
            let x = {
              id: `${MD5(Date().toLocaleString() + Date.now() + randomString({
                length: 8,
                numeric: true,
                letters: false,
                special: false
              }))}`,
              id_akun: data[i]['id_akun'],
              kode_akun: bindData[j]['kode_akun'],
              nama_akun: bindData[j]['nama_akun'],
            }
            endRes.push(x)
            break;
          }
        }
      }
      this.listSelectAkun = endRes
    } else {
      bindData = this.listSelectAkun

      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < bindData.length; j++) {
          if (data[i]['id_akun'] === bindData[j]['id_akun']) {
            data[i] = bindData[j]
          }
        }
      }
      bindData.splice(0, bindData.length)
      for (var i = 0; i < data.length; i++) {
        if (data[i]['id'] === '' || data[i]['id'] == null || data[i]['id'] === undefined) {
          data[i]['id'] = `${MD5(Date().toLocaleString() + Date.now() + randomString({
            length: 8,
            numeric: true,
            letters: false,
            special: false
          }))}`
        }
        bindData.push(data[i])
      }
      this.listSelectAkun = bindData
    }
  }

  inputGroup(type?: any) {
    let input,
      data = [
        {
          type: type,
          title: type === 'kode_akun' ? 'Data Group Akun'
            : '',
          columns: type === 'kode_akun' ? this.displayColAkunLov
            : '',
          contain: type === 'kode_akun' ? this.listAkun
            : '',
          rules: [],
          interface: {},
          statusSelectable: true,
          listSelectBox: type === 'kode_akun' ? this.listSelectAkun :
            [],
          selectIndicator: type === 'kode_akun' ? 'kode_akun'
            : ''
        },
      ], setting = {
        width: '50vw',
        posTop: '30px'
      }
    input = this.gbl.openDialog(type, data, this.forminput, setting)

    input.afterClosed().subscribe(
      result => {
        if (result) {
          this.ref.markForCheck()
          if (type === 'kode_akun') {
            this.restructureDetailData('akun', result, 'change')
          }
        }
      }
    )
  }

  openCDialog() { // Confirmation Dialog
    this.gbl.topPage()
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '90px' },
      data: {
        buttonLayout: this.confirmButtonLayout,
        labelLayout: this.confirmLabelLayout,
        inputLayout: [
          {
            label: 'Kode Group Akun',
            id: 'kode-group-akun',
            type: 'input',
            valueOf: this.formValue.kode_group_akun,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true
          },
          {
            label: 'Nama Group Akun',
            id: 'nama-group-akun',
            type: 'input',
            valueOf: this.formValue.nama_group_akun,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true
          },
        ]
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(
      result => { }
    )
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
    }, 1)
  }

}
