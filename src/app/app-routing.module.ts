// Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Components
import { BaseComponent } from './views/theme/base/base.component';
import { ErrorPageComponent } from './views/theme/content/error-page/error-page.component';
// Auth
import { BeforeLoginService} from  './service/authentication/before-login.service';
import { AfterLoginService} from  './service/authentication/after-login.service';

const routes: Routes = [
	{
		path: 'auth',
		canActivate: [BeforeLoginService],
		loadChildren: () => import('./views/pages/auth/auth.module').then(m => m.AuthModule)
	},
	{
		path: '',
		component: BaseComponent,
		canActivate: [AfterLoginService],
		children: [
			{
				path: 'home',
				loadChildren: () => import('./views/pages/dashboard/dashboard.module').then(m => m.DashboardModule)
			},
			/* {
				path: 'management',
				loadChildren: () => import('./views/pages/management/management.module').then(m => m.ManagementModule)
			}, */
			{
				path: 'master',
				loadChildren: () => import('./views/pages/master/master.module').then(m => m.MasterModule)
			},
			{
				path: 'transaksi',
				loadChildren: () => import('./views/pages/transaksi/transaksi.module').then(m => m.TransaksiModule)
			},
			{
				path: 'management',
				loadChildren: () => import('./views/pages/management/management.module').then(m => m.ManagementModule)
			},
			{
				path: 'monitoring',
				loadChildren: () => import('./views/pages/monitoring/monitoring.module').then(m => m.MonitoringModule)
			},
			{
				path: 'builder',
				loadChildren: () => import('./views/theme/content/builder/builder.module').then(m => m.BuilderModule)
			},
			{
				path: 'error/403',
				component: ErrorPageComponent,
				data: {
					'type': 'error-v6',
					'code': 403,
					'title': '403... Access forbidden',
					'desc': 'Looks like you don\'t have permission to access for requested page.<br> Please, contact administrator'
				}
			},
			{path: 'error/:type', component: ErrorPageComponent},
			{path: '', redirectTo: 'home', pathMatch: 'full'},
			{path: '**', redirectTo: 'home', pathMatch: 'full'}
		]
	},

	{path: '**', redirectTo: 'error/403', pathMatch: 'full'},
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes)
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
