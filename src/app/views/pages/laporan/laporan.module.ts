// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
//Shared
import { SharedModule } from '../shared.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
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
import {
  usersReducer,
  UserEffects
} from '../../../core/auth';

// Components
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
]

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PartialsModule,
    SharedModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([UserEffects]),
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
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
    HttpUtilsService,
    TypesUtilsService,
    LayoutUtilsService
  ],
  entryComponents: [
    ActionNotificationComponent
  ],
  declarations: [
    AllComponent,
    LaporanJurnalComponent,
    LaporanBukuBesarComponent,
    LaporanNeracaSaldoComponent,
    LaporanLabaRugiComponent,
    LaporanNeracaComponent,
    LaporanArusKasComponent,
    RekapKasComponent,
    RekapGiroComponent,
    RekapBankComponent,
    RekapPettyCashComponent
  ]
})
export class LaporanModule { }
