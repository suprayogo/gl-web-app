// Angular
import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
// Material
import { MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
// Translate
import { TranslateModule } from '@ngx-translate/core';
// Module components
import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { AuthNoticeComponent } from './auth-notice/auth-notice.component';
// Auth
import { SharedModule } from '../shared.module';

const routes: Routes = [
	{
		path: '',
		component: AuthComponent,
		children: [
			{
				path: '',
				redirectTo: 'login',
				pathMatch: 'full'
			},
			{
				path: 'login',
				component: LoginComponent,
				data: {returnUrl: window.location.pathname}
			}
		]
	}
];


@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatButtonModule,
		RouterModule.forChild(routes),
		MatInputModule,
		MatFormFieldModule,
		MatCheckboxModule,
		TranslateModule.forChild(),
		SharedModule
	],
	providers: [],
	exports: [
		AuthComponent
	],	
	declarations: [
		AuthComponent,
		LoginComponent,
		AuthNoticeComponent
	]
})

export class AuthModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: AuthModule,
			providers: []
		};
	}
}
