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
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService} from '../../../core/_base/crud';
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
import { BankComponent } from './bank/bank.component';
import { RekeningPerusahaanComponent } from './rekening-perusahaan/rekening-perusahaan.component';
import { PegaturanAkunComponent } from './pegaturan-akun/pegaturan-akun.component';
import { ChartOfAccountComponent } from './chart-of-account/chart-of-account.component';
import { JenisTransaksiComponent } from './jenis-transaksi/jenis-transaksi.component';
import { PengaturanSaldoAwalComponent } from './pengaturan-saldo-awal/pengaturan-saldo-awal.component';
import { PengaturanLaporanComponent } from './pengaturan-laporan/pengaturan-laporan.component';
import { PengaturanJurnalOtomatisComponent } from './pengaturan-jurnal-otomatis/pengaturan-jurnal-otomatis.component';
import { PengaturanLinkTarikDataComponent } from './pengaturan-link-tarik-data/pengaturan-link-tarik-data.component';
import { PengaturanSaldoKasirComponent } from './pengaturan-saldo-kasir/pengaturan-saldo-kasir.component';
import { KasirComponent } from './kasir/kasir.component';
import { TemplateTransaksiComponent } from './template-transaksi/template-transaksi.component';
import { PengajuanBukaPeriodeKasirComponent } from './pengajuan-buka-periode-kasir/pengajuan-buka-periode-kasir.component';
import { WorklistComponent } from './worklist/worklist.component';


const routes: Routes = [
	{
		path: 'bank',
		component: BankComponent,
	},
	{	
		path: 'rekening-perusahaan',
		component: RekeningPerusahaanComponent,
	},
	{
		path: 'pengaturan-akun',
		component: PegaturanAkunComponent
	},
	{
		path: 'chart-of-account',
		component: ChartOfAccountComponent,
	},
	{
		path: 'jenis-transaksi',
		component: JenisTransaksiComponent,
	},
	{
		path: 'pengaturan-saldo-awal',
		component: PengaturanSaldoAwalComponent,
	},
	{
		path: 'pengaturan-laporan',
		component: PengaturanLaporanComponent,
	},
	{
		path: 'pengaturan-jurnal-otomatis',
		component: PengaturanJurnalOtomatisComponent,
	},
	{
		path: 'pengaturan-link-tarik-data',
		component: PengaturanLinkTarikDataComponent,
	},
	{
		path: 'pengaturan-saldo-kasir',
		component: PengaturanSaldoKasirComponent,
	},
	{
		path: 'kasir',
		component: KasirComponent,
	},
	{
		path: 'template-transaksi',
		component: TemplateTransaksiComponent,
	},
	{
		path: 'pengajuan-buka-periode-kasir',
		component: PengajuanBukaPeriodeKasirComponent,
	},
	{
		path: 'worklist',
		component: WorklistComponent,
	}
];

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
		BankComponent,
		RekeningPerusahaanComponent,
		PegaturanAkunComponent,
		ChartOfAccountComponent,
		JenisTransaksiComponent,
		PengaturanSaldoAwalComponent,
		PengaturanLaporanComponent,
		PengaturanJurnalOtomatisComponent,
		PengaturanLinkTarikDataComponent,
		PengaturanSaldoKasirComponent,
		KasirComponent,
		TemplateTransaksiComponent,
		PengajuanBukaPeriodeKasirComponent,
		WorklistComponent,
	]
})
export class MasterModule {}