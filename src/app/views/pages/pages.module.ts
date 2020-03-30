// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
// Partials
import { PartialsModule } from '../partials/partials.module';
// Pages
import { CoreModule } from '../../core/core.module';
import { MasterModule } from './master/master.module';
// import { ManagementModule } from './management/management.module';
import { TransaksiModule } from './transaksi/transaksi.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { LaporanModule } from './laporan/laporan.module';

@NgModule({
	declarations: [],
	exports: [],
	imports: [
		CommonModule,
		HttpClientModule,
		FormsModule,
		CoreModule,
		PartialsModule,
		MasterModule,
		// ManagementModule,
		TransaksiModule,
		MonitoringModule,
		LaporanModule
	],
	providers: []
})
export class PagesModule {
}