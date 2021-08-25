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

const routes: Routes = [
  {
    path: 'all-reports',
    component: AllComponent
  },
  {
    path: 'jurnal',
    component: LaporanJurnalComponent
  },
  {
    path: 'buku-besar',
    component: LaporanBukuBesarComponent
  },
  {
    path: 'neraca-saldo',
    component: LaporanNeracaSaldoComponent
  },
  {
    path: 'laba-rugi',
    component: LaporanLabaRugiComponent
  },
  {
    path: 'neraca',
    component: LaporanNeracaComponent
  },
  {
    path: 'arus-kas',
    component: LaporanArusKasComponent
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
  {
    path: 'rekap-tran',
    component: RekapTranComponent
  },
  {
    path: 'coa',
    component: LaporanCoaComponent
  }
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
    LaporanCoaComponent
  ]
})
export class LaporanModule { }
