// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
//Shared
import { SharedModule } from '../shared.module';
// Services
import { TypesUtilsService, LayoutUtilsService } from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';

// Material
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';

// COMPONENTS
import { AllComponent } from './all/all.component';
import { LaporanJurnalComponent } from './laporan-jurnal/laporan-jurnal.component';
import { LaporanBukuBesarComponent } from './laporan-buku-besar/laporan-buku-besar.component';
import { LaporanNeracaSaldoComponent } from './laporan-neraca-saldo/laporan-neraca-saldo.component';
import { LaporanLabaRugiComponent } from './laporan-laba-rugi/laporan-laba-rugi.component';
import { LaporanNeracaComponent } from './laporan-neraca/laporan-neraca.component';
import { LaporanArusKasComponent } from './laporan-arus-kas/laporan-arus-kas.component';
import { RekapKasComponent } from './rekap-kas/rekap-kas.component';
import { RekapGiroComponent } from './rekap-giro/rekap-giro.component';
import { RekapBankComponent } from './rekap-bank/rekap-bank.component';
import { RekapPettyCashComponent } from './rekap-petty-cash/rekap-petty-cash.component';
import { LaporanListComponent } from './laporan-list/laporan-list.component';
import { RekapTranComponent } from './rekap-tran/rekap-tran.component';
import { LaporanCoaComponent } from './laporan-coa/laporan-coa.component';
import { LaporanAnalisaComponent } from './laporan-analisa/laporan-analisa.component';
import { LaporanBukuBesarRevComponent } from './laporan-buku-besar-rev/laporan-buku-besar-rev.component';
import { LaporanLabaRugiRevComponent } from './laporan-laba-rugi-rev/laporan-laba-rugi-rev.component';
import { LaporanJurnalRevComponent } from './laporan-jurnal-rev/laporan-jurnal-rev.component';
import { LaporanNeracaSaldoRevComponent } from './laporan-neraca-saldo-rev/laporan-neraca-saldo-rev.component';
import { LaporanNeracaRevComponent } from './laporan-neraca-rev/laporan-neraca-rev.component';
import { LaporanArusKasRevComponent } from './laporan-arus-kas-rev/laporan-arus-kas-rev.component';
import { LaporanAnalisaRevComponent } from './laporan-analisa-rev/laporan-analisa-rev.component';
import { LaporanRekapTransaksiRevComponent } from './laporan-rekap-transaksi-rev/laporan-rekap-transaksi-rev.component';
import { LaporanCoaRevComponent } from './laporan-coa-rev/laporan-coa-rev.component';

const routes: Routes = [
  // Terpakai
  {
    path: 'jurnal',
    // component: LaporanJurnalRevComponent
    component: LaporanJurnalComponent
  },
  {
    path: 'buku-besar',
    // component: LaporanBukuBesarRevComponent
    component: LaporanBukuBesarComponent
  },
  {
    path: 'neraca-saldo',
    // component: LaporanNeracaSaldoRevComponent
    component: LaporanNeracaSaldoComponent
  },
  {
    path: 'laba-rugi',
    // component: LaporanLabaRugiRevComponent
    component: LaporanLabaRugiComponent
  },
  {
    path: 'neraca',
    // component: LaporanNeracaRevComponent
    component: LaporanNeracaComponent
  },
  {
    path: 'arus-kas',
    // component: LaporanArusKasRevComponent
    component: LaporanArusKasComponent
  },
  {
    path: 'coa',
    // component: LaporanCoaRevComponent
    component: LaporanCoaComponent
  },
  {
    path: 'analisa',
    // component: LaporanAnalisaRevComponent
    component: LaporanAnalisaComponent
  },
  {
    path: 'rekap-tran',
    // component: LaporanRekapTransaksiRevComponent
    component: RekapTranComponent
  },
  // Tidak Terpakai
  {
    path: 'all-reports',
    component: AllComponent
  },
  {
    path: 'rekap-kas',
    component: RekapKasComponent
  },
  {
    path: 'rekap-giro',
    component: RekapGiroComponent
  },
  {
    path: 'rekap-bank',
    component: RekapBankComponent
  },
  {
    path: 'rekap-petty-cash',
    component: RekapPettyCashComponent
  },
]

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PartialsModule,
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
    TypesUtilsService,
    LayoutUtilsService
  ],
  entryComponents: [
    ActionNotificationComponent
  ],
  declarations: [
    AllComponent,
    LaporanListComponent,
    LaporanJurnalComponent,
    LaporanBukuBesarComponent,
    LaporanNeracaSaldoComponent,
    LaporanLabaRugiComponent,
    LaporanNeracaComponent,
    LaporanArusKasComponent,
    RekapKasComponent,
    RekapGiroComponent,
    RekapBankComponent,
    RekapPettyCashComponent,
    RekapTranComponent,
    LaporanCoaComponent,
    LaporanAnalisaComponent,
    LaporanBukuBesarRevComponent,
    LaporanLabaRugiRevComponent,
    LaporanJurnalRevComponent,
    LaporanNeracaSaldoRevComponent,
    LaporanNeracaRevComponent,
    LaporanArusKasRevComponent,
    LaporanAnalisaRevComponent,
    LaporanRekapTransaksiRevComponent,
    LaporanCoaRevComponent
  ]
})
export class LaporanModule { }
